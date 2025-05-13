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
import { ReportsLayout } from "./routes/reports/ReportsLayout"; 
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
      {
        path: "libros",
        element: (
          <ProtectedRoute>
            <BookList />
          </ProtectedRoute>
        ),
      },
      {
        path: "libros/agregar",
        element: (
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "libros/editar/:id",
        element: (
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "pedidos",
        element: (
          <ProtectedRoute>
            <OrderList />
          </ProtectedRoute>
        ),
      },
      {
        path: "clientes",
        element: (
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        ),
      },
      {
        path: "pedidos/:id",
        element: (
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "reportes",
        element: <ReportsLayout />,
        children: [
          {
            path: "ventas",
            element: (
              <ProtectedRoute>
                <SalesByPeriod />
              </ProtectedRoute>
            ),
          },
          {
            path: "populares",
            element: (
              <ProtectedRoute>
                <BestSellers />
              </ProtectedRoute>
            ),
          },
          {
            path: "frecuentes",
            element: (
              <ProtectedRoute>
                <FrequentCustomers />
              </ProtectedRoute>
            ),
          },
          {
            path: "estado",
            element: (
              <ProtectedRoute>
                <BooksByStatus />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);