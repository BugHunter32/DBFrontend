import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { KycComponent } from './components/kyc/kyc.component';
import { authGuard } from './guards/auth.guard';
import { loggedInGuard } from './guards/logged-in.guard'; // <-- IMPORT THE NEW GUARD
import { WalletComponent } from './components/wallet/wallet.component';
import { LoanApplicationComponent } from './components/loan-application/loan-application.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { MyLoansComponent } from './components/my-loan/my-loans.component';
import { SecondaryMarketListing } from './services/secondary-market.service';
import { SecondaryMarketplaceComponent } from './components/secondary-marketplace/secondary-marketplace.component';
import { RoboAdvisorSettingsComponent } from './components/robo-advisor-settings/robo-advisor-settings.component';
import { StockMarketComponent } from './components/stock-market/stock-market.component';
import { StockDetailComponent } from './components/stock-detail/stock-detail.component';
import { StockPortfolioComponent } from './components/stock-portfolio/stock-portfolio.component';
import { roleGuard } from './guards/role.guard';
import { LoanDetailComponent } from './components/loan-detail/loan-detail.component';
export const routes: Routes = [
  // Public routes are now protected by the loggedInGuard
{ path: 'loan-detail/:id', component: LoanDetailComponent, canActivate: [authGuard] },
  // Protected routes remain protected by the authGuard
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    canMatch: [authGuard, roleGuard],
    // This now points to the AdminModule, not the routes file.
    loadChildren: () =>
       import('./admin/admin.module').then(m => m.AdminModule)
  },
    { path: 'login', component: LoginComponent, canActivate: [loggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loggedInGuard] },
  { path: 'kyc', component: KycComponent, canActivate: [authGuard] },
  { path: 'wallet', component: WalletComponent, canActivate: [authGuard] },
  // { path: 'borrower-dashboard', component: BorrowerDashboardComponent, canActivate: [authGuard] },
  { path: 'apply-for-loan', component: LoanApplicationComponent, canActivate: [authGuard] },
  { path: 'secondary-market', component: SecondaryMarketplaceComponent, canActivate: [authGuard] },
  { path: 'settings/robo-advisor', component: RoboAdvisorSettingsComponent, canActivate: [authGuard] },
  { path: 'marketplace', component: MarketplaceComponent, canActivate: [authGuard] },
  { path: 'apply-for-loan', component: LoanApplicationComponent, canActivate: [authGuard] },
  { path: 'marketplace', component: MarketplaceComponent, canActivate: [authGuard] },
  // A single route for both borrower's loans and lender's investments
  { path: 'my-loans', component: MyLoansComponent, canActivate: [authGuard] },
  { path: 'stock-market', component: StockMarketComponent, canActivate: [authGuard] },
  { path: 'stock-portfolio', component: StockPortfolioComponent, canActivate: [authGuard] },
  // A route with a parameter for viewing a specific stock's details
  { path: 'stock-detail/:id', component: StockDetailComponent, canActivate: [authGuard] },
  // Redirects
  { path: '', redirectTo: '/my-loans', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];