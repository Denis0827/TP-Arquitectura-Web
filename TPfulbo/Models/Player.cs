using System;

namespace TPfulbo.Models
{
    public class Player : User
    {

        // Constructor sin parámetros para deserialización JSON
        public Player() : base("", "", DateTime.Now, "", "", "")
        {
        }

        public Player(string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
        : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
        }
    }
} 