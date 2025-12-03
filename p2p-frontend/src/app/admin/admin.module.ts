import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// --- Import the routing module ---
import { AdminRoutingModule } from './admin-routing.module';

// --- Import all standalone components used in this module ---
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { KycReviewComponent } from './components/kyc-review/kyc-review.component';
import { StockCurationComponent } from './components/stock-curation/stock-curation.component';
// import { AuditLogViewerComponent } from './components/audit-log-viewer/audit-log-viewer.component';
// import { AdminLoanManagementComponent } from './components/admin-loan-management/admin-loan-management.component';

// --- Import all Angular Material modules used by the components ---
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// ... add any other Material modules as needed

@NgModule({
  declarations: [
    // Components that are NOT standalone would be declared here.
  ],
  imports: [
    // Angular Modules
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,

    // Standalone Components
    AdminLayoutComponent,
    AdminDashboardComponent,
    UserManagementComponent,
    KycReviewComponent,
    StockCurationComponent,
    // AuditLogViewerComponent,
    // AdminLoanManagementComponent,

    // Material Modules
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AdminModule { }