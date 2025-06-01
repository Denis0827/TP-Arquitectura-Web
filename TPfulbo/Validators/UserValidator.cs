using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using TPfulbo.Models;

namespace TPfulbo.Validators
{
    public class UserValidator
    {
        public (bool isValid, string message) ValidateUserData(
            string nombre,
            string apellido,
            DateTime fechaNacimiento,
            string mail,
            string telefono,
            string contraseña,
            IEnumerable<User> existingUsers)
        {
            if (string.IsNullOrWhiteSpace(nombre))
            {
                return (false, "El nombre no puede estar vacío");
            }

            if (string.IsNullOrWhiteSpace(apellido))
            {
                return (false, "El apellido no puede estar vacío");
            }

            if (fechaNacimiento == default(DateTime))
            {
                return (false, "La fecha de nacimiento no puede estar vacía");
            }

            if (string.IsNullOrWhiteSpace(mail))
            {
                return (false, "El mail no puede estar vacío");
            }

            if (!mail.Contains("@"))
            {
                return (false, "El mail debe contener un @");
            }

            if (string.IsNullOrWhiteSpace(telefono))
            {
                return (false, "El teléfono no puede estar vacío");
            }

            string phonePattern = @"^\d{2}-\d{4}-\d{4}$";
            if (!Regex.IsMatch(telefono, phonePattern))
            {
                return (false, "El formato del teléfono debe ser XX-XXXX-XXXX");
            }

            if (string.IsNullOrWhiteSpace(contraseña))
            {
                return (false, "La contraseña no puede estar vacía");
            }

            // Verificar si el mail ya está registrado
            foreach (var user in existingUsers)
            {
                if (user.Mail.Equals(mail, StringComparison.OrdinalIgnoreCase))
                {
                    return (false, "El mail ya está registrado");
                }
            }

            return (true, "Datos válidos");
        }
    }
} 