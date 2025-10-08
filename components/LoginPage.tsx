"use client";
import React, { useState } from "react";
import { authenticateUser } from "../data/dummyAuth";
import RegistrationSuccessModal from "./RegistrationSuccessModal";

interface User {
  name: string;
  username: string;
  role: 'consultant' | 'fitter';
  location: string;
}

type AuthMode = "login" | "signup";
type UserRole = "fitter" | "consultant";

interface LoginPageProps {
  onLogin: (userData: any, role: 'consultant' | 'fitter') => void;
}

interface RegistrationData {
  name: string;
  dateOfBirth: string;
  photo: File | null;
  location: string;
  username: string;
  password: string;
  confirmPassword: string;
  enrollmentDate: string;
}

const cities = [
  "Bangalore",
  "Chennai", 
  "Mumbai",
  "Ahmedabad",
  "Delhi",
  "Kochi",
  "Hyderabad",
  "Amaravathi"
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("consultant");
  const [currentStep, setCurrentStep] = useState(1);
  const [loginError, setLoginError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: "",
    dateOfBirth: "",
    photo: null,
    location: "",
    username: "",
    password: "",
    confirmPassword: "",
    enrollmentDate: new Date().toLocaleDateString()
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const time = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    return { 
      fullDate: date,
      time: time 
    };
  };

  const handleInputChange = (field: keyof RegistrationData, value: string | File | null) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('photo', file);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setRegisteredUser(null);
    setAuthMode('login'); // Switch back to login mode
    // Reset form data
    setLoginData({ username: '', password: '' });
    setRegistrationData({
      name: "",
      dateOfBirth: "",
      photo: null,
      location: "",
      username: "",
      password: "",
      confirmPassword: "",
      enrollmentDate: new Date().toLocaleDateString()
    });
    setSelectedRole('consultant');
    setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (authMode === "login") {
      // Login logic
      try {
        const user = authenticateUser(loginData.username, loginData.password, selectedRole);
        if (user) {
          const userData = {
            name: user.name,
            username: loginData.username,
            role: selectedRole,
            location: loginData.username === 'raj_consultant' ? 'Bangalore' : 'Chennai'
          };
          onLogin(userData, selectedRole);
        } else {
          setLoginError('Invalid username or password');
        }
      } catch (error) {
        setLoginError('Login failed. Please try again.');
      }
    } else {
      // Registration submission
      console.log('Registration data:', { ...registrationData, role: selectedRole });
      
      const newUser = {
        name: registrationData.name,
        username: registrationData.username,
        role: selectedRole,
        location: registrationData.location
      };
      
      // Store user data and show success modal
      setRegisteredUser(newUser);
      setShowSuccessModal(true);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(registrationData.name && registrationData.dateOfBirth && registrationData.photo);
      case 2:
        return !!(registrationData.location);
      case 3:
        return !!(registrationData.username && registrationData.password && registrationData.confirmPassword && registrationData.password === registrationData.confirmPassword);
      default:
        return false;
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep
                  ? "bg-blue-600 text-white"
                  : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  step < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          value={registrationData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth *
        </label>
        <input
          type="date"
          value={registrationData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profile Photo *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {registrationData.photo && (
          <p className="text-sm text-green-600 mt-1">
            Photo uploaded: {registrationData.photo.name}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City *
        </label>
        <select
          value={registrationData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select your city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username *
        </label>
        <input
          type="text"
          value={registrationData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your username"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          type="password"
          value={registrationData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your password"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <input
          type="password"
          value={registrationData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Confirm your password"
          required
        />
        {registrationData.password && registrationData.confirmPassword && 
         registrationData.password !== registrationData.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Curtainry Specialist
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {authMode === "login" ? "Sign in to your account" : "Create your specialist account"}
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("consultant")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedRole === "consultant"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Consultant
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("fitter")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedRole === "fitter"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Fitter
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {authMode === "login" ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          ) : (
            <div>
              {renderStepIndicator()}
              
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>
          )}

          {loginError && (
            <div className="text-red-600 text-sm text-center">{loginError}</div>
          )}

          <div className="flex flex-col space-y-4">
            {authMode === "signup" && currentStep < 3 ? (
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep)}
                  className={`px-4 py-2 rounded-md ${
                    isStepValid(currentStep)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } ${currentStep === 1 ? "ml-auto" : ""}`}
                >
                  Next
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={authMode === "signup" && !isStepValid(currentStep)}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  authMode === "signup" && !isStepValid(currentStep)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {authMode === "login" ? "Sign in" : "Complete Registration"}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setCurrentStep(1);
                setLoginError('');
              }}
              className="text-blue-600 hover:text-blue-500 text-sm text-center"
            >
              {authMode === "login" 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>

        {/* Demo credentials for testing */}
        {authMode === "login" && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
            <p className="text-xs text-gray-500">Consultant: raj_consultant / password123</p>
            <p className="text-xs text-gray-500">Fitter: kumar_fitter / password123</p>
          </div>
        )}
      </div>

      {/* Registration Success Modal */}
      {showSuccessModal && registeredUser && (
        <RegistrationSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userData={registeredUser}
        />
      )}
    </div>
  );
}