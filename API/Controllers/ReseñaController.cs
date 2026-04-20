using Application.Dtos;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
        [Route("api/[controller]")] 
        [ApiController]

    public class ReseñaController : ControllerBase
    {
        private readonly IReseñaService _reseñaService;

        public ReseñaController(IReseñaService reseñaService)
        {
            _reseñaService = reseñaService;
        }

        [HttpPost("dejar-reseña")]
        [Authorize]
        public async Task<IActionResult> DejarReseña([FromBody] ReseñaDto dto)
        {
            var guestId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

            var exito = await _reseñaService.CrearReseña(dto, guestId);

            if (!exito)
                return BadRequest("Solo puedes dejar reseña si la reserva finalizó y te pertenece.");

            return Ok("Gracias por tu comentario :)");
        }
    }
}
