"use client";
import React, { useState } from "react";
import { authenticateUser } from "../lib/auth";
import RegistrationSuccessModal from "./RegistrationSuccessModal";

interface User {
  name: string;
  username: string;
  role: 'consultant' | 'fitter';
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
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  // Get current date and time for auto-detection
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      fullDate: now.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };
  
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: "",
    dateOfBirth: "",
    photo: null,
    location: "",
    username: "",
    password: "",
    confirmPassword: "",
    enrollmentDate: getCurrentDateTime().date
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (authMode === "login") {
      console.log('Login attempt:', {
        username: loginData.username,
        password: loginData.password,
        role: selectedRole
      });
      
      const user = authenticateUser(loginData.username, loginData.password, selectedRole);
      
      console.log('Authentication result:', user);
      
      if (user) {
        console.log('Login successful, calling onLogin with:', user, selectedRole);
        onLogin(user, selectedRole);
      } else {
        setLoginError('Invalid username or password');
      }
    } else {
      // Registration submission
      console.log('Registration data:', { ...registrationData, role: selectedRole });
      
      const newUser = {
        name: registrationData.name,
        username: registrationData.username,
        role: selectedRole,
        location: registrationData.location,
        registrationDate: getCurrentDateTime().fullDate,
        registrationTime: getCurrentDateTime().time
      };
      
      // Store user data and show success modal
      setRegisteredUser(newUser);
      setShowSuccessModal(true);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (authMode === "signup" && currentStep > 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Curtainry Team
            </h2>
            <p className="text-gray-600">
              Step {currentStep} of 3 - Complete your profile
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={registrationData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={registrationData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Photo *
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {registrationData.photo ? (
                        <img
                          src={URL.createObjectURL(registrationData.photo)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-2xl">📷</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload a clear photo of yourself</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <select
                    required
                    value={registrationData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select your city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Choose a unique username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={registrationData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Create a strong password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={registrationData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Registration Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Role:</span> {selectedRole === 'consultant' ? 'Curtain Consultant' : 'Curtain Fitter'}</p>
                    <p><span className="font-medium">Name:</span> {registrationData.name}</p>
                    <p><span className="font-medium">Location:</span> {registrationData.location}</p>
                    <p><span className="font-medium">Enrollment Date:</span> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-between pt-4">
              {currentStep > 2 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Complete Registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center p-8">
        <div className="text-center text-white space-y-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-3xl">C</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold">Curtainry</h1>
              <p className="text-blue-100">Specialist Network</p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h2 className="text-3xl font-bold">Join Our Professional Network</h2>
            <p className="text-blue-100 text-lg">
              Connect with customers, manage appointments, track earnings, and be part of our comprehensive curtain services platform.
            </p>
            
            <div className="grid gap-4 text-left">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">👔 Curtain Consultants</h3>
                <p className="text-blue-100 text-sm">Provide expert design consultations and recommendations</p>
              </div>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold mb-2">🔧 Curtain Fitters</h3>
                <p className="text-blue-100 text-sm">Professional installation and maintenance services</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Curtainry</h1>
            <p className="text-gray-600">Specialist Network</p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {authMode === "login" ? "Welcome Back" : "Join Our Team"}
            </h2>
            <p className="text-gray-600">
              {authMode === "login" ? "Sign in to your specialist account" : "Start your professional journey"}
            </p>
          </div>
          
          <form onSubmit={authMode === "signup" ? (e) => { e.preventDefault(); setCurrentStep(2); } : handleSubmit} className="space-y-6">
            {authMode === "login" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="consultant">Curtain Consultant</option>
                    <option value="fitter">Curtain Fitter</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>
                
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">{loginError}</p>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="font-medium text-blue-900 mb-2">Demo Login Credentials:</p>
                  <p className="text-blue-700"><strong>Consultant:</strong> raj_consultant / password123</p>
                  <p className="text-blue-700"><strong>Fitter:</strong> kumar_fitter / password123</p>
                </div>
              </>
            )}
            
            {authMode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialist Role *
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="consultant">Curtain Consultant</option>
                    <option value="fitter">Curtain Fitter</option>
                  </select>
                </div>
              </>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              {authMode === "login" ? "Sign In" : "Continue Registration"}
            </button>
          </form>
          
          <div className="text-center">
            <p className="text-gray-600">
              {authMode === "login" ? "New to Curtainry?" : "Already part of our team?"}
            </p>
            <button
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setCurrentStep(1);
                setLoginError('');
              }}
              className="text-blue-600 font-semibold hover:underline mt-1"
            >
              {authMode === "login" ? "Join Our Team" : "Sign In"}
            </button>
          </div>
        </div>
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