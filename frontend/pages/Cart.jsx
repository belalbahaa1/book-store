import React, { useEffect, useState } from "react";
import { useAuth } from "../src/auth/context";
import { Link } from "react-router-dom";
import DeleteModal from "../src/components/DeleteModal";
import CheckoutModal from "../src/components/CheckoutModal";
import API_BASE_URL from "../src/config";

const Cart = () => {
  const { user, refreshAuth } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        if (!user?.cart || user.cart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        let itemsRemoved = false;
        const bookDetails = await Promise.all(
          user.cart.map(async (item) => {
            const res = await fetch(`${API_BASE_URL}/books/${item.bookId}`);
            if (res.ok) {
              const data = await res.json();
              return { ...data, quantity: item.quantity };
            } else {
              // Book not found (deleted?), remove from cart
              await fetch(`${API_BASE_URL}/users/update-cart`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ bookId: item.bookId, action: "remove" }),
              });
              itemsRemoved = true;
              return null;
            }
          }),
        );

        if (itemsRemoved) {
          await refreshAuth();
        }

        const validItems = bookDetails.filter((item) => item !== null);
        setCartItems(validItems);
        const totalPrice = validItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        setTotal(totalPrice);
      } catch (error) {
        console.error("Error fetching cart details", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.cart) {
      fetchCartDetails();
    } else {
      setLoading(false);
    }
  }, [user, refreshAuth]);

  const handleUpdateCart = async (bookId, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/update-cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookId, action }),
      });

      if (response.ok) {
        // Refresh items after update
        await refreshAuth();
        if (action === "remove") {
          const book = cartItems.find((item) => item._id === bookId);
          setDeleteMessage(
            book
              ? `"${book.title}" has been removed from your cart.`
              : "Item removed from cart",
          );
          setShowDeleteModal(true);
        }
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart", error);
    }
  };

  const handleCheckout = async (checkoutData) => {
    try {
      setShowCheckoutModal(false);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert(`Order placed successfully!`);
        await refreshAuth();
        setCartItems([]);
        setTotal(0);
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error("Error during checkout", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">
        Loading cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link
          to="/"
          className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-2 text-text-muted">
          Review your selected books before checkout
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-8">
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface p-4 shadow-lg transition-all hover:border-primary/20"
              >
                <div className="relative shrink-0 overflow-hidden rounded-lg group">
                  <img
                    src={
                      item.coverImage
                        ? `${API_BASE_URL}/images/${item.coverImage}`
                        : "https://placehold.co/150"
                    }
                    alt={item.title}
                    className="size-24 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {!item.coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-hover text-text-muted text-xs">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between self-stretch sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-text-main">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-muted">by {item.author}</p>
                    <p className="text-sm font-medium text-primary sm:hidden">
                      ${item.price}
                    </p>
                    <div className="mt-1">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                          item.stock > 0
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {item.stock > 0
                          ? `${item.stock} in stock`
                          : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-6 sm:mt-0">
                    <div className="flex items-center rounded-full border border-white/10 bg-background/50 p-1">
                      <button
                        onClick={() => handleUpdateCart(item._id, "decrease")}
                        className="flex size-8 items-center justify-center rounded-full text-text-muted transition hover:bg-white/10 hover:text-white active:scale-95"
                      >
                        <svg
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-text-main">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateCart(item._id, "increase")}
                        className="flex size-8 items-center justify-center rounded-full text-text-muted transition hover:bg-white/10 hover:text-white active:scale-95"
                      >
                        <svg
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="hidden text-lg font-bold text-text-main sm:block">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleUpdateCart(item._id, "remove")}
                        className="rounded-full p-2 text-text-muted transition hover:bg-red-500/10 hover:text-red-500"
                        title="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-xl border border-white/5 bg-surface p-6 shadow-xl lg:col-span-4 lg:mt-0 lg:p-8">
          <h2 className="text-lg font-medium text-text-main">Order Summary</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-main font-semibold">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-text-muted">Shipping</span>
              <span className="text-primary text-sm">Free</span>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-base font-bold text-text-main">Total</span>
              <span className="text-xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="mt-8 w-full rounded-lg bg-primary py-3 px-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-indigo-600 hover:scale-[1.02] hover:shadow-primary/40 active:scale-95"
          >
            Checkout
          </button>
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckout}
        total={total}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        message={deleteMessage}
      />
    </div>
  );
};

export default Cart;
