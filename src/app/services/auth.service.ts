import {Injectable,} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import firebase from "firebase/compat/app";
import { GoogleAuthProvider } from 'firebase/auth';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: firebase.User | undefined;
  isProfilSet = false// Save logged in user data
  public progress = 0;
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private firestore : AngularFirestore
  ) {
    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(r => {

    });
    this.afAuth.authState.subscribe((user) => {
      this.userData = user;
      console.log(user)
      this.setProfilSet()
    });




  }
  setProfilSet(){

    const userUid = this.userData?.uid;
    console.log(userUid)
    if (userUid) {
      const userDocRef = this.firestore.doc(`users/${userUid}`);

      userDocRef.get().subscribe((userDocSnapshot) => {
        //this.isProfilSet = userDocSnapshot.get('profil');
        this.isProfilSet = userDocSnapshot.get('profil').isProfilSet;

        if (this.isProfilSet) {
          // Redirect to dashboard if isProfilSet is true
          this.router.navigate(['/dashboard']);
        } else {
          // Redirect to welcome if isProfilSet is not true (or doesn't exist)
          this.router.navigate(['/welcome']);
        }
      });
      userDocRef.collection('goals').snapshotChanges().pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data(); // Get the document data
            const id = action.payload.doc.id;

            return {id: id, ...data } as any;
          });
        })
      ).subscribe(goals => {
        goals.forEach(x=>{
          console.log(x)
          if(x.main && x.goal !=0){
            this.progress = (x.fond_actuelle / x.goal)*100

          }
        })
        // 'goals' is an array containing all the documents in the 'goals' subcollection
      });
    } else {
      console.error('User UID not available.');
    }
  }
  async SignIn(): Promise<boolean> {
    try {
      const result = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      this.userData = result.user;
      this.setProfilSet()
      return true; // Authentication succeed§ ed
    } catch (error) {
      console.error(error);
      return false; // Authentication failed
    }
  }


  IsLoggedIn(): boolean {
    // console.log(this.isProfilSet)
    if(!!this.userData && !this.isProfilSet && !this.router.url.includes('/welcome'))this.router.navigate(['/welcome']);
    return !!this.userData; // Check if user is logged in
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  // Sign out
  async SignOut(): Promise<boolean> {
    try {
      await this.afAuth.signOut();
      return true // Clear user data
    } catch (error) {
      console.error(error);
      return false
    }
  }
}
