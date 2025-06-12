using System;

namespace TPfulbo.Models
{
    public class Coach : User
    {
        private string _licencia;
        private DateTime _fechaIngreso;
        private int _aniosExperiencia;

        public string Licencia
        {
            get { return _licencia; }
            set { _licencia = value; }
        }

        public DateTime FechaIngreso
        {
            get { return _fechaIngreso; }
            set { _fechaIngreso = value; }
        }

        public int AniosExperiencia
        {
            get { return _aniosExperiencia; }
            set { _aniosExperiencia = value; }
        }

        public Coach(string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña, string licencia, DateTime fechaIngreso, int aniosExperiencia)
        : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
            _licencia = licencia;
            _fechaIngreso = fechaIngreso;
            _aniosExperiencia = aniosExperiencia;
        }
    }
} 