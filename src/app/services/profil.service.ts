import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {FormGroup} from "@angular/forms";
import {IncomeCategories} from "../model/income_categories";
import {ExpenseCategories} from "../model/expense_categories";
import {Transaction} from "../model/transaction";
import {Observable, Subject} from "rxjs";

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
  public async updateProfilAndAddTransaction(incomeOrExpense: Transaction): Promise<boolean> {
    if (this.auth.userData != null) {

      const userUid = this.auth.userData.uid;
      const userDocRef = this.firestore.collection('users').doc(userUid);

      // Retrieve the current profil data
      userDocRef.get().subscribe((userDoc) => {
        if (userDoc.exists) {
          const currentProfil = (userDoc.data() as any).profil as any;

          // Calculate the new 'fond_actuelle' based on income or expense
          if (incomeOrExpense.type == 'income') {
            currentProfil.fond_actuelle += incomeOrExpense.amount;
          } else {
            currentProfil.fond_actuelle -= incomeOrExpense.amount;
          }

          // Update the 'profil' data in Firestore
          userDocRef.update({ profil: currentProfil })


          // Create a new transaction object


          // Reference the "transactions" collection under the user's document
          const transactionsCollectionRef = userDocRef.collection('transactions');

          // Add a new document to the "transactions" collection with auto-generated ID
          transactionsCollectionRef.add(JSON.parse(JSON.stringify(incomeOrExpense)))
            .then((docRef) => {
              console.log('Transaction data written with ID: ', docRef.id);
            })
            .catch((error) => {
              console.error('Error adding transaction data: ', error);
            });
        } else {
          console.error('User document does not exist.');
        }
      });
      return true

    }
    else {
      return false
    }
  }
  public async modifyTransactionAndFond(transaction: Transaction): Promise<boolean> {
    if (this.auth.userData != null) {
      const userUid = this.auth.userData.uid;
      const userDocRef = this.firestore.collection('users').doc(userUid);

      userDocRef.get().subscribe((userDoc) => {
        if (userDoc.exists) {
          const currentProfil = (userDoc.data() as any).profil as any;
          const transactionsCollectionRef = userDocRef.collection('transactions');

          transactionsCollectionRef
            .doc(transaction.id) // Use the document ID of the transaction to update
            .get()
            .subscribe((transactionDoc) => {
              if (transactionDoc.exists) {
                const existingTransaction = transactionDoc.data() as Transaction;

                // Calculate the difference in funds due to the modification
                let fundDifference = 0;
                if (existingTransaction.type === 'income') {
                  fundDifference -= existingTransaction.amount;
                } else {
                  fundDifference += existingTransaction.amount;
                }
                if (transaction.type === 'income') {
                  fundDifference += transaction.amount;
                } else {
                  fundDifference -= transaction.amount;
                }

                // Update 'fond_actuelle'
                currentProfil.fond_actuelle += fundDifference;

                // Update the 'profil' data in Firestore
                userDocRef.update({ profil: currentProfil });

                // Update the transaction data
                transactionDoc.ref.update(JSON.parse(JSON.stringify( transaction)))
                  .then(() => {
                    console.log('Transaction data modified.');
                  })
                  .catch((error) => {
                    console.error('Error modifying transaction data: ', error);
                  });
              } else {
                console.error('Transaction document does not exist.');
              }
            });
        } else {
          console.error('User document does not exist.');
        }
      });
      return true;
    } else {
      return false;
    }
  }

  public async deleteTransactionAndFond(transaction: Transaction): Promise<boolean> {
    if (this.auth.userData != null) {
      const userUid = this.auth.userData.uid;
      const userDocRef = this.firestore.collection('users').doc(userUid);

      userDocRef.get().subscribe((userDoc) => {
        if (userDoc.exists) {
          const currentProfil = (userDoc.data() as any).profil as any;
          const transactionsCollectionRef = userDocRef.collection('transactions');

          transactionsCollectionRef
            .doc(transaction.id) // Use the document ID of the transaction to delete
            .get()
            .subscribe((transactionDoc) => {
              if (transactionDoc.exists) {
                const existingTransaction = transactionDoc.data() as Transaction;
                let fundDifference = 0
                // Calculate the difference in funds due to the deletion
                if(existingTransaction.type == 'expense') {
                   fundDifference = +existingTransaction.amount;
                }else {
                   fundDifference = -existingTransaction.amount;
                }


                // Update 'fond_actuelle'
                currentProfil.fond_actuelle += fundDifference;

                // Update the 'profil' data in Firestore
                userDocRef.update({ profil: currentProfil });

                // Delete the transaction
                transactionDoc.ref.delete()
                  .then(() => {
                    console.log('Transaction data deleted.');
                  })
                  .catch((error) => {
                    console.error('Error deleting transaction data: ', error);
                  });
              } else {
                console.error('Transaction document does not exist.');
              }
            });
        } else {
          console.error('User document does not exist.');
        }
      });
      return true;
    } else {
      return false;
    }
  }


}
