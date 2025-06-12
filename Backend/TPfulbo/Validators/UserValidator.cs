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
            string fechaNacimiento,
            string mail,
            string telefono,
            string contraseña,
            string dni,
            int edad,
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

            if (string.IsNullOrWhiteSpace(fechaNacimiento))
            {
                return (false, "La fecha de nacimiento no puede estar vacía");
            }

            // Validar formato de fecha dd/mm/aaaa
            string datePattern = @"^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$";
            if (!Regex.IsMatch(fechaNacimiento, datePattern))
            {
                return (false, "La fecha debe tener el formato dd/mm/aaaa");
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

            // Validar longitud mínima de contraseña
            if (contraseña.Length < 8)
            {
                return (false, "La contraseña debe tener al menos 8 caracteres");
            }

            // Validar que la contraseña tenga al menos una mayúscula y una minúscula
            if (!Regex.IsMatch(contraseña, @"^(?=.*[a-z])(?=.*[A-Z]).*$"))
            {
                return (false, "La contraseña debe contener al menos una mayúscula y una minúscula");
            }

            // Validar DNI
            if (string.IsNullOrWhiteSpace(dni))
            {
                return (false, "El DNI no puede estar vacío");
            }

            string dniPattern = @"^\d{7,8}$";
            if (!Regex.IsMatch(dni, dniPattern))
            {
                return (false, "El DNI debe tener 7 u 8 dígitos");
            }

            // Validar edad
            if (edad <= 0)
            {
                return (false, "Ingrese un valor válido.");
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