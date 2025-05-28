using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TPfulbo.Managers;

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

        [HttpPost]
        public async Task<IActionResult> CreateMatch([FromBody] dynamic request)
        {
            var (success, message, match) = await _matchManager.CreateMatch(
                (int)request.idCancha,
                (int)request.idCategory,
                (DateTime)request.fecha,
                (TimeSpan)request.hora,
                (int)request.idTeamA,
                (int)request.idTeamB
            );
            if (!success)
                return BadRequest(message);
            return Ok(match);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMatches()
        {
            var matches = await _matchManager.GetAllMatches();
            return Ok(matches);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMatchById(int id)
        {
            var match = await _matchManager.GetMatchById(id);
            if (match == null)
                return NotFound("Partido no encontrado");
            return Ok(match);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            var success = await _matchManager.DeleteMatch(id);
            if (!success)
                return NotFound("Partido no encontrado");
            return Ok("Partido eliminado exitosamente");
        }

        [HttpGet("team/{idTeam}")]
        public async Task<IActionResult> GetMatchesByTeamId(int idTeam)
        {
            var matches = await _matchManager.GetMatchesByTeamId(idTeam);
            return Ok(matches);
        }

        [HttpGet("fecha/{fecha}")]
        public async Task<IActionResult> GetMatchesByFecha(DateTime fecha)
        {
            var matches = await _matchManager.GetMatchesByFecha(fecha);
            return Ok(matches);
        }

        [HttpGet("cancha/{idCancha}")]
        public async Task<IActionResult> GetMatchesByCanchaId(int idCancha)
        {
            var matches = await _matchManager.GetMatchesByCanchaId(idCancha);
            return Ok(matches);
        }

        [HttpGet("category/{idCategory}")]
        public async Task<IActionResult> GetMatchesByCategory(int idCategory)
        {
            var matches = await _matchManager.GetMatchesByCategory(idCategory);
            return Ok(matches);
        }
    }
} 