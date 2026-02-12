import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";

const AllBooks = () => {
  const [bookList, setBookList] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/getBooks`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        navigate("/", { replace: true });
        return;
      }

      const data = await res.json();
      setBookList(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/books/deleteBook/${bookId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Book deleted successfully!");
        fetchBooks();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Book Inventory
          </h1>
          <p className="text-sm md:text-base text-text-muted">
            Manage your collection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 md:px-4 md:py-2 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-text-muted mb-0.5">Total Books</p>
            <p className="text-xl md:text-2xl font-bold text-white">
              {bookList.length}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-book")}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-indigo-600 text-white font-semibold transition-all shadow-lg shadow-primary/25 text-sm md:text-base whitespace-nowrap"
          >
            + Add Book
          </button>
        </div>
      </div>

      {/* Books Grid - Mobile First */}
      {bookList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-20 px-4 rounded-2xl bg-white/5 border border-white/10">
          <svg
            className="w-12 h-12 md:w-16 md:h-16 text-text-muted mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
            No books found
          </h3>
          <p className="text-sm md:text-base text-text-muted text-center mb-6">
            Start by adding your first book
          </p>
          <button
            onClick={() => navigate("/admin/add-book")}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-indigo-600 text-white font-semibold transition-all shadow-lg shadow-primary/25"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bookList?.map((book) => (
            <div
              key={book._id}
              className="group relative flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Book Cover - Optimized for Mobile */}
              <div className="relative aspect-3/4 overflow-hidden bg-slate-800">
                <img
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src={`${API_BASE_URL}/images/${book.coverImage}`}
                  alt={book.title}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Stock Badge - Smaller on Mobile */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3">
                  <span
                    className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                      book.stock > 10
                        ? "bg-emerald-500/90 text-white"
                        : book.stock > 0
                          ? "bg-amber-500/90 text-white"
                          : "bg-red-500/90 text-white"
                    }`}
                  >
                    {book.stock > 0 ? `${book.stock} in stock` : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Book Details - Compact on Mobile */}
              <div className="flex flex-col flex-1 p-4 md:p-5">
                <div className="flex-1 mb-3">
                  <h3 className="text-base md:text-lg font-bold text-white mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs md:text-sm text-primary font-medium mb-2">
                    {book.author}
                  </p>
                  <p className="text-xs md:text-sm text-text-muted line-clamp-2">
                    {book.description}
                  </p>
                </div>

                {/* Price and Category - Responsive */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Price</p>
                    <p className="text-lg md:text-xl font-bold text-white">
                      ${book.price}
                    </p>
                  </div>
                  {book.category && (
                    <div className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs font-medium text-text-muted truncate max-w-[100px]">
                        {book.category.name || "Uncategorized"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Touch Friendly */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 md:py-2.5 px-3 md:px-4 text-xs md:text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all active:scale-95"
                  >
                    Delete
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 rounded-xl bg-primary/10 border border-primary/20 py-2.5 md:py-2.5 px-3 md:px-4 text-xs md:text-sm font-semibold text-primary hover:bg-primary/20 hover:border-primary/30 transition-all active:scale-95">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
