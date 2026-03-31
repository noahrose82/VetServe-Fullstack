import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServiceRequestsService } from '../../services/service-requests.service';

@Component({
  selector: 'app-service-request-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './service-request-create.html',
  styleUrl: './service-request-create.css'
})
export class ServiceRequestCreate {
  form = {
    veteranId: 1,
    category: '',
    description: '',
    status: 'Open'
  };

  saving = false;
  error = '';

  constructor(
    private service: ServiceRequestsService,
    private router: Router
  ) {}

  save(): void {
    this.error = '';
    
    // Validation
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
    
    this.saving = true;

    this.service.create(this.form).subscribe({
      next: () => this.router.navigate(['/service-requests']),
      error: () => {
        this.error = 'Failed to create service request';
        this.saving = false;
      }
    });
  }
}