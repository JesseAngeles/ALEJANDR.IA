import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { HomePage } from "./routes/home/HomePage";
import { Profile } from "./routes/account/Profile";
import { ShoppingCart } from "./routes/shopping/ShoppingCart";
import { DeliveryAddress } from "./routes/address/DeliveryAddress";
import { Payment } from "./routes/payment/Payment";
import { Cvc } from "./routes/payment/Cvc";
import { Summary } from "./routes/shopping/Summary";
import { Login } from "./routes/account/Login";
import { Registro } from "./routes/account/CreateAccount";
import { Favoritos } from "./routes/favorites/favoritos";
import { BookDetails } from "./routes/book/book_details/BookDetail";
import { Search } from "./routes/search/Search";
import { PurchaseConfirmation } from "./routes/shopping/PurchaseConfirmation";
import { AddPaymentMethod } from "./routes/payment/AddPaymentMethod";
import { AddDeliveryAddress } from "./routes/address/AddDeliveryAddress";
import { PaymentMethodsAccount } from "./routes/account/PaymentMethodsAccount";
import { AddressesAccount } from "./routes/account/AddressesAccount";
import { PasswordRecovery } from "./routes/account/PasswordRecovery";
import { OrderHistory } from "./routes/account/OrderHistory";
import { PasswordReset } from "./routes/account/PasswordReset";
import { ProtectedRoute } from "./ProtectedRoute";
import { OrderDetails } from "./routes/account/OrderDetails";
import { Review } from "./routes/book/Review";
import { NotFound } from "@/Errors/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <Login /> },
      { path: "registro", element: <Registro /> },
      { path: "mis-favoritos", element: <Favoritos /> },
      { path: "book/:isbn", element: <BookDetails /> },
      { path: "busqueda", element: <Search /> },
      { path: "mis-favoritos", element: <Favoritos /> },
      { path: "password-recovery", element: <PasswordRecovery /> },

      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <ShoppingCart />
          </ProtectedRoute>
        ),
      },
      {
        path: "address",
        element: (
          <ProtectedRoute>
            <DeliveryAddress />
          </ProtectedRoute>
        ),
      },
      {
        path: "address/add",
        element: (
          <ProtectedRoute>
            <AddDeliveryAddress />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment/add",
        element: (
          <ProtectedRoute>
            <AddPaymentMethod />
          </ProtectedRoute>
        ),
      },
      {
        path: "cvc",
        element: (
          <ProtectedRoute>
            <Cvc />
          </ProtectedRoute>
        ),
      },
      {
        path: "summary",
        element: (
          <ProtectedRoute>
            <Summary />
          </ProtectedRoute>
        ),
      },
      {
        path: "confirmation",
        element: (
          <ProtectedRoute>
            <PurchaseConfirmation />
          </ProtectedRoute>
        ),
      },

      // Zona privada de cuenta
      {
        path: "account/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "account/payment",
        element: (
          <ProtectedRoute>
            <PaymentMethodsAccount />
          </ProtectedRoute>
        ),
      },
      {
        path: "account/addresses",
        element: (
          <ProtectedRoute>
            <AddressesAccount />
          </ProtectedRoute>
        ),
      },
      {
        path: "account/history",
        element: (
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "password-reset",
        element: (
          <ProtectedRoute>
            <PasswordReset />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order/:orderId",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute >

        ),
      },
      {
        path: "/review/:isbn",
        element: (
          <ProtectedRoute>
            <Review />
          </ProtectedRoute >

        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
