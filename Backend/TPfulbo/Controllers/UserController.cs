using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TPfulbo.Managers;
using TPfulbo.Models;
using TPfulbo.Controllers.Requests;

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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var (success, message, player) = await _userManager.CreatePlayer(
                request.Nombre,
                request.Apellido,
                request.FechaNacimiento,
                request.Mail,
                request.Telefono,
                request.Contraseña,
                request.DNI,
                request.Edad
            );

            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));

            return Ok(ApiResponse<object>.CreateSuccess(new { idPlayer = player.IdUser }, message));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            (bool success, string message, string userType, int userId) = await _userManager.Login(request.Mail, request.Contraseña);
            
            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }

            return Ok(ApiResponse<object>.CreateSuccess(new { userType, userId }, message));
        }

        [HttpPost("players/{idPlayer}/coach")]
        public async Task<IActionResult> CreateCoach(int idPlayer, [FromBody] CreateCoachRequest request)
        {
            var (success, message) = await _userManager.CreateCoach(idPlayer, request.Licencia, request.FechaIngreso, request.AniosExperiencia);
            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }

            return Ok(ApiResponse<object>.CreateSuccess(new { idPlayer }, message));
        }

        [HttpGet("coaches")]
        public async Task<IActionResult> GetAllCoaches()
        {
            var coaches = await _userManager.GetAllCoaches();
            return Ok(ApiResponse<object>.CreateSuccess(coaches, "Coaches obtenidos exitosamente"));
        }

        [HttpGet("coaches/{idCoach}")]
        public async Task<IActionResult> GetCoachById(int idCoach)
        {
            var coach = await _userManager.GetCoachById(idCoach);
            if (coach == null)
                return NotFound(ApiResponse<object>.CreateError("Coach no encontrado"));
            return Ok(ApiResponse<object>.CreateSuccess(coach, "Coach encontrado exitosamente"));
        }

        [HttpDelete("coaches/{idCoach}")]
        public async Task<IActionResult> DeleteCoach(int idCoach)
        {
            var success = await _userManager.DeleteCoach(idCoach);
            if (!success)
                return NotFound(ApiResponse<object>.CreateError("Coach no encontrado"));
            return Ok(ApiResponse<object>.CreateSuccess(new { idCoach }, "Coach eliminado exitosamente"));
        }

        [HttpGet("players")]
        public async Task<IActionResult> GetAllPlayers()
        {
            var players = await _userManager.GetAllPlayers();
            return Ok(ApiResponse<object>.CreateSuccess(players, "Players obtenidos exitosamente"));
        }

        [HttpGet("players/{idPlayer}")]
        public async Task<IActionResult> GetPlayerById(int idPlayer)
        {
            var player = await _userManager.GetPlayerById(idPlayer);
            if (player == null)
                return NotFound(ApiResponse<object>.CreateError("Player no encontrado"));
            return Ok(ApiResponse<object>.CreateSuccess(player, "Player encontrado exitosamente"));
        }

        [HttpDelete("players/{idPlayer}")]
        public async Task<IActionResult> DeletePlayer(int idPlayer)
        {
            var success = await _userManager.DeletePlayer(idPlayer);
            if (!success)
                return NotFound(ApiResponse<object>.CreateError("Player no encontrado"));
            return Ok(ApiResponse<object>.CreateSuccess(new { idPlayer }, "Player eliminado exitosamente"));
        }
    }
} 

