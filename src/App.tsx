import { Routes, Route } from "react-router-dom";
import Workspace from "./components/Workspace";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Workspace />} />
    </Routes>
  );
}

export default App;
