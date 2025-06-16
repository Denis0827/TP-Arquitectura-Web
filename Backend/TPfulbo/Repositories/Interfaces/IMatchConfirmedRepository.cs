using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IMatchConfirmedRepository
    {
        Task<IEnumerable<MatchConfirmed>> GetAllMatchConfirmed();
        Task<MatchConfirmed> GetMatchConfirmedById(int idMatch);
        Task<IEnumerable<MatchConfirmed>> GetMatchConfirmedByCategory(int idCategory);
        Task<IEnumerable<MatchConfirmed>> GetMatchConfirmedByCoach(int idCoach);
        Task<IEnumerable<MatchConfirmed>> GetMatchConfirmedByPlayer(int idPlayer);
        Task<MatchConfirmed> GetMatchConfirmedByFecha(DateTime fecha);
        Task<MatchConfirmed> CreateMatchConfirmed(int idCoach, int idField, DateTime fecha, int idCategory, int idTeamA, int idTeamB);
        Task<bool> DeleteMatchConfirmed(int idMatch);
    }
} 