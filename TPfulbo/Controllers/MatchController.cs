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

        [HttpPost("coaches/{idCoach}/createMatch")]
        public async Task<IActionResult> CreateMatch(int idCoach, [FromBody] CreateMatchRequest request)
        {
            var (success, message, match) = await _matchManager.CreateMatch(
                idCoach,
                request.IdField,
                request.IdConfirmDate,
                request.IdCategory,
                request.IdPlayersTeamA,
                request.IdPlayersTeamB
            );

            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(new { message, matchId = match.IdMatch });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Match>>> GetAllMatches()
        {
            var matches = await _matchManager.GetAllMatches();
            return Ok(matches);
        }

        [HttpGet("{idMatch}")]
        public async Task<ActionResult<Match>> GetMatchById(int idMatch)
        {
            var match = await _matchManager.GetMatchById(idMatch);
            if (match == null)
                return NotFound("Partido no encontrado");
            return Ok(match);
        }

        [HttpGet("category/{idCategory}")]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatchesByCategory(int idCategory)
        {
            var matches = await _matchManager.GetMatchesByCategory(idCategory);
            return Ok(matches);
        }

        [HttpDelete("{idMatch}")]
        public async Task<IActionResult> DeleteMatch(int idMatch)
        {
            var (success, message) = await _matchManager.DeleteMatch(idMatch);
            if (!success)
                return NotFound("Partido no encontrado");
            return Ok("Partido eliminado exitosamente");
        }
    }
} 