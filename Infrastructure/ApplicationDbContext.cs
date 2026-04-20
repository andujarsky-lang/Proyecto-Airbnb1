using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Propiedad> Propiedades { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<Reseña> Reseñas { get; set; }
        public DbSet<ImagenPropiedad> ImagenesPropiedad { get; set; }




    }
}
