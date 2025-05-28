using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TPfulbo.Managers;

namespace TPfulbo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager _userManager;

        public UserController(UserManager userManager)
        {
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] dynamic request)
        {
            var (success, message, user) = await _userManager.CreateUser(
                (string)request.nombre,
                (string)request.apellido,
                (DateTime)request.fechaNacimiento,
                (string)request.mail,
                (string)request.telefono,
                (string)request.contraseña
            );

            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(new { message, userId = user.IdUser });
        }

        [HttpPost("{userId}/player")]
        public async Task<IActionResult> CreatePlayer(int userId)
        {
            var (success, message) = await _userManager.CreatePlayer(userId);
            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(message);
        }

        [HttpPost("{userId}/coach")]
        public async Task<IActionResult> CreateCoach(int userId)
        {
            var (success, message) = await _userManager.CreateCoach(userId);
            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userManager.GetUserById(id);
            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }
            return Ok(user);
        }

        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _userManager.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound("Usuario no encontrado");
            }
            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userManager.DeleteUser(id);
            if (!success)
            {
                return NotFound("Usuario no encontrado");
            }
            return Ok("Usuario eliminado exitosamente");
        }

        [HttpGet("coaches")]
        public async Task<IActionResult> GetAllCoaches()
        {
            var coaches = await _userManager.GetAllCoaches();
            return Ok(coaches);
        }

        [HttpGet("coaches/{idCoach}")]
        public async Task<IActionResult> GetCoachById(int idCoach)
        {
            var coach = await _userManager.GetCoachById(idCoach);
            if (coach == null)
                return NotFound("Coach no encontrado");
            return Ok(coach);
        }

        [HttpGet("coaches/user/{idUser}")]
        public async Task<IActionResult> GetCoachByUserId(int idUser)
        {
            var coach = await _userManager.GetCoachByUserId(idUser);
            if (coach == null)
                return NotFound("Coach no encontrado");
            return Ok(coach);
        }

        [HttpDelete("coaches/{idCoach}")]
        public async Task<IActionResult> DeleteCoach(int idCoach)
        {
            var success = await _userManager.DeleteCoach(idCoach);
            if (!success)
                return NotFound("Coach no encontrado");
            return Ok("Coach eliminado exitosamente");
        }

        [HttpGet("players")]
        public async Task<IActionResult> GetAllPlayers()
        {
            var players = await _userManager.GetAllPlayers();
            return Ok(players);
        }

        [HttpGet("players/{idPlayer}")]
        public async Task<IActionResult> GetPlayerById(int idPlayer)
        {
            var player = await _userManager.GetPlayerById(idPlayer);
            if (player == null)
                return NotFound("Player no encontrado");
            return Ok(player);
        }

        [HttpGet("players/user/{idUser}")]
        public async Task<IActionResult> GetPlayerByUserId(int idUser)
        {
            var player = await _userManager.GetPlayerByUserId(idUser);
            if (player == null)
                return NotFound("Player no encontrado");
            return Ok(player);
        }

        [HttpDelete("players/{idPlayer}")]
        public async Task<IActionResult> DeletePlayer(int idPlayer)
        {
            var success = await _userManager.DeletePlayer(idPlayer);
            if (!success)
                return NotFound("Player no encontrado");
            return Ok("Player eliminado exitosamente");
        }
    }
} 