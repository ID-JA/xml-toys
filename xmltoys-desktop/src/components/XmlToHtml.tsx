import { useState } from "react";
import UploadField from "./UploadField";
import { Editor } from "@monaco-editor/react";
import { Button } from "./ui/button";
function XmlToHtml() {
  const [xmlContent, setXmlContent] = useState<string>("");
  const [xsltContent, setXsltContent] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  const [xmlFile, setXmlFile] = useState();
  const [xsltFile, setXsltFile] = useState();

  const handleUpload = async () => {
    if (!xmlFile || !xsltFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("xmlFile", xmlFile);
    formData.append("xsltFile", xsltFile);

    try {
      const response = await fetch(
        "http://localhost:5135/api/XmlToys/xml-to-html",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const html = await response.text();
      setHtmlContent(html);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };
  return (
    <div>
      <div className="grid grid-cols-2">
        <div>
          <UploadField
            setFile={setXmlFile}
            setContent={(content) => setXmlContent(content as string)}
          />
          <Editor
            height="50vh"
            defaultLanguage="xml"
            options={{
              readOnly: true,
            }}
            value={xmlContent}
          />
        </div>
        <div>
          <UploadField
            setFile={setXsltFile}
            setContent={(content) => setXsltContent(content as string)}
          />
          <Editor
            height="50vh"
            defaultLanguage="xml"
            options={{
              readOnly: true,
            }}
            value={xsltContent}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={handleUpload}>Generate HTML</Button>
      </div>
      <h2 className="mb-4 text-xl font-bold">Preview:</h2>
      <iframe
        srcDoc={htmlContent}
        style={{ width: "100%", height: "500px", border: "none" }}
        title="XSLT Preview"
      />
    </div>
  );
}
export default XmlToHtml;
