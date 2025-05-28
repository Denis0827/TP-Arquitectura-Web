using System;
using System.Threading.Tasks;
using System.Linq;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class MatchValidator
    {
        private readonly ITeamRepository _teamRepository;

        public MatchValidator(ITeamRepository teamRepository)
        {
            _teamRepository = teamRepository;
        }

        public async Task<(bool isValid, string message)> ValidateMatchCreation(int idTeamA, int idTeamB, DateTime fecha, TimeSpan hora)
        {
            if (idTeamA == idTeamB)
                return (false, "Un partido no puede tener el mismo equipo en ambos lados");

            var teamA = await _teamRepository.GetTeamById(idTeamA);
            var teamB = await _teamRepository.GetTeamById(idTeamB);
            if (teamA == null || teamB == null)
                return (false, "Uno o ambos equipos no existen");

            if (fecha.Date < DateTime.Today)
                return (false, "La fecha del partido no puede ser en el pasado");

            int countA = teamA.IdPlayers?.Count ?? 0;
            int countB = teamB.IdPlayers?.Count ?? 0;
            if (countA != countB)
                return (false, $"Ambos equipos deben tener la misma cantidad de jugadores (Equipo A: {countA}, Equipo B: {countB})");

            return (true, "Validación exitosa");
        }
    }
} 