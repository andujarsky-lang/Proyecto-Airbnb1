namespace Application.Dtos
{
    public class CrearPropiedadDto
    {
        public string Nombre { get; set; } = null!;
        public string Ubicacion { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        // HostId ya no viene del body — lo lee el controller del JWT y se lo pasa al servicio
    }
}
