using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
       
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioDto usuarioDto)
        {
            var resultado = await _usuarioService.Registrar(usuarioDto);

            if (!resultado.Exito)
            {
                // Error en el registro
                return BadRequest(new 
                { 
                    mensaje = resultado.MensajeError,
                    detalles = resultado.MensajeNotificacion
                });
            }

            // Registro exitoso
            if (resultado.NotificacionEnviada)
            {
                // Todo perfecto: usuario registrado y notificación enviada
                return Ok(new 
                { 
                    mensaje = "Usuario registrado correctamente. Revisa tu Telegram para el código de confirmación.",
                    notificacion = resultado.MensajeNotificacion
                });
            }
            else
            {
                // Usuario registrado pero notificación falló
                return Ok(new 
                { 
                    mensaje = "Usuario registrado correctamente, pero no se pudo enviar la notificación.",
                    advertencia = resultado.MensajeNotificacion,
                    nota = "Puedes consultar tu código de confirmación con el administrador o en la base de datos."
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var resultado = await _usuarioService.Login(loginDto.Correo ?? "", loginDto.Password ?? "");

            if (!resultado.Exito)
                return Unauthorized(new { mensaje = resultado.MensajeError });

            return Ok(new { mensaje = "Login exitoso", token = resultado.Token });
        }

        [HttpPost("confirmar-correo")]
        public async Task<IActionResult> ConfirmarCorreo([FromQuery] string correo, [FromQuery] string token)
        {
            var exito = await _usuarioService.ConfirmarEmailAsync(correo, token);

            if (!exito)
                return BadRequest("El código es inválido o ya expiró.");

            return Ok("¡Cuenta confirmada exitosamente! Ya puedes iniciar sesión.");
        }
    }
}