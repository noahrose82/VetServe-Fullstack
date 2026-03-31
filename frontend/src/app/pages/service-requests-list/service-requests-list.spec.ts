import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestsList } from './service-requests-list';

describe('ServiceRequestsList', () => {
  let component: ServiceRequestsList;
  let fixture: ComponentFixture<ServiceRequestsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
