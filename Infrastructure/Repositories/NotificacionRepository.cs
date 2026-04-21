using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class NotificacionRepository : INotificacionRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificacionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notificacion>> ObtenerPorUsuarioAsync(int usuarioId)
        {
            return await _context.Notificaciones
                .Where(n => n.UsuarioId == usuarioId)
                .OrderByDescending(n => n.FechaCreacion)
                .ToListAsync();
        }

        public async Task<IEnumerable<Notificacion>> ObtenerNoLeidasPorUsuarioAsync(int usuarioId)
        {
            return await _context.Notificaciones
                .Where(n => n.UsuarioId == usuarioId && n.Leida == false)
                .OrderByDescending(n => n.FechaCreacion)
                .ToListAsync();
        }

        public async Task<Notificacion?> ObtenerPorIdAsync(int id)
        {
            return await _context.Notificaciones.FindAsync(id);
        }

        public async Task AgregarAsync(Notificacion notificacion)
        {
            await _context.Notificaciones.AddAsync(notificacion);
        }

        public async Task MarcarComoLeidaAsync(int notificacionId)
        {
            var notificacion = await _context.Notificaciones.FindAsync(notificacionId);
            if (notificacion != null)
            {
                notificacion.Leida = true;
            }
        }

        public async Task MarcarTodasComoLeidasAsync(int usuarioId)
        {
            var notificaciones = await _context.Notificaciones
                .Where(n => n.UsuarioId == usuarioId && n.Leida == false)
                .ToListAsync();

            foreach (var notificacion in notificaciones)
            {
                notificacion.Leida = true;
            }
        }

        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}