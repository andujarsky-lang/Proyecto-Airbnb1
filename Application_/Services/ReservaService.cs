using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ReservaService : IReservaService
    {
        private readonly IReservaRepository _reservaRepository;
        private readonly IPropiedadRepository _propiedadRepository;
        private readonly IEmailService _emailService;
        private readonly IUsuarioRepository _usuarioRepository;

        public ReservaService(IReservaRepository reservaRepository, IPropiedadRepository propiedadRepository, IEmailService emailService,
        IUsuarioRepository usuarioRepository)
        {
            _reservaRepository = reservaRepository;
            _propiedadRepository = propiedadRepository;
            _emailService = emailService;
            _usuarioRepository = usuarioRepository;
        }

        public async Task<bool> CrearReserva(ReservaDto reservaDto, int guestId)
        {
            // Validamos que la propiedad exista
            var propiedad = await _propiedadRepository.ObtenerPorIdAsync(reservaDto.PropiedadId);
            if (propiedad == null) return false;

            // 2. Validamos que el dueño no reserve su propia casa
            if (propiedad.HostId == guestId) return false;

            // 3. Prevenir Overbooking
            var estaDisponible = await _reservaRepository.EstaDisponibleAsync(reservaDto.PropiedadId, reservaDto.FechaInicio, reservaDto.FechaFin);
            if (!estaDisponible) return false; // Si no está disponible, abortamos

            // 4. Calcular precios y noches
            decimal precioPorNoche = await _propiedadRepository.ObtenerPrecioNocheAsync(reservaDto.PropiedadId);
            int noches = (reservaDto.FechaFin - reservaDto.FechaInicio).Days;

            if (noches <= 0) return false;

            // 5. Mapear el DTO a la Entidad
            var nuevaReserva = new Reserva
            {
                PropiedadId = reservaDto.PropiedadId,
                GuestId = guestId,
                FechaInicio = reservaDto.FechaInicio,
                FechaFin = reservaDto.FechaFin,
                PrecioTotal = noches * precioPorNoche,
                // OJO: La pasé a Confirmada para que el Huésped pueda dejar la Reseña luego
                Estado = EstadoReserva.Pendiente,
                FechaReserva = DateTime.UtcNow
            };

            // aqui entra algo super importante: la concurrencia

            // A. "Tocamos" la propiedad para actualizar su RowVersion en la base de datos
            propiedad.UltimaActividad = DateTime.UtcNow;

            // B. Preparamos la reserva para guardarla
            await _reservaRepository.AgregarAsync(nuevaReserva);
            
            // C. Intentamos guardar ambas cosas al mismo tiempo, sabiendo lo que va a pasar 
            try
            {
                await _reservaRepository.GuardarCambiosAsync();

                var huesped = await _usuarioRepository.ObtenerPorIdAsync(guestId);

                if (huesped != null && !string.IsNullOrEmpty(huesped.Correo))
                {
                    string asunto = "¡Tu solicitud de reserva está Pendiente!";

                    string cuerpo = $@"
                        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                            <h2 style='color: #FF5A5F;'>¡Hola, {huesped.Nombre}! 🏠</h2>
                            <p>Tu solicitud de reserva para <b>{propiedad.Nombre}</b> ha sido recibida con éxito.</p>
                            <ul>
                                <li><b>Check-in:</b> {reservaDto.FechaInicio:dd/MM/yyyy}</li>
                                <li><b>Check-out:</b> {reservaDto.FechaFin:dd/MM/yyyy}</li>
                                <li><b>Precio Total:</b> ${noches * precioPorNoche}</li>
                            </ul>
                            <p>Actualmente está en estado <b>Pendiente</b>. El anfitrión te confirmará pronto.</p>
                            <p>Gracias por usar HomelyGo.</p>
                        </div>";

                    await _emailService.EnviarCorreoAsync(huesped.Correo, asunto, cuerpo);
                }

                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }

        public async Task<IEnumerable<ReservaResponseDto>> ObtenerMisReservas(int guestId)
        {
            // 1. Buscamos las reservas crudas en la base de datos
            var reservas = await _reservaRepository.ObtenerPorUsuarioAsync(guestId);

            // 2. Mapeamos la Entidad al DTO visual
            return reservas.Select(r => new ReservaResponseDto
            {
                Id = r.Id,
                PropiedadId = r.PropiedadId,
                FechaInicio = r.FechaInicio,
                FechaFin = r.FechaFin,
                PrecioTotal = r.PrecioTotal,
                Estado = r.Estado.ToString(),
                FechaReserva = r.FechaReserva
            });
        }

        public async Task<bool> CancelarReserva(int reservaId, int guestId)
        {
            // 1. Buscamos la reserva en la base de datos
            var reserva = await _reservaRepository.ObtenerPorIdAsync(reservaId);

            // 2. Si no existe, devolvemos false 
            if (reserva == null) return false;

            if (reserva.GuestId != guestId) return false;

            if (reserva.Estado == EstadoReserva.Cancelada) return false;

            TimeSpan tiempoParaCheckIn = reserva.FechaInicio - DateTime.UtcNow;

            if (tiempoParaCheckIn.TotalHours < 24)
            {
                return false;
            }

            // 5. Cambiamos el estado
            reserva.Estado = EstadoReserva.Cancelada;

            await _reservaRepository.GuardarCambiosAsync();

            return true;
        }

        public async Task<bool> CompletarReserva(int reservaId, int guestId)
        {
            var reserva = await _reservaRepository.ObtenerPorIdAsync(reservaId);

            // Validaciones de seguridad
            if (reserva == null || reserva.GuestId != guestId) return false;

            if (reserva.Estado != EstadoReserva.Confirmada) return false;

            if (reserva.FechaFin > DateTime.UtcNow)
            {
                return false;
            }

            reserva.Estado = EstadoReserva.Completada;
            await _reservaRepository.GuardarCambiosAsync();
            return true;
        }

        public async Task<bool> AceptarReserva(int reservaId, int hostId)
        {
            var reserva = await _reservaRepository.ObtenerPorIdAsync(reservaId);
            if (reserva == null) return false;

            // Buscamos la casa para asegurarnos de que el usuario actual es el dueño
            var propiedad = await _propiedadRepository.ObtenerPorIdAsync(reserva.PropiedadId);
            if (propiedad == null || propiedad.HostId != hostId) return false; // ¡Impostor detectado!

            // Solo podemos aceptar reservas que estén pendientes
            if (reserva.Estado != EstadoReserva.Pendiente) return false;

            reserva.Estado = EstadoReserva.Confirmada;
            await _reservaRepository.GuardarCambiosAsync();

            return true;
        }
    }
}