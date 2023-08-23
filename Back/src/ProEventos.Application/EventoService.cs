using System;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        public readonly IEventoPersistence _eventoPersistence;
        private readonly IGeralPersistence _geralPersistence;
        private readonly IMapper _mapper;

        public EventoService(IGeralPersistence geralPersistence, IEventoPersistence eventoPersistence, IMapper mapper)
        {
            _geralPersistence = geralPersistence;
            _eventoPersistence = eventoPersistence;   
            _mapper = mapper;
        }
        public async Task<EventoDto> AddEvento(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                _geralPersistence.Add<Evento>(evento);
                if (await _geralPersistence.SaveChangeAsync())
                    return _mapper.Map<EventoDto>(await _eventoPersistence.GetEventoByIdAsync(evento.Id));

                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersistence.GetEventoByIdAsync(eventoId);
                if (evento == null) 
                    return null;

                model.Id = evento.Id;

                _geralPersistence.Update<Evento>(_mapper.Map(model, evento));
                if (await _geralPersistence.SaveChangeAsync())
                    return _mapper.Map<EventoDto>(await _eventoPersistence.GetEventoByIdAsync(model.Id));

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

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersistence.GetAllEventosAsync(includePalestrantes);
                return _mapper.Map<EventoDto[]>(eventos);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersistence.GetAllEventosByTemaAsync(tema, includePalestrantes);
                return _mapper.Map<EventoDto[]>(eventos);  
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(int id, bool includePalestrantes = false)
        {
            try
            {
                var evento = await _eventoPersistence.GetEventoByIdAsync(id, includePalestrantes);
                if (evento == null) return null;
                
                var resultado = _mapper.Map<EventoDto>(evento);
                return resultado;
            }
            catch (Exception)
            {
                throw;
            }
        }
       
    }
}