// Mock authentication and data functions for the Curtainry specialist app

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'consultant' | 'fitter';
  avatar?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  type: string;
  orderType?: string;
  amount: number;
  date: string;
  scheduledDate?: string;
  scheduledTime?: string;
  location: string;
  customerPhone?: string;
  description?: string;
  catalogDetails?: {
    title: string;
    serialNumber: string;
    composition: string;
    color: string;
    pattern: string;
    pricePerMeter: number;
    manufacturer: string;
    retailer: string;
  };
  rooms?: any[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  measurements: {
    width: number;
    height: number;
    depth?: number;
  };
}

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@curtainry.com',
    role: 'consultant'
  },
  {
    id: '2', 
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@curtainry.com',
    role: 'fitter'
  }
];

// Mock orders database
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    customerName: 'John Smith',
    status: 'pending',
    type: 'consultation',
    orderType: 'premium',
    amount: 1250,
    date: '2025-10-08',
    scheduledDate: '2025-10-10',
    scheduledTime: '10:00 AM',
    location: 'Downtown, Bangalore',
    customerPhone: '+91 98765 43210',
    description: 'Living room curtain consultation for luxury apartment',
    catalogDetails: {
      title: 'Premium Silk Curtains - Royal Collection',
      serialNumber: 'SILK-RC-001',
      composition: '100% Pure Silk',
      color: 'Deep Burgundy',
      pattern: 'Classic Floral',
      pricePerMeter: 180,
      manufacturer: 'Luxury Textiles Co.',
      retailer: 'Curtainry Premium Store'
    }
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-002', 
    customerName: 'Sarah Johnson',
    status: 'accepted',
    type: 'installation',
    orderType: 'standard',
    amount: 2500,
    date: '2025-10-07',
    scheduledDate: '2025-10-09',
    scheduledTime: '2:00 PM',
    location: 'Suburbs, Chennai',
    customerPhone: '+91 87654 32109',
    description: 'Bedroom curtain installation for 2BHK apartment',
    catalogDetails: {
      title: 'Cotton Blend Curtains - Modern Series',
      serialNumber: 'COTT-MS-025',
      composition: '70% Cotton, 30% Polyester',
      color: 'Soft Beige',
      pattern: 'Geometric',
      pricePerMeter: 120,
      manufacturer: 'Modern Home Textiles',
      retailer: 'Curtainry Standard Store'
    }
  },
  {
    id: 'ORD-003',
    customerId: 'CUST-003',
    customerName: 'Rajesh Kumar',
    status: 'in_progress',
    type: 'repair',
    orderType: 'urgent',
    amount: 800,
    date: '2025-10-06',
    scheduledDate: '2025-10-08',
    scheduledTime: '4:00 PM',
    location: 'IT Park, Hyderabad',
    customerPhone: '+91 76543 21098',
    description: 'Curtain rod repair and adjustment',
    catalogDetails: {
      title: 'Blackout Curtains - Professional Series',
      serialNumber: 'BLCK-PS-012',
      composition: '100% Polyester with Blackout Coating',
      color: 'Charcoal Gray',
      pattern: 'Solid',
      pricePerMeter: 95,
      manufacturer: 'Professional Interiors Ltd.',
      retailer: 'Curtainry Business Store'
    }
  },
  {
    id: 'ORD-004',
    customerId: 'CUST-004',
    customerName: 'Priya Sharma',
    status: 'completed',
    type: 'measurement',
    orderType: 'standard',
    amount: 500,
    date: '2025-10-05',
    scheduledDate: '2025-10-07',
    scheduledTime: '11:00 AM',
    location: 'MG Road, Mumbai',
    customerPhone: '+91 65432 10987',
    description: 'Window measurement for custom curtains',
    catalogDetails: {
      title: 'Linen Curtains - Natural Collection',
      serialNumber: 'LINN-NC-008',
      composition: '100% Natural Linen',
      color: 'Ivory White',
      pattern: 'Textured Plain',
      pricePerMeter: 150,
      manufacturer: 'Natural Fabrics Co.',
      retailer: 'Curtainry Eco Store'
    }
  },
  {
    id: 'ORD-005',
    customerId: 'CUST-005',
    customerName: 'Amit Patel',
    status: 'pending',
    type: 'consultation',
    orderType: 'admin',
    amount: 1800,
    date: '2025-10-08',
    scheduledDate: '2025-10-11',
    scheduledTime: '9:00 AM',
    location: 'Corporate Office, Delhi',
    customerPhone: '+91 54321 09876',
    description: 'Office space curtain consultation and design',
    catalogDetails: {
      title: 'Commercial Grade Curtains - Executive Series',
      serialNumber: 'COMM-ES-003',
      composition: 'Fire-Retardant Polyester Blend',
      color: 'Corporate Blue',
      pattern: 'Pinstripe',
      pricePerMeter: 200,
      manufacturer: 'Corporate Interiors Group',
      retailer: 'Curtainry Commercial Division'
    }
  }
];

// Room types for measurements
export const roomTypes = [
  'Living Room',
  'Master Bedroom',
  'Bedroom 1',
  'Bedroom 2', 
  'Bedroom 3',
  'Guest Bedroom',
  'Children\'s Room',
  'Baby Room/Nursery',
  'Kitchen',
  'Dining Room',
  'Family Room',
  'Drawing Room',
  'Study Room/Office',
  'Home Office',
  'Library',
  'Prayer Room/Pooja Room',
  'Bathroom',
  'Master Bathroom',
  'Guest Bathroom',
  'Powder Room',
  'Balcony',
  'Terrace',
  'Patio',
  'Staircase',
  'Hallway/Corridor',
  'Entrance/Foyer',
  'Utility Room',
  'Laundry Room',
  'Storage Room',
  'Basement',
  'Attic',
  'Garage',
  'Guest Room',
  'Entertainment Room',
  'Game Room',
  'Gym/Exercise Room',
  'Music Room',
  'Art Studio',
  'Workshop',
  'Other'
];

// Mock authentication function
export const authenticateUser = (username: string, password: string, role: 'consultant' | 'fitter'): User | null => {
  // Mock authentication logic - check username and role
  if (role === 'consultant' && username === 'raj_consultant' && password === 'password123') {
    return {
      id: '1',
      name: 'Raj Kumar',
      email: 'raj.consultant@curtainry.com',
      role: 'consultant'
    };
  }
  
  if (role === 'fitter' && username === 'kumar_fitter' && password === 'password123') {
    return {
      id: '2', 
      name: 'Kumar Singh',
      email: 'kumar.fitter@curtainry.com',
      role: 'fitter'
    };
  }
  
  return null;
};

// Get orders for user
export const getOrdersForUser = async (userId: string, role: 'consultant' | 'fitter'): Promise<Order[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock orders (in real app would filter by user)
  return mockOrders;
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find and update order
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = status;
    return true;
  }
  
  return false;
};

// Add room to order
export const addRoomToOrder = async (orderId: string, room: Partial<Room>): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find the order and add the room
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    if (!mockOrders[orderIndex].rooms) {
      mockOrders[orderIndex].rooms = [];
    }
    mockOrders[orderIndex].rooms.push(room as Room);
    return true;
  }
  
  return false;
};

export default {
  authenticateUser,
  getOrdersForUser,
  updateOrderStatus,
  addRoomToOrder,
  roomTypes
};