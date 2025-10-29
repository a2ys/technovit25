"use client";

import React, { useState, useEffect } from "react";

interface TshirtData {
  front: string;
  back: string;
}

const MerchPage: React.FC = () => {
  const [tshirts, setTshirts] = useState<TshirtData>({ front: "", back: "" });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const accentColor = "#70E081";

  const sizeData = [
    { size: "S(36)", width: 18, length: 26 },
    { size: "M(38)", width: 19, length: 27 },
    { size: "L(40)", width: 20, length: 28 },
    { size: "XL(42)", width: 21, length: 29 },
    { size: "XXL(44)", width: 22, length: 30 },
  ];

  useEffect(() => {
    const storageKey = "technovitMerchData";
    const oneDayInMs = 24 * 60 * 60 * 1000;

    const cachedDataJSON = localStorage.getItem(storageKey);

    if (cachedDataJSON) {
      const { data, timestamp } = JSON.parse(cachedDataJSON);
      const isExpired = new Date().getTime() - timestamp > oneDayInMs;

      if (!isExpired) {
        setTshirts(data);
        return;
      }
    }

    const freshData: TshirtData = {
      front: "https://cdn.a2ys.dev/images/tshirt-front.png",
      back: "https://cdn.a2ys.dev/images/tshirt-back.png",
    };

    const dataToCache = {
      data: freshData,
      timestamp: new Date().getTime(),
    };

    localStorage.setItem(storageKey, JSON.stringify(dataToCache));
    setTshirts(freshData);
  }, []);

  const images = tshirts.front ? [tshirts.front, tshirts.back] : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  if (!tshirts.front) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading Merch...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="mb-12 text-center md:mb-16">
        <h1 className="ttFont relative pb-4 text-5xl font-bold md:text-7xl">
          technoVIT&apos;25 Merch
          <span
            className="absolute bottom-0 left-1/2 h-1.5 w-2/3 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </h1>
      </div>

      <div className="mb-12 flex w-full max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="relative w-full max-w-sm aspect-square sm:max-w-md">
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-gray-800 shadow-lg">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`T-shirt view ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `translateX(${
                    (index - currentImageIndex) * 100
                  }%)`,
                }}
                loading="lazy"
              />
            ))}
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 focus:outline-none cursor-pointer"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 focus:outline-none cursor-pointer"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="w-full max-w-sm lg:max-w-xs">
          <h2
            className="mb-4 text-center text-3xl font-bold"
            style={{ color: accentColor }}
          >
            Size Chart
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full min-w-full text-center text-sm">
              <thead className="bg-gray-800 text-xs uppercase tracking-wider">
                <tr>
                  <th className="border-r border-gray-700 px-4 py-3">Size</th>
                  <th className="border-r border-gray-700 px-4 py-3">
                    Width (in)
                  </th>
                  <th className="px-4 py-3">Length (in)</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/50">
                {sizeData.map((row) => (
                  <tr key={row.size} className="border-t border-gray-700">
                    <td className="border-r border-gray-700 px-4 py-3 font-medium">
                      {row.size}
                    </td>
                    <td className="border-r border-gray-700 px-4 py-3">
                      {row.width}
                    </td>
                    <td className="px-4 py-3">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <a
        href="https://chennaievents.vit.ac.in/technovit/merch"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 rounded-full px-16 py-4 text-lg font-bold text-gray-900 cursor-pointer"
        style={{ backgroundColor: accentColor }}
      >
        Buy Now
      </a>
    </div>
  );
};

export default MerchPage;
