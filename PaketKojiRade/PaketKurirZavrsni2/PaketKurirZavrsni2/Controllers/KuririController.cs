using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PaketKurirZavrsni2.Interfaces;
using PaketKurirZavrsni2.Models;

namespace PaketKurirZavrsni2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KuririController : ControllerBase
    {
        private readonly IKurirRepository _kurirRepository;

        public KuririController(IKurirRepository kurirRepository)
        {
            _kurirRepository = kurirRepository;
        }
        [HttpGet]
        public IActionResult GetAllKurir()
        {
            return Ok(_kurirRepository.GetAll());
        }
        [HttpGet("{id}")]
        public IActionResult GetKurirById(int id)
        {
            var kurir = _kurirRepository.GetById(id);

            if (kurir == null)
            {
                return NotFound();
            }
            return Ok(kurir);
        }
        [HttpPost]
        public IActionResult PostKurir(Kurir kurir)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _kurirRepository.Add(kurir);
            return CreatedAtAction("GetKurirById", new { id = kurir.Id }, kurir);
        }
        [HttpPut("{id}")]
        public IActionResult PutKurir(int id, Kurir kurir)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != kurir.Id)
            {
                return BadRequest();
            }

            try
            {
                _kurirRepository.Update(kurir);
            }
            catch
            {
                return BadRequest();
            }

            return Ok(kurir);
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteKurir(int id)
        {
            var kurir = _kurirRepository.GetById(id);
            if (kurir == null)
            {
                return NotFound();
            }
            _kurirRepository.Delete(kurir);
            return NoContent();
        }
        [HttpGet]
        [Route("/api/dostave")]
        public IActionResult UkupnaTezina([FromQuery]decimal tezina)
        {
            return Ok(_kurirRepository.UkupnaTezina(tezina));
        }
        [HttpGet]
        [Route("/api/stanje")]
        public IActionResult UkupanBrojPaketa()
        {
            return Ok(_kurirRepository.UkupnoPaketa()); 
        }
        [HttpGet]
        [Route("/api/nadji")]
        public IActionResult NadjiPoImenu([FromQuery]string ime)
        {
            return Ok(_kurirRepository.GetByIme(ime));
        }
    }
}
