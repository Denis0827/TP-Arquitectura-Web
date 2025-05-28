using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class Match
    {
        private int _id;
        private int _idCancha;
        private int _idCategory;
        private DateTime _fecha;
        private TimeSpan _hora;
        private int _idTeamA;
        private int _idTeamB;
        private List<int> _idAssistance;

        public int Id
        {
            get { return _id; }
            set { _id = value; }
        }

        public int IdCancha
        {
            get { return _idCancha; }
            set { _idCancha = value; }
        }

        public int IdCategory
        {
            get { return _idCategory; }
            set { _idCategory = value; }
        }

        public DateTime Fecha
        {
            get { return _fecha; }
            set { _fecha = value; }
        }

        public TimeSpan Hora
        {
            get { return _hora; }
            set { _hora = value; }
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

        public List<int> IdAssistance
        {
            get { return _idAssistance; }
            set { _idAssistance = value; }
        }

        public Match(int idCancha, int idCategory, DateTime fecha, TimeSpan hora, int idTeamA, int idTeamB)
        {
            _idCancha = idCancha;
            _idCategory = idCategory;
            _fecha = fecha;
            _hora = hora;
            _idTeamA = idTeamA;
            _idTeamB = idTeamB;
            _idAssistance = new List<int>();
        }
    }
} 