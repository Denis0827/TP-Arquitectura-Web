using System;

namespace TPfulbo.Models
{
    public class User
    {
        private int _idUser;
        private string _nombre;
        private string _apellido;
        private DateTime _fechaNacimiento;
        private string _mail;
        private string _telefono;
        private string _contraseña;

        public int IdUser
        {
            get { return _idUser; }
            set { _idUser = value; }
        }

        public string Nombre
        {
            get { return _nombre; }
            set { _nombre = value; }
        }

        public string Apellido
        {
            get { return _apellido; }
            set { _apellido = value; }
        }

        public DateTime FechaNacimiento
        {
            get { return _fechaNacimiento; }
            set { _fechaNacimiento = value; }
        }

        public string Mail
        {
            get { return _mail; }
            set { _mail = value; }
        }

        public string Telefono
        {
            get { return _telefono; }
            set { _telefono = value; }
        }

        public string Contraseña
        {
            get { return _contraseña; }
            set { _contraseña = value; }
        }

        // Constructor con parámetros
        public User(string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
        {
            _nombre = nombre;
            _apellido = apellido;
            _fechaNacimiento = fechaNacimiento;
            _mail = mail;
            _telefono = telefono;
            _contraseña = contraseña;
        }
    }
}