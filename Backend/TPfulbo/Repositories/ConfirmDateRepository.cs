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
    public class ConfirmDateRepository : IConfirmDateRepository
    {
        private readonly string _jsonFilePath;
        private List<ConfirmDate> _dates;

        public ConfirmDateRepository()
        {
            _jsonFilePath = Path.Combine("..", "..", "Data", "dates.json");
            LoadDates();
        }

        private void LoadDates()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _dates = JsonSerializer.Deserialize<List<ConfirmDate>>(jsonString) ?? new List<ConfirmDate>();
            }
            else
            {
                _dates = new List<ConfirmDate>();
                SaveDates();
            }
        }

        private void SaveDates()
        {
            var jsonString = JsonSerializer.Serialize(_dates, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<ConfirmDate>> GetAllDates()
        {
            return await Task.FromResult(_dates);
        }

        public async Task<ConfirmDate> GetDateById(int idDate)
        {
            return await Task.FromResult(_dates.FirstOrDefault(d => d.IdDate == idDate));
        }

        public async Task<ConfirmDate> GetDateByFecha(DateTime fecha)
        {
            return await Task.FromResult(_dates.FirstOrDefault(d => d.Fecha.Date == fecha.Date));
        }

        public async Task<ConfirmDate> CreateDate(DateTime fecha, int idField, int idCategory)
        {
            int newId = _dates.Count > 0 ? _dates.Max(d => d.IdDate) + 1 : 1;
            var newDate = new ConfirmDate(fecha, idField, idCategory)
            {
                IdDate = newId
            };

            _dates.Add(newDate);
            SaveDates();
            return await Task.FromResult(newDate);
        }

        public async Task<bool> DeleteDate(int idDate)
        {
            var date = _dates.FirstOrDefault(d => d.IdDate == idDate);
            if (date != null)
            {
                _dates.Remove(date);
                SaveDates();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> ConfirmPlayer(int idDate, int idPlayer)
        {
            var date = _dates.FirstOrDefault(d => d.IdDate == idDate);
            if (date == null)
                return await Task.FromResult(false);

            if (!date.IdPlayers.Contains(idPlayer))
            {
                date.IdPlayers.Add(idPlayer);
                SaveDates();
            }

            return await Task.FromResult(true);
        }

        public async Task<List<int>> GetConfirmedPlayers(int idDate)
        {
            var date = _dates.FirstOrDefault(d => d.IdDate == idDate);
            return await Task.FromResult(date?.IdPlayers ?? new List<int>());
        }

        public async Task<bool> CancelPlayerConfirmation(int idDate, int idPlayer)
        {
            var date = _dates.FirstOrDefault(d => d.IdDate == idDate);
            if (date == null)
                return await Task.FromResult(false);

            if (date.IdPlayers.Contains(idPlayer))
            {
                date.IdPlayers.Remove(idPlayer);
                SaveDates();
                return await Task.FromResult(true);
            }

            return await Task.FromResult(false);
        }
    }
} 