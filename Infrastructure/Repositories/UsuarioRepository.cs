using Microsoft.EntityFrameworkCore;
using Application.Interfaces;
using Domain.Entities;


namespace Infrastructure.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ApplicationDbContext _context = null!;

        public UsuarioRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> ObtenerPorCorreoAsync(string correo)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Correo == correo);
        }

        public async Task AgregarAsync(Usuario usuario)
        {
            await _context.Usuarios.AddAsync(usuario);
        }

        public async Task GuardarCambiosAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Usuario?> ObtenerPorIdAsync(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }
    }
}
