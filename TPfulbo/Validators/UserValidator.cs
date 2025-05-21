using System;
using System.Text.RegularExpressions;
using TPfulbo.Models;

namespace TPfulbo.Validators
{
    public class UserValidator
    {
        public (bool isValid, string message) ValidateUserData(User user, IEnumerable<User> existingUsers)
        {
            // Validar campos vacíos
            if (string.IsNullOrWhiteSpace(user.Nombre))
                return (false, "El nombre no puede estar vacío");
            
            if (string.IsNullOrWhiteSpace(user.Apellido))
                return (false, "El apellido no puede estar vacío");
            
            if (string.IsNullOrWhiteSpace(user.Mail))
                return (false, "El email no puede estar vacío");
            
            if (string.IsNullOrWhiteSpace(user.Telefono))
                return (false, "El teléfono no puede estar vacío");
            
            if (string.IsNullOrWhiteSpace(user.Contraseña))
                return (false, "La contraseña no puede estar vacía");

            // Validar formato de email
            if (!IsValidEmail(user.Mail))
                return (false, "El formato del email no es válido");

            // Validar que el email sea único
            if (existingUsers.Any(u => u.Mail.Equals(user.Mail, StringComparison.OrdinalIgnoreCase)))
                return (false, "El email ya está registrado");

            // Validar formato de teléfono (solo números y caracteres básicos)
            if (!IsValidPhone(user.Telefono))
                return (false, "El formato del teléfono no es válido");

            // Validar contraseña
            if (!IsValidPassword(user.Contraseña))
                return (false, "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número");

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