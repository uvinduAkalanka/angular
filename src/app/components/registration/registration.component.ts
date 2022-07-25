import { UserService } from './../../services/user.service';
import { UserData } from './../../models/userData';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  userFormGroup!: FormGroup;

  get firstnameControl(): AbstractControl { return this.userFormGroup?.get('firstname') as FormGroup; }
  get lastnameControl(): AbstractControl { return this.userFormGroup?.get('lastname') as FormGroup; }
  get emailControl(): AbstractControl { return this.userFormGroup?.get('email') as FormGroup; }

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.createUserDetailsForm();

  }

  createUserDetailsForm() {
    this.userFormGroup = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  userRagistartion() {
    let user: UserData = {
      first_name: this.firstnameControl.value,
      last_name: this.lastnameControl.value,
      email: this.emailControl.value,
      avatar: "https://reqres.in/img/faces/7-image.jpg"
    };

    this.userService.createUserData(user).subscribe((res) => {
      console.log(res);
      this.snackBar.open('User Registartion Successfully', 'X', {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center"
      });
      this.userFormGroup.reset();
      this.userFormGroup.clearValidators();
    }, (e) => {
      console.log(e);
      this.snackBar.open(e, 'X', {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center",
        panelClass: ["custom-style"]
      });
    });

    console.log(user);
  }

  cancle(): void{
    this.userFormGroup.reset();
  }

}
