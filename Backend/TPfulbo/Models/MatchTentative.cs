using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class MatchTentative : Match
    {
        private List<int> _idPlayers;

        public List<int> IdPlayers
        {
            get { return _idPlayers; }
            set { _idPlayers = value; }
        }

        public MatchTentative(DateTime fecha, int idCoach, int idField, int idCategory)
            : base(fecha, idCoach, idField, idCategory)
        {
            _idPlayers = new List<int>();
        }
    }
} 