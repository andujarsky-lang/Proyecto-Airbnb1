using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using BCrypt.Net;

namespace Application.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;

        public UsuarioService(IUsuarioRepository usuarioRepository, ITokenService tokenService, IEmailService emailService)
        {
            _usuarioRepository = usuarioRepository;
            _tokenService = tokenService;
            _emailService = emailService;
        }


        public async Task<RegistroResultDto> Registrar(UsuarioDto usuarioDto)
        {
            try
            {
                // 1. Validación: verificar si el correo ya existe
                var usuarioExistente = await _usuarioRepository.ObtenerPorCorreoAsync(usuarioDto.Correo!);

                if (usuarioExistente != null)
                {
                    return new RegistroResultDto
                    {
                        Exito = false,
                        MensajeError = "El correo electrónico ya está registrado.",
                        NotificacionEnviada = false
                    };
                }

                // 2. Crear el nuevo usuario
                var nuevoUsuario = new Usuario
                {
                    Nombre = usuarioDto.Nombre,
                    Correo = usuarioDto.Correo,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(usuarioDto.Password),
                    Rol = usuarioDto.Rol,
                    IsEmailConfirmed = false,
                    ConfirmationToken = Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                    TokenExpiration = DateTime.UtcNow.AddMinutes(15)
                };

                // 3. Guardar en la base de datos
                try
                {
                    await _usuarioRepository.AgregarAsync(nuevoUsuario);
                    await _usuarioRepository.GuardarCambiosAsync();
                }
                catch (Exception ex)
                {
                    // Error crítico: no se pudo guardar en la BD
                    return new RegistroResultDto
                    {
                        Exito = false,
                        MensajeError = "Error al guardar el usuario en la base de datos.",
                        NotificacionEnviada = false,
                        MensajeNotificacion = $"Detalles técnicos: {ex.Message}"
                    };
                }

                // 4. Intentar enviar notificación (no crítico - el usuario ya está registrado)
                bool notificacionEnviada = false;
                string? mensajeNotificacion = null;

                try
                {
                    // Mensaje simple compatible con Telegram HTML
                    string mensajeHtml = $@"<b>¡Bienvenido/a a AirBnb HomelyGo, {nuevoUsuario.Nombre}!</b>

Casi terminamos. Tu código de activación es:

<b>{nuevoUsuario.ConfirmationToken}</b>

Este código expira en 15 minutos.";

                    await _emailService.EnviarCorreoAsync(nuevoUsuario.Correo!, "Activa tu cuenta", mensajeHtml);
                    notificacionEnviada = true;
                    mensajeNotificacion = "Código de confirmación enviado a Telegram.";
                }
                catch (Exception ex)
                {
                    // Error no crítico: el usuario se registró pero no recibió la notificación
                    notificacionEnviada = false;
                    mensajeNotificacion = $"No se pudo enviar la notificación: {ex.Message}";
                    
                    // Loguear para debugging
                    Console.WriteLine($"[ERROR TELEGRAM] {ex.Message}");
                    Console.WriteLine($"[ERROR TELEGRAM] StackTrace: {ex.StackTrace}");
                }

                // 5. Retornar resultado exitoso (con o sin notificación)
                return new RegistroResultDto
                {
                    Exito = true,
                    MensajeError = null,
                    NotificacionEnviada = notificacionEnviada,
                    MensajeNotificacion = mensajeNotificacion
                };
            }
            catch (Exception ex)
            {
                // Error inesperado general
                Console.WriteLine($"[ERROR CRÍTICO EN REGISTRO] {ex.Message}");
                Console.WriteLine($"[ERROR CRÍTICO] StackTrace: {ex.StackTrace}");

                return new RegistroResultDto
                {
                    Exito = false,
                    MensajeError = "Ocurrió un error inesperado durante el registro.",
                    NotificacionEnviada = false,
                    MensajeNotificacion = $"Detalles técnicos: {ex.Message}"
                };
            }
        }

        public async Task<LoginResultDto> Login(string correo, string password)
        {
            var usuario = await _usuarioRepository.ObtenerPorCorreoAsync(correo);

            if (usuario == null)
                return new LoginResultDto { Exito = false, MensajeError = "Usuario o contraseña incorrectos." };

            // Verificamos el hash de la contraseña con BCrypt
            // Si la contraseña está en texto plano (cuentas viejas), hacemos comparación directa
            bool passwordValida = false;

            try
            {
                // Intentamos verificar con BCrypt (cuentas nuevas)
                passwordValida = BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash);
            }
            catch (BCrypt.Net.SaltParseException)
            {
                // Si falla, es porque la contraseña está en texto plano (cuenta vieja)
                passwordValida = (usuario.PasswordHash == password);
            }

            if (!passwordValida)
                return new LoginResultDto { Exito = false, MensajeError = "Usuario o contraseña incorrectos." };

            if (!usuario.IsEmailConfirmed)
                return new LoginResultDto { Exito = false, MensajeError = "Cuenta no confirmada. Por favor revisa tu correo electrónico para activarla." };

            var token = _tokenService.GenerarToken(usuario);
            return new LoginResultDto { Exito = true, Token = token };
        }

        public async Task<bool> ConfirmarEmailAsync(string correo, string token)
        {
            var usuario = await _usuarioRepository.ObtenerPorCorreoAsync(correo);
            if (usuario == null) return false;

            if (usuario.ConfirmationToken != token) return false;
            if (usuario.TokenExpiration < DateTime.UtcNow) return false;

            // Confirmamos y limpiamos el token para que no se use de nuevo
            usuario.IsEmailConfirmed = true;
            usuario.ConfirmationToken = null;
            usuario.TokenExpiration = null;

            await _usuarioRepository.GuardarCambiosAsync();
            return true;
        }
    }
}