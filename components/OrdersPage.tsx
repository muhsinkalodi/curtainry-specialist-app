'use client';

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, User, Eye, CheckCircle, XCircle, AlertCircle, Plus, Filter, Calendar, ArrowLeft, Building, UserCircle } from 'lucide-react';
import { getOrdersForUser, updateOrderStatus, addRoomToOrder } from '../data/dummyAuth';
import MeasurementModal from './MeasurementModal';
import MeasurementDisplay from './MeasurementDisplay';
import ConfirmationModal from './ConfirmationModal';
import { SessionManager } from '../utils/sessionManager';

interface OrdersPageProps {
  userRole: 'consultant' | 'fitter';
  userData: any;
}

export default function OrdersPage({ userRole, userData }: OrdersPageProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<{ action: string; orderId: string } | null>(null);
  const [filter, setFilter] = useState('accepted'); // Default to 'accepted' as per requirements
  const [orderTypeFilter, setOrderTypeFilter] = useState('all'); // 'all', 'customer', 'admin'
  const [dateFilter, setDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visitedOrders, setVisitedOrders] = useState<Set<string>>(new Set()); // Track visited orders

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getOrdersForUser(userData?.id || '1', userRole);
        setOrders(userOrders);
        
        // Save session data (with error handling)
        try {
          SessionManager.saveSession(userRole, userData?.id || '1', '/orders');
        } catch (sessionError) {
          console.warn('Session management not available:', sessionError);
          // Continue without session management - it's not critical for functionality
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    
    fetchOrders();

    // Handle browser back button
    const handleBackButton = () => {
      if (showFullDetails) {
        setShowFullDetails(false);
        setSelectedOrder(null);
      }
    };

    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [userData, userRole, showFullDetails]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getOrdersForUser(userData?.id || '1', userRole);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    
    fetchOrders();
  }, [userRole, userData]);

  const handleOrderAction = (orderId: string, action: string) => {
    setConfirmationAction({ action, orderId });
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    if (!confirmationAction) return;
    
    const { action, orderId } = confirmationAction;
    let newStatus = '';
    
    switch (action) {
      case 'accept':
        newStatus = 'accepted';
        break;
      case 'reject':
        newStatus = 'cancelled';
        break;
      case 'visit':
        newStatus = 'in_progress';
        // Track that this order has been visited
        setVisitedOrders(prev => new Set(prev).add(orderId));
        break;
      case 'complete':
        newStatus = 'completed';
        break;
      default:
        return;
    }

    try {
      const result = await updateOrderStatus(orderId, newStatus as any);
      if (result) {
        const userOrders = await getOrdersForUser(userData.id, userRole);
        setOrders(userOrders);
        setShowConfirmation(false);
        setConfirmationAction(null);
        
        // If this was a visit action, automatically open the details for the updated order
        if (action === 'visit') {
          const updatedOrder = userOrders.find(order => order.id === orderId);
          if (updatedOrder) {
            setSelectedOrder(updatedOrder);
          }
        }
      }
    } catch (error) {
      // In a real app, show user-friendly error message
      setShowConfirmation(false);
      setConfirmationAction(null);
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filter === 'accepted') {
      // Show only pending, in_progress, and completed for accepted filter
      filtered = filtered.filter(order => 
        order.status === 'pending' || 
        order.status === 'accepted' || 
        order.status === 'in_progress' || 
        order.status === 'completed'
      );
    } else if (filter === 'in_progress') {
      filtered = filtered.filter(order => order.status === 'in_progress');
    } else {
      filtered = filtered.filter(order => order.status === filter);
    }

    // Filter by order type (customer/admin)
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(order => {
        const orderType = order.orderType || order.type;
        if (orderTypeFilter === 'customer') {
          return orderType !== 'admin';
        } else if (orderTypeFilter === 'admin') {
          return orderType === 'admin';
        }
        return true;
      });
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.scheduledDate);
        const filterDate = new Date(dateFilter);
        return orderDate.toDateString() === filterDate.toDateString();
      });
    }

    return filtered;
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Action Required';
      case 'accepted':
        return 'In Progress';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800';
      case 'accepted':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestSource = (orderType: string) => {
    return orderType === 'admin' ? 'Admin Request' : 'Customer Order';
  };

  const openFullDetails = (order: any) => {
    setSelectedOrder(order);
    setShowFullDetails(true);
    
    // Update session and browser history
    SessionManager.updateRoute(`/orders/${order.id}`);
    window.history.pushState({ orderId: order.id }, '', `/orders/${order.id}`);
  };

  const openMeasurementModal = (order: any) => {
    setSelectedOrder(order);
    setShowMeasurementModal(true);
  };

  const filteredOrders = getFilteredOrders();

  if (showFullDetails && selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowFullDetails(false);
                  setSelectedOrder(null);
                  try {
                    SessionManager.updateRoute('/orders');
                    window.history.pushState({}, '', '/orders');
                  } catch (error) {
                    console.warn('Session/history management failed:', error);
                    // Continue without session management
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Order Details</h1>
                <p className="text-sm text-gray-600">Order #{selectedOrder.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Order Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">#{selectedOrder.id}</h2>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getDisplayStatus(selectedOrder.status)}
                  </span>
                  <span className="flex items-center space-x-1 text-sm text-gray-600">
                    {selectedOrder.orderType === 'admin' ? <Building size={16} /> : <UserCircle size={16} />}
                    <span>{getRequestSource(selectedOrder.orderType || selectedOrder.type)}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">₹{selectedOrder.amount}</p>
                <p className="text-sm text-gray-600">{selectedOrder.type}</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Scheduled Date</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.scheduledDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.scheduledTime}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3 mb-6">
              <MapPin size={20} className="text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{selectedOrder.location}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Description</h3>
              <p className="text-gray-700 leading-relaxed">{selectedOrder.description}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Contact Number</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customerPhone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-semibold text-gray-900">{selectedOrder.location}</p>
              </div>
            </div>
          </div>

          {/* Curtain Details - Only show if catalogDetails exists */}
          {selectedOrder.catalogDetails && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Curtain Details</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">{selectedOrder.catalogDetails.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-blue-600 font-medium">Serial:</span>
                    <p className="text-blue-700">{selectedOrder.catalogDetails.serialNumber}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Composition:</span>
                    <p className="text-blue-700">{selectedOrder.catalogDetails.composition}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Color:</span>
                    <p className="text-blue-700">{selectedOrder.catalogDetails.color}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Pattern:</span>
                    <p className="text-blue-700">{selectedOrder.catalogDetails.pattern}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Price/Meter:</span>
                    <p className="text-blue-700">₹{selectedOrder.catalogDetails.pricePerMeter}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">Manufacturer:</span>
                      <p className="text-blue-700">{selectedOrder.catalogDetails.manufacturer}</p>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">Retailer:</span>
                      <p className="text-blue-700">{selectedOrder.catalogDetails.retailer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Room Measurements - Show measurements using the dedicated component - Only for consultants */}
          {userRole === 'consultant' && (
            <MeasurementDisplay 
              rooms={selectedOrder.rooms || []}
              orderDetails={selectedOrder}
            />
          )}          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Pending Orders - Show Accept/Reject for both consultant and fitter */}
              {selectedOrder.status === 'pending' && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setConfirmationAction({ action: 'accept', orderId: selectedOrder.id });
                      setShowConfirmation(true);
                    }}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle size={18} />
                    <span>Accept Order</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setConfirmationAction({ action: 'reject', orderId: selectedOrder.id });
                      setShowConfirmation(true);
                    }}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircle size={18} />
                    <span>Reject Order</span>
                  </button>
                </>
              )}

              {/* Accepted Orders - Show Visit Site button for both roles */}
              {selectedOrder.status === 'accepted' && !visitedOrders.has(selectedOrder.id) && (
                <button
                  onClick={() => {
                    setConfirmationAction({ action: 'visit', orderId: selectedOrder.id });
                    setShowConfirmation(true);
                  }}
                  className="w-full sm:col-span-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye size={18} />
                  <span>Visit Site</span>
                </button>
              )}

              {/* Consultant - After Visit - Show Add Measurement and Complete buttons */}
              {(selectedOrder.status === 'in_progress' || (selectedOrder.status === 'accepted' && visitedOrders.has(selectedOrder.id))) && userRole === 'consultant' && (
                <>
                  <button
                    onClick={() => openMeasurementModal(selectedOrder)}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>Add Measurement</span>
                  </button>
                  <button
                    onClick={() => {
                      setConfirmationAction({ action: 'complete', orderId: selectedOrder.id });
                      setShowConfirmation(true);
                    }}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle size={18} />
                    <span>Complete Order</span>
                  </button>
                </>
              )}

              {/* Fitter - After Visit - Show only Complete button (no measurement needed) */}
              {(selectedOrder.status === 'in_progress' || (selectedOrder.status === 'accepted' && visitedOrders.has(selectedOrder.id))) && userRole === 'fitter' && (
                <button
                  onClick={() => {
                    setConfirmationAction({ action: 'complete', orderId: selectedOrder.id });
                    setShowConfirmation(true);
                  }}
                  className="w-full sm:col-span-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={18} />
                  <span>Complete Order</span>
                </button>
              )}

              {/* Rejected Orders - Show status */}
              {selectedOrder.status === 'cancelled' && (
                <div className="w-full sm:col-span-2 px-6 py-3 bg-red-100 text-red-800 rounded-lg font-medium flex items-center justify-center space-x-2 border border-red-200">
                  <XCircle size={18} />
                  <span>Order Rejected</span>
                </div>
              )}

              {/* Completed Orders - Show status */}
              {selectedOrder.status === 'completed' && (
                <div className="w-full sm:col-span-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium flex items-center justify-center space-x-2 border border-green-200">
                  <CheckCircle size={18} />
                  <span>Order Completed</span>
                </div>
              )}
              
            </div>
          </div>
        </div>
        
        {/* Confirmation Modal for detailed view */}
        <ConfirmationModal
          isOpen={showConfirmation}
          message={confirmationAction ? `Are you sure you want to ${confirmationAction.action.replace('_', ' ')} order #${confirmationAction.orderId}?` : ''}
          onConfirm={confirmAction}
          onCancel={() => {
            setShowConfirmation(false);
            setConfirmationAction(null);
          }}
          confirmButtonColor={confirmationAction?.action === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'}
        />
        
        {/* Measurement Modal for detailed view - Only for consultants */}
        {userRole === 'consultant' && showMeasurementModal && selectedOrder && (
          <MeasurementModal
            order={selectedOrder}
            onClose={() => setShowMeasurementModal(false)}
            onSave={async (roomData: any) => {
              try {
                const success = await addRoomToOrder(selectedOrder.id, roomData);
                if (success) {
                  // Refresh orders to show updated data
                  const userOrders = await getOrdersForUser(userData.id, userRole);
                  setOrders(userOrders);
                  
                  // Update the selected order to reflect the new room data
                  const updatedOrder = userOrders.find(order => order.id === selectedOrder.id);
                  if (updatedOrder) {
                    setSelectedOrder(updatedOrder);
                  }
                  
                  setShowMeasurementModal(false);
                }
              } catch (error) {
                console.error('Failed to save measurement:', error);
                // In a real app, show user-friendly error message
                setShowMeasurementModal(false);
              }
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h2>
        <p className="text-gray-600">
          {userRole === 'consultant' 
            ? 'Manage customer consultations and measurements' 
            : 'Handle curtain installations and fittings'
          }
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4 mb-6">
        {/* Status Filters */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {[
            { key: 'accepted', label: 'Active Orders' },
            { key: 'pending', label: 'New Requests' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Order Type Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Order Type:</label>
            <select
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="customer">Customer Orders</option>
              <option value="admin">Admin Orders</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Scheduled Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-gray-400 hover:text-gray-600"
                title="Clear date filter"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>

          {/* Clear All Filters */}
          {(orderTypeFilter !== 'all' || dateFilter) && (
            <button
              onClick={() => {
                setOrderTypeFilter('all');
                setDateFilter('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {filter === 'accepted' 
                ? 'No active orders at the moment.' 
                : filter === 'pending'
                ? 'No new requests available.'
                : 'No completed orders yet.'
              }
            </p>
          </div>
        ) : (
          filteredOrders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getDisplayStatus(order.status)}
                    </span>
                    <span className="flex items-center space-x-1 text-xs text-gray-600">
                      {order.orderType === 'admin' ? <Building size={12} /> : <UserCircle size={12} />}
                      <span>{getRequestSource(order.orderType || order.type)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{order.scheduledDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{order.scheduledTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700">{order.customerPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-700">{order.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => openFullDetails(order)}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Measurement Modal - Only for consultants */}
      {userRole === 'consultant' && showMeasurementModal && selectedOrder && (
        <MeasurementModal
          order={selectedOrder}
          onClose={() => setShowMeasurementModal(false)}
          onSave={async (roomData: any) => {
            try {
              const success = await addRoomToOrder(selectedOrder.id, roomData);
              if (success) {
                // Refresh orders to show updated data
                const userOrders = await getOrdersForUser(userData.id, userRole);
                setOrders(userOrders);
                
                // Update the selected order to reflect the new room data
                const updatedOrder = userOrders.find(order => order.id === selectedOrder.id);
                if (updatedOrder) {
                  setSelectedOrder(updatedOrder);
                }
                
                setShowMeasurementModal(false);
              }
            } catch (error) {
              console.error('Failed to save measurement:', error);
              // In a real app, show user-friendly error message
              setShowMeasurementModal(false);
            }
          }}
        />
      )}
      
      {/* Confirmation Modal for list view */}
      <ConfirmationModal
        isOpen={showConfirmation}
        message={confirmationAction ? `Are you sure you want to ${confirmationAction.action.replace('_', ' ')} order #${confirmationAction.orderId}?` : ''}
        onConfirm={confirmAction}
        onCancel={() => {
          setShowConfirmation(false);
          setConfirmationAction(null);
        }}
        confirmButtonColor={confirmationAction?.action === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'}
      />
    </div>
  );
}