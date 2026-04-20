using Application.Dtos;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class PropiedadRepository : IPropiedadRepository
    {
        private readonly ApplicationDbContext _context = null!;

        public PropiedadRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExisteHostAsync(int hostId)
        {
            // Busca en la tabla de usuarios si hay alguno con ese ID
            return await _context.Usuarios.AnyAsync(u => u.Id == hostId);
        }

        public async Task AgregarAsync(Propiedad propiedad)
        {
            await _context.Propiedades.AddAsync(propiedad);
        }

        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<decimal> ObtenerPrecioNocheAsync(int propiedadId)
        {
            return await _context.Propiedades
                .Where(p => p.Id == propiedadId)
                .Select(p => p.PrecioPorNoche) 
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Propiedad>> ObtenerTodasAsync()
        {
            return await _context.Propiedades.ToListAsync();
        }
        public async Task<Propiedad?> ObtenerPorIdAsync(int id)
        {
            return await _context.Propiedades.FindAsync(id);
        }

        public async Task<IEnumerable<Propiedad>> BuscarDisponiblesAsync(FiltroBusquedaDto filtro)
        {
            // 1. Empezamos con todas las propiedades que cumplen los filtros básicos
            var query = _context.Propiedades.AsQueryable();

            if (!string.IsNullOrEmpty(filtro.Ubicacion))
                query = query.Where(p => p.Ubicacion == filtro.Ubicacion);

            if (filtro.PrecioMaximo.HasValue)
                query = query.Where(p => p.PrecioPorNoche <= filtro.PrecioMaximo.Value);

            // Buscamos propiedades cuyas reservas confirmadas NO choquen con las fechas pedidas
            var propiedadesIdsOcupadas = _context.Reservas
                .Where(r => r.Estado == EstadoReserva.Confirmada &&
                            r.FechaInicio < filtro.FechaFin &&
                            r.FechaFin > filtro.FechaInicio)
                .Select(r => r.PropiedadId);

            query = query.Where(p => !propiedadesIdsOcupadas.Contains(p.Id));

            // Saltamos las páginas anteriores y tomamos solo la cantidad solicitada
            var resultados = await query
                .Skip((filtro.Pagina - 1) * filtro.TamañoPagina)
                .Take(filtro.TamañoPagina)
                .ToListAsync();

            return resultados;
        }
    }
}