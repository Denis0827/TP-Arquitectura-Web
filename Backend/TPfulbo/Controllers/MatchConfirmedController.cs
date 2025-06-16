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
    public class MatchConfirmedController : ControllerBase
    {
        private readonly MatchConfirmedManager _matchConfirmedManager;

        public MatchConfirmedController(MatchConfirmedManager matchConfirmedManager)
        {
            _matchConfirmedManager = matchConfirmedManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MatchConfirmed>>> GetAllMatchConfirmed()
        {
            var (success, message, matches) = await _matchConfirmedManager.GetAllMatchConfirmed();
            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }
            return Ok(ApiResponse<object>.CreateSuccess(matches, message));
        }

        [HttpGet("{idMatch}")]
        public async Task<ActionResult<MatchConfirmed>> GetMatchConfirmedById(int idMatch)
        {
            var (success, message, match) = await _matchConfirmedManager.GetMatchConfirmedById(idMatch);
            if (!success)
            {
                return NotFound(ApiResponse<object>.CreateError(message));
            }
            return Ok(ApiResponse<object>.CreateSuccess(match, message));
        }

        [HttpGet("category/{idCategory}")]
        public async Task<ActionResult<IEnumerable<MatchConfirmed>>> GetMatchConfirmedByCategory(int idCategory)
        {
            var (success, message, matches) = await _matchConfirmedManager.GetMatchConfirmedByCategory(idCategory);
            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }
            return Ok(ApiResponse<object>.CreateSuccess(matches, message));
        }

        [HttpGet("coach/{idCoach}")]
        public async Task<ActionResult<IEnumerable<MatchConfirmed>>> GetMatchConfirmedByCoach(int idCoach)
        {
            var (success, message, matches) = await _matchConfirmedManager.GetMatchConfirmedByCoach(idCoach);
            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }
            return Ok(ApiResponse<object>.CreateSuccess(matches, message));
        }

        [HttpGet("player/{idPlayer}")]
        public async Task<ActionResult<IEnumerable<MatchConfirmed>>> GetMatchConfirmedByPlayer(int idPlayer)
        {
            var (success, message, matches) = await _matchConfirmedManager.GetMatchConfirmedByPlayer(idPlayer);
            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }
            return Ok(ApiResponse<object>.CreateSuccess(matches, message));
        }

        [HttpGet("date/{fecha}")]
        public async Task<ActionResult<MatchConfirmed>> GetMatchConfirmedByFecha(DateTime fecha)
        {
            var (success, message, match) = await _matchConfirmedManager.GetMatchConfirmedByFecha(fecha);
            if (!success)
            {
                return NotFound(ApiResponse<object>.CreateError(message));
            }
            return Ok(ApiResponse<object>.CreateSuccess(match, message));
        }

        [HttpPost("coaches/{idCoach}/createMatch")]
        public async Task<IActionResult> CreateMatchConfirmed(int idCoach, [FromBody] CreateMatchConfirmedRequest request)
        {
            var (success, message, match) = await _matchConfirmedManager.CreateMatchConfirmed(
                idCoach,
                request.IdMatchTentative,
                request.IdPlayersTeamA,
                request.IdPlayersTeamB
            );

            if (!success)
            {
                return BadRequest(ApiResponse<object>.CreateError(message));
            }

            return Ok(ApiResponse<object>.CreateSuccess(match, message));
        }

        [HttpDelete("{idMatch}")]
        public async Task<IActionResult> DeleteMatchConfirmed(int idMatch)
        {
            var (success, message) = await _matchConfirmedManager.DeleteMatchConfirmed(idMatch);
            if (!success)
            {
                return NotFound(ApiResponse<object>.CreateError(message));
            }
            return Ok(ApiResponse<object>.CreateSuccess(null, message));
        }
    }
} 