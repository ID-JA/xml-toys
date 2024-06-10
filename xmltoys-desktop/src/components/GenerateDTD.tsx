import { Editor } from "@monaco-editor/react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";

function GenerateDTD() {
  const [file, setFile] = useState<any>(null);
  const [xmlContent, setXmlContent] = useState<string>("");
  const [dtd, setDtd] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          const result = event.target.result;
          if (result) {
            setXmlContent(result as string);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:5135/api/XmlToys/generate-dtd",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const formattedDtd = data.dtd.replace(/\r\n/g, "\n");
      setDtd(formattedDtd);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  const handleDownloadDtd = () => {
    const blob = new Blob([dtd], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.dtd";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="grid grid-cols-2">
      <div>
        <input type="file" accept=".xml" onChange={handleFileChange} />
        <Button className="mb-4" onClick={handleUpload}>
          Generate
        </Button>
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
        <Button className="mb-4" onClick={handleDownloadDtd}>
          Download
        </Button>
        <Editor
          height="90vh"
          defaultLanguage="xml"
          options={{
            readOnly: true,
          }}
          value={dtd}
        />
      </div>
    </div>
  );
}

export default GenerateDTD;
