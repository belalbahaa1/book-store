import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../src/auth/context";
import SuccessModal from "../src/components/SuccessModal";
import API_BASE_URL from "../src/config";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const query = searchParams.get("q") || "";
  const { isAuthenticated, refreshAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/books/getBooks`);
        const data = await res.json();

        // Filter books by search query
        const filtered = data.filter(
          (book) =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            (book.category &&
              book.category.name.toLowerCase().includes(query.toLowerCase())),
        );

        setBooks(filtered);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchBooks();
    }
  }, [query]);

  const handleAddToCart = async (bookId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/add-to-cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookId }),
      });

      if (response.ok) {
        const book = books.find((b) => b._id === bookId);
        setModalMessage(
          book
            ? `"${book.title}" has been added to your cart.`
            : "Book added to cart",
        );
        setShowModal(true);
        await refreshAuth();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white text-lg">Searching...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-12 text-center md:mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl md:text-5xl">
            Search Results for "{query}"
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
            Found {books.length} {books.length === 1 ? "book" : "books"}
          </p>
        </div>

        {/* Results Grid */}
        {books.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-surface border border-white/5">
            <svg
              className="w-16 h-16 text-text-muted mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              No books found
            </h3>
            <p className="text-text-muted mb-8 max-w-sm mx-auto">
              We couldn't find any books matching your search. Please check the
              spelling or try a different keyword.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 rounded-xl bg-primary hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-primary/25 active:scale-95"
            >
              Browse All Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {books.map((book) => (
              <div
                key={book._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface border border-white/5 shadow-lg transition-all hover:shadow-2xl hover:border-primary/20"
              >
                <div className="aspect-3/4 w-full overflow-hidden bg-gray-800 relative">
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    {book.isFeatured && (
                      <span className="inline-flex items-center rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                        Featured
                      </span>
                    )}
                    {book.isOnSale && (
                      <span className="inline-flex items-center rounded-full bg-red-500/90 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                        Sale
                      </span>
                    )}
                  </div>
                  <img
                    src={
                      book.coverImage
                        ? `${API_BASE_URL}/images/${book.coverImage}`
                        : "https://placehold.co/400"
                    }
                    alt={book.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Quick Add Overlay (Desktop) */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full px-4 pb-4 transition-transform duration-300 group-hover:translate-y-0 hidden lg:block">
                    <button
                      onClick={() => handleAddToCart(book._id)}
                      className="w-full rounded-xl bg-white/90 backdrop-blur-md py-3 text-sm font-bold text-gray-900 shadow-lg hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-text-main line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm font-medium text-primary mt-1">
                      {book.author}
                    </p>
                    {book.category && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          {book.category.name}
                        </span>
                      </div>
                    )}
                    <div className="mt-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                          book.stock > 0
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {book.stock > 0
                          ? `${book.stock} in stock`
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-text-muted line-clamp-2 flex-1">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      {book.isOnSale && book.discountPercent > 0 ? (
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-text-muted line-through decoration-red-500/50 decoration-2">
                              ${book.price}
                            </span>
                            <span className="text-xs font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                              -{book.discountPercent}%
                            </span>
                          </div>
                          <span className="text-xl font-bold text-white">
                            $
                            {(
                              book.price *
                              (1 - book.discountPercent / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-white">
                          ${book.price}
                        </span>
                      )}
                    </div>

                    {/* Mobile Add Button */}
                    <button
                      onClick={() => handleAddToCart(book._id)}
                      className="lg:hidden rounded-lg bg-surface-hover p-2.5 text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Added to Cart!"
        message={modalMessage}
      />
    </div>
  );
};

export default SearchResults;
