import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; 




@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  userForm !: FormGroup;
  actionBtn :string ="save"
  text1:string ="User Updated Successfully"
  text5:string = "User added successfully"
  constructor(
    private formBuilder : FormBuilder , 
    private api : ApiService, 
    @Inject(MAT_DIALOG_DATA) public editUser:any,
    private dialogRef : MatDialogRef<DialogComponent>,
    private snackBar : MatSnackBar
    ) { }
  
  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
    userName : ['',Validators.required],
    age : ['',Validators.required],
    mobile : ['',Validators.required]
    });

    if(this.editUser){
      this.actionBtn = "Update";
      this.userForm.controls['userName'].setValue(this.editUser.userName);
      this.userForm.controls['age'].setValue(this.editUser.age);
      this.userForm.controls['mobile'].setValue(this.editUser.mobile);
    }
  }

  

  addUser(){
    if(!this.editUser){
      if(this.userForm.valid){
        this.api.postUser(this.userForm.value)
        .subscribe ({
          next:(res) =>{
            // alert("User Added Successfully");
            // this.addSnack(this.text5);
            this.snackBar.open(this.text5.toString(),'',{
              duration:3000,
              verticalPosition:'top'
            })
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error:() => {
            alert("error whilw adding the user")
          }
        })
      }
    }else{
      this.updateUser()
    }
  }
// addUser(){
//   this.dialogService.openConfirmDialog('Are you sure to do this operation?')
//     .afterClosed().subscribe(res =>{
//       if(res){
//         if(!this.editUser){
//               if(this.userForm.valid){
//                 this.api.postUser(this.userForm.value)
//                 .subscribe ({
//                   next:(res) =>{
//                     // alert("User Added Successfully");
//                     // this.addSnack(this.text5);
//                     this.snackBar.open(this.text5.toString(),'',{
        
//                       duration:3000,
//                       verticalPosition:'top'
//                     })
//                     this.userForm.reset();
//                     this.dialogRef.close('save');
//                   },
//                   error:() => {
//                     alert("error whilw adding the user")
//                   }
//                 })
//               }
//             }else{
//               this.updateUser()
//             }
//           }
//       })
// }



  updateUser(){
      this.api.putUser(this.userForm.value, this.editUser.id)
      .subscribe({
        next:(res) =>{
          // alert("User Updated SuccessFully");
          // 
          this.snackBar.open(this.text1.toString(),'',{

            duration:3000,
            verticalPosition:'top'
          })
          this.userForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          alert("Error");
        }
      })
  }

}