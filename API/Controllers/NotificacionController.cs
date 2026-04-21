using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Todas las rutas requieren autenticación
    public class NotificacionController : ControllerBase
    {
        private readonly INotificacionService _notificacionService;

        public NotificacionController(INotificacionService notificacionService)
        {
            _notificacionService = notificacionService;
        }

        [HttpGet("mis-notificaciones")]
        public async Task<IActionResult> ObtenerMisNotificaciones()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("Token inválido.");
            int usuarioId = int.Parse(userIdClaim);

            var notificaciones = await _notificacionService.ObtenerMisNotificaciones(usuarioId);
            return Ok(notificaciones);
        }

        [HttpGet("no-leidas")]
        public async Task<IActionResult> ObtenerNotificacionesNoLeidas()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("Token inválido.");
            int usuarioId = int.Parse(userIdClaim);

            var notificaciones = await _notificacionService.ObtenerNotificacionesNoLeidas(usuarioId);
            return Ok(notificaciones);
        }

        [HttpPut("marcar-leida/{id}")]
        public async Task<IActionResult> MarcarComoLeida(int id)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("Token inválido.");
            int usuarioId = int.Parse(userIdClaim);

            var exito = await _notificacionService.MarcarComoLeida(id, usuarioId);
            
            if (!exito)
                return BadRequest("No se pudo marcar la notificación como leída.");

            return Ok(new { mensaje = "Notificación marcada como leída." });
        }

        [HttpPut("marcar-todas-leidas")]
        public async Task<IActionResult> MarcarTodasComoLeidas()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized("Token inválido.");
            int usuarioId = int.Parse(userIdClaim);

            var exito = await _notificacionService.MarcarTodasComoLeidas(usuarioId);
            
            if (!exito)
                return BadRequest("No se pudieron marcar las notificaciones como leídas.");

            return Ok(new { mensaje = "Todas las notificaciones marcadas como leídas." });
        }
    }
}