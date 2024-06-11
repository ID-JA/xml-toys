using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

// using Newtonsoft.Json;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;

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

        [HttpPost("convert-xml-to-json")]
        public IActionResult ConvertXmlToJson([FromForm] IFormFile xmlFile)
        {
            if (xmlFile == null || xmlFile.Length == 0)
                return BadRequest("No XML file uploaded.");

            try
            {
                using (var stream = new MemoryStream())
                {
                    xmlFile.CopyTo(stream);
                    stream.Position = 0;

                    var xmlDocument = new XmlDocument();
                    xmlDocument.Load(stream);

                    var json = JsonConvert.SerializeXmlNode(xmlDocument, Newtonsoft.Json.Formatting.Indented);

                    return Ok(json);
                }
            }
            catch (System.Xml.XmlException ex)
            {
                return BadRequest($"XML is not valid. Error: {ex.Message}");
            }
        }

        [HttpPost("validate-xml")]
        public IActionResult ValidateXml([FromForm] IFormFile xmlFile, [FromForm] IFormFile xsdFile)
        {
            if (xmlFile == null || xmlFile.Length == 0 || xsdFile == null || xsdFile.Length == 0)
                return BadRequest("Both XML and XSD files must be uploaded.");

            var errors = new List<string>();

            try
            {
                using (var xmlStream = new MemoryStream())
                using (var xsdStream = new MemoryStream())
                {
                    xmlFile.CopyTo(xmlStream);
                    xsdFile.CopyTo(xsdStream);
                    xmlStream.Position = 0;
                    xsdStream.Position = 0;

                    var xmlDocument = new XmlDocument();
                    xmlDocument.Load(xmlStream);

                    var schemaSet = new XmlSchemaSet();
                    schemaSet.Add(null, XmlReader.Create(xsdStream));

                    xmlDocument.Schemas.Add(schemaSet);
                    xmlDocument.Validate((sender, e) =>
                    {
                        if (e.Severity == XmlSeverityType.Error || e.Severity == XmlSeverityType.Warning)
                        {
                            errors.Add(e.Message);
                        }
                    });

                    if (errors.Count != 0)
                    {
                        return BadRequest(new { errors });
                    }

                    return Ok("XML is valid.");
                }
            }
            catch (XmlException ex)
            {
                return BadRequest($"XML is not valid. Error: {ex.Message}");
            }
            catch (XmlSchemaException ex)
            {
                return BadRequest($"XSD is not valid. Error: {ex.Message}");
            }
        }

    }
}
