import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryMarketplaceComponent } from './secondary-marketplace.component';

describe('SecondaryMarketplaceComponent', () => {
  let component: SecondaryMarketplaceComponent;
  let fixture: ComponentFixture<SecondaryMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryMarketplaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
