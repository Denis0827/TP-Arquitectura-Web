using System;
using System.Collections.Generic;

namespace TPfulbo.Controllers.Requests
{
    public class CreateMatchRequest
    {
        public int IdField { get; set; }
        public int IdConfirmDate { get; set; }
        public int IdCategory { get; set; }
        public List<int> IdPlayersTeamA { get; set; }
        public List<int> IdPlayersTeamB { get; set; }
    }
} 