import { createBrowserRouter } from "react-router-dom";
import App from "../components/App/App";
import TemplatesList from "../components/TemplatesList/TemplatesList";
import HTMLTemplate from "../components/HTMLTemplate/HTMLTemplate";
import Convertor from "../components/Convertor/Convertor";

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
      {
        path: "/convertor/:id",
        element: <Convertor />,
      },
    ],
  },
]);

export default router;
