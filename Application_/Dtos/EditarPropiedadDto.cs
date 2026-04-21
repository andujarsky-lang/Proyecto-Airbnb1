namespace Application.Dtos
{
    public class EditarPropiedadDto
    {
        public string Nombre { get; set; } = null!;
        public string Ubicacion { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        // NuevaImagen ya no vive aquí — el controller la recibe y la convierte a Stream antes de llamar al servicio
    }
}
