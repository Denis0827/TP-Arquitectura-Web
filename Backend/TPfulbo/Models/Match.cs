using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class Match
    {
        private int _idMatch;
        private int _idCoach;
        private int _idField;
        private int _idDate;
        private int _idCategory;
        private List<int> _idPlayersTeamA;
        private List<int> _idPlayersTeamB;
        
        

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

        public List<int> IdPlayersTeamA
        {
            get { return _idPlayersTeamA; }
            set { _idPlayersTeamA = value; }
        }

        public List<int> IdPlayersTeamB
        {
            get { return _idPlayersTeamB; }
            set { _idPlayersTeamB = value; }
        }

        public Match(int idCoach, int idField, int idDate, int idCategory, List<int> idPlayersTeamA = null, List<int> idPlayersTeamB = null)
        {
            _idCoach = idCoach;
            _idField = idField;
            _idDate = idDate;
            _idCategory = idCategory;
            _idPlayersTeamA = idPlayersTeamA ?? new List<int>();
            _idPlayersTeamB = idPlayersTeamB ?? new List<int>();
        }
    }
} 