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
import { useEffect } from "react";
import { register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

const App = () => {
  useEffect(() => {
    const func = async () => {
      await register(await connect());
    };
    func();
    console.log("APP USEEFFECT, func ran");
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Idle />} />
        <Route path="/response" element={<ResponsePage />} />
        <Route path="/home" element={<Home />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
