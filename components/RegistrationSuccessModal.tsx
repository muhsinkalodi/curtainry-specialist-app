'use client';

import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole: 'consultant' | 'fitter';
  registrationDate?: string;
  registrationTime?: string;
}

export default function RegistrationSuccessModal({
  isOpen,
  onClose,
  userName,
  userRole,
  registrationDate,
  registrationTime
}: RegistrationSuccessModalProps) {
  if (!isOpen) return null;

  const currentDate = registrationDate || new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = registrationTime || new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ 
        zIndex: 999999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        style={{ zIndex: 999999 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Registration Successful!</h2>
              <p className="text-sm text-gray-600">Welcome to Curtainry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Thank you for registering, {userName}!
            </h3>
            <p className="text-gray-600">
              Your registration as a <span className="font-medium capitalize">{userRole}</span> has been submitted successfully.
            </p>
          </div>

          {/* Registration Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Registration Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{userRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{currentTime}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What&apos;s Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Our team will review your application</li>
              <li>• You will receive an email confirmation within 24 hours</li>
              <li>• We&apos;ll get back to you soon with further instructions</li>
              <li>• Keep an eye on your email for updates</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a href="mailto:support@curtainry.com" className="text-primary hover:text-primary-dark font-medium">
                support@curtainry.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Continue to Login
          </button>
        </div>
      </div>
    </div>
  );
}