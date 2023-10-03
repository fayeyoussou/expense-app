import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import firebase from "firebase/compat/app";
import {ProfilService} from "./services/profil.service";

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
    return this.auth.progress
  }
  constructor(public auth : AuthService) {

  }
}
