import { Component, OnInit, createPlatformFactory } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dynamic-angular-form';
  formTemplate: any;
  dynamicFormGroup: FormGroup;

  constructor() { }

  ngOnInit() {
    this.formTemplate = [
      {
        id: 'q1_1',
        type: "textbox",
        label: "What are your thoughts on the coupoon?",
      },
      {
        id: 'q1_2',
        type: "textbox",
        label: "Was this your first coupon on the blingg? How easy or difficult it was to use the platform?"
      },
      {
        id: 'q1_3',
        type: 'radio',
        label: 'Rate your experience out of 5',
        options: [1, 2, 3, 4, 5]
      },
      {
        id: 'q1_4',
        type: 'checkbox',
        label: "What are the things you liked the most? (Can select more than 1)",
        options: ["Price", "Taste", "Location", "Service"]
      }
    ];

    this.createDynamicForm(this.formTemplate);
  }

  createDynamicForm(formTemplate: any[]) {
    // form group object
    let group = {};

    // for each object in the form template, create a form control and add it to the form group obj
    formTemplate.forEach(inputTemplate => {
      if (inputTemplate.type !== 'checkbox') {
        group[inputTemplate.id] = new FormControl('', [Validators.required]);
      } else {
        // there will be no required validation for form array as the user might not want to select any checkbox
        group[inputTemplate.id] = new FormArray([]);
        group = this.addCheckBoxes(group, inputTemplate.id, inputTemplate.options);
      }
    });

    this.dynamicFormGroup = new FormGroup(group);
  }

  addCheckBoxes(formGroup, controlName, options: any[]) {
    options.forEach(option => {
      // generate a form control for every option
      const control = new FormControl('');
      (formGroup[controlName] as FormArray).push(control);
    });

    return formGroup;
  }

  onSubmit() {
    if (this.dynamicFormGroup.valid) {
      let formValues = this.dynamicFormGroup.value;
      for (let prop in formValues) {
        if (formValues.hasOwnProperty(prop)) {
          if (typeof formValues[prop] == "object") {
            const originalArray = this.formTemplate.filter(item => item.id === prop);
            formValues[prop] = this.fetchSelectedValuesFromArray(originalArray[0].options, formValues[prop]);
          }
        }
      }
      console.log('final', formValues);
    } else {
      this.validateAllFormFields(this.dynamicFormGroup);
    }
  }

  validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
  }

  fetchSelectedValuesFromArray(originalArray: any[], selectedArray: any[]) {
    const selectedValues = originalArray.filter((item, i) => selectedArray[i] === true);
    return selectedValues;
  }
}

