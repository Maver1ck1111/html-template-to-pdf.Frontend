import { createBrowserRouter } from "react-router-dom";
import App from "../components/App/App";
import TemplatesList from "../components/TemplatesList/TemplatesList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <TemplatesList />,
      },
    ],
  },
]);

export default router;
