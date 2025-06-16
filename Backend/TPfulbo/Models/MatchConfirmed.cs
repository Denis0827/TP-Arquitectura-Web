using System;

namespace TPfulbo.Models
{
    public class MatchConfirmed : Match
    {
        private int _idTeamA;
        private int _idTeamB;

        public int IdTeamA
        {
            get { return _idTeamA; }
            set { _idTeamA = value; }
        }

        public int IdTeamB
        {
            get { return _idTeamB; }
            set { _idTeamB = value; }
        }

        public MatchConfirmed(DateTime fecha, int idCoach, int idField, int idCategory, int idTeamA, int idTeamB)
            : base(fecha, idCoach, idField, idCategory)
        {
            _idTeamA = idTeamA;
            _idTeamB = idTeamB;
        }
    }
} 