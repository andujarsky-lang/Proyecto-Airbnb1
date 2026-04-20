using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;                                    

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


        public async Task<bool> Registrar(UsuarioDto usuarioDto)
        {
            var usuarioExistente = await _usuarioRepository.ObtenerPorCorreoAsync(usuarioDto.Correo!);

            if (usuarioExistente != null)
            {
                return false;
            }

            var nuevoUsuario = new Usuario
            {
                Nombre = usuarioDto.Nombre,
                Correo = usuarioDto.Correo,
                PasswordHash = usuarioDto.Password,
                Rol = usuarioDto.Rol,

                IsEmailConfirmed = false,
                ConfirmationToken = Guid.NewGuid().ToString().Substring(0, 8).ToUpper(), // Código corto de 8 letras
                TokenExpiration = DateTime.UtcNow.AddMinutes(15)
        };

            await _usuarioRepository.AgregarAsync(nuevoUsuario);
            await _usuarioRepository.GuardarCambiosAsync();

            // enviamos el correo real

            string mensajeHtml = $@"
                <div style='font-family: Arial; border: 1px solid #ddd; padding: 20px;'>
                    <h2>¡Bienvenida/o a AirBnb HomelyGo, {nuevoUsuario.Nombre}!</h2>
                    <p>Casi terminamos. Tu código de activación es:</p>
                    <h1 style='color: #ff385c;'>{nuevoUsuario.ConfirmationToken}</h1>
                    <p>Este código expira en 30 minutos.</p>
                </div>";

            await _emailService.EnviarCorreoAsync(nuevoUsuario.Correo!, "Activa tu cuenta", mensajeHtml);

            return true;
        }

        public async Task<string> Login(string correo, string password)
        {
            var usuario = await _usuarioRepository.ObtenerPorCorreoAsync(correo);

            if (usuario == null || usuario.PasswordHash != password)
            {
                return "Usuario o contraseña incorrectos.";
            }

            if (!usuario.IsEmailConfirmed)
            {
                return "Cuenta no confirmada. Por favor revisa tu correo electrónico para activarla.";
            }

            return _tokenService.GenerarToken(usuario);
        }

        // el nuevo metodo para confirmar el correo
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