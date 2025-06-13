using System;

namespace TPfulbo.Controllers.Requests
{
    public class CreateFieldRequest
    {
        public string Calle { get; set; }
        public int Altura { get; set; }
        public int Capacidad { get; set; }
        public string Botines { get; set; }
        public bool TieneEstacionamiento { get; set; }
    }
} 