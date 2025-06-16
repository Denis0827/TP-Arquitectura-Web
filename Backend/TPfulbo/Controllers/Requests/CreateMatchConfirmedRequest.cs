using System;
using System.Collections.Generic;

namespace TPfulbo.Controllers.Requests
{
    public class CreateMatchConfirmedRequest
    {
        public int IdMatchTentative { get; set; }
        public List<int> IdPlayersTeamA { get; set; }
        public List<int> IdPlayersTeamB { get; set; }
    }
} 