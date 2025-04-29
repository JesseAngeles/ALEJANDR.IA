import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { HomePage } from "./routes/home/HomePage";
import { ShoppingCart } from "./routes/shopping/ShoppingCart";
import { DeliveryAddress } from "./routes/address/DeliveryAddress";
import { AddDeliveryAddress } from "./routes/address/AddDeliveryAddress";
import { Payment } from "./routes/payment/Payment";
import { AddPaymentMethod } from "./routes/payment/AddPaymentMethod";
import { Cvc } from "./routes/payment/Cvc";
import { Summary } from "./routes/shopping/Summary";
import { Login } from "./routes/account/Login";
import { Registro } from "./routes/account/CreateAccount";
import { Favoritos } from "./routes/favorites/favoritos";
import { BookDetails } from "./routes/book/book_details/BookDetail";
import { Search } from "./routes/search/Search";
import { PurchaseConfirmation } from "./routes/shopping/PurchaseConfirmation";
import { Profile } from "./routes/account/Profile";
import { PaymentMethodsAccount } from "./routes/account/PaymentMethodsAccount";
import { AddressesAccount } from "./routes/account/AddressesAccount";
import { OrderHistoryAccount } from "./routes/account/OrderHistoryAccount";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cart", element: <ShoppingCart /> },
      { path: "address", element: <DeliveryAddress /> },
      { path: "address/add", element: <AddDeliveryAddress /> },
      { path: "payment", element: <Payment /> },
      { path: "payment/add", element: <AddPaymentMethod /> },
      { path: "cvc", element: <Cvc /> },
      { path: "summary", element: <Summary /> },
      { path: "login", element: <Login /> },
      { path: "registro", element: <Registro /> },
      { path: "mis-favoritos", element: <Favoritos /> },
      { path: "libro", element: <BookDetails /> },
      { path: "busqueda", element: <Search /> },
      { path: "confirmation", element: <PurchaseConfirmation /> },

      {
        path: "account/profile",
        element: <Profile />,
      },
      {
        path: "account/payment",
        element: <PaymentMethodsAccount />,
      },
      {
        path: "account/addresses",
        element: <AddressesAccount />,
      },
      {
        path: "account/history",
        element: <OrderHistoryAccount />,
      },
    ],
  },
]);
