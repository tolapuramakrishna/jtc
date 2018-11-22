import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MasterService } from '../services/master.service';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material';




function onConfirmPasswordGiven(c: AbstractControl): any {
  if (!c.parent || !c) return;
  const pwd = c.parent.get('password');
  const cpwd = c.parent.get('confirmPassword')

  if (!pwd || !cpwd) return;
  if (pwd.value !== cpwd.value) {
    // console.log(pwd.value,cpwd.value)
    return { invalid: true };

  } else {
    return
  }
}


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  btnSubmit = false;
  emailexist = false;
  passmatch = false;
  reg_form: FormGroup;
  passmismatch = false;
  checked = false;
  constructor(
    private fb: FormBuilder,
    public masterSerObj: MasterService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegistrationComponent>
  ) {

  }


  private matchValidator(pwd, cpwd) {

    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[pwd];
      let confirmPassword = group.controls[cpwd];

      if (password.value !== confirmPassword.value) {
        this.btnSubmit = false;
        return {
          mismatchedPasswords: true
        };
      }
    }

  }
  ngOnInit() {

    this.reg_form = this.fb.group({
      'firstname': new FormControl('', [Validators.pattern('^[a-zA-Z ]*$')]),
      // 'lastname': new FormControl('', [Validators.pattern('^[a-zA-Z ]*$')]),
      // 'mobile': new FormControl('', [Validators.minLength(10), Validators.pattern('^[1-9]+[0-9]*$')]),
      'email': new FormControl(null, [Validators.required, Validators.pattern('^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(\d+$)$')]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6),
      Validators.pattern('^[a-zA-Z0-9@\#\$\&\* ]*$')], ),
      'confirmPassword': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9@\#\$\&\* ]*$')]),

    }, { validator: this.matchValidator('password', 'confirmPassword') });
    // console.log(this.reg_form)
  }




  /* registration submit button */
  onRegister() {

    if (!this.reg_form.valid) {
      alert('Please provide required details');
      this.btnSubmit = true;
    } else {
      this.btnSubmit = false;
      if (this.reg_form.controls.password.value !== this.reg_form.controls.confirmPassword.value) {
        alert('Password & Confirm password not matching');
      } else if (!this.checked) {
        alert("Please accept terms & conditions");
      } else {

        var options = {
          "userName": this.reg_form.controls.firstname.value.trim(),
          "email": this.reg_form.controls.email.value.trim(),
          "password": this.reg_form.controls.password.value.trim(),
        }

        this.masterSerObj.postRegistration(options).subscribe(
          (data: any) => {
            var res: any = <any>data;
            console.log(res);
            this.dialogRef.close();
            if (res.status === 1) {
              alert('Registration Successfull');

            } else {
              alert('Registration failed please try after some time');
            }
          },
          (error) => {
            console.log(error)
            if (error.status === 0) {
              alert('Please try again later');
            } else {
              alert(error.error.messageText);
            }
          }
        );

      }
    }
  }

  // gotoLogin() {
  //   this.dialogRef.close();
  //   this.dialog.open(LoginComponent, {
  //     height: '300px', width: '400px'
  //   })
  // }
}
