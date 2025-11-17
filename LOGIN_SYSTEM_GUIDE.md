# Enhanced Login System Guide

## Overview
This enhanced login system provides comprehensive authentication and authorization features for your Angular application, supporting both admin/employee and customer login flows.

## Features

### 🔐 Authentication
- **Dual Login System**: Separate endpoints for employees (`/api/auth/nhan_vien_login`) and customers (`/api/auth/khach_hang_login`)
- **JWT Token Management**: Secure token storage with automatic expiration handling
- **Form Validation**: Comprehensive client-side validation with user-friendly error messages
- **Remember Me**: Optional credential storage for customer login
- **Loading States**: Visual feedback during authentication process

### 🛡️ Security
- **Token Expiration**: Automatic token validation and cleanup
- **HTTP Interceptor**: Automatic token attachment to API requests
- **Route Guards**: Protection for authenticated routes with role-based access
- **Secure Storage**: Proper token and user data management

### 👤 User Management
- **User Profiles**: Complete user information management
- **Role-Based Access**: Support for ADMIN, EMPLOYEE, MANAGER, and CUSTOMER roles
- **Profile Updates**: Update user information, phone, email
- **Address Management**: Customer address CRUD operations

## Components

### 1. Login Service (`LoginServiceService`)
Enhanced service with better error handling and type safety.

```typescript
// Employee login
this.loginService.loginEmployee(credentials).subscribe({
  next: (response) => {
    if (response.token) {
      this.tokenService.setToken(response.token, response.user);
      // Handle success
    }
  },
  error: (error) => {
    // Handle error
  }
});

// Customer login
this.loginService.loginCustomer(credentials).subscribe({
  // Similar handling
});
```

### 2. Token Service (`TokenService`)
Comprehensive token and user management.

```typescript
// Check authentication
const isAuth = this.tokenService.isAuthenticated();

// Get user info
const userInfo = this.tokenService.getUserInfo();

// Check roles
const isAdmin = this.tokenService.hasRole('ADMIN');
const hasAnyRole = this.tokenService.hasAnyRole(['ADMIN', 'EMPLOYEE']);

// Observable streams
this.tokenService.isAuthenticated$.subscribe(isAuth => {
  // Handle auth state changes
});
```

### 3. Auth Guard (`AuthGuard`)
Route protection with role-based access control.

```typescript
// In your routing module
{
  path: 'admin',
  canActivate: [AuthGuard],
  data: { roles: ['ADMIN', 'EMPLOYEE'] },
  component: AdminComponent
}
```

### 4. User Service (`UserService`)
Complete user profile management.

```typescript
// Get user profile
this.userService.getCurrentUserProfile();

// Update profile
this.userService.updateCustomerProfile(profileData).subscribe();

// Manage addresses
this.userService.getUserAddresses(customerId).subscribe();
```

## Usage Examples

### Basic Login Implementation

```typescript
// In your component
export class LoginComponent {
  loginForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private loginService: LoginServiceService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      
      this.loginService.loginEmployee(credentials).subscribe({
        next: (response) => {
          if (response.token) {
            this.tokenService.setToken(response.token, response.user);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error.message);
        }
      });
    }
  }
}
```

### Route Protection

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'EMPLOYEE'] },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'customer',
    canActivate: [AuthGuard],
    data: { roles: ['CUSTOMER'] },
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
  }
];
```

### Authentication Status Component

```html
<!-- Use in your header/navbar -->
<app-auth-status></app-auth-status>
```

## API Integration

### Login Endpoints
- **Employee Login**: `POST /api/auth/nhan_vien_login`
- **Customer Login**: `POST /api/auth/khach_hang_login`

### Request Format
```json
{
  "username": "user@example.com",
  "pass": "password123"
}
```

### Response Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "role": "CUSTOMER",
    "fullName": "John Doe"
  },
  "message": "Đăng nhập thành công"
}
```

## Configuration

### 1. App Module Setup
Ensure these modules are imported:

```typescript
@NgModule({
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    // ... other modules
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
```

### 2. Environment Configuration
Update your environment files:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  tokenKey: 'jwtToken'
};
```

## Error Handling

The system provides comprehensive error handling:

- **400**: Invalid credentials format
- **401**: Wrong username/password
- **403**: Account locked or insufficient permissions
- **404**: Login service not found
- **500**: Server error

## Best Practices

### 1. Token Management
- Tokens are automatically attached to requests
- Expired tokens trigger automatic logout
- Secure storage in localStorage

### 2. Form Validation
- Client-side validation with real-time feedback
- Server-side error handling
- User-friendly error messages

### 3. Security
- Automatic token cleanup on logout
- Route protection with guards
- Role-based access control

### 4. User Experience
- Loading states during authentication
- Remember me functionality
- Smooth navigation after login/logout

## Troubleshooting

### Common Issues

1. **Token not attached to requests**
   - Ensure AuthInterceptor is properly configured
   - Check if token exists and is not expired

2. **Login form validation errors**
   - Verify ReactiveFormsModule is imported
   - Check form control names match template

3. **Route guard not working**
   - Ensure guards are properly imported and configured
   - Check role data in route configuration

4. **CORS issues**
   - Configure backend to allow frontend origin
   - Check API base URL configuration

## Migration from Old System

If you're migrating from the old login system:

1. **Update imports**: Change to new service methods
2. **Form validation**: Replace template-driven with reactive forms
3. **Error handling**: Update to use new error response format
4. **Route guards**: Add authentication guards to protected routes

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Ensure proper module imports
4. Check token expiration and storage

---

This enhanced login system provides a robust, secure, and user-friendly authentication experience for your application.