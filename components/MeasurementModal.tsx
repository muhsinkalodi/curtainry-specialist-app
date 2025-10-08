'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Trash2, Ruler, Copy, Check } from 'lucide-react';
import { roomTypes, addRoomToOrder } from '../data/dummyAuth';

interface WindowMeasurement {
  id: string;
  width: string;
  height: string;
  sameAsPrevious: boolean;
}

interface MeasurementModalProps {
  order: any;
  onClose: () => void;
  onSave: (roomData: any) => void;
}

export default function MeasurementModal({ order, onClose, onSave }: MeasurementModalProps) {
  const [formData, setFormData] = useState({
    roomType: '',
    numberOfWindows: '1',
    curtainSerial: order?.catalogDetails?.serialNumber || `CURT-${order?.id || 'AUTO'}`,
    notes: ''
  });

  const [windows, setWindows] = useState<WindowMeasurement[]>([
    { id: '1', width: '', height: '', sameAsPrevious: false }
  ]);

  const [errors, setErrors] = useState<any>({});

  // Update number of windows when field changes
  useEffect(() => {
    const numWindows = parseInt(formData.numberOfWindows) || 1;
    const currentWindowsCount = windows.length;

    if (numWindows > currentWindowsCount) {
      // Add new windows
      const newWindows = [];
      for (let i = currentWindowsCount; i < numWindows; i++) {
        newWindows.push({
          id: (i + 1).toString(),
          width: '',
          height: '',
          sameAsPrevious: i > 0
        });
      }
      setWindows(prev => [...prev, ...newWindows]);
    } else if (numWindows < currentWindowsCount) {
      // Remove extra windows
      setWindows(prev => prev.slice(0, numWindows));
    }
  }, [formData.numberOfWindows]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const handleWindowChange = (windowId: string, field: keyof WindowMeasurement, value: string | boolean) => {
    setWindows(prev => prev.map(window => {
      if (window.id === windowId) {
        const updatedWindow = { ...window, [field]: value };
        
        // If "same as previous" is checked, copy measurements from previous window
        if (field === 'sameAsPrevious' && value === true) {
          const windowIndex = prev.findIndex(w => w.id === windowId);
          if (windowIndex > 0) {
            const previousWindow = prev[windowIndex - 1];
            updatedWindow.width = previousWindow.width;
            updatedWindow.height = previousWindow.height;
          }
        }
        
        return updatedWindow;
      }
      return window;
    }));

    // Clear window-specific errors
    const errorKey = `window_${windowId}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev: any) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.roomType) {
      newErrors.roomType = 'Room type is required';
    }

    if (!formData.numberOfWindows || parseInt(formData.numberOfWindows) <= 0) {
      newErrors.numberOfWindows = 'Valid number of windows is required';
    }

    if (!formData.curtainSerial) {
      newErrors.curtainSerial = 'Serial number is required';
    }

    // Validate each window
    windows.forEach((window, index) => {
      if (!window.sameAsPrevious || index === 0) {
        if (!window.width || parseFloat(window.width) <= 0) {
          newErrors[`window_${window.id}_width`] = `Width required for window ${index + 1}`;
        }
        if (!window.height || parseFloat(window.height) <= 0) {
          newErrors[`window_${window.id}_height`] = `Height required for window ${index + 1}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalArea = () => {
    return windows.reduce((total, window) => {
      const width = parseFloat(window.width) || 0;
      const height = parseFloat(window.height) || 0;
      return total + (width * height);
    }, 0).toFixed(2);
  };

  const calculateEstimatedCost = () => {
    const totalArea = parseFloat(calculateTotalArea()) || 0;
    const pricePerMeter = order?.catalogDetails?.pricePerMeter || 150; // Default price
    return (totalArea * pricePerMeter).toFixed(0);
  };

  const handleSave = () => {
    if (validateForm()) {
      const measurementData = {
        roomType: formData.roomType,
        numberOfWindows: parseInt(formData.numberOfWindows),
        windows: windows.map((window, index) => ({
          windowNumber: index + 1,
          width: parseFloat(window.width),
          height: parseFloat(window.height),
          area: parseFloat(window.width) * parseFloat(window.height),
          sameAsPrevious: window.sameAsPrevious && index > 0
        })),
        curtainSerial: formData.curtainSerial,
        notes: formData.notes,
        measuredAt: new Date().toISOString(),
        totalArea: parseFloat(calculateTotalArea()),
        estimatedCost: parseFloat(calculateEstimatedCost())
      };

      // Prepare room data for the order
      const roomDataForOrder = {
        id: Date.now().toString(),
        name: `${formData.roomType} - ${order.customerName}`,
        type: formData.roomType,
        measurements: measurementData,
        details: measurementData
      };

      // Add to order
      addRoomToOrder(order.id, roomDataForOrder);
      onSave(measurementData);
    }
  };

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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 999999 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Room Measurement</h2>
            <p className="text-sm text-gray-600">Order #{order.id} - {order.customerName}</p>
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
          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type *
            </label>
            <select
              value={formData.roomType}
              onChange={(e) => handleInputChange('roomType', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.roomType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select room type</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.roomType && (
              <p className="mt-1 text-sm text-red-600">{errors.roomType}</p>
            )}
          </div>

          {/* Number of Windows */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Windows in this Room *
            </label>
            <input
              type="number"
              min="1"
              max="10"
              placeholder="1"
              value={formData.numberOfWindows}
              onChange={(e) => handleInputChange('numberOfWindows', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.numberOfWindows ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.numberOfWindows && (
              <p className="mt-1 text-sm text-red-600">{errors.numberOfWindows}</p>
            )}
          </div>

          {/* Window Measurements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Window Measurements</h3>
            <div className="space-y-4">
              {windows.map((window, index) => (
                <div key={window.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Window {index + 1}</h4>
                    {index > 0 && (
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={window.sameAsPrevious}
                          onChange={(e) => handleWindowChange(window.id, 'sameAsPrevious', e.target.checked)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600">Same as previous window</span>
                        <Copy size={14} className="text-gray-400" />
                      </label>
                    )}
                  </div>

                  {(!window.sameAsPrevious || index === 0) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Width (feet) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="8.5"
                          value={window.width}
                          onChange={(e) => handleWindowChange(window.id, 'width', e.target.value)}
                          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`window_${window.id}_width`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors[`window_${window.id}_width`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`window_${window.id}_width`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Height (feet) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="7.0"
                          value={window.height}
                          onChange={(e) => handleWindowChange(window.id, 'height', e.target.value)}
                          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`window_${window.id}_height`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors[`window_${window.id}_height`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`window_${window.id}_height`]}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {window.sameAsPrevious && index > 0 && (
                    <div className="bg-blue-50 rounded p-3 text-sm text-blue-700 flex items-center space-x-2">
                      <Check size={16} />
                      <span>Using same measurements as Window {index}: {window.width}' × {window.height}'</span>
                    </div>
                  )}

                  {/* Window Area */}
                  {window.width && window.height && (
                    <div className="mt-3 bg-gray-50 rounded p-2">
                      <div className="flex items-center space-x-2">
                        <Ruler size={14} className="text-gray-600" />
                        <span className="text-sm text-gray-600">
                          Area: <strong>{(parseFloat(window.width) * parseFloat(window.height)).toFixed(2)} sq ft</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Area Calculation */}
          {windows.some(w => w.width && w.height) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Ruler size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Coverage Area</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{calculateTotalArea()} sq ft</p>
              <p className="text-sm text-blue-700">{windows.length} window(s) in {formData.roomType}</p>
            </div>
          )}

          {/* Curtain Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curtain Serial Number *
            </label>
            <input
              type="text"
              placeholder="Auto-detected from order"
              value={formData.curtainSerial}
              onChange={(e) => handleInputChange('curtainSerial', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.curtainSerial ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.curtainSerial && (
              <p className="mt-1 text-sm text-red-600">{errors.curtainSerial}</p>
            )}
          </div>

          {/* Cost Estimation */}
          {windows.some(w => w.width && w.height) && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Estimated Cost</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p>Total Area: {calculateTotalArea()} sq ft</p>
                <p>Price per sq ft: ₹{order?.catalogDetails?.pricePerMeter || 150}</p>
                <p>Number of Windows: {windows.length}</p>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <p className="text-lg font-bold text-green-900">
                    Total: ₹{calculateEstimatedCost()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Measurement Summary */}
          {formData.roomType && windows.some(w => w.width && w.height) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Measurement Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Room Type:</p>
                    <p className="font-medium">{formData.roomType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Number of Windows:</p>
                    <p className="font-medium">{windows.length}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Window Details:</p>
                  {windows.map((window, index) => (
                    <div key={window.id} className="text-xs bg-white rounded p-2 mb-1">
                      Window {index + 1}: {window.width}' × {window.height}' 
                      {window.sameAsPrevious && index > 0 && <span className="text-blue-600"> (same as previous)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any special requirements, observations, or customer preferences..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Save size={16} />
            <span>Save Measurement</span>
          </button>
        </div>
      </div>
    </div>
  );
}