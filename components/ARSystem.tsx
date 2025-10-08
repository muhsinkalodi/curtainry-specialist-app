'use client';

import React from 'react';
import { Smartphone, Camera, Eye, Sparkles, Zap, Clock, ArrowRight, Construction, Wrench } from 'lucide-react';

interface ARSystemProps {
  userType: 'consultant' | 'fitter';
}

const ARSystem: React.FC<ARSystemProps> = ({ userType }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Coming Soon Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-purple-200">
            <Smartphone className="text-purple-600" size={24} />
            <span className="text-lg font-semibold text-purple-800">AR Technology</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Revolutionary AR technology for curtain visualization and measurement is under development.
          </p>

          {/* Construction Animation */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="animate-bounce">
              <Construction className="text-orange-500" size={32} />
            </div>
            <div className="animate-pulse">
              <Wrench className="text-blue-500" size={28} />
            </div>
            <div className="animate-bounce delay-100">
              <Construction className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/40">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What&apos;s Coming</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-white/40 rounded-lg">
              <div className="bg-purple-100 p-3 rounded-full">
                <Camera className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Virtual Room Scan</h3>
                <p className="text-gray-600 text-sm">Scan customer rooms with AR to visualize curtain placements instantly</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/40 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <Eye className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Preview</h3>
                <p className="text-gray-600 text-sm">Show customers exactly how different curtains will look in their space</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/40 rounded-lg">
              <div className="bg-green-100 p-3 rounded-full">
                <Sparkles className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Style Matching</h3>
                <p className="text-gray-600 text-sm">AI-powered recommendations based on room decor and lighting</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-white/40 rounded-lg">
              <div className="bg-orange-100 p-3 rounded-full">
                <Zap className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Measurements</h3>
                <p className="text-gray-600 text-sm">Accurate measurements using AR technology for perfect fitting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="text-white" size={24} />
            <h2 className="text-2xl font-bold">Development Timeline</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Phase 1</h3>
              <p className="text-sm opacity-90">Basic AR scanning functionality</p>
              <p className="text-xs opacity-75 mt-2">Q1 2025</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Phase 2</h3>
              <p className="text-sm opacity-90">Real-time curtain visualization</p>
              <p className="text-xs opacity-75 mt-2">Q2 2025</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Phase 3</h3>
              <p className="text-sm opacity-90">AI recommendations & full integration</p>
              <p className="text-xs opacity-75 mt-2">Q3 2025</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Stay tuned for revolutionary AR technology that will transform how customers experience curtain shopping!
          </p>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium">
            <span>Feature in Development</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARSystem;