import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from "./pages/welcome/welcome.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {QuestionnairesComponent} from "./pages/questionnaires/questionnaires.component";
import {ProfilComponent} from "./pages/profil/profil.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', component : DashboardComponent },
  { path : 'welcome', component : QuestionnairesComponent},
  { path : 'dashboard', component : DashboardComponent},
  { path : 'profil',component : ProfilComponent}

  // { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
