using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IReservaRepository
    {
        Task<bool> ExistePropiedadAsync(int propiedadId);
        Task<bool> ExisteUsuarioAsync(int usuarioId);
        Task AgregarAsync(Reserva reserva);
        Task GuardarCambiosAsync();

        Task<IEnumerable<Reserva>> ObtenerPorUsuarioAsync(int guestId);
        Task<Reserva?> ObtenerReservaParaReseña(int propiedadId, int guestId);

        Task<bool> EstaDisponibleAsync(int propiedadId, DateTime fechaInicio, DateTime fechaFin);
        Task<Reserva?> ObtenerPorIdAsync(int id);
    }
}
