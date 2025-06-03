using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IMatchRepository
    {
        Task<IEnumerable<Match>> GetAllMatches();
        Task<Match> GetMatchById(int idMatch);
        Task<IEnumerable<Match>> GetMatchesByCategory(int idCategory);
        Task<IEnumerable<Match>> GetMatchesByCoach(int idCoach);
        Task<IEnumerable<Match>> GetMatchesByPlayer(int idPlayer);
        Task<Match> CreateMatch(int idCoach, int idField, int idDate, int idCategory, int idTeamA, int idTeamB);
        Task<bool> DeleteMatch(int idMatch);
    }
} 