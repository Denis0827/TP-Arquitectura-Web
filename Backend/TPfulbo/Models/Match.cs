using System;

namespace TPfulbo.Models
{
    public class Match
    {
        private int _idMatch;
        private int _idCoach;
        private int _idField;
        private int _idDate;
        private int _idCategory;
        private int _idTeamA;
        private int _idTeamB;

        public int IdMatch
        {
            get { return _idMatch; }
            set { _idMatch = value; }
        }

        public int IdCoach
        {
            get { return _idCoach; }
            set { _idCoach = value; }
        }

        public int IdField
        {
            get { return _idField; }
            set { _idField = value; }
        }

        public int IdDate
        {
            get { return _idDate; }
            set { _idDate = value; }
        }

        public int IdCategory
        {
            get { return _idCategory; }
            set { _idCategory = value; }
        }

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

        public Match(int idCoach, int idField, int idDate, int idCategory)
        {
            _idCoach = idCoach;
            _idField = idField;
            _idDate = idDate;
            _idCategory = idCategory;
        }
    }
} 