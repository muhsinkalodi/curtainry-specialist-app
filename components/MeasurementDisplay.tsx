'use client';

import React from 'react';
import { Ruler, Calendar, FileText, MapPin } from 'lucide-react';

interface WindowMeasurement {
  windowNumber: number;
  width: number;
  height: number;
  area: number;
  sameAsPrevious?: boolean;
}

interface RoomMeasurement {
  roomType: string;
  numberOfWindows: number;
  windows: WindowMeasurement[];
  curtainSerial: string;
  notes: string;
  measuredAt: string;
  totalArea: number;
  estimatedCost: number;
}

interface Room {
  id: string;
  name: string;
  type: string;
  measurements: RoomMeasurement;
  details: any;
}

interface MeasurementDisplayProps {
  rooms: Room[];
  orderDetails?: any;
}

export default function MeasurementDisplay({ rooms, orderDetails }: MeasurementDisplayProps) {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Measurements</h3>
        <div className="text-center py-8">
          <Ruler size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No measurements recorded yet</p>
          <p className="text-sm text-gray-400 mt-1">Add measurements using the "Add Measurement" button</p>
        </div>
      </div>
    );
  }

  const getTotalArea = () => {
    return rooms.reduce((total, room) => total + (room.measurements?.totalArea || 0), 0).toFixed(2);
  };

  const getTotalCost = () => {
    return rooms.reduce((total, room) => total + (room.measurements?.estimatedCost || 0), 0);
  };

  const getTotalWindows = () => {
    return rooms.reduce((total, room) => total + (room.measurements?.numberOfWindows || 0), 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Room Measurements</h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">{rooms.length} Room(s) Measured</p>
          <p className="text-sm text-gray-600">{getTotalWindows()} Total Windows</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Ruler size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Area</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{getTotalArea()} sq ft</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-bold text-lg">₹</span>
            <span className="text-sm font-medium text-green-900">Total Cost</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">₹{getTotalCost()}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MapPin size={20} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Rooms</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">{rooms.length}</p>
        </div>
      </div>

      {/* Individual Room Details */}
      <div className="space-y-6">
        {rooms.map((room, index) => (
          <div key={room.id || index} className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{room.type}</h4>
                <p className="text-sm text-gray-600">{room.name}</p>
              </div>
              <div className="text-right">
                {room.measurements?.measuredAt && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(room.measurements.measuredAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            {room.measurements && (
              <div className="space-y-4">
                {/* Serial Number */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-600">Serial:</span>
                  <span className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
                    {room.measurements.curtainSerial}
                  </span>
                </div>

                {/* Windows Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      {room.measurements.numberOfWindows} Window(s) in this room
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {room.measurements.totalArea} sq ft
                    </span>
                  </div>
                  
                  {/* Individual Windows */}
                  {room.measurements.windows && room.measurements.windows.length > 0 && (
                    <div className="space-y-2">
                      {room.measurements.windows.map((window, windowIndex) => (
                        <div key={windowIndex} className="flex justify-between items-center bg-white rounded p-3 text-sm">
                          <span className="text-gray-600 font-medium">Window {window.windowNumber}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-700">
                              {window.width}' × {window.height}'
                            </span>
                            <span className="text-blue-600 font-medium">
                              {window.area.toFixed(2)} sq ft
                            </span>
                            {window.sameAsPrevious && (
                              <span className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded">
                                Same as previous
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cost Estimation */}
                {room.measurements.estimatedCost && (
                  <div className="flex justify-between items-center py-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Room Cost:</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{room.measurements.estimatedCost}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {room.measurements.notes && (
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-start space-x-2">
                      <FileText size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Notes:</span>
                        <p className="text-sm text-gray-600 mt-1 italic">{room.measurements.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Summary */}
      {rooms.length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Complete House Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Rooms:</p>
                <p className="font-bold text-gray-900">{rooms.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Windows:</p>
                <p className="font-bold text-gray-900">{getTotalWindows()}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Area:</p>
                <p className="font-bold text-blue-600">{getTotalArea()} sq ft</p>
              </div>
              <div>
                <p className="text-gray-600">Total Cost:</p>
                <p className="font-bold text-green-600">₹{getTotalCost()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}