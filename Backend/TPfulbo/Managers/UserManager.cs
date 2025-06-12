using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;
using System.Linq;

namespace TPfulbo.Managers
{
    public class UserManager
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly ICoachRepository _coachRepository;
        private readonly UserValidator _validator;

        public UserManager(
            IPlayerRepository playerRepository,
            ICoachRepository coachRepository)
        {
            _playerRepository = playerRepository;
            _coachRepository = coachRepository;
            _validator = new UserValidator();
        }

        public async Task<(bool success, string message, Player player)> CreatePlayer(string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña, string dni, int edad)
        {
            var existingPlayers = await _playerRepository.GetAllPlayers();            
            // Validar datos del usuario
            var (isValid, message) = _validator.ValidateUserData(nombre, apellido, fechaNacimiento, mail, telefono, contraseña, dni, edad, existingPlayers.Select(p => new Player(p.Nombre, p.Apellido, p.FechaNacimiento, p.Mail, p.Telefono, p.Contraseña, p.DNI, p.Edad)));
            if (!isValid)
            {
                return (false, message, null);
            }

            // Crear el jugador directamente
            var player = await _playerRepository.CreatePlayer(nombre, apellido, fechaNacimiento, mail, telefono, contraseña, dni, edad);
            return (true, "Jugador creado exitosamente", player);
        }

        public async Task<(bool success, string message)> CreateCoach(int idPlayer, string licencia, DateTime fechaIngreso, int aniosExperiencia)
        {
            var player = await _playerRepository.GetPlayerById(idPlayer);
            if (player == null)
            {
                return (false, "Jugador no encontrado");
            }

            // Verificar si ya existe un coach para este usuario
            var existingCoach = await _coachRepository.GetCoachById(player.IdUser);
            if (existingCoach != null)
            {
                return (false, "Este usuario ya tiene un perfil de coach");
            }

            // Crear el coach con los datos del jugador y los parámetros proporcionados
            var coach = await _coachRepository.CreateCoach(
                player.Nombre,
                player.Apellido,
                player.FechaNacimiento,
                player.Mail,
                player.Telefono,
                player.Contraseña,
                licencia,
                fechaIngreso,
                aniosExperiencia
            );

            if (coach == null)
                return (false, "Error al crear el entrenador");

            // Delete player
            await _playerRepository.DeletePlayer(idPlayer);

            return (true, "Coach creado exitosamente");
        }

        public async Task<(bool success, string message, string userType, int userId)> Login(string mail, string contraseña)
        {
            // Primero buscar en los jugadores
            var players = await _playerRepository.GetAllPlayers();
            var player = players.FirstOrDefault(p => 
                p.Mail.Equals(mail, StringComparison.OrdinalIgnoreCase) && 
                p.Contraseña == contraseña);

            if (player != null)
            {
                return (true, "Login exitoso", "Player", player.IdUser);
            }

            // Si no es jugador, buscar en los coaches
            var coaches = await _coachRepository.GetAllCoaches();
            var coach = coaches.FirstOrDefault(c => 
                c.Mail.Equals(mail, StringComparison.OrdinalIgnoreCase) && 
                c.Contraseña == contraseña);

            if (coach != null)
            {
                return (true, "Login exitoso", "Coach", coach.IdUser);
            }

            return (false, "Credenciales inválidas", null, 0);
        }

        public async Task<IEnumerable<Coach>> GetAllCoaches()
        {
            return await _coachRepository.GetAllCoaches();
        }

        public async Task<Coach> GetCoachById(int idCoach)
        {
            return await _coachRepository.GetCoachById(idCoach);
        }

        public async Task<bool> DeleteCoach(int idCoach)
        {
            return await _coachRepository.DeleteCoach(idCoach);
        }

        public async Task<IEnumerable<Player>> GetAllPlayers()
        {
            return await _playerRepository.GetAllPlayers();
        }

        public async Task<Player> GetPlayerById(int idPlayer)
        {
            return await _playerRepository.GetPlayerById(idPlayer);
        }

        public async Task<bool> DeletePlayer(int idPlayer)
        {
            return await _playerRepository.DeletePlayer(idPlayer);
        }

        
    }
} 