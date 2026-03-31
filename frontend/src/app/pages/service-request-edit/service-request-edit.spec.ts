import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestEdit } from './service-request-edit';

describe('ServiceRequestEdit', () => {
  let component: ServiceRequestEdit;
  let fixture: ComponentFixture<ServiceRequestEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
