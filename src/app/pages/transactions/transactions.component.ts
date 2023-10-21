import {Component, LOCALE_ID, ViewContainerRef} from '@angular/core';
import {Transaction} from "../../model/transaction";
import {AuthService} from "../../services/auth.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Subscription} from "rxjs";
import {CategoryService} from "../../services/category.service";
import {TransactionCategory} from "../../model/transaction_category";
import {AddExpenseIncomeComponent} from "../../add-expense-income/add-expense-income.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {ProfilService} from "../../services/profil.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less']
})
export class TransactionsComponent {

      loading = true
      total = 0
      pageSize = 5;
      pageIndex = 1;
      sort : { key,value}[] = []
  private transactionsSubscription: Subscription;
      loaded = false;

  transactionsList : Array<Transaction> =[]
  transactionsListBase : Array<Transaction> =[]
  expenses : Array<TransactionCategory> = []
  incomes : Array<TransactionCategory> = []

      constructor(
        public transService :AuthService,
        categorieService : CategoryService,
        private modal: NzModalService,
        private viewContainerRef: ViewContainerRef,
        private message: NzMessageService,
        private profilService : ProfilService,
        private datePipe :DatePipe
      ) {
        this.transactionsSubscription = transService.transactions$.subscribe(transactions => {
          // console.log("running")
          if(transService.loadedTransaction ) {
            transService.loadTransaction(null)
          }
          this.transactionsListBase = [...transactions]
          this.sortTransaction();
        });
        categorieService.expenses.subscribe(x=>{
          this.expenses = x
        })
        categorieService.incomes.subscribe(x=>{
          this.incomes = x
        })
      }

  getCategory(idCategory: string) {
    let categories = [...this.expenses,...this.incomes]
    return categories.find(x=>x.id==idCategory)
  }
  converDate(date : Date):string{

    return this.datePipe.transform(date, 'd MMM y h:mm a');
  }
  sortTransaction() {
    this.total = this.transactionsListBase.length
    // Extract sorting criteria from this.sort
    const sortCriteria = this.sort.find(x => x.value !== null) ;



    const { key: sortCol, value: sortDir } = sortCriteria ? sortCriteria : {key : 'dateTransaction' ,value : 'descend'};

    this.transactionsList = this.transactionsListBase.sort((a, b) => {
      switch (sortCol) {
        case 'type':
          const typeOrder = { expense: 0, income: 1 };
          return (typeOrder[a.type] - typeOrder[b.type]) * (sortDir === 'ascend' ? 1 : -1);

        case 'amount':
          return (a.amount - b.amount) * (sortDir === 'ascend' ? 1 : -1);

        case 'idCategory':
          const categoryA = this.getCategory(a.idCategory).name;
          const categoryB = this.getCategory(b.idCategory).name;
          return categoryA.localeCompare(categoryB) * (sortDir === 'ascend' ? -1 : 1);

        case 'dateTransaction':
          const dateOrder = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
          return dateOrder(a.dateTransaction, b.dateTransaction) * (sortDir === 'ascend' ? 1 : -1);

        default:
          // Handle the default case here or throw an error if needed
          return 0;
      }
    }).slice((this.pageIndex-1)*this.pageSize,(this.pageIndex-1)*this.pageSize +this.pageSize);
  }

  ngOnDestroy(){
    this.transactionsSubscription.unsubscribe();
  }

  onQueryParamsChange($event: NzTableQueryParams) {

    this.sort = $event.sort
    this.pageIndex = $event.pageIndex
    this.pageSize = $event.pageSize
    console.log($event)
    this.sortTransaction()

  }

  deleteTransaction(data: Transaction) {
    this.profilService.deleteTransactionAndFond(data).then(_=>this.message.create('success', 'Suppression réussit',{

    }),_=>this.message.create('error', 'Échec suppression'))
  }

  editTransaction(data: Transaction) {
    const modal = this.modal.create<AddExpenseIncomeComponent
      ,Transaction
    >({
      nzTitle: 'Add Transaction',
      nzContent: AddExpenseIncomeComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzData: data,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'edit',
          onClick: componentInstance => {
            componentInstance!.editForm()
          }
        }
      ]
    });
    const instance = modal.getContentComponent();
    modal.afterClose.subscribe(result => {
      this.message.create(result.type, result.message);
    });
  }

  cancelTransaction() {
    this.message.info('Suppression annulée');
  }
}
