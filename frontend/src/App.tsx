import "./App.css";
import Idle from "./pages/Idle";
import { Route, Routes } from "react-router-dom";

const App = () => {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Idle />} />
      </Routes>
    </div>

  );
};

export default App;
