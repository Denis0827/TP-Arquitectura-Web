using System;

namespace TPfulbo.Models
{
    public class Coach : User
    {

        // Constructor sin parámetros para deserialización JSON
        public Coach() : base("", "", DateTime.Now, "", "", "")
        {
        }

        public Coach(int idUser, string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
        : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
            IdUser = idUser;
        }
    }
} 