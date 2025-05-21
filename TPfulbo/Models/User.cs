using System;

namespace TPfulbo.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Mail { get; set; }
        public string Telefono { get; set; }
        public string Contraseña { get; set; }
    }
}