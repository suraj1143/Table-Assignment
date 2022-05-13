import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogComponent } from "./dialog/dialog.component";
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DsService } from './shared/ds.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  text = '!!User deleted successfully'; 
  text4 = 'User added successfully'

  displayedColumns: string[] = ['userName', 'age', 'mobile','action'];
  dataSource !: MatTableDataSource<any>;


  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(
    private dialog: MatDialog,
    private api:ApiService,
    private snackBar: MatSnackBar,
    private dialogService: DsService ){
  }

 

  ngOnInit(): void {
    this.getAllUsers();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val => {
      if(val === 'save'){
        this.getAllUsers();
      }
    })
  }
  
  
  getAllUsers(){
    this.api.getUser()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Error while fetching the records!!");
      }
    })
  }

  
  //   this.dialog.open(DialogComponent,{
  //     width: '30%',
  //     data:row
  //   }).afterClosed().subscribe(val =>{
  //     if(val === 'update'){
  //       this.getAllUsers();
  //     }
  //   })
  // }
  editUser(row:any){
    this.dialogService.openConfirmDialog('Are you sure to do this operation?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.dialog.open(DialogComponent,{
              width: '30%',
              data:row
            }).afterClosed().subscribe(val =>{
              if(val === 'update'){
                this.getAllUsers();
              }
            })
          }
      })
  }


  deleteUser(id:number){
    // this.api.deleteUser(id)
    // .subscribe({
    //   next:(res) => {
    //     this.snackBar.open(this.text.toString(),'',{

    //       duration:3000,
    //       verticalPosition:'top'
    //     })
    //     this.getAllUsers();
    //   },
    //   error:()=>{
    //     alert("Error while deleting the user")
    //   }
    // })
    this.dialogService.openConfirmDialog('Are you sure to do this operation?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.api.deleteUser(id)
        .subscribe({
            next:(res) => {
              this.snackBar.open(this.text.toString(),'',{
      
                duration:3000,
                verticalPosition:'top'
              })
              this.getAllUsers();
            },
            error:()=>{
              alert("Error while deleting the user")
            }
          })
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

