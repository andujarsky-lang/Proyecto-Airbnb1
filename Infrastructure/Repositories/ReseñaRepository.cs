using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ReseñaRepository :IReseñaRepository
    {
        private readonly ApplicationDbContext _context;

        public ReseñaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AgregarAsync(Reseña reseña)
        {
            await _context.Reseñas.AddAsync(reseña);
        }

        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task<List<Reseña>> ObtenerPorPropiedadIdAsync(int propiedadId)
        {
            return await _context.Reseñas
              .Where(r => r.PropiedadId == propiedadId)
              .ToListAsync();
        }
    }
}
