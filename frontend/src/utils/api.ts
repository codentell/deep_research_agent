import axios from 'axios';
import { ResearchRequest, ResearchResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for long research queries
  headers: {
    'Content-Type': 'application/json',
  },
});

export const researchApi = {
  async conductResearch(request: ResearchRequest): Promise<ResearchResponse> {
    const response = await apiClient.post<ResearchResponse>('/research', request);
    return response.data;
  },

  async getConfig() {
    const response = await apiClient.get('/config');
    return response.data;
  },

  async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;