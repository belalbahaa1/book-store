import { useLocation } from "react-router-dom";
import Header from "../src/components/Header";

export default function MainLayout({ children }) {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? "" : "max-w-7xl mx-auto p-4"}>
        {children}
      </main>
    </>
  );
}
