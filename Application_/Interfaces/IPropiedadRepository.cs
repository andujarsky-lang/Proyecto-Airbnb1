using Application.Dtos;
using Domain.Entities;
using System;
using System.Collections.Generic;

namespace Application.Interfaces
{
    public interface IPropiedadRepository
    {
        Task<bool> ExisteHostAsync(int hostId);
        Task AgregarAsync(Propiedad propiedad);

        Task GuardarCambiosAsync();
        Task RemoverAsync(Propiedad propiedad);
        Task<decimal> ObtenerPrecioNocheAsync(int propiedadId);

        Task<IEnumerable<Propiedad>> ObtenerTodasAsync();
        Task<Propiedad?> ObtenerPorIdAsync(int id);

        Task<IEnumerable<Propiedad>> BuscarDisponiblesAsync(FiltroBusquedaDto filtro);
    }
}
