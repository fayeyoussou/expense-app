import {Component, inject} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-add-expense-income',
  templateUrl: './add-expense-income.component.html',
  styleUrls: ['./add-expense-income.component.less']
})
export class AddExpenseIncomeComponent {
  public title = "Add new Fluctuation"
  public subtitle = "Add new Fluctuation"

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);

  destroyModal(): void {
    this.#modal.destroy({ data: 'this the result data' });
  }
}
