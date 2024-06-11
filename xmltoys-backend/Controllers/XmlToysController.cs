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

        [HttpPost("generate-xsd")]
        public IActionResult GenerateXsd(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is empty");
            }

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var xmlDocument = XDocument.Load(stream);
                    var xsd = XmlHelpers.GenerateXsd(xmlDocument);

                    return Ok(new { xsd });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("xml-to-html")]
        public IActionResult GenerateXslt([FromForm] IFormFile xmlFile, [FromForm] IFormFile xsltFile)
        {
            if (xmlFile == null || xmlFile.Length == 0)
            {
                return BadRequest("No XML file uploaded");
            }

            if (xsltFile == null || xsltFile.Length == 0)
            {
                return BadRequest("No XSLT file uploaded");
            }

            try
            {
                // Load XML document
                XDocument xmlDocument;
                using (var xmlStream = new MemoryStream())
                {
                    xmlFile.CopyTo(xmlStream);
                    xmlStream.Position = 0;
                    xmlDocument = XDocument.Load(xmlStream);
                }

                // Load XSLT
                string xsltString;
                using (var xsltStream = new MemoryStream())
                {
                    xsltFile.CopyTo(xsltStream);
                    xsltStream.Position = 0;
                    using (var reader = new StreamReader(xsltStream))
                    {
                        xsltString = reader.ReadToEnd();
                    }
                }

                // Transform XML to HTML
                var htmlContent = XmlHelpers.TransformXmlToHtml(xmlDocument, xsltString);

                return Content(htmlContent, "text/html");
            }
            catch (System.Xml.XmlException ex)
            {
                return BadRequest($"XML is not valid. Error: {ex.Message}");
            }
        }
    }
}
