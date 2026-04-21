using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class PropiedadService : IPropiedadService
    {
        private readonly IPropiedadRepository _propiedadRepository;
        private readonly IImagenService _imagenService;

        public PropiedadService(IPropiedadRepository propiedadRepository, IImagenService imagenService)
        {
            _propiedadRepository = propiedadRepository;
            _imagenService = imagenService;
        }

        public async Task<IEnumerable<PropiedadResponseDto>> ObtenerTodas()
        {
            var propiedades = await _propiedadRepository.ObtenerTodasAsync();

            return propiedades.Select(p => new PropiedadResponseDto
            {
                Id = p.Id,
                HostId = p.HostId,
                Nombre = p.Nombre!,
                Ubicacion = p.Ubicacion!,
                Descripcion = p.Descripcion!,
                PrecioPorNoche = p.PrecioPorNoche,
                Capacidad = p.Capacidad,
                ImagenPrincipalUrl = p.ImagenPrincipalUrl,
                FechaRegistro = p.FechaRegistro
            });
        }

        public async Task<List<PropiedadConEstrellasDto>> BuscarPropiedades(FiltroBusquedaDto filtro)
        {
            var propiedades = await _propiedadRepository.BuscarDisponiblesAsync(filtro);

            return propiedades.Select(p => new PropiedadConEstrellasDto
            {
                Id = p.Id,
                Nombre = p.Nombre!,
                Ubicacion = p.Ubicacion!,
                PrecioPorNoche = p.PrecioPorNoche,
                Capacidad = p.Capacidad,
                PromedioCalificacion = p.Reseñas.Any()
                    ? Math.Round(p.Reseñas.Average(r => r.Calificacion), 1)
                    : 0
            }).ToList();
        }

        // hostId viene del JWT (el controller lo extrae y lo pasa aquí)
        // imagenStream y nombreArchivo son null si el host no subió imagen
        // Devuelve el ID de la propiedad creada
        public async Task<int> CrearPropiedad(CrearPropiedadDto dto, int hostId, Stream? imagenStream, string? nombreArchivo)
        {
            string? urlImagen = null;

            // Si viene imagen, el SERVICIO es quien la sube (no el controller)
            if (imagenStream != null && !string.IsNullOrEmpty(nombreArchivo))
            {
                urlImagen = await _imagenService.SubirImagenAsync(imagenStream, nombreArchivo);
            }

            var nuevaPropiedad = new Propiedad
            {
                Nombre = dto.Nombre,
                Ubicacion = dto.Ubicacion,
                Descripcion = dto.Descripcion,
                PrecioPorNoche = dto.PrecioPorNoche,
                Capacidad = dto.Capacidad,
                HostId = hostId,  // viene del JWT, no del body
                FechaRegistro = DateTime.UtcNow,
                ImagenPrincipalUrl = urlImagen
            };

            await _propiedadRepository.AgregarAsync(nuevaPropiedad);
            await _propiedadRepository.GuardarCambiosAsync();

            return nuevaPropiedad.Id; // Devolvemos el ID de la propiedad creada
        }

        public async Task<bool> EditarPropiedad(int id, EditarPropiedadDto dto, int hostId, Stream? nuevaImagenStream, string? nombreArchivo)
        {
            var propiedad = await _propiedadRepository.ObtenerPorIdAsync(id);

            if (propiedad == null || propiedad.HostId != hostId)
                return false;

            propiedad.Nombre = dto.Nombre;
            propiedad.Ubicacion = dto.Ubicacion;
            propiedad.Descripcion = dto.Descripcion;
            propiedad.PrecioPorNoche = dto.PrecioPorNoche;
            propiedad.Capacidad = dto.Capacidad;

            // Solo actualizamos la imagen si el host envió una nueva
            if (nuevaImagenStream != null && !string.IsNullOrEmpty(nombreArchivo))
            {
                propiedad.ImagenPrincipalUrl = await _imagenService.SubirImagenAsync(nuevaImagenStream, nombreArchivo);
            }

            await _propiedadRepository.GuardarCambiosAsync();
            return true;
        }

        public async Task<bool> EliminarPropiedad(int id, int hostId)
        {
            var propiedad = await _propiedadRepository.ObtenerPorIdAsync(id);

            if (propiedad == null || propiedad.HostId != hostId)
                return false;

            await _propiedadRepository.RemoverAsync(propiedad);
            await _propiedadRepository.GuardarCambiosAsync();
            return true;
        }
    }
}
