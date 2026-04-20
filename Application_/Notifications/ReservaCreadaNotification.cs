using System;
using MediatR;

namespace Application.Notifications
{
    // La interfaz INotification le dice al sistema que esto es un mensaje asíncrono
    public class ReservaCreadaNotification : INotification
    {
        public int ReservaId { get; set; }
        public int HostId { get; set; }
        public string NombreHuesped { get; set; } = string.Empty;
    }
}