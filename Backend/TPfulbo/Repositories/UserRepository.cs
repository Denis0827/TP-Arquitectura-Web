using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly ICoachRepository _coachRepository;

        public UserRepository(IPlayerRepository playerRepository, ICoachRepository coachRepository)
        {
            _playerRepository = playerRepository;
            _coachRepository = coachRepository;
        }

        public async Task<User> GetUserById(int idUser)
        {
            // Try to find the user as a player first
            var player = await _playerRepository.GetPlayerById(idUser);
            if (player != null)
            {
                return player;
            }

            // If not found as a player, try as a coach
            var coach = await _coachRepository.GetCoachById(idUser);
            if (coach != null)
            {
                return coach;
            }

            return null;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            // Try to find the user as a player first
            var player = await _playerRepository.GetPlayerByEmail(email);
            if (player != null)
            {
                return player;
            }

            // If not found as a player, try as a coach
            var coach = await _coachRepository.GetCoachByEmail(email);
            if (coach != null)
            {
                return coach;
            }

            return null;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var players = await _playerRepository.GetAllPlayers();
            var coaches = await _coachRepository.GetAllCoaches();
            return players.Cast<User>().Concat(coaches.Cast<User>());
        }
    }
} 