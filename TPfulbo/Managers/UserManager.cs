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
        private readonly IUserRepository _userRepository;
        private readonly IPlayerRepository _playerRepository;
        private readonly ICoachRepository _coachRepository;
        private readonly UserValidator _validator;

        public UserManager(
            IUserRepository userRepository, 
            IPlayerRepository playerRepository,
            ICoachRepository coachRepository)
        {
            _userRepository = userRepository;
            _playerRepository = playerRepository;
            _coachRepository = coachRepository;
            _validator = new UserValidator();
        }

        public async Task<(bool success, string message, User user)> CreateUser(string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
        {
            var existingUsers = await _userRepository.GetAllUsers();            
            // Validar datos del usuario
            var (isValid, message) = _validator.ValidateUserData(nombre, apellido, fechaNacimiento, mail, telefono, contraseña, existingUsers);
            if (!isValid)
            {
                return (false, message, null);
            }

            // Crear el usuario (el repositorio asigna el IdUser)
            var user = await _userRepository.CreateUser(nombre, apellido, fechaNacimiento, mail, telefono, contraseña);

            return (true, "Usuario creado exitosamente", user);
        }

        public async Task<(bool success, string message)> CreatePlayer(int userId)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
            {
                return (false, "Usuario no encontrado");
            }

            // Verificar si ya existe un jugador o coach para este usuario
            var existingPlayer = await _playerRepository.GetPlayerByUserId(userId);
            if (existingPlayer != null)
            {
                return (false, "Este usuario ya tiene un perfil de jugador");
            }

            var existingCoach = await _coachRepository.GetCoachByUserId(userId);
            if (existingCoach != null)
            {
                return (false, "Este usuario ya tiene un perfil de coach");
            }

            // Crear el jugador
            var player = await _playerRepository.CreatePlayer(userId, user.Nombre, user.Apellido, user.FechaNacimiento, user.Mail, user.Telefono, user.Contraseña);
            return (true, "Jugador creado exitosamente");
        }

        public async Task<(bool success, string message)> CreateCoach(int userId)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
            {
                return (false, "Usuario no encontrado");
            }

            // Verificar si ya existe un jugador o coach para este usuario
            var existingPlayer = await _playerRepository.GetPlayerByUserId(userId);
            if (existingPlayer != null)
            {
                return (false, "Este usuario ya tiene un perfil de jugador");
            }

            var existingCoach = await _coachRepository.GetCoachByUserId(userId);
            if (existingCoach != null)
            {
                return (false, "Este usuario ya tiene un perfil de coach");
            }

            // Crear el coach
            var coach = await _coachRepository.CreateCoach(userId, user.Nombre, user.Apellido, user.FechaNacimiento, user.Mail, user.Telefono, user.Contraseña);
            return (true, "Coach creado exitosamente");
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _userRepository.GetAllUsers();
        }

        public async Task<User> GetUserById(int id)
        {
            return await _userRepository.GetUserById(id);
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _userRepository.GetUserByEmail(email);
        }

        public async Task<bool> DeleteUser(int id)
        {
            // Primero eliminamos el jugador o coach asociado si existe
            await _playerRepository.DeletePlayer(id);
            await _coachRepository.DeleteCoach(id);
            // Luego eliminamos el usuario
            return await _userRepository.DeleteUser(id);
        }

        public async Task<IEnumerable<Coach>> GetAllCoaches()
        {
            return await _coachRepository.GetAllCoaches();
        }

        public async Task<Coach> GetCoachById(int idCoach)
        {
            return await _coachRepository.GetCoachById(idCoach);
        }

        public async Task<Coach> GetCoachByUserId(int idUser)
        {
            return await _coachRepository.GetCoachByUserId(idUser);
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

        public async Task<Player> GetPlayerByUserId(int idUser)
        {
            return await _playerRepository.GetPlayerByUserId(idUser);
        }

        public async Task<bool> DeletePlayer(int idPlayer)
        {
            return await _playerRepository.DeletePlayer(idPlayer);
        }
    }
} 