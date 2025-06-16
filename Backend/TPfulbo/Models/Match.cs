using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class Match
    {
        private DateTime _fecha;
        private int _idMatch;
        private int _idCoach;
        private int _idField;
        private int _idCategory;

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

        public DateTime Fecha
        {
            get { return _fecha; }
            set { _fecha = value; }
        }

        public int IdCategory
        {
            get { return _idCategory; }
            set { _idCategory = value; }
        }

        public Match(DateTime fecha, int idCoach, int idField, int idCategory)
        {
            _fecha = fecha;
            _idCoach = idCoach;
            _idField = idField;
            _idCategory = idCategory;
        }
    }
} 