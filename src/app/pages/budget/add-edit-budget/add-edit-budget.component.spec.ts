import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBudgetComponent } from './add-edit-budget.component';

describe('AddEditBudgetComponent', () => {
  let component: AddEditBudgetComponent;
  let fixture: ComponentFixture<AddEditBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
