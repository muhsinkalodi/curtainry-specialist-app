'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick?: () => void;
  fallbackUrl?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  onClick, 
  fallbackUrl = '/dashboard', 
  label = "Back", 
  className = "" 
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Use browser history if available, otherwise fallback to specified URL
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackUrl);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group ${className}`}
    >
      <ArrowLeft 
        size={20} 
        className="group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" 
      />
      <span className="font-medium">{label}</span>
    </button>
  );
}