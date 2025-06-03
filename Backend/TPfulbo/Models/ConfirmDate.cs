using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class ConfirmDate
    {
        private int _idDate;
        private DateTime _fecha;
        private List<int> _idPlayers;

        public int IdDate
        {
            get { return _idDate; }
            set { _idDate = value; }
        }

        public DateTime Fecha
        {
            get { return _fecha; }
            set { _fecha = value; }
        }

        public List<int> IdPlayers
        {
            get { return _idPlayers; }
            set { _idPlayers = value; }
        }

        public ConfirmDate(DateTime fecha)
        {
            _fecha = fecha;
            _idPlayers = new List<int>();
        }
    }
} 