import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestCreate } from './service-request-create';

describe('ServiceRequestCreate', () => {
  let component: ServiceRequestCreate;
  let fixture: ComponentFixture<ServiceRequestCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRequestCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRequestCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
