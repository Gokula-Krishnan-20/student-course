import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dialog',
  imports:[MatDialogModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatDividerModule,FormsModule,CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})export class DialogComponent implements OnInit {
  modules: { title: string; description: string }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  roles:any;
  ngOnInit() {
     this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  
    if (this.data.type === 'modules') {
      this.modules = this.data.modules && this.data.modules.length > 0
        ? [...this.data.modules]
        : [{ title: '', description: '' }];  // Add at least one blank module if none
    }
  }

  addModule() {
    this.modules.push({ title: '', description: '' });
  }

  removeModule(index: number) {
    this.modules.splice(index, 1);
  }

  saveModules() {
    this.dialogRef.close(this.modules);
  }

  closeModuleDialog() {
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onDelete() {
    this.dialogRef.close(true);
  }
}
