import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {TransactionCategory} from "../model/transaction_category";
import {map, Observable, of} from "rxjs";
import {Transaction} from "../model/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  public _transactions: Transaction[] = [];

  constructor(private firestore: AngularFirestore, private auth: AuthService) {
    this.getUserTransaction()
  }
  get transaction():Transaction[]{
    return this._transactions
  }


  getUserTransaction() {



  }
}
