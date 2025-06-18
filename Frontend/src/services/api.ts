const API_BASE_URL = 'http://localhost:8000/api/v1';

// Mock data for fallback when backend is not available
const MOCK_DELIVERIES: Delivery[] = [
  {
    _id: "1",
    id: "1",
    customer: "Huzaifa Paracha",
    customer_name: "Huzaifa Paracha",
    customer_phone: "3361919915",
    customer_address: "House no 1-5 parachnar street kohat -25000-",
    tracking: "293350800016940",
    merchant: "Elyscents Pakistan",
    order_status: "Unbooked",
    no_of_items: 2,
    courier: "postex",
    created_date: "2025-05-20T10:30:00",
    city: "Kohat",
    order_value: 2500,
    phone: "3361919915",
    address: "House no 1-5 parachnar street kohat -25000-",
    items: 2,
    value: "Rs 2,500",
    date: "2025-05-20",
    status: "unbooked",
    assignedCourier: "postex"
  },
  {
    _id: "2",
    id: "2",
    customer: "Sara Ahmed",
    customer_name: "Sara Ahmed",
    customer_phone: "3112345678",
    customer_address: "DHA Phase 5, Lahore",
    tracking: "LEO243350800016948",
    merchant: "Elyscents Pakistan",
    order_status: "dispatched",
    no_of_items: 1,
    courier: "leopard",
    created_date: "2025-05-21T09:30:00",
    city: "Lahore",
    order_value: 2800,
    phone: "3112345678",
    address: "DHA Phase 5, Lahore",
    items: 1,
    value: "Rs 2,800",
    date: "2025-05-21",
    status: "dispatched",
    assignedCourier: "leopard"
  },
  {
    _id: "3",
    id: "3",
    customer: "Ali Hassan",
    customer_name: "Ali Hassan",
    customer_phone: "3001234567",
    customer_address: "Block 15, Gulshan-e-Iqbal, Karachi",
    tracking: "LEO293350800016947",
    merchant: "Elyscents Pakistan",
    order_status: "Delivered",
    no_of_items: 3,
    courier: "leopard",
    created_date: "2025-05-20T10:00:00",
    city: "Karachi",
    order_value: 4500,
    phone: "3001234567",
    address: "Block 15, Gulshan-e-Iqbal, Karachi",
    items: 3,
    value: "Rs 4,500",
    date: "2025-05-20",
    status: "delivered",
    assignedCourier: "leopard"
  }
];

const MOCK_COURIER_STATS = {
  postex: {
    courier: "postex",
    successRate: 75,
    totalOrders: 8,
    avgValue: 2100
  },
  leopard: {
    courier: "leopard",
    successRate: 85,
    totalOrders: 6,
    avgValue: 3200
  }
};

const MOCK_CITY_STATS: CityStats[] = [
  { city: "Karachi", postexRate: 70, leopardRate: 90 },
  { city: "Lahore", postexRate: 80, leopardRate: 85 },
  { city: "Islamabad", postexRate: 85, leopardRate: 80 },
  { city: "Rawalpindi", postexRate: 75, leopardRate: 75 }
];

const MOCK_DELIVERY_SUMMARY: DeliverySummary = {
  total_orders: 14,
  postex_orders: 8,
  leopard_orders: 6,
  courier_performance: MOCK_COURIER_STATS
};

export interface Order {
  id: string;
  order_id: string;
  tracking?: string;
  tracking_id?: string;
  assigned_courier?: string;
  customer: string;
  customer_name: string;
  customer_address: string;
  customer_email: string;
  customer_phone: string;
  total_price: number;
  status: "pending" | "confirmed" | "unconfirmed";
  date: string;
  created_date: string;
  expanded?: boolean;
  product_name?: string;
  product_quantity?: number;
  delivery_status?: "pending" | "shipped" | "in_transit" | "delivered" | "failed" | "returned";
  children?: {
    type: string;
    content: string;
    timestamp: string;
    status?: "sent" | "delivered" | "read" | "responded";
  }[];
}

export interface Delivery {
  _id: string;
  id: string;
  customer: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  tracking: string;
  merchant: string;
  order_status: string;
  no_of_items: number;
  courier: "postex" | "leopard";
  created_date: string;
  city: string;
  order_value: number;
  phone: string;
  address: string;
  items: number;
  value: string;
  date: string;
  status: string;
  assignedCourier: string;
}

export interface CourierStats {
  courier: string;
  successRate: number;
  totalOrders: number;
  avgValue: number;
}

export interface CityStats {
  city: string;
  postexRate: number;
  leopardRate: number;
}

