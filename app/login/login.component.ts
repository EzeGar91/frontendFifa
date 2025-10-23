import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  isLoginMode = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: [''] // Solo para registro
    });

    // Actualizar validaciones según el modo
    this.updateFormValidations();
  }

  private updateFormValidations() {
    const usernameControl = this.loginForm.get('username');
    
    if (this.isLoginMode) {
      usernameControl?.clearValidators();
    } else {
      usernameControl?.setValidators([Validators.required, Validators.minLength(3)]);
    }
    
    usernameControl?.updateValueAndValidity();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.updateFormValidations();
    
    // Limpiar el campo username cuando cambie a login
    if (this.isLoginMode) {
      this.loginForm.patchValue({ username: '' });
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      if (this.isLoginMode) {
        this.login();
      } else {
        this.register();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private login() {
    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error?.error || 'Error al iniciar sesión';
        this.isLoading = false;
      }
    });
  }

  private register() {
    const userData = {
      username: this.loginForm.value.username,
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.error?.error || 'Error al registrarse';
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${requiredLength} caracteres`;
      }
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'email': 'Email',
      'password': 'Contraseña',
      'username': 'Nombre de usuario'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
