import {Component, ViewContainerRef, Directive, ElementRef, HostListener} from '@angular/core';
import {AuthService} from "./services/auth.service";
import firebase from "firebase/compat/app";
import {ProfilService} from "./services/profil.service";
import {AddExpenseIncomeComponent} from "./add-expense-income/add-expense-income.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {Transaction} from "./model/transaction";
import {trigger, transition, style, animate, state} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  animations : [
    trigger('slide', [
      // Define the animation states and transitions
      state('void', style({ transform: 'translateX(100%)' })), // Start from the right
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('900ms', style({ transform: 'translateX(0)' })), // Slide in from the right
      ]),
      transition(':leave', [
        animate('900ms', style({ transform: 'translateX(100%)' })), // Slide out to the left
      ]),
    ]),
    trigger('slideLeft', [
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('900ms', style({ transform: 'translateX(100%)' })), // Slide out to the right
      ]),
    ]),

  ]
})

export class AppComponent {
  isCollapsed = false
  getFormatedNumberString(goal:number,after = 1):string{
    let goalS = ''
    let end = true
    if(goal >100000){
      goal=goal/1000000
      goalS=' M'
    }else if(goal > 100){
      goal=goal/1000
      goalS=' m'
    }
    return  goal.toFixed(after)+goalS
  }
  get newFormat(){


    return (percent: number): string => `${this.getFormatedNumberString(this.auth.profil.fond_actuelle,2)} / ${this.getFormatedNumberString(this.auth.goal)} ${this.auth.profil.devise}`;
  }
  get isLoggedIn() : boolean{
    return this.auth.IsLoggedIn();
  }
  get progress () : number {
    return parseFloat((this.auth.progress).toFixed(2))
  }
  get isProfilSet() : boolean{
    return this.auth.isProfilSet
  }

  constructor(public auth : AuthService,private modal: NzModalService,private viewContainerRef: ViewContainerRef) {

  }
  fadeIn = trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('500ms', style({ opacity: 1 })),
    ]),
  ]);
  public showaddFluctualModal(){
    const modal = this.modal.create<AddExpenseIncomeComponent
      ,Transaction
    >({
      nzTitle: 'Add Transaction',
      nzContent: AddExpenseIncomeComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzData: null,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'submit',
          onClick: componentInstance => {
            componentInstance!.submitForm()
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
