import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private profil : any
  private progress : number = 0
  constructor(private firestore : AngularFirestore,private auth : AuthService) {
    this.profil = auth.profil
  }
  get myProfil(): any {
    return this.profil;
  }
  get ProgressOnMain(){
    return this.progress
  }

  public addNewProfil(profilInfo : FormGroup[],questions : any[]){
    if(this.auth.userData !=null){
      let responseProfil = {}
      let responseGoals = {}
      responseGoals['main']=true
      questions.forEach((x,i)=>{
        let value =  profilInfo[i].get(x.id as string).value
        if(x.collection == 'profil')responseProfil[x.id]=  value
        else if(x.collection == 'goals') {
          if(x.type != 'number-currency' )responseGoals[x.id] = value
          else responseGoals[x.id] = value * profilInfo[i].get('multiplier').value
        }
      })
      let userUid = this.auth.userData.uid
      responseProfil['name'] = this.auth.userData.displayName
      responseProfil['isProfilSet']=true
      this.auth.isProfilSet =true
      // console.log("goals",responseGoals)
      // console.log("profiles",responseProfil)
      const userDocRef = this.firestore.collection('users').doc(userUid);
      userDocRef.set({ profil: responseProfil })
        .then(() => {
          console.log('Profile data written successfully');
        })
        .catch((error) => {
          console.error('Error adding profile data: ', error);
        });

      // Reference the "goals" collection under the user's document
      const goalsCollectionRef = userDocRef.collection('goals');

      // Add a new document to the "goals" collection with auto-generated ID
      goalsCollectionRef.add(responseGoals)
        .then((docRef) => {
          console.log('Goal data written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error adding goal data: ', error);
        });
        // 680 + 300 + 370 =
    }
  }
}
