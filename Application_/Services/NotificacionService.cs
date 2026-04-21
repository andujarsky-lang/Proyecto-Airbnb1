using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class NotificacionService : INotificacionService
    {
        private readonly INotificacionRepository _notificacionRepository;

        public NotificacionService(INotificacionRepository notificacionRepository)
        {
            _notificacionRepository = notificacionRepository;
        }

        public async Task<IEnumerable<NotificacionDto>> ObtenerMisNotificaciones(int usuarioId)
        {
            var notificaciones = await _notificacionRepository.ObtenerPorUsuarioAsync(usuarioId);

            return notificaciones.Select(n => new NotificacionDto
            {
                Id = n.Id,
                Mensaje = n.Mensaje ?? string.Empty,
                FechaCreacion = n.FechaCreacion,
                Leida = n.Leida ?? false,
                UsuarioId = n.UsuarioId
            });
        }

        public async Task<IEnumerable<NotificacionDto>> ObtenerNotificacionesNoLeidas(int usuarioId)
        {
            var notificaciones = await _notificacionRepository.ObtenerNoLeidasPorUsuarioAsync(usuarioId);

            return notificaciones.Select(n => new NotificacionDto
            {
                Id = n.Id,
                Mensaje = n.Mensaje ?? string.Empty,
                FechaCreacion = n.FechaCreacion,
                Leida = n.Leida ?? false,
                UsuarioId = n.UsuarioId
            });
        }

        public async Task<bool> MarcarComoLeida(int notificacionId, int usuarioId)
        {
            var notificacion = await _notificacionRepository.ObtenerPorIdAsync(notificacionId);
            
            if (notificacion == null || notificacion.UsuarioId != usuarioId)
                return false;

            await _notificacionRepository.MarcarComoLeidaAsync(notificacionId);
            await _notificacionRepository.GuardarCambiosAsync();
            return true;
        }

        public async Task<bool> MarcarTodasComoLeidas(int usuarioId)
        {
            await _notificacionRepository.MarcarTodasComoLeidasAsync(usuarioId);
            await _notificacionRepository.GuardarCambiosAsync();
            return true;
        }

        public async Task CrearNotificacion(int usuarioId, string mensaje)
        {
            var notificacion = new Notificacion
            {
                UsuarioId = usuarioId,
                Mensaje = mensaje,
                FechaCreacion = DateTime.UtcNow,
                Leida = false
            };

            await _notificacionRepository.AgregarAsync(notificacion);
            await _notificacionRepository.GuardarCambiosAsync();
        }
    }
}