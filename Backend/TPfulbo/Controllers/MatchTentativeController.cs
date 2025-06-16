using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TPfulbo.Models;
using TPfulbo.Managers;
using TPfulbo.Controllers.Requests;

namespace TPfulbo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchTentativeController : ControllerBase
    {
        private readonly MatchTentativeManager _matchTentativeManager;

        public MatchTentativeController(MatchTentativeManager matchTentativeManager)
        {
            _matchTentativeManager = matchTentativeManager;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<MatchTentative>>>> GetAllMatchTentatives()
        {
            var matchTentatives = await _matchTentativeManager.GetAllMatchTentatives();
            return Ok(ApiResponse<IEnumerable<MatchTentative>>.CreateSuccess(matchTentatives, "Partidos tentativos obtenidos exitosamente"));
        }

        [HttpGet("{idMatch}")]
        public async Task<ActionResult<ApiResponse<MatchTentative>>> GetMatchTentativeById(int idMatch)
        {
            var matchTentative = await _matchTentativeManager.GetMatchTentativeById(idMatch);
            if (matchTentative == null)
                return NotFound(ApiResponse<MatchTentative>.CreateError("Partido tentativo no encontrado"));

            return Ok(ApiResponse<MatchTentative>.CreateSuccess(matchTentative, "Partido tentativo obtenido exitosamente"));
        }

        [HttpGet("fecha/{fecha}")]
        public async Task<ActionResult<ApiResponse<MatchTentative>>> GetMatchTentativeByFecha(DateTime fecha)
        {
            var matchTentative = await _matchTentativeManager.GetMatchTentativeByFecha(fecha);
            if (matchTentative == null)
                return NotFound(ApiResponse<MatchTentative>.CreateError("Partido tentativo no encontrado"));

            return Ok(ApiResponse<MatchTentative>.CreateSuccess(matchTentative, "Partido tentativo obtenido exitosamente"));
        }

        [HttpPost("coaches/{idCoach}/createMatch")]
        public async Task<ActionResult<ApiResponse<MatchTentative>>> CreateMatchTentative(int idCoach, [FromBody] CreateMatchTentativeRequest request)
        {
            var (success, message, matchTentative) = await _matchTentativeManager.CreateMatchTentative(
                idCoach,
                request.Fecha,
                request.IdField,
                request.IdCategory);

            if (!success)
                return BadRequest(ApiResponse<MatchTentative>.CreateError(message));

            return Ok(ApiResponse<MatchTentative>.CreateSuccess(matchTentative, message));
        }

        [HttpDelete("{idMatch}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteMatchTentative(int idMatch)
        {
            var (success, message) = await _matchTentativeManager.DeleteMatchTentative(idMatch);
            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));

            return Ok(ApiResponse<object>.CreateSuccess(null, message));
        }

        [HttpPost("{idMatch}/confirm/{idPlayer}")]
        public async Task<ActionResult<ApiResponse<object>>> ConfirmPlayer(int idMatch, int idPlayer)
        {
            var (success, message) = await _matchTentativeManager.ConfirmPlayer(idMatch, idPlayer);
            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));

            return Ok(ApiResponse<object>.CreateSuccess(null, message));
        }

        [HttpGet("{idMatch}/confirmed")]
        public async Task<ActionResult<ApiResponse<List<int>>>> GetConfirmedPlayers(int idMatch)
        {
            var confirmedPlayers = await _matchTentativeManager.GetConfirmedPlayers(idMatch);
            return Ok(ApiResponse<List<int>>.CreateSuccess(confirmedPlayers, "Jugadores confirmados obtenidos exitosamente"));
        }

        [HttpPost("{idMatch}/unconfirm/{idPlayer}")]
        public async Task<ActionResult<ApiResponse<object>>> CancelPlayerConfirmation(int idMatch, int idPlayer)
        {
            var (success, message) = await _matchTentativeManager.CancelPlayerConfirmation(idMatch, idPlayer);
            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));

            return Ok(ApiResponse<object>.CreateSuccess(null, message));
        }
    }
} 