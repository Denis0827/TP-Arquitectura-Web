using System;

namespace TPfulbo.Models
{
    public class Player : User
    {
        private string _dni;
        private int _edad;

        public string DNI
        {
            get { return _dni; }
            set { _dni = value; }
        }

        public int Edad
        {
            get { return _edad; }
            set { _edad = value; }
        }

        public Player(string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña, string dni, int edad)
        : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
            _dni = dni;
            _edad = edad;
        }
    }
} 