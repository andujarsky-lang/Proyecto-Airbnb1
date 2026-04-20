using Application.Dtos;

namespace Application.Interfaces
{
    public interface IPropiedadService
    {
        Task<bool> Publicar(PropiedadDto propiedadDto);
        Task<IEnumerable<PropiedadResponseDto>> ObtenerTodas();
        Task<List<PropiedadConEstrellasDto>> BuscarPropiedades(FiltroBusquedaDto filtro);
        Task CrearPropiedad(CrearPropiedadDto dto, string? urlImage);
    }
}