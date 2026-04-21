using MediatR;

namespace Application.Notifications
{
    public class ReservaCompletadaNotification : INotification
    {
        public int ReservaId { get; set; }
        public int GuestId { get; set; }
        public string NombrePropiedad { get; set; } = string.Empty;
        public string NombreHuesped { get; set; } = string.Empty;
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }
}