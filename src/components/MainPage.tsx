import { useState, useEffect } from "react";
import { Home } from "./Home";
import { Team } from "./Team";
import { About } from "./About";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import Events from "./Events";
import { MerchPage } from "./MerchPage";

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "events":
        return <Events />;
      case "team":
        return <Team />;
      case "merch":
        return <MerchPage />;
      case "about":
        return <About />;
    }
  };

  return (
    <div className="min-h-screen bg-black w-screen">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-20">{renderPage()}</main>
      <Footer />
    </div>
  );
};

export default MainPage;
