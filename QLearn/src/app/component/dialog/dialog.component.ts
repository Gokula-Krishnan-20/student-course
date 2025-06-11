import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
 
// Angular Material & Forms modules needed for dialog UI and forms
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
 
@Component({
  selector: 'app-dialog',
  standalone: true, // Enables use as a standalone component
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  // Holds the list of course modules being added/edited
  modules: { title: string; description: string }[] = [];
 
  // Stores current user's role (used to conditionally show features if needed)
  roles: string | null | undefined;
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Data passed into the dialog
    private dialogRef: MatDialogRef<DialogComponent>, // Reference to control dialog state (close, pass data, etc.)
    private snackBar: MatSnackBar // Snackbar for showing messages
  ) {}
 
  ngOnInit() {
    // Get the user's role from localStorage
    this.roles = localStorage.getItem('role');
    console.log(this.roles);
 
    // If dialog is used for editing modules, initialize with passed data or default one module field
    if (this.data.type === 'modules') {
      this.modules = this.data.modules?.length ? [...this.data.modules] : [{ title: '', description: '' }];
    }
  }
 
  // Adds a new empty module field
  addModule() {
    this.modules.push({ title: '', description: '' });
  }
 
  // Removes a module field by index
  removeModule(index: number) {
    this.modules.splice(index, 1);
  }
 
  // Displays a toast message using Angular Material Snackbar
  showToast(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }
 
  // Validates module inputs and sends them back to the parent component if valid
  saveModules() {
    const invalid = this.modules.some(
      m => !m.title.trim() || !m.description.trim() || // Check for empty strings
      !/^(?![\d\W]+$)[\w\s]+$/.test(m.title) ||       // Reject titles with only symbols/numbers
      !/^(?![\d\W]+$)[\w\s]+$/.test(m.description)    // Reject descriptions with only symbols/numbers
    );
 
    if (invalid) {
      this.showToast('Please fill valid text for all modules (no numbers/symbols only)');
      return;
    }
 
    this.dialogRef.close(this.modules); // Return the valid module data to the parent
  }
 
  // Close dialog without saving any data
  closeModuleDialog() {
    this.dialogRef.close();
  }
 
  // Cancel current operation and send `false` (can be used to trigger cancel logic in parent)
  onCancel() {
    this.dialogRef.close(false);
  }
 
  // Confirm deletion and send `true` (can be used for delete confirmation in parent)
  onDelete() {
    this.dialogRef.close(true);
  }
}