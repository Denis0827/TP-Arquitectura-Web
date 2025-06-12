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
    public class PlayerRepository : IPlayerRepository
    {
        private readonly string _jsonFilePath;
        private List<Player> _players;

        public PlayerRepository()
        {
            _jsonFilePath = Path.Combine("..", "..", "Data", "players.json");
            LoadPlayers();
        }

        private void LoadPlayers()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _players = JsonSerializer.Deserialize<List<Player>>(jsonString) ?? new List<Player>();
            }
            else
            {
                _players = new List<Player>();
                SavePlayers();
            }
        }

        private void SavePlayers()
        {
            var jsonString = JsonSerializer.Serialize(_players, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Player>> GetAllPlayers()
        {
            return await Task.FromResult(_players);
        }

        public async Task<Player> GetPlayerById(int idPlayer)
        {
            return await Task.FromResult(_players.FirstOrDefault(p => p.IdUser == idPlayer));
        }

        public async Task<Player> CreatePlayer(string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña, string dni, int edad)
        {
            int newId = _players.Count > 0 ? _players.Max(p => p.IdUser) + 1 : 1;
            var newPlayer = new Player(nombre, apellido, fechaNacimiento, mail, telefono, contraseña, dni, edad)
            {
                IdUser = newId
            };

            _players.Add(newPlayer);
            SavePlayers();
            return await Task.FromResult(newPlayer);
        }

        public async Task<bool> DeletePlayer(int idPlayer)
        {
            var player = _players.FirstOrDefault(p => p.IdUser == idPlayer);
            if (player != null)
            {
                _players.Remove(player);
                SavePlayers();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<Player> GetPlayerByEmail(string email)
        {
            return await Task.FromResult(_players.FirstOrDefault(p => p.Mail.Equals(email, StringComparison.OrdinalIgnoreCase)));
        }
    }
} 