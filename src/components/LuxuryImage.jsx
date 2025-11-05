"use client";
import React, { useState } from 'react';

export default function LuxuryImage({ src, alt, className = '', fallback = null }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const defaultFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt || 'Music')}&size=400&background=random&color=fff&bold=true&format=svg`;

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {loading && (
        <div className="absolute inset-0 image-skeleton rounded-lg"></div>
      )}

      {/* Actual image */}
      <img
        src={error ? (fallback || defaultFallback) : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* Gradient overlay for better aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
