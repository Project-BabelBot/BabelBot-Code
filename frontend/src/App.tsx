import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import ResponsePage from "./pages/ResponsePage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="/response" element={<ResponsePage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

const Home = () => {
  return (
    <>
      <h1>BableBot Home</h1>
    </>
  );
};

const Root = () => {
  return (
    <>
      <h1>Root</h1>

      <div>
        <Outlet />
      </div>
    </>
  );
};

export default App;
