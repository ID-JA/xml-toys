import { useState } from "react";
import UploadField from "./UploadField";
import { Button } from "./ui/button";
import { Editor } from "@monaco-editor/react";
import { downloadFile } from "@/lib/utils";

function GenerateXSD() {
  const [file, setFile] = useState<any>(null);
  const [xmlContent, setXmlContent] = useState<string>("");
  const [xsd, setXsd] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:5135/api/XmlToys/generate-xsd",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const formattedXsd = data.xsd.replace(/\r\n/g, "\n");
      setXsd(formattedXsd);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };
  return (
    <div className="grid grid-cols-2">
      <div>
        <div className="flex justify-between mb-4">
          <UploadField
            setContent={(content) => setXmlContent(content as string)}
            setFile={setFile}
          />
          <Button className="mb-4" onClick={handleUpload}>
            Generate
          </Button>
        </div>
        <Editor
          value={xmlContent}
          height="90vh"
          defaultLanguage="xml"
          options={{
            readOnly: true,
          }}
        />
      </div>
      <div>
        <Button
          className="mb-4 float-right"
          onClick={() => downloadFile(xsd, "generatedXSD.xsd")}
        >
          Download
        </Button>
        <Editor
          height="90vh"
          defaultLanguage="xml"
          options={{
            readOnly: true,
          }}
          value={xsd}
        />
      </div>
    </div>
  );
}

export default GenerateXSD;
