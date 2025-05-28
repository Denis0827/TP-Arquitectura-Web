using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IAssistanceRepository
    {
        Task<IEnumerable<Assistance>> GetAllAssistances();
        Task<Assistance> GetAssistanceById(int id);
        Task<Assistance> CreateAssistance(int idPlayer, int idMatch);
        Task<bool> DeleteAssistance(int id);
        Task<IEnumerable<Assistance>> GetAssistancesByPlayerId(int idPlayer);
        Task<IEnumerable<Assistance>> GetAssistancesByMatchId(int idMatch);
    }
} 