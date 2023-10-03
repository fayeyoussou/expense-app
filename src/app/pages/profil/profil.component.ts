import { Component } from '@angular/core';
import {ProfilService} from "../../services/profil.service";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.less']
})
export class ProfilComponent {
  get userProfil(){
    return this.profilService.myProfil;
  }
  constructor(private profilService : ProfilService) {
  }
}
