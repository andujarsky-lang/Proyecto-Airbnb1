using System;
using MediatR;

namespace Application.Notifications
{
    // Este Handler está "suscrito" a la notificación de arriba

    public class EnviarCorreoReservaHandler : INotificationHandler<ReservaCreadaNotification>
    {
        public async Task Handle(ReservaCreadaNotification notification, CancellationToken cancellationToken)
        {
            // 🚨 SIMULACIÓN DE PROCESO PESADO 🚨
            // Aquí es donde iría la lógica real de enviar un email con SendGrid o SMTP.
            // Le ponemos un retraso de 3 segundos para simular que el correo viaja por internet.
            await Task.Delay(3000, cancellationToken);

            Console.WriteLine($"\n📧 [EMAIL ASÍNCRONO ENVIADO]:");
            Console.WriteLine($"Para el Host ID: {notification.HostId}");
            Console.WriteLine($"Mensaje: ¡Tienes una nueva reserva pendiente (ID: {notification.ReservaId}) del huésped {notification.NombreHuesped}!\n");
        }
    }
}
