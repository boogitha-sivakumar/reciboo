// app/components/SearchForm.tsx - Search form component
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const [place, setPlace] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (place.trim()) {
      router.push(`/place/${encodeURIComponent(place)}`);
    }
  };

  // Example popular places in India
  const popularPlaces = [
    "Mumbai",
    "Delhi",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Bengaluru",
    "Jaipur",
    "Lucknow",
  ];

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-2">
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter a place name (e.g., Mumbai, Delhi, Kolkata)"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-peach"
            required
          />
          <button
            type="submit"
            className="mt-2 md:mt-0 px-6 py-3 bg-peach text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Search Recipes
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Popular places:</p>
        <div className="flex flex-wrap gap-2">
          {popularPlaces.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPlace(p);
                router.push(`/place/${encodeURIComponent(p)}`);
              }}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
