import { useState } from "react";
import { Button } from "./ui/button";
import UploadField from "./UploadField";
import { Editor } from "@monaco-editor/react";

function XmlToJson() {
  const [xmlContent, setXmlContent] = useState<string>("");
  const [jsonContent, setJsonContent] = useState<string>();

  const [xmlFile, setXmlFile] = useState();

  const handleUpload = async () => {
    if (!xmlFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("xmlFile", xmlFile);

    try {
      const response = await fetch(
        "http://localhost:5135/api/XmlToys/convert-xml-to-json",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonOutput = await response.text();
      setJsonContent(jsonOutput);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };
  return (
    <div className="grid grid-cols-2 gap-12">
      <div>
        <div className="flex justify-between mb-4 items-center">
          <UploadField
            setFile={setXmlFile}
            setContent={(content) => setXmlContent(content as string)}
          />
          <Button onClick={handleUpload}>Generate</Button>
        </div>
        <Editor
          height="80vh"
          defaultLanguage="xml"
          options={{
            readOnly: true,
          }}
          value={xmlContent}
        />
      </div>
      <div>
        <Editor
          height="80vh"
          defaultLanguage="json"
          options={{
            readOnly: true,
          }}
          value={jsonContent}
        />
      </div>
    </div>
  );
}
export default XmlToJson;
