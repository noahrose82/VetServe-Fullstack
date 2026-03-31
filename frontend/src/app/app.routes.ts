import { Routes } from '@angular/router';
import { ServiceRequestsList } from './pages/service-requests-list/service-requests-list';
import { ServiceRequestCreate } from './pages/service-request-create/service-request-create';
import { ServiceRequestEdit } from './pages/service-request-edit/service-request-edit';

export const routes: Routes = [
  { path: '', redirectTo: 'service-requests', pathMatch: 'full' },

  { path: 'service-requests', component: ServiceRequestsList },
  { path: 'service-requests/create', component: ServiceRequestCreate },
  { path: 'service-requests/:id/edit', component: ServiceRequestEdit },

  { path: '**', redirectTo: 'service-requests' }
];