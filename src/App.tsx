import { ExchangeForm } from "./features/exchange";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Portfolio } from "./features/portfolio";
import { Layout } from "./Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ExchangeForm />,
        index: true,
      },
      {
        path: "/portfolio",
        element: <Portfolio />,
      },
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
