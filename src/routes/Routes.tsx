import { createBrowserRouter } from "react-router-dom";
import App from "../components/App/App";
import TemplatesList from "../components/TemplatesList/TemplatesList";
import HTMLTemplate from "../components/HTMLTemplate/HTMLTemplate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <TemplatesList />,
      },
      {
        path: "/create",
        element: <HTMLTemplate />,
      },
      {
        path: "/edit/:id",
        element: <HTMLTemplate />,
      },
    ],
  },
]);

export default router;
