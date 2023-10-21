import {Component, inject} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {ProfilService} from "../services/profil.service";
import {CategoryService} from "../services/category.service";
import {TransactionCategory} from "../model/transaction_category";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Transaction} from "../model/transaction";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-add-expense-income',
  templateUrl: './add-expense-income.component.html',
  styleUrls: ['./add-expense-income.component.less']
})
export class AddExpenseIncomeComponent {
  public title = "Add new Fluctuation"
  public subtitle = "Add new Fluctuation"

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: Transaction = inject(NZ_MODAL_DATA);
  expenses : Array<TransactionCategory> = []
  incomes : Array<TransactionCategory> = []
  types = ['expense','income']
  form: FormGroup
  categories:Array<TransactionCategory> = []
  constructor(private profilService:ProfilService,private categoryService : CategoryService,private fb: FormBuilder,private message: NzMessageService) {
    categoryService.expenses.subscribe(x=>{
      this.expenses =x
    })
    categoryService.incomes.subscribe(x=>{
      this.incomes =x
    })
    console.log(this.nzModalData)

    setTimeout(x=>{
      if(this.nzModalData != null && this.nzModalData.type == 'expense'){
        this.categories = this.expenses
      } else if(this.nzModalData != null){
        this.categories = this.incomes
      }
    },1000);
    this.form = this.fb.group(
      {
        ['type']:[(this.nzModalData == null ? null:this.nzModalData.type) ,Validators.required],
        ['amount']:[this.nzModalData?.amount,Validators.compose([Validators.required,Validators.min(5)])],
        ['category']:[this.nzModalData?.idCategory,Validators.required],
        ['multiplier']:[1,Validators.required],
        ['description'] : [(this.nzModalData == null ? '':this.nzModalData.description),Validators.required]
      }
    )
    this.form.get('type')?.valueChanges.subscribe((selectedType) => {
      if (selectedType ==='expense' ){
        // Otherwise, provide default options 1-30
        this.categories = this.expenses
      }else if (selectedType ==='income' ){
        // Otherwise, provide default options 1-30
        this.categories = this.incomes
      } else {
        this.categories = []
      }
    });
  }
  destroyModal(): void {
    this.#modal.destroy({ data: 'this the result data' });
  }
  public submitForm(){
    if(this.form.valid){
      let value =  this.form.value
      let transaction = new Transaction(value)

      console.log(transaction)
      this.profilService.updateProfilAndAddTransaction(transaction).then(x=>{
        if(x){
          this.destroyModal()
        }
      })
    }
  }
  public editForm(){
    if(this.form.valid) {
      let value = this.form.value
      let transaction = new Transaction(value)
      transaction.id = this.nzModalData.id
      transaction.dateTransaction = this.nzModalData.dateTransaction
      this.profilService.modifyTransactionAndFond(transaction).then(x=>{
        if(x){
          this.#modal.destroy({type:'success',message: "Modification réussit"})
        }
      },error=>{
        this.#modal.destroy({type:'error',message: "Échec modification"})
      })
    }
  }
}
