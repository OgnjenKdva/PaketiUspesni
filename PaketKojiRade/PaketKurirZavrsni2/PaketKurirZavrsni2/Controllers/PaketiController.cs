using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PaketKurirZavrsni2.DTO;
using PaketKurirZavrsni2.Interfaces;
using PaketKurirZavrsni2.Models;
using PaketKurirZavrsni2.Repositories;
using System;
using System.Linq;

namespace PaketKurirZavrsni2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaketiController : ControllerBase
    {
        private readonly IPaketRepository _paketRepository;
        private readonly IMapper _mapper;

        public PaketiController(IPaketRepository paketRepository, IMapper mapper)
        {
            _paketRepository = paketRepository;
            _mapper = mapper;
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_paketRepository.GetAll().ProjectTo<PaketDTO>(_mapper.ConfigurationProvider).ToList());
        }
        [HttpGet("{id}")]
        public IActionResult GetOnePaketById(int id)
        {
            var paket = _paketRepository.GetById(id);
            if (paket == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<PaketDetailDTO>(paket));
        }
        [HttpPost]
        public IActionResult PostPaket(Paket paket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _paketRepository.Add(paket);
            return CreatedAtAction("GetOnePaketById", new { id = paket.Id }, paket);
        }
        [HttpPut("{id}")]
        public IActionResult PutPaket(int id, Paket paket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != paket.Id)
            {
                return BadRequest();
            }

            try
            {
                _paketRepository.Update(paket);
            }
            catch
            {
                return BadRequest();
            }

            return Ok(paket);
        }
        [HttpDelete("{id}")]
        public IActionResult DeletePaket(int id)
        {
            var paket = _paketRepository.GetById(id);
            if (paket == null)
            {
                return NotFound();
            }
            _paketRepository.Delete(paket);
            return NoContent();
        }
        [HttpGet]
        [Route("/api/[controller]/trazi")]
        public IActionResult TraziPoImenuPrimaoca([FromQuery] string ime)
        {
            return Ok(_paketRepository.GetByImePrimaoca(ime).ProjectTo<PaketDTO>(_mapper.ConfigurationProvider).ToList());
        }
        [HttpPost]
        [Route("/api/pretraga")]
        public IActionResult PretragaPaketa(PaketPretragaPoTeziniDTO dto)
        {
            if (dto.MinTezina < 0 || dto.MaxTezina < 0 || dto.MinTezina > dto.MaxTezina)
            {
                return BadRequest();
            }
            return Ok(_paketRepository.GetByTezina(dto.MinTezina, dto.MaxTezina).ProjectTo<PaketDTO>(_mapper.ConfigurationProvider).ToList());
        }
    }
}
