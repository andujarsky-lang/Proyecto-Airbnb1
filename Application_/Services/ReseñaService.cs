using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ReseñaService : IReseñaService
    {
        private readonly IReservaRepository _reservaRepository;
        private readonly IReseñaRepository _reseñaRepository;

        public ReseñaService(IReservaRepository reservaRepository, IReseñaRepository reseñaRepository)
        {
            _reservaRepository = reservaRepository;
            _reseñaRepository = reseñaRepository;
        }
        public async Task<bool> CrearReseña(ReseñaDto dto, int userId)
        {
            var reserva = await _reservaRepository.ObtenerPorIdAsync(dto.ReservaId);

            if (reserva == null ||
                reserva.GuestId != userId ||
                reserva.Estado != EstadoReserva.Completada)
            {
                return false; 
            }

            var nuevaReseña = new Reseña
            {
                ReservaId = dto.ReservaId,
                PropiedadId = reserva.PropiedadId,
                GuestId = userId,
                Calificacion = dto.Calificacion,
                Comentario = dto.Comentario
            };

            await _reseñaRepository.AgregarAsync(nuevaReseña);
            await _reseñaRepository.GuardarCambiosAsync();
            return true;
        }
    }
}
