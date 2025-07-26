/**
 * @fileoverview Camera service for API operations
 * @description Professional service layer for camera-related operations
 */

import { ApiClient, apiClient } from '@/lib/api-client';
import { 
  Camera, 
  CameraStatus, 
  CreateCameraRequest, 
  UpdateCameraRequest, 
  CameraFilters 
} from '@/types/camera.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';

/**
 * Camera service class providing all camera-related API operations
 */
export class CameraService {
  private client: ApiClient;

  constructor(client: ApiClient = apiClient) {
    this.client = client;
  }

  /**
   * Fetch all cameras with optional filtering and pagination
   */
  async getCameras(
    filters?: CameraFilters,
    page = 1,
    limit = 50
  ): Promise<ApiResponse<PaginatedResponse<Camera>>> {
    const params: Record<string, string | number | boolean> = {
      page,
      limit,
    };

    // Add other filters
    if (filters?.location) {
      params.location = filters.location;
    }
    if (filters?.searchTerm) {
      params.searchTerm = filters.searchTerm;
    }
    if (filters?.status) {
      params.status = Array.isArray(filters.status) 
        ? filters.status.join(',') 
        : filters.status;
    }

    return this.client.get<PaginatedResponse<Camera>>('/cameras', { params });
  }

  /**
   * Fetch a single camera by ID
   */
  async getCameraById(id: string): Promise<ApiResponse<Camera>> {
    return this.client.get<Camera>(`/cameras/${id}`);
  }

  /**
   * Create a new camera
   */
  async createCamera(data: CreateCameraRequest): Promise<ApiResponse<Camera>> {
    return this.client.post<Camera>('/cameras', data);
  }

  /**
   * Update an existing camera
   */
  async updateCamera(
    id: string, 
    data: UpdateCameraRequest
  ): Promise<ApiResponse<Camera>> {
    return this.client.patch<Camera>(`/cameras/${id}`, data);
  }

  /**
   * Delete a camera
   */
  async deleteCamera(id: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`/cameras/${id}`);
  }

  /**
   * Update camera status
   */
  async updateCameraStatus(
    id: string, 
    status: CameraStatus
  ): Promise<ApiResponse<Camera>> {
    return this.client.patch<Camera>(`/cameras/${id}/status`, { status });
  }

  /**
   * Get camera stream URL
   */
  async getCameraStream(id: string): Promise<ApiResponse<{ streamUrl: string }>> {
    return this.client.get<{ streamUrl: string }>(`/cameras/${id}/stream`);
  }

  /**
   * Test camera connection
   */
  async testCameraConnection(id: string): Promise<ApiResponse<{ isConnected: boolean }>> {
    return this.client.post<{ isConnected: boolean }>(`/cameras/${id}/test`);
  }

  /**
   * Get camera statistics
   */
  async getCameraStats(id: string): Promise<ApiResponse<{
    uptime: number;
    incidentCount: number;
    lastIncident?: Date;
    streamQuality: 'excellent' | 'good' | 'poor';
  }>> {
    return this.client.get(`/cameras/${id}/stats`);
  }

  /**
   * Bulk update camera status
   */
  async bulkUpdateStatus(
    cameraIds: string[], 
    status: CameraStatus
  ): Promise<ApiResponse<Camera[]>> {
    return this.client.patch<Camera[]>('/cameras/bulk/status', {
      cameraIds,
      status,
    });
  }

  /**
   * Search cameras by name or location
   */
  async searchCameras(query: string): Promise<ApiResponse<Camera[]>> {
    return this.client.get<Camera[]>('/cameras/search', {
      params: { q: query },
    });
  }
}

/**
 * Default camera service instance
 */
export const cameraService = new CameraService();
