import {Injectable,} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import firebase from "firebase/compat/app";
import { GoogleAuthProvider } from 'firebase/auth';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {BehaviorSubject, catchError, map, Observable, of, switchMap} from "rxjs";
import {Transaction} from "../model/transaction";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: firebase.User | undefined;
  isProfilSet = false// Save logged in user data
  public progress = 0;
  private _profil
  loaded = false
  private _goal = 0
  public _transactions :Array<Transaction> = []
  private _loadedTransaction = true
  private _transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$: Observable<Transaction[]> = this._transactionsSubject.asObservable();
  public get loadedTransaction() : boolean {
    return this._loadedTransaction
  }
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private firestore : AngularFirestore,
  ) {
    this.initialize()
  }
  get goal ( ) : number {
    return this._goal
  }
  get profil(){
    return this._profil
  }
  async initialize() {
    await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(_ => {

    });
    await this.afAuth.authState.subscribe((user) => {
      this.userData = user;
      console.log(user)
      this.setProfilSet()

    });
  }
  get transactions () :Array<Transaction>{
    return this._transactions
  }
  setProfilInfo(data){
    this._profil = data.profil;
    this.isProfilSet = data.profil.isProfilSet;
    console.log(this.router.url)
    if (!!this.userData && !this.isProfilSet && !this.router.url.includes('/welcome')) {
      this.router.navigate(['/welcome']);
      // Return an observable with a null value
    } else if (this.userData != null && this.isProfilSet && this.router.url.includes('/welcome')) {
      this.router.navigate(['']);
    }else if(!this.userData && this.router.url != '/'){
      this.router.navigate(['']);
    }
  }
  loadTransaction(userDocRef :AngularFirestoreDocument<any> =null){
    if(userDocRef ==null ) userDocRef = this.firestore.doc(`users/${this.userData?.uid}`);
    if(this.router.url.includes('transaction')){
      userDocRef.collection<Transaction>("transactions").snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data()
            data.id = a.payload.doc.id
            return data as Transaction
          });
        })
      ).subscribe(x=>{
        console.log(x)
        this._loadedTransaction = false
        this._transactions = x
        this._transactionsSubject.next(x);
      })
    }
  }
  setProfilSet() {
    const userUid = this.userData?.uid;

    if (userUid) {
      const userDocRef = this.firestore.doc(`users/${userUid}`);

      // Subscribe to snapshot changes for the user document and subcollection
      userDocRef.snapshotChanges().pipe(
        switchMap(
          (userDocSnapshot) => {
          if (userDocSnapshot.payload.exists) {
            const data = userDocSnapshot.payload.data() as any;
            this.setProfilInfo(data)
            this.loaded = true
            // Check isProfilSet here and navigate accordingly
          } else {
            // Handle the case where the document does not exist
            console.log("Document does not exist.");
            // You can choose to navigate to another route or handle it differently.
          }
          this.loadTransaction(userDocRef)

          // Check if goals is null or not and return an appropriate value
          return userDocRef.collection('goals').snapshotChanges().pipe(
            map(actions => {
              return actions.map(action => {
                const data = action.payload.doc.data(); // Get the document data
                const id = action.payload.doc.id;

                return { id: id, ...data } as any;
              });
            }),
            catchError(error => {
              console.error("Error fetching goals:", error);
              return of(null); // Return an observable with a null value in case of an error
            })
          );
        })
      ).subscribe(goals => {
        if (goals === null) {
          // Handle the case where goals is null
          console.log("Goals data is null.");
          // You can choose to handle it differently.
        } else {
          goals.forEach(x => {
            if (x.main && x.goal != 0) {
              console.log(x.goal);
              this._goal = x.goal;
              this.progress = (this._profil.fond_actuelle) * 100 / x.goal;
            }
          });
          // 'goals' is an array containing all the documents in the 'goals' subcollection
        }
      });
    } else {
      console.error('Not connected.');
      this.loaded = true
      this.router.navigate(['/']);
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

  updateFondActuelle(fond_actuelle: number) {
    const userUid = this.userData.uid;
    const userDocRef = this.firestore.collection('users').doc(userUid);
    userDocRef.get().subscribe(x=>{
      let ptofil = (x.data() as any).profil
      if(ptofil.fond_actuelle != fond_actuelle) {
        ptofil.fond_actuelle = fond_actuelle
        userDocRef.update({ profil: ptofil });
      }
    })
  }
}
