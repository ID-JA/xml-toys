import { Editor } from "@monaco-editor/react";
import UploadField from "./UploadField";
import { useState } from "react";
import { Button } from "./ui/button";
import { FileDownIcon } from "lucide-react";
import { downloadFile } from "@/lib/utils";

function ValidationXML() {
  const [xmlContent, setXmlContent] = useState<string>("");
  const [xsdContent, setXsdContent] = useState("");
  const [errors, setErrors] = useState([]);

  const [_, setXmlFile] = useState();
  const [xsdFile, setXsdFile] = useState();

  const handleUpload = async () => {
    if (!xmlContent || !xsdFile) {
      alert("Please upload both XML and XSD files.");
      return;
    }

    const formData = new FormData();
    const updatedXmlFile = new File([xmlContent], "updated.xml", {
      type: "text/xml",
    });

    formData.append("xmlFile", updatedXmlFile);
    formData.append("xsdFile", xsdFile);

    try {
      const response = await fetch(
        "http://localhost:5135/api/XmlToys/validate-xml",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.text();
        setErrors([]);
        alert(result);
      } else {
        const result = await response.json();
        setErrors(result.errors || []);
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <UploadField
            setFile={setXmlFile}
            setContent={(content) => setXmlContent(content as string)}
          />

          <div className="relative mt-4">
            <Button
              size="icon"
              className="absolute z-50 right-0"
              onClick={() => downloadFile(xmlContent, "valid-xml.xml")}
            >
              <FileDownIcon className="w-6 h-6" />
            </Button>
            <Editor
              height="50vh"
              defaultLanguage="xml"
              onChange={(value) => setXmlContent(value || "")}
              value={xmlContent}
            />
          </div>
          <div>
            <ul className="list-disc">
              {errors.map((error, index) => (
                <li
                  key={index}
                  className="text-red-500 font-semibold text-md mb-2"
                >
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <UploadField
            setFile={setXsdFile}
            setContent={(content) => setXsdContent(content as string)}
          />
          <Editor
            height="50vh"
            defaultLanguage="xml"
            options={{
              readOnly: true,
            }}
            value={xsdContent}
          />
        </div>
      </div>
      <div className="flex justify-center align-items">
        <Button size="lg" onClick={handleUpload}>
          Validate XML
        </Button>
      </div>
    </div>
  );
}

export default ValidationXML;
