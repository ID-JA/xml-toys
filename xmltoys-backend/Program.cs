using System.Text.Json.Serialization;
using System.Xml.Linq;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

var app = builder.Build();

// var sampleTodos = new Todo[] {
//     new(1, "Walk the dog"),
//     new(2, "Do the dishes", DateOnly.FromDateTime(DateTime.Now)),
//     new(3, "Do the laundry", DateOnly.FromDateTime(DateTime.Now.AddDays(1))),
//     new(4, "Clean the bathroom"),
//     new(5, "Clean the car", DateOnly.FromDateTime(DateTime.Now.AddDays(2)))
// };

// var todosApi = app.MapGroup("/todos");
// todosApi.MapPost("/{id}", (Htt model) => Results.Ok("model"));

app.MapPost("/generate-dtd", (HttpRequest request) =>
{
    if (request.Form.Files == null || request.Form.Files.Count == 0)
    {
        return Results.BadRequest("No file uploaded.");
    }

    try
    {
        using (var stream = new MemoryStream())
        {
            request.Form.Files[0].CopyTo(stream);
            stream.Position = 0;

            var xmlDocument = XDocument.Load(stream);
            var dtd = XmlHelpers.GenerateDtd(xmlDocument);
            return Results.Ok(dtd);
        }
    }
    catch (System.Xml.XmlException ex)
    {
        return Results.BadRequest($"XML is not valid. Error: {ex.Message}");
    }

});

app.Run();

// public record Todo(int Id, string? Title, DateOnly? DueBy = null, bool IsComplete = false);

// [JsonSerializable(typeof(Todo[]))]
// internal partial class AppJsonSerializerContext : JsonSerializerContext
// {

// }

public record FileUploadModel(IFormFile File);
[JsonSerializable(typeof(FileUploadModel))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{

}

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