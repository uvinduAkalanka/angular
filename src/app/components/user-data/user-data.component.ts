import { UserService } from './../../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UserData, UserDataResponse } from '../../models/userData';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
})
export class UserDataComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource?: MatTableDataSource<UserData>;
  userResponse?: UserDataResponse;
  pageNumber: number = 1;

  constructor(private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        const page = isNaN(+params?.['page']) ? 1 : +params?.['page'] ?? 1;
        console.log(page);
        this.getUserDetails(page);
        this.pageNumber = page;
      });
  }
  displayedColumns: string[] = [
    'image',
    'id',
    'email',
    'first_name',
    'last_name',
    'action',
  ];

  editUser(row: UserData): void {
    this.dialog.open(UserEditComponent, {
      width: '500px',
      height: '400px',
      data: row,
    });
  }

  getUserDetails(page: number) {
    this.userService.getUserData(page).subscribe((data) => {
      this.userResponse = data;
      this.dataSource = new MatTableDataSource<UserData>(data.data);
      console.log(this.dataSource);
    });
  }

  handlePageEvent(event: PageEvent) {
    this.router.navigate(['userdata'], { queryParams: { page: event.pageIndex + 1 } });
  }

  deleteUser(row: UserData) {
    console.log(row);
    this.userService.deleteUserData(row).subscribe((res) => {
      this.getUserDetails(this.pageNumber);
      console.log(res);
      this.snackBar.open('User Delete Successfully', 'X', {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }, (e) => {
      console.log(e);
      this.snackBar.open(e, 'X', {
        duration: 2000,
        verticalPosition: "top",
        horizontalPosition: "center",
        panelClass: ["custom-style"]
      });

    });
  }
}
