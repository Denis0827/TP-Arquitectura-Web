using System;

namespace TPfulbo.Controllers.Requests
{
    public class PlayerRequest
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string FechaNacimiento { get; set; }
        public string Mail { get; set; }
        public string Telefono { get; set; }
        public string Contraseña { get; set; }
    }
}