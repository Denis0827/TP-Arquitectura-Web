using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class Team
    {
        private int _idTeam;
        private List<int> _idPlayers;

        public int IdTeam
        {
            get { return _idTeam; }
            set { _idTeam = value; }
        }

        public List<int> IdPlayers
        {
            get { return _idPlayers; }
            set { _idPlayers = value; }
        }

        public Team(List<int> idPlayers)
        {
            _idPlayers = idPlayers;
        }

    }
} 