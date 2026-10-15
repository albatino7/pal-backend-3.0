import { RouterProvider } from "react-router-dom";
import router from "./app/routes";

export const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
