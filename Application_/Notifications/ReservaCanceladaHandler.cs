using Application.Interfaces;
using MediatR;

namespace Application.Notifications
{
    public class ReservaCanceladaHandler : INotificationHandler<ReservaCanceladaNotification>
    {
        private readonly INotificacionService _notificacionService;

        public ReservaCanceladaHandler(INotificacionService notificacionService)
        {
            _notificacionService = notificacionService;
        }

        public async Task Handle(ReservaCanceladaNotification notification, CancellationToken cancellationToken)
        {
            try
            {
                // 1. Notificación para el HOST (solo BD)
                string mensajeHost = $"Reserva cancelada: {notification.NombreHuesped} canceló su reserva (ID: {notification.ReservaId}) para {notification.NombrePropiedad}";
                await _notificacionService.CrearNotificacion(notification.HostId, mensajeHost);

                // 2. Notificación para el GUEST (solo BD)
                string mensajeGuest = $"Has cancelado tu reserva para {notification.NombrePropiedad} (ID: {notification.ReservaId})";
                await _notificacionService.CrearNotificacion(notification.GuestId, mensajeGuest);

                Console.WriteLine($"[NOTIFICACIÓN BD] Reserva cancelada - Host ID: {notification.HostId}, Guest ID: {notification.GuestId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR NOTIFICACIÓN CANCELACIÓN] {ex.Message}");
            }
        }
    }
}