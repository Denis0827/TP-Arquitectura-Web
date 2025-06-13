using System;
using System.Collections.Generic;

namespace TPfulbo.Controllers.Requests
{
    public class ConfirmDateRequest
    {
        public DateTime Fecha { get; set; }
        public int IdField { get; set; }
        public int IdCategory { get; set; }
    }
} 