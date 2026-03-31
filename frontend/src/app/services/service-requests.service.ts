import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServiceRequest {
  id: number;
  veteranId: number;
  category: string;
  description: string;
  status: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ServiceRequestsService {
  private baseUrl = 'http://localhost:3000/api/service-requests';

  constructor(private http: HttpClient) {}

getAll(limit: number = 25, offset: number = 0): Observable<ServiceRequest[]> {
  return this.http.get<ServiceRequest[]>(`${this.baseUrl}?limit=${limit}&offset=${offset}`);
}

  getById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<ServiceRequest>): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.baseUrl, data);
  }

  update(id: number, data: Partial<ServiceRequest>): Observable<ServiceRequest> {
    return this.http.put<ServiceRequest>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}