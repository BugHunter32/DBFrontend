import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCurationComponent } from './stock-curation.component';

describe('StockCurationComponent', () => {
  let component: StockCurationComponent;
  let fixture: ComponentFixture<StockCurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockCurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
