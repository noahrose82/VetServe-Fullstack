import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ServiceRequestsService, ServiceRequest } from '../../services/service-requests.service';

@Component({
  selector: 'app-service-requests-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-requests-list.html',
  styleUrl: './service-requests-list.css',
})
export class ServiceRequestsList implements OnInit {
  requests: ServiceRequest[] = [];
  loading = false;
  error = '';

  // Pagination settings
  initialLimit = 5;      // Show first 5
  loadMoreLimit = 10;    // Load 10 more each time
  offset = 0;
  hasMore = true;

  constructor(
    private service: ServiceRequestsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();  // Load first 5 only
  }

  // Load first 5 items only
  loadInitialData(): void {
    this.loading = true;
    this.error = '';
    
    this.service.getAll(this.initialLimit, 0).subscribe({
      next: (data) => {
        this.requests = data;  // Only first 5
        this.hasMore = data.length === this.initialLimit;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load service requests. ' + (err.message || 'Unknown error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Load more items (starting from position 5)
  loadMore(): void {
    if (this.loading || !this.hasMore) return;
    
    this.loading = true;
    this.offset = this.requests.length;  // Start from current count
    
    this.service.getAll(this.loadMoreLimit, this.offset).subscribe({
      next: (data) => {
        this.requests = [...this.requests, ...data];  // Append new items
        this.hasMore = data.length === this.loadMoreLimit;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load more requests. ' + (err.message || 'Unknown error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDelete(id: number): void {
    if (!confirm('Delete this service request?')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Delete failed: ' + (err.message || 'Unknown error'));
      }
    });
  }
}