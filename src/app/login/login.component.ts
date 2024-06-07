import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MessagesService} from "../messages/messages.service";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { retry } from 'rxjs';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', Validators.required], 
    password: ['', Validators.required],
  });

  messagesService = inject(MessagesService);
  authService = inject(AuthService);
  router = inject(Router);

  async onLogin() {
    try {
      const {email, password} = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage(
          'Enter an email and password.',
          'error');
        return;
      }
      await this.authService.login(email, password);      
      await this.router.navigate(['/home']);
    } 
    catch(err) {
      console.error(err);
      this.messagesService.showMessage(
        'Login failed... Please, try again', 
        'error')
    }
  }
}
