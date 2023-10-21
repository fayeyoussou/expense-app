import {Validators} from "@angular/forms";

export class Transaction {
  id : string | undefined
  amount : number = 0
  type : 'expense' | 'income'
  idCategory : string
  dateTransaction:Date = new Date()
  description : string = ""
  constructor(data : any) {
    // ['type']:[null,Validators.required],
    //   ['amount']:[0,Validators.required],
    //   ['category']:[null,Validators.required],
    //   ['multiplier']:[1,Validators.required]
    this.type = data.type
    this.amount = data.amount * data.multiplier
    this.idCategory = data.category
    this.description = data.description
  }
}
