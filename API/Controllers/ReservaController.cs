using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReservaController : ControllerBase
    {
        private readonly IReservaService _reservaService;

        public ReservaController(IReservaService reservaService)
        {
            _reservaService = reservaService;
        }

        [HttpPost("crear")]
        [Authorize] 
        public async Task<IActionResult> Crear([FromBody] ReservaDto reservaDto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null) return Unauthorized("No se encontró el ID de usuario en el token.");

            int userId = int.Parse(userIdClaim);

            var resultado = await _reservaService.CrearReserva(reservaDto, userId);

            if (!resultado) return BadRequest("Error al crear la reserva. Verifica que la propiedad exista y que las fechas estén disponibles.");

            return Ok(new { mensaje = "¡Reserva creada con éxito!", estado = "Pendiente" });
        }

        [HttpGet("mis-reservas")]
        [Authorize]
        public async Task<IActionResult> MisReservas()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("Token inválido o expirado.");

            int userId = int.Parse(userIdClaim);

            var misReservas = await _reservaService.ObtenerMisReservas(userId);

            if (!misReservas.Any())
            {
                return Ok(new { mensaje = "Aún no tienes reservas con nosotros." });
            }

            return Ok(misReservas);
        }

        [HttpPut("cancelar/{id}")]
        [Authorize]
        public async Task<IActionResult> Cancelar(int id)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("Token inválido.");

            int userId = int.Parse(userIdClaim);

            var exito = await _reservaService.CancelarReserva(id, userId);

            if (!exito)
            {
                return BadRequest(new { mensaje = "No se pudo cancelar. Verifica que la reserva te pertenezca y que falten más de 24 horas para tu check-in." });
            }

            return Ok(new { mensaje = "Reserva cancelada exitosamente" });
        }

        [HttpPut("completar/{id}")]
        [Authorize]
        public async Task<IActionResult> Completar(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

            var exito = await _reservaService.CompletarReserva(id, userId);

            if (!exito) return BadRequest("No se pudo completar la reserva. Verifica que ya haya pasado la fecha de salida.");

            return Ok("Reserva marcada como Completada. ¡Ya puedes dejar una reseña!");
        }

        [HttpPut("aceptar/{id}")]
        [Authorize] // El host debe estar logueado
        public async Task<IActionResult> Aceptar(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

            var exito = await _reservaService.AceptarReserva(id, userId);

            if (!exito)
                return BadRequest("No se pudo aceptar. Verifica que seas el dueño de la propiedad y que la reserva esté Pendiente.");

            return Ok("Reserva confirmada exitosamente UY UY UY. El huésped ya puede preparar sus maletas.");
        }
    }
}