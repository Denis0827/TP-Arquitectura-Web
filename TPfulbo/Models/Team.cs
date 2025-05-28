using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class Team
    {
        private int _id;
        private string _nombre;
        private List<int> _idPlayers;

        public int Id
        {
            get { return _id; }
            set { _id = value; }
        }

        public string Nombre
        {
            get { return _nombre; }
            set { _nombre = value; }
        }

        public List<int> IdPlayers
        {
            get { return _idPlayers; }
            set { _idPlayers = value; }
        }

        public Team(string nombre)
        {
            _nombre = nombre;
            _idPlayers = new List<int>();
        }
    }
} 