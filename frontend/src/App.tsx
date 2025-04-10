
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6">
        <h2 className="text-xl font-bold">Bienvenido a la librería ALEJANDR.IA</h2>
        <p>Explora nuestros libros favoritos, recomendados y más.</p>
      </main>
      <Footer />
    </div>
  );
};

export default App;
