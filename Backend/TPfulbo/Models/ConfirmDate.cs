using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class ConfirmDate
    {
        private int _idDate;
        private DateTime _fecha;
        private int _idField;
        private int _idCategory;
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

        public int IdField
        {
            get { return _idField; }
            set { _idField = value; }
        }

        public int IdCategory
        {
            get { return _idCategory; }
            set { _idCategory = value; }
        }

        public List<int> IdPlayers
        {
            get { return _idPlayers; }
            set { _idPlayers = value; }
        }

        public ConfirmDate(DateTime fecha, int idField, int idCategory)
        {
            _fecha = fecha;
            _idField = idField;
            _idCategory = idCategory;
            _idPlayers = new List<int>();
        }
    }
} 