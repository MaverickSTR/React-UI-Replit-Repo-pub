// api-client.ts

import { HospitableClientConfig, HospitableError, HospitableRequestOptions, HospitableResponse, Property, Customer, Booking } from './types';

export class HospitableAPI {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultCache: RequestCache;
  private readonly defaultRevalidate: number;

  constructor(config: HospitableClientConfig) {
    this.baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
    this.apiToken = config.apiToken;
    this.defaultHeaders = {
      'Authorization': `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Connect-Version': '2024-01',
      ...config.defaultHeaders,
    };
    this.defaultCache = config.defaultCache ?? 'no-store';
    this.defaultRevalidate = config.defaultRevalidate ?? 60;
  }

  private async request<T>(path: string, options: HospitableRequestOptions = {}): Promise<HospitableResponse<T>> {
    const url = new URL(`${path.startsWith('/') ? path : `/${path}`}`, this.baseUrl);
    
    try {
      const fetchOptions: RequestInit = {
        method: options.method ?? 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        cache: options.cache ?? this.defaultCache,
      };

      console.log(`Fetching from: ${url.toString()}`);
      
      const response = await fetch(url.toString(), fetchOptions);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('API request failed:', error);
      const hospError: HospitableError = {
        name: error.name || "APIError",
        message: error.message || "Unknown API error",
        code: 'API_ERROR',
        status: 500,
      };
      throw hospError;
    }
  }

  // Property endpoints
  async getProperties(): Promise<Property[]> {
    const response = await this.request<Property[]>('/properties');
    return response.data;
  }

  async getProperty(id: string): Promise<Property> {
    const response = await this.request<Property>(`/properties/${id}`);
    return response.data;
  }

  async createProperty(property: Omit<Property, 'id'>): Promise<Property> {
    const response = await this.request<Property>('/properties', {
      method: 'POST',
      body: property,
    });
    return response.data;
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    const response = await this.request<Property>(`/properties/${id}`, {
      method: 'PATCH',
      body: property,
    });
    return response.data;
  }

  async deleteProperty(id: string): Promise<void> {
    await this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Customer endpoints
  async getCustomers(): Promise<Customer[]> {
    const response = await this.request<Customer[]>('/customers');
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.request<Customer>(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const response = await this.request<Customer>('/customers', {
      method: 'POST',
      body: customer,
    });
    return response.data;
  }

  // Booking endpoints
  async getBookings(filters?: { propertyId?: string; customerId?: string }): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (filters?.propertyId) params.append('propertyId', filters.propertyId);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    
    const response = await this.request<Booking[]>(`/bookings?${params.toString()}`);
    return response.data;
  }

  async createBooking(booking: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const response = await this.request<Booking>('/bookings', {
      method: 'POST',
      body: booking,
    });
    return response.data;
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const response = await this.request<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return response.data;
  }
}