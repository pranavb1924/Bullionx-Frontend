import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // In case you need router directives
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Define a user object for binding the form
  user = {
    email: '',
    password: ''
  };

  // Inject AuthService
  constructor(private authService: AuthService) {}

  // onSubmit() will call the AuthService.login() method
  onSubmit(): void {
    console.log('Login attempt:', this.user);
    this.authService.login(this.user).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        alert('Login successful!');
        // Here you could store the token or navigate to a protected page
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        alert('Login failed. Check console for details.');
      }
    });
  }
}
