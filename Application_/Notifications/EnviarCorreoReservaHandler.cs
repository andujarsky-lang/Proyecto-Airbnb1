using Application.Interfaces;
using MediatR;

namespace Application.Notifications
{
    // Este Handler está "suscrito" a la notificación de arriba
    public class EnviarCorreoReservaHandler : INotificationHandler<ReservaCreadaNotification>
    {
        private readonly INotificacionService _notificacionService;

        public EnviarCorreoReservaHandler(INotificacionService notificacionService)
        {
            _notificacionService = notificacionService;
        }

        public async Task Handle(ReservaCreadaNotification notification, CancellationToken cancellationToken)
        {
            try
            {
                // Solo crear notificación interna en BD (sin Telegram)
                string mensajeInterno = $"Nueva reserva recibida de {notification.NombreHuesped} (ID: {notification.ReservaId})";
                await _notificacionService.CrearNotificacion(notification.HostId, mensajeInterno);

                Console.WriteLine($"[NOTIFICACIÓN BD] Nueva reserva para Host ID: {notification.HostId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR NOTIFICACIÓN] {ex.Message}");
            }
        }
    }
}
