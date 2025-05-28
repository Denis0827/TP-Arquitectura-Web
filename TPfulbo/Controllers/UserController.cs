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
        public async Task<IActionResult> CreatePlayer([FromBody] PlayerRequest request)
        {
            var (success, message, player) = await _userManager.CreatePlayer(
                request.Nombre,
                request.Apellido,
                request.FechaNacimiento,
                request.Mail,
                request.Telefono,
                request.Contraseña
            );

            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(new { message, playerId = player.IdUser });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (success, message, userType, userId) = await _userManager.Login(request.Mail, request.Contraseña);
            
            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(new { message, userType, userId });
        }

        [HttpPost("players/{playerId}/coach")]
        public async Task<IActionResult> CreateCoach(int playerId)
        {
            var (success, message) = await _userManager.CreateCoach(playerId);
            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(message);
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

