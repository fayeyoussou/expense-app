import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DatePipe, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Zorro ant Modules
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import localeFr from '@angular/common/locales/fr'; // Import French locale data
import { NzSpinModule } from 'ng-zorro-antd/spin';

const ngZorroConfig: NzConfig = {
  message: { nzTop: 55,nzPauseOnHover : true },
  notification: { nzTop: 240 }
};

// AngularFire modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import {environment} from "./environments/environment";
import {ExpenseFormComponent} from "./expense-form/expense-form.component";
import {NzFormModule} from "ng-zorro-antd/form";
import {QuestionnairesComponent} from "./pages/questionnaires/questionnaires.component";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {ProfilComponent} from "./pages/profil/profil.component";
import {AddExpenseIncomeComponent} from "./add-expense-income/add-expense-income.component";
import {TransactionsComponent} from "./pages/transactions/transactions.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {WelcomeComponent} from "./pages/welcome/welcome.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    ExpenseFormComponent,
    QuestionnairesComponent,
    ProfilComponent,
    AddExpenseIncomeComponent,
    TransactionsComponent,
    WelcomeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzTabsModule,
    NzModalModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzFormModule,
    NzButtonModule,
    NzProgressModule,
    NzDatePickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    NzSpaceModule,
    NzTableModule,
    NzPopconfirmModule,
    NzMessageModule,
    NzSpinModule
  ],
  providers: [
    DatePipe,
    { provide: NZ_I18N, useValue: fr_FR },
    provideNzConfig(ngZorroConfig)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
