import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdventureFormComponent } from './adventure-form.component';

describe('AdventureFormComponent', () => {
  let component: AdventureFormComponent;
  let fixture: ComponentFixture<AdventureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventureFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdventureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
