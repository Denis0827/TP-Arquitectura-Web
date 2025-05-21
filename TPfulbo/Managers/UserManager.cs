using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;

namespace TPfulbo.Managers
{
    public class UserManager
    {
        private readonly IUserRepository _userRepository;
        private readonly UserValidator _validator;

        public UserManager(IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _validator = new UserValidator();
        }

        public async Task<(bool success, string message)> ValidateAndCreateUser(User user)
        {
            // Obtener todos los usuarios existentes para validar unicidad
            var existingUsers = await _userRepository.GetAllUsers();

            // Validar datos
            var (isValid, message) = _validator.ValidateUserData(user, existingUsers);
            if (!isValid)
            {
                return (false, message);
            }

            // Crear usuario
            var createdUser = await _userRepository.CreateUser(user);
            return (true, "Usuario creado exitosamente");
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
    }
} 