import { Button } from "./components/ui/button";
import { useState } from "react";
import GenerateDTD from "./components/GenerateDTD";

const Components = {
  "generate-dtd": GenerateDTD,
};
function App() {
  const [state, setState] = useState<any>("");
  const Component = Components[state];
  return (
    <div className="container h-screen">
      <div className="space-x-4 p-4">
        <Button onClick={() => setState("generate-dtd")}>Generate DTD</Button>
      </div>
      <br />
      {Component ? <Component /> : null}
    </div>
  );
}

export default App;
