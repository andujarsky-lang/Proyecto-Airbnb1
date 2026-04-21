using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropiedadController : ControllerBase
    {
        private readonly IPropiedadService _propiedadService;
        public PropiedadController(IPropiedadService propiedadService)
        {
            _propiedadService = propiedadService;
        }

        [HttpGet("lista")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerLista()
        {
            var propiedades = await _propiedadService.ObtenerTodas();
            return Ok(propiedades);
        }

        [HttpGet("buscar")]
        [AllowAnonymous]
        public async Task<IActionResult> Buscar([FromQuery] FiltroBusquedaDto filtro)
        {
            var resultados = await _propiedadService.BuscarPropiedades(filtro);

            if (!resultados.Any())
                return Ok(new { mensaje = "No se encontraron propiedades con esos filtros.", datos = resultados });

            return Ok(resultados);
        }

        [HttpPost]
        [Authorize(Roles = "Host")]
        public async Task<IActionResult> CrearPropiedad([FromForm] CrearPropiedadConImagenDto dtoConImagen)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Unauthorized("Token inválido.");
                int hostId = int.Parse(userIdClaim);

                // Mapeamos el DTO del controller al DTO del servicio (sin IFormFile)
                var dto = new CrearPropiedadDto
                {
                    Nombre = dtoConImagen.Nombre,
                    Ubicacion = dtoConImagen.Ubicacion,
                    Descripcion = dtoConImagen.Descripcion,
                    PrecioPorNoche = dtoConImagen.PrecioPorNoche,
                    Capacidad = dtoConImagen.Capacidad
                };

                // El controller solo convierte IFormFile a Stream y se lo pasa al servicio
                Stream? imagenStream = null;
                string? nombreArchivo = null;

                if (dtoConImagen.ImagenPrincipal != null)
                {
                    imagenStream = dtoConImagen.ImagenPrincipal.OpenReadStream();
                    nombreArchivo = dtoConImagen.ImagenPrincipal.FileName;
                }

                var propiedadId = await _propiedadService.CrearPropiedad(dto, hostId, imagenStream, nombreArchivo);

                return Ok(new { mensaje = "Propiedad creada con éxito.", id = propiedadId });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Host")]
        public async Task<IActionResult> Editar(int id, [FromForm] EditarPropiedadConImagenDto dtoConImagen)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Unauthorized("Token inválido.");
                int hostId = int.Parse(userIdClaim);

                // Mapeamos el DTO del controller al DTO del servicio (sin IFormFile)
                var dto = new EditarPropiedadDto
                {
                    Nombre = dtoConImagen.Nombre,
                    Ubicacion = dtoConImagen.Ubicacion,
                    Descripcion = dtoConImagen.Descripcion,
                    PrecioPorNoche = dtoConImagen.PrecioPorNoche,
                    Capacidad = dtoConImagen.Capacidad
                };

                Stream? imagenStream = null;
                string? nombreArchivo = null;

                if (dtoConImagen.NuevaImagen != null)
                {
                    imagenStream = dtoConImagen.NuevaImagen.OpenReadStream();
                    nombreArchivo = dtoConImagen.NuevaImagen.FileName;
                }

                var exito = await _propiedadService.EditarPropiedad(id, dto, hostId, imagenStream, nombreArchivo);

                if (!exito)
                    return BadRequest(new { mensaje = "No se pudo editar. Verifica que la propiedad exista y te pertenezca." });

                return Ok(new { mensaje = "Propiedad actualizada con éxito." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Host")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null) return Unauthorized("Token inválido.");
                int hostId = int.Parse(userIdClaim);

                var exito = await _propiedadService.EliminarPropiedad(id, hostId);

                if (!exito)
                    return BadRequest(new { mensaje = "No se pudo eliminar. Verifica que la propiedad exista y te pertenezca." });

                return Ok(new { mensaje = "Propiedad eliminada con éxito." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}
