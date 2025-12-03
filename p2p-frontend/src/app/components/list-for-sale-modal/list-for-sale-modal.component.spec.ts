import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListForSaleModalComponent } from './list-for-sale-modal.component';

describe('ListForSaleModalComponent', () => {
  let component: ListForSaleModalComponent;
  let fixture: ComponentFixture<ListForSaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListForSaleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListForSaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
