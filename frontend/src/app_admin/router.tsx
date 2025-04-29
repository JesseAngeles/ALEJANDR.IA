import { createBrowserRouter } from "react-router-dom";
import { AdminFooter } from "./layout/AdminFooter";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./routes/dashboard/LoginPage";
import { AdminHome } from "./routes/dashboard/AdminHome";
import { BookList } from "./routes/books/BookList";
import { AddBook } from "./routes/books/AddBook";
import { EditBook } from "./routes/books/EditBook";
import { OrderList } from "./routes/orders/OrderList";
import { CustomerList } from "./routes/customers/CustomerList";
import { SalesByPeriod } from "./routes/reports/SalesByPeriod";
import { BestSellers } from "./routes/reports/BestSellers";
import { FrequentCustomers } from "./routes/reports/FrequentCustomers";
import { BooksByStatus } from "./routes/reports/BooksByStatus";
import { ReportsLayout } from "./routes/reports/ReportsLayout"; // nuevo layout para reportes
import { OrderDetails } from "./routes/orders/OrderDetails";

export const adminRouter = createBrowserRouter([
  {
    path: "/admin/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminFooter />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: "libros", element: <BookList /> },
      { path: "libros/agregar", element: <AddBook /> },
      { path: "libros/editar/:id", element: <EditBook /> },
      { path: "pedidos", element: <OrderList /> },
      { path: "clientes", element: <CustomerList /> },
      { path: "pedidos/:id", element: <OrderDetails /> },
      {
        path: "reportes",
        element: <ReportsLayout />, 
        children: [
          { path: "ventas", element: <SalesByPeriod /> },
          { path: "populares", element: <BestSellers /> },
          { path: "frecuentes", element: <FrequentCustomers /> },
          { path: "estado", element: <BooksByStatus /> },
        ],
      },
    ],
  },
]);

