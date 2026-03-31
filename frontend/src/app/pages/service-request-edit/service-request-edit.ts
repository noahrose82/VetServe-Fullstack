import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  ServiceRequestsService,
  ServiceRequest
} from '../../services/service-requests.service';

@Component({
  selector: 'app-service-request-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './service-request-edit.html',
  styleUrl: './service-request-edit.css'
})
export class ServiceRequestEdit implements OnInit {
  id = 0;

  loading = true;
  saving = false;
  error = '';

  // form model (filled after load)
  form: Omit<ServiceRequest, 'createdAt'> = {
    id: 0,
    veteranId: 1,
    category: 'Benefits',
    description: '',
    status: 'Open'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ServiceRequestsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = Number(idParam);

    if (!this.id || Number.isNaN(this.id)) {
      this.error = 'Invalid request id.';
      this.loading = false;
      return;
    }

    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.service.getById(this.id).subscribe({
      next: (data) => {
        // Copy server values into the form
        this.form = {
          id: data.id,
          veteranId: data.veteranId,
          category: data.category,
          description: data.description,
          status: data.status
        };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load service request.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.error = '';

    if (!this.form.veteranId || this.form.veteranId <= 0) {
      this.error = 'Veteran ID must be a positive number.';
      return;
    }
    if (!this.form.category?.trim()) {
      this.error = 'Category is required.';
      return;
    }
    if (!this.form.description?.trim()) {
      this.error = 'Description is required.';
      return;
    }
    if (!this.form.status?.trim()) {
      this.error = 'Status is required.';
      return;
    }

    this.saving = true;

    // Send only updatable fields
    this.service
      .update(this.id, {
        veteranId: this.form.veteranId,
        category: this.form.category,
        description: this.form.description,
        status: this.form.status
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/service-requests']);
        },
        error: () => {
          this.saving = false;
          this.error = 'Failed to update service request.';
        }
      });
  }
}