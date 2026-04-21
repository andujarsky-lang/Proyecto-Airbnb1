using Application.Dtos;

namespace Application.Interfaces
{
    public interface IPropiedadService
    {
        // -- Endpoint legado (comentado para referencia, reemplazado por CrearPropiedad) --
        // Task<bool> Publicar(PropiedadDto propiedadDto);

        Task<IEnumerable<PropiedadResponseDto>> ObtenerTodas();
        Task<List<PropiedadConEstrellasDto>> BuscarPropiedades(FiltroBusquedaDto filtro);

        // hostId viene del JWT, imagenStream/nombreArchivo son opcionales (null si no hay imagen)
        // Devuelve el ID de la propiedad creada
        Task<int> CrearPropiedad(CrearPropiedadDto dto, int hostId, Stream? imagenStream, string? nombreArchivo);

        // nuevaImagenStream/nombreArchivo son null si el host no cambió la imagen
        Task<bool> EditarPropiedad(int id, EditarPropiedadDto dto, int hostId, Stream? nuevaImagenStream, string? nombreArchivo);

        Task<bool> EliminarPropiedad(int id, int hostId);
    }
}
