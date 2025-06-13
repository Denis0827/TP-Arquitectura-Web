using System;

namespace TPfulbo.Controllers.Requests
{
    public class CreateDateRequest
    {
        public DateTime Fecha { get; set; }
        public int IdField { get; set; }
        public int IdCategory { get; set; }
    }
} 