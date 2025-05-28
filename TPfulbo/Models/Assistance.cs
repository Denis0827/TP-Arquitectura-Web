using System;

namespace TPfulbo.Models
{
    public class Assistance
    {
        private int _id;
        private int _idPlayer;
        private int _idMatch;
        private bool _asistio;

        public int Id
        {
            get { return _id; }
            set { _id = value; }
        }

        public int IdPlayer
        {
            get { return _idPlayer; }
            set { _idPlayer = value; }
        }

        public int IdMatch
        {
            get { return _idMatch; }
            set { _idMatch = value; }
        }

        public bool Asistio
        {
            get { return _asistio; }
            set { _asistio = value; }
        }

        public Assistance(int idPlayer, int idMatch)
        {
            _idPlayer = idPlayer;
            _idMatch = idMatch;
            _asistio = false;
        }
    }
} 