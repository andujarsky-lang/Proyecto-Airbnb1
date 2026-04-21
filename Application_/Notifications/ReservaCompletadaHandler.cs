using Application.Interfaces;
using MediatR;

namespace Application.Notifications
{
    public class ReservaCompletadaHandler : INotificationHandler<ReservaCompletadaNotification>
    {
        private readonly INotificacionService _notificacionService;

        public ReservaCompletadaHandler(INotificacionService notificacionService)
        {
            _notificacionService = notificacionService;
        }

        public async Task Handle(ReservaCompletadaNotification notification, CancellationToken cancellationToken)
        {
            try
            {
                // Notificación interna para el GUEST (solo BD)
                string mensajeGuest = $"¡Estadía completada! Esperamos que hayas disfrutado tu estancia en {notification.NombrePropiedad}. ¡Deja una reseña!";
                await _notificacionService.CrearNotificacion(notification.GuestId, mensajeGuest);

                Console.WriteLine($"[NOTIFICACIÓN BD] Reserva completada - Guest ID: {notification.GuestId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR NOTIFICACIÓN COMPLETADA] {ex.Message}");
            }
        }
    }
}