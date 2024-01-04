import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ResponsePage from "./pages/ResponsePage";
import Idle from "./pages/Idle";
import Clock from "./components/Clock";
import "./App.css";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Idle />} />
        <Route path="/response" element={<ResponsePage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

const Root = () => {
  return (
    <>
      <Clock />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default App;
