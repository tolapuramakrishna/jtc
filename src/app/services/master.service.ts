import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class MasterService {

  token = "";
  userId: any;
  apiUrl = '';

  userData = [];
  constructor(
    private http: HttpClient,
    private routerObj: Router,
  ) {
    if (environment.production) {
      this.apiUrl = environment.prodApiUrl;
    }

    const temp = localStorage.getItem('token');
    if ([undefined, '', null].indexOf(temp) == -1) {
      this.token = temp;
      this.userData = JSON.parse(localStorage.getItem('userData'));
      this.userId = this.userData[0].uid;
    }
  }

  checkUselogin() {
    if (this.token !== null && this.token !== '' && this.token !== undefined) {
      return true;
    } else {
      return false;
    }
  }
  postuserLogin(options) {
    return this.http.post(this.apiUrl + '/v1/login', options);
  }
  postRegistration(options) {
    return this.http.post(this.apiUrl + '/v1/userregister', options)
  }

  getComments() {
    return this.http.get(this.apiUrl + '/v1/comments')
  }

  postCommnet(options){
    return this.http.post(this.apiUrl + '/v1/comment',options)
  }

  putComment(options){
    return this.http.put(this.apiUrl + '/v1/upvote',options)
  }


  restrictNumeric(event) {
    const pattern = /^[a-zA-Z ]+$/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 9 && event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onlyNumberKey(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 9 && event.keyCode != 8 && event.keyCode != 13 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  AlphaNumeric(event) {
    const pattern = /[a-zA-Z0-9]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 9 && event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  withspace(event) {
    const pattern = /[a-zA-Z0-9 ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 9 && event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

export interface BooksData {
  id: string;
  name: string;
  progress: string;
  color: string;
}