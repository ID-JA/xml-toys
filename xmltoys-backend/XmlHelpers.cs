using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;
using System.Xml.Xsl;

namespace XmlToys.API
{
    public class XmlHelpers
    {
        public static string GenerateDtd(XDocument xmlDocument)
        {
            var elements = new HashSet<string>();
            var dtd = new List<string>();

            var rootElement = xmlDocument.Root;
            if (rootElement != null)
            {
                GenerateElementDtd(rootElement, elements, dtd);
            }

            return string.Join(Environment.NewLine, dtd);
        }

        private static void GenerateElementDtd(XElement element, HashSet<string> elements, List<string> dtd)
        {
            if (elements.Contains(element.Name.LocalName))
                return;

            elements.Add(element.Name.LocalName);

            if (!element.HasElements && string.IsNullOrWhiteSpace(element.Value))
            {
                // Self-closing tag or empty element
                var elementDtd = $"<!ELEMENT {element.Name.LocalName} EMPTY>";
                dtd.Add(elementDtd);
            }
            else if (!element.HasElements && !string.IsNullOrWhiteSpace(element.Value))
            {
                // Element with text content
                var elementDtd = $"<!ELEMENT {element.Name.LocalName} (#PCDATA)>";
                dtd.Add(elementDtd);
            }
            else
            {
                var children = new Dictionary<string, int>();
                foreach (var child in element.Elements())
                {
                    if (children.ContainsKey(child.Name.LocalName))
                    {
                        children[child.Name.LocalName]++;
                    }
                    else
                    {
                        children[child.Name.LocalName] = 1;
                    }
                    GenerateElementDtd(child, elements, dtd);
                }

                var childrenDtd = children.Count > 0
                    ? string.Join(", ", GenerateChildDtd(children))
                    : "EMPTY";

                var elementDtd = $"<!ELEMENT {element.Name.LocalName} ({childrenDtd})>";
                dtd.Add(elementDtd);
            }

            if (element.HasAttributes)
            {
                foreach (var attribute in element.Attributes())
                {
                    var attlistDtd = $"<!ATTLIST {element.Name.LocalName} {attribute.Name.LocalName} CDATA #REQUIRED>";
                    dtd.Add(attlistDtd);
                }
            }
        }

        private static IEnumerable<string> GenerateChildDtd(Dictionary<string, int> children)
        {
            foreach (var child in children)
            {
                yield return child.Value > 1 ? $"{child.Key}*" : child.Key;
            }
        }
       
        public static string GenerateXsd(XDocument xmlDocument)
        {
            using (var stream = new MemoryStream())
            {
                xmlDocument.Save(stream);
                stream.Position = 0;

                var schemaSet = new XmlSchemaSet();
                var settings = new XmlReaderSettings
                {
                    DtdProcessing = DtdProcessing.Parse,
                    ValidationType = ValidationType.None 
                };

                using (var reader = XmlReader.Create(stream, settings))
                {
                    var inference = new XmlSchemaInference();
                    schemaSet = inference.InferSchema(reader);
                }

                if (schemaSet.Count > 0)
                {
                    var writer = new StringWriter();
                    foreach (XmlSchema schema in schemaSet.Schemas())
                    {
                        schema.Write(writer);
                    }
                    return writer.ToString();
                }
                else
                {
                    throw new InvalidOperationException("Failed to infer XML schema.");
                }
            }
        }

        public static string TransformXmlToHtml(XDocument xmlDocument, string xsltString)
        {
            using (var stringWriter = new StringWriter())
            {
                var xslt = new XslCompiledTransform();
                using (var xsltReader = new StringReader(xsltString))
                {
                    using (var xmlReader = System.Xml.XmlReader.Create(xsltReader))
                    {
                        xslt.Load(xmlReader);
                    }
                }

                using (var xmlReader = xmlDocument.CreateReader())
                {
                    xslt.Transform(xmlReader, null, stringWriter);
                }

                return stringWriter.ToString();
            }
        }

    }
}
