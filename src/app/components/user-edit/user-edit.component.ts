import { UserData } from './../../models/userData';
import { UserService } from './../../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  userFormGroup!: FormGroup;

  get firstnameControl(): AbstractControl { return this.userFormGroup?.get('firstname') as FormGroup; }
  get lastnameControl(): AbstractControl { return this.userFormGroup?.get('lastname') as FormGroup; }
  get emailControl(): AbstractControl { return this.userFormGroup?.get('email') as FormGroup; }

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: UserData,
    public dialogRef: MatDialogRef<UserEditComponent>,) { }

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

  onSubmit() {

    let user: UserData = {
      ...this.data,
      first_name: this.firstnameControl?.value,
      last_name: this.lastnameControl?.value,
      email: this.emailControl?.value,
    }
    this.userService.editUserData(user).subscribe((res) => {
      console.log(res);
      this.snackBar.open('User Edit Successfully', 'X', {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center"
      });
      this.onNoClick();
    }, (e) => {
      this.snackBar.open(e, 'X', {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center",
        panelClass: ["custom-style"]
      });
      console.log(e);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancle(): void{
    this.userFormGroup.reset();
  }

}
