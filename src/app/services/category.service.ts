import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {TransactionCategory} from "../model/transaction_category";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private firestore : AngularFirestore) {
  }
  get expenses():Observable<TransactionCategory[]>{
    return this.firestore.collection<TransactionCategory>("expense").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          data.id = a.payload.doc.id
          data.type='expense'
          return data as TransactionCategory
        });
      })
    );
  }
  get incomes():Observable<TransactionCategory[]>{
    return this.firestore.collection<any>("income").snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          data.id = a.payload.doc.id
          data.type='income'
          return data as TransactionCategory
        });
      })
    );
  }
}
