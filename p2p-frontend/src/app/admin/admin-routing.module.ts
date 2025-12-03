import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// --- Import all components that will be used in the admin section ---
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { KycReviewComponent } from './components/kyc-review/kyc-review.component';
import { StockCurationComponent } from './components/stock-curation/stock-curation.component';
// import { AuditLogViewerComponent } from './components/audit-log-viewer/audit-log-viewer.component';
import { AdminLoanManagementComponent } from '../admin/components/admin-loan-management/admin-loan-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // The shell/layout component with the sidebar
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'kyc-review', component: KycReviewComponent },
      { path: 'loan-management', component: AdminLoanManagementComponent },
      // { path: 'loan-management', component: AdminLoanManagementComponent },
      { path: 'stock-curation', component: StockCurationComponent },
      // { path: 'audit-logs', component: AuditLogViewerComponent },

      // If a user navigates to just '/admin', redirect them to the dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }