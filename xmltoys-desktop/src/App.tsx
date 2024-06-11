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
  default: () => JSX.Element;
};

const Components = {
  "generate-dtd": GenerateDTD,
  "generate-xsd": GenerateXSD,
  "xml-to-html": XmlToHtml,
  "xml-to-json": XmlToJson,
  "validate-xml": ValidationXML,
  "xml-diff-checker": XmlDiffChecker,
  default: Main,
};

const activeClasses = "bg-red-500 hover:bg-red-500";

function App() {
  const [state, setState] = useState("default");
  const Component = Components[state as keyof ComponentType];
  return (
    <div className="container h-screen">
      <div className="flex items-center justify-center gap-4 p-4">
        <Button
          className={clsx(state === "default" && activeClasses)}
          onClick={() => setState("default")}
        >
          Main Page
        </Button>
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

function Main() {
  return (
    <div className="h-[500px] flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold text-center mb-1">
          XML Mini Projet (XmlToys)
        </h1>
        <p className="text-center text-md mb-5 max-w-[598px] mx-auto">
          Une boîte à outils <strong>XML</strong> regroupe tous les outils
          essentiels pour travailler avec <strong>XML</strong> en un seul
          endroit pratique.
        </p>
        <h1 className="text-4xl font-bold text-center mb-4">
          développé par: Nazha Haida et Jamal Id Aissa
        </h1>
        <h1 className="text-3xl font-semibold text-center mb-2">
          LP LDW - 2023/2024 <br /> ENS Tétouan Université Abdelmalek Essaâdi
        </h1>
        <img src="./logo.png" className="h-28 mx-auto mt-4" />
      </div>
    </div>
  );
}

export default App;
