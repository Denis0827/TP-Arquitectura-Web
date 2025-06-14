using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Managers;
using TPfulbo.Models;
using TPfulbo.Controllers.Requests;

namespace TPfulbo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly MatchManager _matchManager;

        public MatchController(MatchManager matchManager)
        {
            _matchManager = matchManager;
        }

        [HttpPost("createMatch")]
        public async Task<IActionResult> CreateMatch([FromBody] CreateMatchRequest request)
        {
            var (success, message, match) = await _matchManager.CreateMatch(
                request.IdCoach,
                request.IdField,
                request.IdConfirmDate,
                request.IdCategory,
                request.IdPlayersTeamA,
                request.IdPlayersTeamB
            );

            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }

            return Ok(ApiResponse<object>.CreateSuccess(new { matchId = match.IdMatch }, message));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Match>>> GetAllMatches()
        {
            var matches = await _matchManager.GetAllMatches();
            return Ok(ApiResponse<object>.CreateSuccess(matches, "Partidos obtenidos exitosamente"));
        }

        [HttpGet("{idMatch}")]
        public async Task<ActionResult<Match>> GetMatchById(int idMatch)
        {
            var match = await _matchManager.GetMatchById(idMatch);
            if (match == null)
                return NotFound(ApiResponse<object>.CreateError("Partido no encontrado"));
            return Ok(ApiResponse<object>.CreateSuccess(match, "Partido encontrado exitosamente"));
        }

        [HttpGet("category/{idCategory}")]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatchesByCategory(int idCategory)
        {
            var matches = await _matchManager.GetMatchesByCategory(idCategory);
            return Ok(ApiResponse<object>.CreateSuccess(matches, "Partidos de la categoría obtenidos exitosamente"));
        }

        [HttpGet("coaches/{idCoach}")]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatchesByCoach(int idCoach)
        {
            var matches = await _matchManager.GetMatchesByCoach(idCoach);
            return Ok(ApiResponse<object>.CreateSuccess(matches, "Partidos del coach obtenidos exitosamente"));
        }

        [HttpGet("players/{idPlayer}")]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatchesByPlayer(int idPlayer)
        {
            var matches = await _matchManager.GetMatchesByPlayer(idPlayer);
            return Ok(ApiResponse<object>.CreateSuccess(matches, "Partidos del player obtenidos exitosamente"));
        }

        [HttpDelete("{idMatch}")]
        public async Task<IActionResult> DeleteMatch(int idMatch)
        {
            var (success, message) = await _matchManager.DeleteMatch(idMatch);
            if (!success)
                return NotFound(ApiResponse<object>.CreateError(message));
            return Ok(ApiResponse<object>.CreateSuccess(new { idMatch }, message));
        }
    }
} 