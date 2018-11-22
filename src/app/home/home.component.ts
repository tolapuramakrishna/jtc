import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { MasterService } from '../services/master.service';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  commentArr = [];
  txt_comment = '';
  postBtnFlag = false;

  constructor(
    public dialog: MatDialog,
    public masterObj: MasterService
  ) { }

  ngOnInit() {
    this.getcomment();

    setInterval(() => {

      this.getcomment();
    }  , 10000);
  }

  onRegister() {
    this.dialog.open(RegistrationComponent, {

    })
  }
  onLogin() {
    this.dialog.open(LoginComponent, {

    })
  }
  onLogout() {
    this.masterObj.token = '';
    localStorage.setItem('token', '');
    this.masterObj.userData = [];
    this.masterObj.userId = '';
  }

  onUpvote(id) {
    if (this.masterObj.token == '') {
      alert("Please login");
    } else {
      let options = {
        uid: this.masterObj.userId,
        commentId: id
      }
      this.masterObj.putComment(options).subscribe(
        (res: any) => {

          this.getcomment();
        },
        (err) => {

        }
      );
    }
  }
  onPostComment(txt_comment) {
    if (this.masterObj.token == '') {
      alert("Please login");
    } else {
      this.postBtnFlag = true;
      let options = {
        uid: this.masterObj.userId,
        comment: txt_comment
      }
      this.masterObj.postCommnet(options).subscribe(
        (res: any) => {

          this.commentArr = res.data;
          this.txt_comment = '';
          this.postBtnFlag = false;
          this.getcomment();
        },
        (err) => {
          this.postBtnFlag = false;
        }
      );
    }
  }

  getcomment() {
    this.masterObj.getComments().subscribe(
      (res: any) => {

        this.commentArr = res.data;
      },
      (err) => {

      }
    )
  }

  isUserUpvoted(commentId) {
    if (this.masterObj.userId) {
      let temp = this.commentArr.filter(x => x.commentId == commentId)
      if (temp.length) {
        if (temp[0].upVoteduid.indexOf(this.masterObj.userId) == -1)
          return false;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }
}
