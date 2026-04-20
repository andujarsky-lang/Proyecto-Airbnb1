using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IReseñaRepository
    {
        Task AgregarAsync(Reseña reseña);
        Task GuardarCambiosAsync();
        Task<List<Reseña>> ObtenerPorPropiedadIdAsync(int propiedadId);
    }
}
