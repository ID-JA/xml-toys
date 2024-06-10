using System.Xml.Linq;

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
    }
}
