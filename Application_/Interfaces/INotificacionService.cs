using Application.Dtos;

namespace Application.Interfaces
{
    public interface INotificacionService
    {
        Task<IEnumerable<NotificacionDto>> ObtenerMisNotificaciones(int usuarioId);
        Task<IEnumerable<NotificacionDto>> ObtenerNotificacionesNoLeidas(int usuarioId);
        Task<bool> MarcarComoLeida(int notificacionId, int usuarioId);
        Task<bool> MarcarTodasComoLeidas(int usuarioId);
        Task CrearNotificacion(int usuarioId, string mensaje);
    }
}