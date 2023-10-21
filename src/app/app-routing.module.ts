import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from "./pages/welcome/welcome.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {QuestionnairesComponent} from "./pages/questionnaires/questionnaires.component";
import {ProfilComponent} from "./pages/profil/profil.component";
import {TransactionsComponent} from "./pages/transactions/transactions.component";

const routes: Routes = [
  {path : '',component : WelcomeComponent},
  { path: 'dashboard', pathMatch: 'full', component : DashboardComponent },
  { path : 'welcome', component : QuestionnairesComponent},
  { path : 'profil',component : ProfilComponent},
  { path : 'transactions',component:TransactionsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
