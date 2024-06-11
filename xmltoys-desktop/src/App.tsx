import { Button } from "./components/ui/button";
import { useState } from "react";
import GenerateDTD from "./components/GenerateDTD";
import GenerateXSD from "./components/GenerateXSD";
import { clsx } from "clsx";
import XmlToHtml from "./components/XmlToHtml";
import XmlToJson from "./components/XmltToJson";
import ValidationXML from "./components/ValidateXML";
import XmlDiffChecker from "./components/XmlDiffChecker";

type ComponentType = {
  "generate-dtd": () => JSX.Element;
  "generate-xsd": () => JSX.Element;
  "xml-to-html": () => JSX.Element;
  "xml-to-json": () => JSX.Element;
  "validate-xml": () => JSX.Element;
  "xml-diff-checker": () => JSX.Element;
};

const Components = {
  "generate-dtd": GenerateDTD,
  "generate-xsd": GenerateXSD,
  "xml-to-html": XmlToHtml,
  "xml-to-json": XmlToJson,
  "validate-xml": ValidationXML,
  "xml-diff-checker": XmlDiffChecker,
};

const activeClasses = "bg-red-500 hover:bg-red-500";

function App() {
  const [state, setState] = useState("");
  const Component = Components[state as keyof ComponentType];
  return (
    <div className="container h-screen">
      <div className="flex items-center justify-center gap-4 p-4">
        <Button
          className={clsx(state === "generate-dtd" && activeClasses)}
          onClick={() => setState("generate-dtd")}
        >
          Generate DTD
        </Button>
        <Button
          className={clsx(state === "generate-xsd" && activeClasses)}
          onClick={() => setState("generate-xsd")}
        >
          Generate XSD
        </Button>
        <Button
          className={clsx(state === "xml-to-html" && activeClasses)}
          onClick={() => setState("xml-to-html")}
        >
          XML to HTML
        </Button>
        <Button
          className={clsx(state === "xml-to-json" && activeClasses)}
          onClick={() => setState("xml-to-json")}
        >
          XML to JSON
        </Button>
        <Button
          className={clsx(state === "validate-xml" && activeClasses)}
          onClick={() => setState("validate-xml")}
        >
          Validate XML
        </Button>
        <Button
          className={clsx(state === "xml-diff-checker" && activeClasses)}
          onClick={() => setState("xml-diff-checker")}
        >
          XML diff Checker
        </Button>
      </div>
      <br />
      {Component ? <Component /> : null}
    </div>
  );
}

export default App;
