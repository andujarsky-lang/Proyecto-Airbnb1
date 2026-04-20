using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class PropiedadService : IPropiedadService 
    {
        private readonly IPropiedadRepository _propiedadRepository;

        public PropiedadService(IPropiedadRepository propiedadRepository)
        {
            _propiedadRepository = propiedadRepository;
        }

        public async Task<bool> Publicar(PropiedadDto propiedadDto)
        {
            var hostExiste = await _propiedadRepository.ExisteHostAsync(propiedadDto.HostId);

            if (!hostExiste)
            {
                return false;
            }

            var nuevaPropiedad = new Propiedad
            {
                Nombre = propiedadDto.Nombre,
                Descripcion = propiedadDto.Descripcion,
                PrecioPorNoche = propiedadDto.PrecioPorNoche,
                HostId = propiedadDto.HostId
            };

            await _propiedadRepository.AgregarAsync(nuevaPropiedad);
            await _propiedadRepository.GuardarCambiosAsync();

            return true;
        }

        public async Task<IEnumerable<PropiedadResponseDto>> ObtenerTodas()
        {
            var propiedades = await _propiedadRepository.ObtenerTodasAsync();

            return propiedades.Select(p => new PropiedadResponseDto
            {
                Id = p.Id,
                HostId = p.HostId, 
                Nombre = p.Nombre!,
                Descripcion = p.Descripcion!,
                PrecioPorNoche = p.PrecioPorNoche
            });
        }

        public async Task<List<PropiedadConEstrellasDto>> BuscarPropiedades(FiltroBusquedaDto filtro)
        {
            var propiedades = await _propiedadRepository.BuscarDisponiblesAsync(filtro);

            // Transformamos las propiedades de la BD a nuestro DTO
            var resultado = propiedades.Select(p => new PropiedadConEstrellasDto
            {
                Id = p.Id,
                Nombre = p.Nombre!,
                Ubicacion = p.Ubicacion!,
                PrecioPorNoche = p.PrecioPorNoche,
                Capacidad = p.Capacidad,
                // Si tiene reseñas, saca el promedio. Si no, ponle 0 estrellas.
                PromedioCalificacion = p.Reseñas.Any() ? Math.Round(p.Reseñas.Average(r => r.Calificacion), 1) : 0
            }).ToList();

            return resultado;
        }

        public async Task CrearPropiedad(CrearPropiedadDto dto, string? urlImagenPrincipal)
        {
            var nuevaPropiedad = new Propiedad
            {
                Nombre = dto.Nombre,
                Ubicacion = dto.Ubicacion,
                Descripcion = dto.Descripcion,
                PrecioPorNoche = dto.PrecioPorNoche,
                Capacidad = dto.Capacidad,
                HostId = dto.HostId,
                FechaRegistro = DateTime.UtcNow
            };

            if (!String.IsNullOrEmpty(urlImagenPrincipal)) { 
                nuevaPropiedad.ImagenPrincipalUrl = urlImagenPrincipal;
            }

            await _propiedadRepository.AgregarAsync(nuevaPropiedad);
            await _propiedadRepository.GuardarCambiosAsync();
        }


    }
}