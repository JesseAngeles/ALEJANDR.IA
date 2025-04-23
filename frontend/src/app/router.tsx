import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { HomePage } from "./routes/home/HomePage";
import { Account } from "./routes/account/Account";
import { ShoppingCart } from "./routes/shopping/ShoppingCart";
import { DeliveryAddress } from "./routes/shopping/DeliveryAddress";
import { Payment } from "./routes/shopping/Payment";
import { Cvc } from "./routes/shopping/Cvc";
import { Summary } from "./routes/shopping/Summary";
import { Login } from "./routes/account/Login"
import { Registro } from "./routes/account/CreateAccount"
import { Favoritos } from "./routes/favorites/favoritos";
import { BookDetails } from "./routes/book/book_details/BookDetail";
import { Search } from "./routes/search/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "account", element: <Account /> },
      { path: "cart", element: <ShoppingCart /> },
      { path: "address", element: <DeliveryAddress /> },
      { path: "payment", element: <Payment /> },
      { path: "cvc", element: <Cvc /> },
      { path: "summary", element: <Summary /> },
      { path: "login", element: <Login/>},
      { path: "Registro", element: <Registro/> },
      { path: "mis-favoritos", element: <Favoritos/>},
      { path: "libro", element: <BookDetails/>},
      { path: "busqueda", element: <Search/> }
    ],
  },
]);
