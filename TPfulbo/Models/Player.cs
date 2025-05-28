using System;

namespace TPfulbo.Models
{
    public class Player : User
    {
        private int _idPlayer;

        public int IdPlayer
        {
            get { return _idPlayer; }
            set { _idPlayer = value; }
        }

        public Player(int idPlayer, string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
            : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
            _idPlayer = idPlayer;
        }
    }
} 