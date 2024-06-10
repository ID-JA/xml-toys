import { Button } from "./components/ui/button";
import { useState } from "react";

const Components = {
  "generate-xml": GenerateXML,
  "check-xml-diff": CheckXMLDiff,
};
function App() {
  const [state, setState] = useState<string>("");
  const Component = Components[state];
  return (
    <div className="container h-screen">
      <div className="space-x-4">
        <Button onClick={() => setState("generate-xml")}>Generate XML</Button>
        <Button onClick={() => setState("check-xml-diff")}>
          Check XML diff
        </Button>
      </div>
      <br />
      {Component ? <Component /> : null}
    </div>
  );
}

export default App;

function GenerateXML() {
  return <div>Hello from generate XML</div>;
}

function CheckXMLDiff() {
  return <div>Hello from CheckXMLDiff</div>;
}
