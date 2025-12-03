import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestModalComponent } from './invest-modal.component';

describe('InvestModalComponent', () => {
  let component: InvestModalComponent;
  let fixture: ComponentFixture<InvestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
