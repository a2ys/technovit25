"use client";

import { useState, useEffect } from "react";
import CachedImage from "@/components/CachedImage";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeenModal) {
      setIsOpen(true);
      sessionStorage.setItem("hasSeenWelcomeModal", "true");
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
      <div className="relative animate-in fade-in-0 zoom-in-95">
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
          aria-label="Close modal"
        >
          ✕
        </button>

        <CachedImage
          src="https://cdn.a2ys.dev/images/modal-image.jpg"
          alt="Welcome to TechnoVIT"
          width={500}
          height={500}
          className="max-w-md rounded-lg object-contain md:max-w-lg"
        />
      </div>
    </div>
  );
}
