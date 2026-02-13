import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import "./App.css";
import AdminLayout from "./components/admin/AdminLayout";
import AddBook from "./components/admin/AddBook";
import AllBooks from "./components/admin/AllBooks";
import Categories from "./components/admin/Categories";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Cart from "../pages/Cart";
import SearchResults from "../pages/SearchResults";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AllBooks />} />
              <Route path="books" element={<AllBooks />} />
              <Route path="categories" element={<Categories />} />
              <Route path="add-book" element={<AddBook />} />
            </Route>
          </Route>
        </Routes>
      </MainLayout>
    </AuthProvider>
  );
}

export default App;
