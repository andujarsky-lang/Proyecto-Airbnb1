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
        private readonly IImagenService _imagenService;

        public PropiedadController(IPropiedadService propiedadService, IImagenService imagenService)
        {
            _propiedadService = propiedadService;
            _imagenService = imagenService;
        }

        [HttpPost("publicar")]
        [Authorize(Roles = "Host")]
        public async Task<IActionResult> Publicar([FromBody] PropiedadDto propiedadDto)
        {
            var exito = await _propiedadService.Publicar(propiedadDto);

            if (exito)
            {
                return Ok("Propiedad publicada con éxito, URRAAAAAAA!!!");
            }
            else
            {
                return BadRequest("No se pudo publicar la propiedad. Verifica que el HostId sea válido.");
            }
        }

        [HttpGet("lista")]
        [AllowAnonymous]
        public async Task<IActionResult> ObtenerLista()
        {
            // Le pedimos al servicio que nos traiga todas las propiedades
            var propiedades = await _propiedadService.ObtenerTodas();

            // Si por alguna razón la lista está vacía, igual devolvemos un 200 OK pero con una lista vacía
            return Ok(propiedades);
        }

        [HttpGet("buscar")]
        [AllowAnonymous] // Cualquier persona, incluso sin Login, debería poder buscar casas
        public async Task<IActionResult> Buscar([FromQuery] FiltroBusquedaDto filtro)
        {
            var resultados = await _propiedadService.BuscarPropiedades(filtro);

            if (!resultados.Any())
                return Ok(new { mensaje = "No se encontraron propiedades con esos filtros.", datos = resultados });

            return Ok(resultados);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CrearPropiedad([FromForm] CrearPropiedadDto dto)
        {
            try
            {
                string? urlImagen = null;

                // Si viene la imagen principal, la guardamos físicamente
                if (dto.ImagenPrincipal != null)
                {
                    using var memoryStream = new MemoryStream();
                    await dto.ImagenPrincipal.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;

                    // Nos devuelve algo como /uploads/xxxx_foto.jpg
                    urlImagen = await _imagenService.SubirImagenAsync(memoryStream, dto.ImagenPrincipal.FileName);
                }

                // Guardamos la propiedad junto con la URL de su imagen en un solo paso
                await _propiedadService.CrearPropiedad(dto, urlImagen);

                return Ok(new { mensaje = "Propiedad e Imagen creadas con éxito!!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"ERROR REAL: {ex.Message} --- Detalle: {ex.InnerException?.Message}");
            }
        }
    }
}