export interface DeliverySummary {
  total_orders: number;
  postex_orders: number;
  leopard_orders: number;
  courier_performance: {
    [key: string]: CourierStats;
  };
}

export interface UnresponsiveCustomer {
  _id: string;
  id: string;
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  order_number: string;
  order_date: string;
  order_total: number;
  status: "waiting" | "reminder_sent" | "no_response" | "tagged" | "manual_followup";
  last_contact: string;
  flow_stage: "confirmation" | "reminder" | "no_response" | "call_tagged" | "manual_followup" | "completed";
  actions: {
    type: string;
    timestamp: string;
    note?: string;
    status?: "pending" | "completed";
  }[];
  days_since_order: number;
  expanded?: boolean;
}

export interface ReminderHistory {
  _id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reminder_type: string;
  reminder_content: string;
  sent_date: string;
  sent_time: string;
  status: string;
  order_total: number;
  days_since_reminder: number;
}

export interface ResolvedCustomer {
  _id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  order_total: number;
  order_date: string;
  resolved_date: string;
  resolved_time: string;
  resolution_method: string;
  resolution_note: string;
  days_to_resolve: number;
  status: string;
}

export interface OrderStats {
  confirmed: number;
  pending: number;
  unconfirmed: number;
  total: number;
}

export interface UnresponsiveStats {
  waiting: number;
  reminder_sent: number;
  no_response: number;
  tagged: number;
  manual_followup: number;
  total: number;
}

export interface ReminderStats {
  total_reminders: number;
  today: number;
  this_week: number;
  this_month: number;
}

export interface ResolvedStats {
  total_resolved: number;
  today: number;
  this_week: number;
  this_month: number;
}

export interface HighRiskAreaOrder {
  _id: string;
  id: string;
  order_id: string;
  customer: string;
  area: string;
  address: string;
  risk_rate: number;
  risk_factors: string[];
  status: "new" | "analyzing" | "high_risk" | "payment_requested" | "payment_received" | "processing" | "review" | "completed";
  date: string;
  messages: {
    id: string;
    text: string;
    sender: "system" | "user";
    timestamp: string;
  }[];
  expanded?: boolean;
}

export interface HighRiskAreaStats {
  total: number;
  new: number;
  analyzing: number;
  high_risk: number;
  payment_requested: number;
  payment_received: number;
  processing: number;
  review: number;
  completed: number;
}

export interface FakeOrder {
  _id: string;
  id: string;
  order_id: string;
  customer: string;
  phone: string;
  address: string;
  amount: number;
  date: string;
  status: "new" | "checking" | "requires_verification" | "partial_payment_requested" | "flagged" | "blacklisted" | "processing" | "completed" | "canceled";
  suspicious: boolean;
  flagCount: number;
  flag_count: number;
  orderHistory: string[];
  order_history: string[];
  verificationRequired: boolean;
  verification_required: boolean;
  messages: {
    id: string;
    text: string;
    sender: "system" | "user";
    timestamp: string;
  }[];
  expanded?: boolean;
}

