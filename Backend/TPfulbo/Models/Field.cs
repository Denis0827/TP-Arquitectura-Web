using System;

namespace TPfulbo.Models
{
    public class Field
    {
        private int _idField;
        private string _calle;
        private int _altura;
        private int _capacidad;
        private string _botines;
        private bool _tieneEstacionamiento;

        public int IdField 
        { 
            get { return _idField; }
            set { _idField = value; }
        }
        public string Calle 
        { 
            get { return _calle; }
            set { _calle = value; }
        }
        public int Altura 
        { 
            get { return _altura; }
            set { _altura = value; }
        }
        public int Capacidad 
        { 
            get { return _capacidad; }
            set { _capacidad = value; }
        }
        public string Botines 
        { 
            get { return _botines; }
            set { _botines = value; }
        }
        public bool TieneEstacionamiento 
        { 
            get { return _tieneEstacionamiento; }
            set { _tieneEstacionamiento = value; }
        }


        public Field(string calle, int altura, int capacidad, string botines, bool tieneEstacionamiento)
        {
            _calle = calle;
            _altura = altura;
            _capacidad = capacidad;
            _botines = botines;
            _tieneEstacionamiento = tieneEstacionamiento;
        }
    }
} 