import { DiffEditor, Editor } from "@monaco-editor/react";
import { useState } from "react";

function XmlDiffChecker() {
  const [originalContent, setOriginalContent] = useState("");
  const [modifiedContent, setModifiedContent] = useState("");

  return (
    <div>
      <div className="grid grid-cols-2 gar-4 mb-6">
        <div>
          <h1 className="mb-4 text-md font-semibold">Original XML:</h1>
          <Editor
            height="50vh"
            defaultLanguage="xml"
            value={originalContent}
            onChange={(value) => setOriginalContent(value || "")}
          />
        </div>
        <div>
          <h1 className="mb-4 text-md font-semibold">Modified XML:</h1>

          <Editor
            height="50vh"
            defaultLanguage="xml"
            value={modifiedContent}
            onChange={(value) => setModifiedContent(value || "")}
          />
        </div>
      </div>
      <DiffEditor
        height="50vh"
        original={originalContent}
        originalLanguage="xml"
        modified={modifiedContent}
        modifiedLanguage="xml"
        options={{
          readOnly: true,
        }}
      />
    </div>
  );
}
export default XmlDiffChecker;
