'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export default function BackButton({ onClick, label = "Back", className = "" }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
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