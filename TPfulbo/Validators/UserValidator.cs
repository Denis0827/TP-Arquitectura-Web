using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using TPfulbo.Models;

namespace TPfulbo.Validators
{
    public class UserValidator
    {
        public (bool isValid, string message) ValidateUserData(string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña, IEnumerable<User> existingUsers)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                return (false, "El nombre no puede estar vacío");

            if (string.IsNullOrWhiteSpace(apellido))
                return (false, "El apellido no puede estar vacío");

            if (fechaNacimiento > DateTime.Now)
                return (false, "La fecha de nacimiento no puede ser futura");

            if (string.IsNullOrWhiteSpace(mail))
                return (false, "El mail no puede estar vacío");

            if (!IsValidEmail(mail))
                return (false, "El formato del mail no es válido");

            if (string.IsNullOrWhiteSpace(telefono))
                return (false, "El teléfono no puede estar vacío");

            if (!IsValidPhone(telefono))
                return (false, "El formato del teléfono no es válido");

            if (string.IsNullOrWhiteSpace(contraseña))
                return (false, "La contraseña no puede estar vacía");

            if (!IsValidPassword(contraseña))
                return (false, "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número");

            // Verificar si el mail ya está en uso (solo si se proporciona la lista de usuarios)
            if (existingUsers != null && existingUsers.Any(u => u.Mail.Equals(mail, StringComparison.OrdinalIgnoreCase)))
                return (false, "El mail ya está en uso");

            return (true, "Datos válidos");
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPhone(string phone)
        {
            // Permite números, espacios, guiones y paréntesis
            return Regex.IsMatch(phone, @"^[0-9\s\-\(\)]+$");
        }

        private bool IsValidPassword(string password)
        {
            // Mínimo 8 caracteres, al menos una mayúscula y un número
            return password.Length >= 8 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsDigit);
        }
    }
} 