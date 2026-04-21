using Domain.Entities;

namespace Application.Interfaces
{
    public interface INotificacionRepository
    {
        Task<IEnumerable<Notificacion>> ObtenerPorUsuarioAsync(int usuarioId);
        Task<IEnumerable<Notificacion>> ObtenerNoLeidasPorUsuarioAsync(int usuarioId);
        Task<Notificacion?> ObtenerPorIdAsync(int id);
        Task AgregarAsync(Notificacion notificacion);
        Task MarcarComoLeidaAsync(int notificacionId);
        Task MarcarTodasComoLeidasAsync(int usuarioId);
        Task GuardarCambiosAsync();
    }
}