import { Component, OnInit } from '@angular/core';
import { NgForm, AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MasterService } from '../services/master.service';
import { MatDialogRef, MatDialog } from '@angular/material';




function onEmailGiven(c: AbstractControl): any {
  if (!c.parent || !c) return;
  const pwd = c.parent.get('username');
  if (!pwd) return;
  if (pwd.value !== '' && pwd.value !== null) {
    var b = validateEmail(pwd.value); //|| validatePhone(pwd.value)
    if (b)
      return
    else
      return { invalid: true }
  }

}

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}
function validatePhone(phone) {
  var re = /^[1-9]+[0-9]*$/;
  return re.test(phone);
}



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitFlag = false;
  emailexist: boolean = false;
  userDetails = { userId: 'jobportal@gmail.com', passeord: 'jobportal' };
  l_form: FormGroup;
  message = '';

  constructor(
    public masterSerObj: MasterService,
    private routerobj: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>
) {
  }

  ngOnInit() {

    this.l_form = new FormGroup({
      'password': new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9@\#\$\&\* ]*$')]),
      'username': new FormControl('', [Validators.required, onEmailGiven,
        // Validators.pattern('^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(\d+$)$')
      ]),
     
    });
  }
 
  onsignin(f: NgForm) {

    this.message = '';
   
    if (f.valid) {
      const user = this.l_form.value.username.trim();
      const password = this.l_form.value.password.trim();
      if (!this.emailexist) {
        var options = {
          email: user,
          password: password,
          
        }
        this.masterSerObj.postuserLogin(options).subscribe(
          (data: any) => {
            var res: any = <any>data;
            console.log(data);
            if (res.status === 1) {
              var arr = res.data[0];
              console.log(arr);
              this.masterSerObj.userData= res.data;
              this.masterSerObj.token = arr._id;
              localStorage.setItem('token', this.masterSerObj.token);
              localStorage.setItem('userData', JSON.stringify(this.masterSerObj.userData));
              this.masterSerObj.userId = arr.uid;
              this.dialogRef.close();
            }
          },
          (error) => {
          
            if (error.status === 401) {
              this.message = 'Invalid Mail ID/Password';
            } else if (error.status === 0) {
              alert('please try gain later');
            } else if (error.status > 0) {
             alert(error.error.messageText)
            }
          }
        )
      } else {
        alert('Entered Email not Registred');
      }
    } else {
      this.submitFlag = true;
    }
  }

 
}
