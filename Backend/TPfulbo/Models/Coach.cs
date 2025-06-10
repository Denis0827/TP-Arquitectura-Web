using System;

namespace TPfulbo.Models
{
    public class Coach : User
    {

        public Coach(int idUser, string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña)
        : base(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
        {
            IdUser = idUser;
        }
    }
} 