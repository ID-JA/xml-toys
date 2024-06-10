using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace XmlToys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class XmlToysController : ControllerBase
    {
        [HttpPost("generate-dtd")]
        public IActionResult GenerateDtd([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            try
            {
                using (var stream = new MemoryStream())
                {
                    file.CopyTo(stream);
                    stream.Position = 0;

                    var xmlDocument = XDocument.Load(stream);
                    var dtd = XmlHelpers.GenerateDtd(xmlDocument);
                    return Ok(new { Dtd = dtd });
                }
            }
            catch (System.Xml.XmlException ex)
            {
                return BadRequest($"XML is not valid. Error: {ex.Message}");
            }
        }
    }
}
