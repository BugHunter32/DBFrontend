import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoboAdvisorSettingsComponent } from './robo-advisor-settings.component';

describe('RoboAdvisorSettingsComponent', () => {
  let component: RoboAdvisorSettingsComponent;
  let fixture: ComponentFixture<RoboAdvisorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoboAdvisorSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoboAdvisorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
