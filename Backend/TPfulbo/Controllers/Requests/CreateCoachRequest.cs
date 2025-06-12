using System;

namespace TPfulbo.Controllers.Requests
{
    public class CreateCoachRequest
    {
        public string Licencia { get; set; }
        public DateTime FechaIngreso { get; set; }
        public int AniosExperiencia { get; set; }
    }
} 