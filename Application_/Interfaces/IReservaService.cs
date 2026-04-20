using Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IReservaService
    {
        Task<bool> CrearReserva(ReservaDto reservaDto, int guestId);
        Task<IEnumerable<ReservaResponseDto>> ObtenerMisReservas(int guestId);
        Task<bool> CancelarReserva(int reservaId, int guestId);
        Task<bool> CompletarReserva(int reservaId, int guestId);
        Task<bool> AceptarReserva(int reservaId, int hostId);
    }
}
