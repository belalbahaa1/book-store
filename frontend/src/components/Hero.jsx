import React from "react";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-text-main sm:text-7xl">
          Welcome to <span className="text-primary">BookStore</span>
        </h1>
        <p className="text-lg text-text-muted sm:text-2xl max-w-2xl mx-auto">
          Discover your next favorite adventure in our curated collection of
          distinctive books.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => {
              document
                .getElementById("featured-products")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1"
          >
            Browse Books
          </button>
          <button className="px-8 py-3 bg-surface text-text-main font-semibold rounded-lg shadow border border-surface-hover hover:bg-surface-hover transition-all">
            Learn More
          </button>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
};

export default Hero;
