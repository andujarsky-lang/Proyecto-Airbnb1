using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ReservaRepository : IReservaRepository
    {
        private readonly ApplicationDbContext _context = null!;

        public ReservaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistePropiedadAsync(int propiedadId)
        {
            return await _context.Propiedades.AnyAsync(p => p.Id == propiedadId);
        }

        public async Task<bool> ExisteUsuarioAsync(int usuarioId)
        {
            return await _context.Usuarios.AnyAsync(u => u.Id == usuarioId);
        }

        public async Task AgregarAsync(Reserva reserva)
        {
            await _context.Reservas.AddAsync(reserva);
        }

        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Reserva>> ObtenerPorUsuarioAsync(int guestId)
        {
            // Vamos a la tabla Reservas, filtramos por el ID del usuario y lo convertimos a Lista
            return await _context.Reservas
                .Where(r => r.GuestId == guestId)
                .ToListAsync();
        }

        public async Task<bool> EstaDisponibleAsync(int propiedadId, DateTime fechaInicio, DateTime fechaFin)
        {
            // Buscamos si existe ALGUNA reserva para esa casa que choque con las nuevas fechas
            bool hayChoque = await _context.Reservas
                .AnyAsync(r => r.PropiedadId == propiedadId &&
                               r.FechaInicio < fechaFin &&    
                               r.FechaFin > fechaInicio);      

            // Si hay un choque, NO está disponible (false). Si no hay choque, SÍ está disponible (true).
            return !hayChoque;
        }
        public async Task<Reserva?> ObtenerPorIdAsync(int id)
        {
            return await _context.Reservas.FindAsync(id);
        }

        public async Task<Reserva?> ObtenerReservaParaReseña(int propiedadId, int guestId)
        {
            // Buscamos la reserva del huésped en la propiedad especificada
            return await _context.Reservas
                .Where(r => r.PropiedadId == propiedadId && r.GuestId == guestId)
                .OrderByDescending(r => r.FechaFin) // Siempre traemos la estancia más reciente
                .FirstOrDefaultAsync();
        }
    }
}
