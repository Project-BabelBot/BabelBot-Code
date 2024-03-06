import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ResponsePage from "./pages/ResponsePage";
import Idle from "./pages/Idle";
import Home from "./pages/Home";
import "./App.css";
import Test from "./pages/test";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Idle />} />
        <Route path="/response" element={<ResponsePage />} />
        <Route path="/home" element={<Home />} />
        <Route path ="/test" element={<Test />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
