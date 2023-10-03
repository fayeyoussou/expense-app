import { Component } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ProfilService} from "../../services/profil.service";

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.less'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class QuestionnairesComponent {
  currentQuestionIndex = 0;
  form: FormGroup[] = [];
  private dateGreaterThanOneWeek(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const oneWeekFromToday = new Date();
      oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7); // Add 7 days (1 week)

      if (selectedDate >= oneWeekFromToday) {
        return null; // Validation passed
      } else {
        return { dateTooSoon: true }; // Validation failed
      }
    };
  }

  questions =  [
    {
      id: 'statut',
      collection : 'profil',
      question: 'Quel est votre statut de travail ?',
      type: 'dropdown',
      values: ['salarie', 'freelance', 'chomeur', 'entrepreneur'],
      validation: [Validators.required], // Validation rule for required selection
      validationMessage: 'Ce champ est obligatoire', // Validation message
    },
    {
      id: 'devise',
      collection : 'profil',
      question: 'Quelle devise souhaitez-vous utiliser ?',
      type: 'dropdown',
      values: ['Franc CFA', 'dollar', 'euro', 'sterling', 'etc.'],
      validation:[ Validators.required], // Validation rule for required selection
      validationMessage: 'Ce champ est obligatoire',
    },
    {
      id: 'fond_actuelle',
      collection : 'profil',

      question: 'Quels sont vos fonds actuelles',
      multiplier : '1',
      type: 'number-currency',
      values: 5,
      validation: [Validators.required,Validators.min(0)], // Ensure the value is positive or zero
      validationMessage: 'La valeur doit être supérieure ou égale à 0', // Validation message
    },
    {
      id: 'goal',
      collection : 'goals',

      question: 'Combien d\'argent souhaitez-vous économiser ?',
      multiplier : '1',
      type: 'number-currency',
      values: 5,
      validation: [Validators.required,Validators.min(0)], // Ensure the value is positive or zero
      validationMessage: 'La valeur doit être supérieure ou égale à 0', // Validation message
    },
    {
      id: 'limite',
      collection : 'goals',
      question: 'À quelle date souhaitez-vous accomplir cet objectif ?',
      type: 'date',
      values: null,
      validation: [Validators.required, this.dateGreaterThanOneWeek()], // Use the custom validation function
      validationMessage: 'La date doit être d\'au moins une semaine à partir d\'aujourd\'hui', // Validation message
    },
    {
      id: 'frequence',
      question: 'Quelle fréquence de suivi préférez-vous ?',
      collection : 'goals',
      type: 'dropdown',
      values: ['mensuel', 'hebdomadaire', 'trimestriel'],
      validation: [Validators.required], // Validation rule for required selection
      validationMessage: 'Ce champ est obligatoire',
    },
    {
      id: 'choosen-date',
      collection : 'goals',
      question: 'Quel jour de la semaine préférez-vous pour le suivi ?',
      type: 'dropdown',
      values:  ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
      validation: [Validators.required], // Validation rule for required selection
      validationMessage: 'Ce champ est obligatoire',
    },

    {
      id: 'income-source',
      question: 'Quelle est votre principale source de revenu ?',
      collection : 'profil',
      type: 'text',
      values: null,
      validation: [], // No built-in validation rules (not required)
      validationMessage: 'Ce champ est facultatif',
    },
    {
      id: 'SummaryTab',
      collection : 'none',
      question: 'Résumé des réponses',
      type: 'summary',
      values: null,
      validation: [], // No built-in validation rules (not required)
      validationMessage: 'Ce champ est facultatif',
    },
  ];
  generateRandomId(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  constructor(private fb: FormBuilder,private profilService : ProfilService) {
    this.questions.forEach((question) => {
      let questionFb : any
      if(question.type != 'number-currency'){
         questionFb = this.fb.group({
          [question.id]: [
            '',
            question.validation ? Validators.compose(question.validation) : null, // Apply multiple validation rules if defined
          ],
        })
      }else {
         questionFb = this.fb.group({
          [question.id]: [
            '',
            question.validation ? Validators.compose(question.validation) : null, // Apply multiple validation rules if defined
          ],['multiplier'] : [1,Validators.required]
        })
      }

      this.form.push(
        questionFb
      );
    });
    this.form[5].get(this.questions[5].id)?.valueChanges.subscribe((selectedFrequency) => {
      if (selectedFrequency === 'hebdomadaire') {
        // If 'hebdomadaire' is selected, provide days of the week as options
        this.questions[6].values = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
      } else {
        // Otherwise, provide default options 1-30
        this.questions[6].values = Array.from({ length: 28 }, (_, index) => String(index + 1));
      }
    });
  }
  get isFormValid(): boolean {
    // Iterate through form groups and check if they are all valid
    for (const formGroup of this.form) {
      if (!formGroup.valid) {
        return false;
      }
    }
    return true;
  }

  handleEnterKey() {
    // Handle Enter key press to switch to the next tab
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  handleTabChange() {

  }

 getQuestions() :any[]{
    return this.questions.filter(x=>{
      return x.type!='summary'
    })
 }
  submitForm() {
    this.profilService.addNewProfil(this.form,this.questions)
  }


}
