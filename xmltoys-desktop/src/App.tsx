import { Button } from "./components/ui/button";
import { useState } from "react";
import GenerateDTD from "./components/GenerateDTD";
import GenerateXSD from "./components/GenerateXSD";
import { type ClassValue, clsx } from "clsx";

type ComponentType = {
  "generate-dtd": () => JSX.Element;
  "generate-xsd": () => JSX.Element;
};

const Components = {
  "generate-dtd": GenerateDTD,
  "generate-xsd": GenerateXSD,
};

function App() {
  const [state, setState] = useState("");
  const Component = Components[state as keyof ComponentType];
  return (
    <div className="container h-screen">
      <div className="space-x-4 p-4">
        <Button
          className={clsx(state === "generate-dtd" && "bg-red-500")}
          onClick={() => setState("generate-dtd")}
        >
          Generate DTD
        </Button>
        <Button
          className={clsx(state === "generate-xsd" && "bg-red-500")}
          onClick={() => setState("generate-xsd")}
        >
          Generate XSD
        </Button>
      </div>
      <br />
      {Component ? <Component /> : null}
    </div>
  );
}

export default App;
