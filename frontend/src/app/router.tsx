import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { HomePage } from "./routes/home/HomePage";
import { Account } from "./routes/account/Account";
import { ShoppingCart } from "./routes/shopping/ShoppingCart";
import { DeliveryAddress } from "./routes/address/DeliveryAddress";
import { Payment } from "./routes/payment/Payment";
import { Cvc } from "./routes/payment/Cvc";
import { Summary } from "./routes/shopping/Summary";
import { Login } from "./routes/account/Login"
import { Registro } from "./routes/account/CreateAccount"
import { Favoritos } from "./routes/favorites/favoritos";
import { BookDetails } from "./routes/book/book_details/BookDetail";
import { Search } from "./routes/search/Search";
import { PurchaseConfirmation } from "./routes/shopping/PurchaseConfirmation";
import { AddPaymentMethod } from "./routes/payment/AddPaymentMethod";
import { AddDeliveryAddress } from "./routes/address/AddDeliveryAddress";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "account", element: <Account /> },
      { path: "cart", element: <ShoppingCart /> },
      { path: "address", element: <DeliveryAddress /> },
      { path: "address/add", element: <AddDeliveryAddress /> },
      { path: "payment", element: <Payment /> },
      { path: "payment/add", element: <AddPaymentMethod /> },
      { path: "cvc", element: <Cvc /> },
      { path: "summary", element: <Summary /> },
      { path: "login", element: <Login /> },
      { path: "Registro", element: <Registro /> },
      { path: "mis-favoritos", element: <Favoritos /> },
      { path: "libro", element: <BookDetails /> },
      { path: "busqueda", element: <Search /> },
      { path: "confirmation", element: <PurchaseConfirmation /> }
    ],
  },
]);
