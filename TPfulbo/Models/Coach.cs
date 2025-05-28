using System;

namespace TPfulbo.Models
{
    public class Coach : User
    {
        private int _idCoach;

        public int IdCoach
        {
            get { return _idCoach; }
            set { _idCoach = value; }
        }

        public Coach(int idCoach, string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
            : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
            _idCoach = idCoach;
        }
    }
} 