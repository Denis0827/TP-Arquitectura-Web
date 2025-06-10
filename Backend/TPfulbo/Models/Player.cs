using System;

namespace TPfulbo.Models
{
    public class Player : User
    {

        public Player(string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña)
        : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
        }
    }
} 