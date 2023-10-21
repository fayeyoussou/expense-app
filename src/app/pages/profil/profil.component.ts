import { Component } from '@angular/core';
import {ProfilService} from "../../services/profil.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.less']
})
export class ProfilComponent {
  form: FormGroup
  loaded =false

  constructor(private profilService: AuthService, private fb: FormBuilder) {
    this.initializeForm()
    const interval = setInterval(()=>{
      if(profilService.loaded){
        this.loaded = true
        this.initializeForm()
        clearInterval(interval);
      }
    },100)
  }

  async ngOnInit() {

  }

  initializeForm() {
    let value = this.profilService.profil?.fond_actuelle ?? 0 as number;
    let multi = 1;
    if (value > 1_000_000) {
      multi = 1000000;
      value = value / 1000000;
    } else if (value > 1000) {
      multi = 1000;
      value /= 1000;
    }

    this.form = this.fb.group({
      ['fond_actuelle']: [value,Validators.compose([Validators.required, Validators.min(0)])],
        //[value, Validators.compose([Validators.required, Validators.min(0)]],
      ['multiplier']: [multi, Validators.required],
    });
  }


  handleEnterKey() {
    if(this.form.valid){
      this.profilService.updateFondActuelle(this.form.value.fond_actuelle * this.form.value.multiplier)
    }
  }
}
