import {Injectable,} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import firebase from "firebase/compat/app";
import { GoogleAuthProvider } from 'firebase/auth';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map, switchMap} from "rxjs";
import {ProfilService} from "./profil.service";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: firebase.User | undefined;
  isProfilSet = false// Save logged in user data
  public progress = 0;
  private _profil
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private firestore : AngularFirestore,
  ) {
    this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(r => {

    });
    this.afAuth.authState.subscribe((user) => {
      this.userData = user;
      console.log(user)
      this.setProfilSet()
    });




  }
  get profil(){
    return this._profil
  }
  setProfilSet() {
    const userUid = this.userData?.uid;

    if (userUid) {
      const userDocRef = this.firestore.doc(`users/${userUid}`);

      // Subscribe to snapshot changes for the user document and subcollection
      userDocRef.snapshotChanges().pipe(
        switchMap((userDocSnapshot) => {
          if (userDocSnapshot.payload.exists) {
            const data = userDocSnapshot.payload.data() as any;
            this._profil = data.profil;
            this.isProfilSet = data.profil.isProfilSet
            // Check isProfilSet here and navigate accordingly
            if (data && data.profil && data.profil.isProfilSet) {
              return this.router.navigate(['/dashboard']);
            } else {
              return this.router.navigate(['/welcome']);
            }
          } else {
            // Handle the case where the document does not exist
            console.log("Document does not exist.");
            // You can choose to navigate to another route or handle it differently.
            return [];
          }
        }),
        switchMap(() => userDocRef.collection('goals').snapshotChanges()),
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data(); // Get the document data
            const id = action.payload.doc.id;

            return { id: id, ...data } as any;
          });
        })
      ).subscribe(goals => {
        goals.forEach(x => {
          //console.log(x);
          if (x.main && x.goal != 0) {
            this.progress = (this._profil.fond_actuelle) * 100 / x.goal;
          }
        });
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
      console.error("Login error");
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
