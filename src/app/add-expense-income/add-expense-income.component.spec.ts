import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseIncomeComponent } from './add-expense-income.component';

describe('AddExpenseIncomeComponent', () => {
  let component: AddExpenseIncomeComponent;
  let fixture: ComponentFixture<AddExpenseIncomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddExpenseIncomeComponent]
    });
    fixture = TestBed.createComponent(AddExpenseIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