export interface FakeOrderStats {
  total: number;
  new: number;
  checking: number;
  requires_verification: number;
  partial_payment_requested: number;
  flagged: number;
  blacklisted: number;
  processing: number;
  completed: number;
  canceled: number;
  suspicious: number;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  async getOrders(status?: string): Promise<Order[]> {
    const endpoint = status && status !== 'all' ? `/orders?status=${status}` : '/orders';
    return this.makeRequest<Order[]>(endpoint);
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.makeRequest<Order>(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string, responseContent?: string): Promise<Order> {
    const params = new URLSearchParams({ status });
    if (responseContent) {
      params.append('response_content', responseContent);
    }

    return this.makeRequest<Order>(`/orders/${orderId}/status?${params.toString()}`, {
      method: 'PUT',
    });
  }

  async getOrderStats(): Promise<OrderStats> {
    return this.makeRequest<OrderStats>('/orders/stats/summary');
  }

  async getDeliveries(courier?: string): Promise<Delivery[]> {
    try {
      const endpoint = courier && courier !== 'all' ? `/deliveries?courier=${courier}` : '/deliveries';
      return await this.makeRequest<Delivery[]>(endpoint);
    } catch (error) {
      console.warn('Backend not available, using mock delivery data');
      
      // Filter mock data by courier if specified
      if (courier && courier !== 'all') {
        return MOCK_DELIVERIES.filter(delivery => delivery.assignedCourier === courier);
      }
      return MOCK_DELIVERIES;
    }
  }

  async getDelivery(deliveryId: string): Promise<Delivery> {
    try {
      return await this.makeRequest<Delivery>(`/deliveries/${deliveryId}`);
    } catch (error) {
      console.warn('Backend not available, using mock delivery data');
      const delivery = MOCK_DELIVERIES.find(d => d.id === deliveryId);
      if (!delivery) {
        throw new Error('Delivery not found');
      }
      return delivery;
    }
  }

  async getCourierStats(): Promise<{[key: string]: CourierStats}> {
    try {
      return await this.makeRequest<{[key: string]: CourierStats}>('/deliveries/stats/couriers');
    } catch (error) {
      console.warn('Backend not available, using mock courier stats');
      return MOCK_COURIER_STATS;
    }
  }

  async getCityStats(): Promise<CityStats[]> {
    try {
      return await this.makeRequest<CityStats[]>('/deliveries/stats/cities');
    } catch (error) {
      console.warn('Backend not available, using mock city stats');
      return MOCK_CITY_STATS;
    }
  }

  async getDeliverySummary(): Promise<DeliverySummary> {
    try {
      return await this.makeRequest<DeliverySummary>('/deliveries/stats/summary');
    } catch (error) {
      console.warn('Backend not available, using mock delivery summary');
      return MOCK_DELIVERY_SUMMARY;
    }
  }

  async getUnresponsiveCustomers(status?: string): Promise<UnresponsiveCustomer[]> {
    const endpoint = status ? `/unresponsive-customers?status_filter=${status}` : '/unresponsive-customers';
    return this.makeRequest<UnresponsiveCustomer[]>(endpoint);
  }

  async updateCustomerAction(customerId: string, action: string, note?: string): Promise<{message: string, customer_id: string}> {
    const params = new URLSearchParams({ action });
    if (note) {
      params.append('note', note);
    }

    return this.makeRequest<{message: string, customer_id: string}>(`/unresponsive-customers/${customerId}/action?${params.toString()}`, {
      method: 'PUT',
    });
  }

  async getUnresponsiveStats(): Promise<UnresponsiveStats> {
    return this.makeRequest<UnresponsiveStats>('/unresponsive-customers/stats/summary');
  }

  async getReminderHistory(): Promise<ReminderHistory[]> {
    return this.makeRequest<ReminderHistory[]>('/unresponsive-customers/reminders');
  }

  async getResolvedCustomers(): Promise<ResolvedCustomer[]> {
    return this.makeRequest<ResolvedCustomer[]>('/unresponsive-customers/resolved');
  }

  async getReminderStats(): Promise<ReminderStats> {
    return this.makeRequest<ReminderStats>('/unresponsive-customers/stats/reminders');
  }

  async getResolvedStats(): Promise<ResolvedStats> {
    try {
      const response = await this.makeRequest<ResolvedStats>('/unresponsive-customers/stats/resolved');
      return response;
    } catch (error) {
      console.error('Error fetching resolved stats:', error);
      return { total_resolved: 0, today: 0, this_week: 0, this_month: 0 };
    }
  }

  // High Risk Areas methods
  async getHighRiskAreaOrders(status?: string): Promise<HighRiskAreaOrder[]> {
    try {
      const url = status && status !== 'all' ? `/high-risk-areas?status=${status}` : '/high-risk-areas';
      const response = await this.makeRequest<HighRiskAreaOrder[]>(url);
      return response;
    } catch (error) {
      console.error('Error fetching high risk area orders:', error);
      return [];
    }
  }

  async getHighRiskAreaOrder(orderId: string): Promise<HighRiskAreaOrder | null> {
    try {
      const response = await this.makeRequest<HighRiskAreaOrder>(`/high-risk-areas/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error fetching high risk area order:', error);
      return null;
    }
  }

  async updateHighRiskAreaOrderStatus(orderId: string, status: string, messageText?: string): Promise<HighRiskAreaOrder | null> {
    try {
      const response = await this.makeRequest<HighRiskAreaOrder>(`/high-risk-areas/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, message_text: messageText }),
      });
      return response;
    } catch (error) {
      console.error('Error updating high risk area order status:', error);
      return null;
    }
  }

  async addHighRiskAreaMessage(orderId: string, messageText: string, sender: string = "user"): Promise<HighRiskAreaOrder | null> {
    try {
      const response = await this.makeRequest<HighRiskAreaOrder>(`/high-risk-areas/${orderId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message_text: messageText, sender }),
      });
      return response;
    } catch (error) {
      console.error('Error adding message to high risk area order:', error);
      return null;
    }
  }

  async getHighRiskAreaStats(): Promise<HighRiskAreaStats> {
    try {
      const response = await this.makeRequest<HighRiskAreaStats>('/high-risk-areas/stats/summary');
      return response;
    } catch (error) {
      console.error('Error fetching high risk area stats:', error);
      return {
        total: 0,
        new: 0,
        analyzing: 0,
        high_risk: 0,
        payment_requested: 0,
        payment_received: 0,
        processing: 0,
        review: 0,
        completed: 0
      };
    }
  }

  async createHighRiskAreaOrder(orderData: {
    order_id: string;
    customer: string;
    area: string;
    address: string;
    risk_rate: number;
    risk_factors: string[];
    status?: string;
  }): Promise<HighRiskAreaOrder | null> {
    try {
      const response = await this.makeRequest<HighRiskAreaOrder>('/high-risk-areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      return response;
    } catch (error) {
      console.error('Error creating high risk area order:', error);
      return null;
    }
  }

  async deleteHighRiskAreaOrder(orderId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/high-risk-areas/${orderId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting high risk area order:', error);
      return false;
    }
  }

  // Fake Orders methods
  async getFakeOrders(status?: string): Promise<FakeOrder[]> {
    try {
      const url = status && status !== 'all' ? `/fake-orders?status=${status}` : '/fake-orders';
      const response = await this.makeRequest<FakeOrder[]>(url);
      return response;
    } catch (error) {
      console.error('Error fetching fake orders:', error);
      return [];
    }
  }

  async getFakeOrder(orderId: string): Promise<FakeOrder | null> {
    try {
      const response = await this.makeRequest<FakeOrder>(`/fake-orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error fetching fake order:', error);
      return null;
    }
  }

  async updateFakeOrderStatus(orderId: string, status: string, messageText?: string): Promise<FakeOrder | null> {
    try {
      const response = await this.makeRequest<FakeOrder>(`/fake-orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, message_text: messageText }),
      });
      return response;
    } catch (error) {
      console.error('Error updating fake order status:', error);
      return null;
    }
  }

  async updateFakeOrderFlag(orderId: string, flagCount: number, suspicious: boolean = true, messageText?: string): Promise<FakeOrder | null> {
    try {
      const response = await this.makeRequest<FakeOrder>(`/fake-orders/${orderId}/flag`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flag_count: flagCount, suspicious, message_text: messageText }),
      });
      return response;
    } catch (error) {
      console.error('Error updating fake order flag:', error);
      return null;
    }
  }

  async addFakeOrderMessage(orderId: string, messageText: string, sender: string = "user"): Promise<FakeOrder | null> {
    try {
      const response = await this.makeRequest<FakeOrder>(`/fake-orders/${orderId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message_text: messageText, sender }),
      });
      return response;
    } catch (error) {
      console.error('Error adding message to fake order:', error);
      return null;
    }
  }

  async getFakeOrderStats(): Promise<FakeOrderStats> {
    try {
      const response = await this.makeRequest<FakeOrderStats>('/fake-orders/stats/summary');
      return response;
    } catch (error) {
      console.error('Error fetching fake order stats:', error);
      return {
        total: 0,
        new: 0,
        checking: 0,
        requires_verification: 0,
        partial_payment_requested: 0,
        flagged: 0,
        blacklisted: 0,
        processing: 0,
        completed: 0,
        canceled: 0,
        suspicious: 0
      };
    }
  }

  async createFakeOrder(orderData: {
    order_id: string;
    customer: string;
    phone: string;
    address: string;
    amount: number;
    status?: string;
    suspicious?: boolean;
    flag_count?: number;
    order_history?: string[];
    verification_required?: boolean;
  }): Promise<FakeOrder | null> {
    try {
      const response = await this.makeRequest<FakeOrder>('/fake-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      return response;
    } catch (error) {
      console.error('Error creating fake order:', error);
      return null;
    }
  }

  async deleteFakeOrder(orderId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/fake-orders/${orderId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting fake order:', error);
      return false;
    }
  }

  // Order booking methods
  async bookWithPostex(orderIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/orders/book-with-postex', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderIds),
    });
  }

  async bookWithLeopard(orderIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/orders/book-with-leopard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderIds),
    });
  }

  async bookRecommended(orderIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/orders/book-recommended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderIds),
    });
  }

  async confirmOrders(orderIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/orders/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderIds),
    });
  }

  async cancelOrders(orderIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/orders/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderIds),
    });
  }
}

export const apiService = new ApiService(); 