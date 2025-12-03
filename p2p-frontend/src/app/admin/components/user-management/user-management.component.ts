import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// --- Material Imports ---
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../services/admin.service';
import { UserProfile } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  // --- THIS IS THE COMPLETED IMPORTS ARRAY ---
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule 
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  // --- Updated Columns Array ---
  displayedColumns: string[] = ['name', 'role', 'createdAt', 'isActive', 'actions'];
  dataSource: MatTableDataSource<UserProfile>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<UserProfile>([]);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data: UserProfile[]) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.snackBar.open('Failed to load users.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Updated sorting accessor for combined name field
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name': return `${item.firstName} ${item.lastName}`;
        default: 
          return (item as any)[property];
      }
    };
    
    // Updated filter predicate to search in multiple fields
    this.dataSource.filterPredicate = (data: UserProfile, filter: string) => {
      const dataStr = `${data.firstName} ${data.lastName} ${data.email} ${data.role}`.toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onActivationToggle(event: MatSlideToggleChange, user: UserProfile): void {
    // This function remains the same, it's already perfect.
    const newStatus = event.checked;
    this.adminService.toggleUserActivation(user.userId).subscribe({
      next: () => {
        this.snackBar.open(`User ${user.firstName} is now ${newStatus ? 'active' : 'inactive'}.`, 'Close', { duration: 2000 });
        user.isActive = newStatus;
      },
      error: (err: any) => { 
        this.snackBar.open('Failed to update user status. Please try again.', 'Close', { duration: 3000 });
        event.source.toggle(); 
      }
    });
  }
}