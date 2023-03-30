using System;
using System.Threading.Tasks;
using ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        public readonly IEventoPersistence _eventoPersistence;
        private readonly IGeralPersistence _geralPersistence;

        public EventoService(IGeralPersistence geralPersistence, IEventoPersistence eventoPersistence)
        {
            _geralPersistence = geralPersistence;
            _eventoPersistence = eventoPersistence;   
        }
        public async Task<Evento> AddEvento(Evento model)
        {
            try
            {
                _geralPersistence.Add<Evento>(model);
                if (await _geralPersistence.SaveChangeAsync())
                    return await _eventoPersistence.GetEventoByIdAsync(model.Id);

                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Evento> UpdateEvento(int eventoId, Evento model)
        {
            try
            {
                var evento = await _eventoPersistence.GetEventoByIdAsync(eventoId);
                if (evento == null) return evento;

                model.Id = evento.Id;

                _geralPersistence.Update<Evento>(model);
                if (await _geralPersistence.SaveChangeAsync())
                    return await _eventoPersistence.GetEventoByIdAsync(model.Id);
                return null;        
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersistence.GetEventoByIdAsync(eventoId);
                if (evento == null) throw new Exception("Evento para delete não encontrado.");

                _geralPersistence.Delete<Evento>(evento);
                return await _geralPersistence.SaveChangeAsync();
                        
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                return await _eventoPersistence.GetAllEventosAsync(includePalestrantes);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                return await _eventoPersistence.GetAllEventosByTemaAsync(tema, includePalestrantes);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Evento> GetEventoByIdAsync(int id, bool includePalestrantes = false)
        {
            try
            {
                return await _eventoPersistence.GetEventoByIdAsync(id, includePalestrantes);
            }
            catch (Exception)
            {
                throw;
            }
        }

        
    }
}