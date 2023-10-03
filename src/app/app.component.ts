import {Component, ViewContainerRef} from '@angular/core';
import {AuthService} from "./services/auth.service";
import firebase from "firebase/compat/app";
import {ProfilService} from "./services/profil.service";
import {AddExpenseIncomeComponent} from "./add-expense-income/add-expense-income.component";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  isCollapsed = false
  get isLoggedIn() : boolean{
    return this.auth.IsLoggedIn();
  }
  get progress () : number {
    return parseFloat((this.auth.progress).toFixed(2))
  }

  constructor(public auth : AuthService,private modal: NzModalService,private viewContainerRef: ViewContainerRef) {

  }
  public showaddFluctualModal(){
    const modal = this.modal.create<AddExpenseIncomeComponent
      // ,any
    >({
      nzTitle: 'Add Transaction',
      nzContent: AddExpenseIncomeComponent,
      nzViewContainerRef: this.viewContainerRef,
      // nzData: {
      //   favoriteLibrary: 'angular',
      //   favoriteFramework: 'angular'
      // },
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'change component title from outside',
          onClick: componentInstance => {
            componentInstance!.title = 'title in inner component is changed';
          }
        }
      ]
    });
    const instance = modal.getContentComponent();
    modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));

    // delay until modal instance created
    // setTimeout(() => {
    //   instance.subtitle = 'sub title is changed';
    // }, 2000);
  }
}
