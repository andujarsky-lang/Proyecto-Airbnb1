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
            var exito = await _usuarioService.Registrar(usuarioDto);

            if (exito == true)
            {
                return Ok("Usuario registrado correctamente :)"); // Código 200
            }
            else
            {
                return BadRequest("Hubo un problema al registrar el usuario."); // Código 400
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var resultado = await _usuarioService.Login(loginDto.Correo ?? "", loginDto.Password ?? "");

            if (resultado == null || resultado == "Usuario o contraseña incorrectos.")
            {
                return Unauthorized(new { mensaje = "Error al iniciar sesión. Verifica tu correo o contraseña." });
            }

            return Ok(new
            {
                mensaje = "Login exitoso",
                token = resultado 
            });
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