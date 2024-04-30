import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginCommand } from 'src/app/DTO/loginCommand';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public show: boolean = false;
  public loginForm: FormGroup | any;
  public errorMessage: string = '';
  loginCommand: LoginCommand = { email: '', password: '' };
  submitted = false;
  isInputFocused: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private loginService: AuthService,
    private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnDestroy() {
  }
  log() {
    if (this.loginForm.valid) {
      this.loginCommand = this.loginForm.value;
      this.loginService.login(this.loginCommand)
        .subscribe((response: any) => {
          console.log('Login passed:', response);
          
          // Check if access token is present in local storage
          const accessToken = this.loginService.getAccessToken();
          if (!accessToken) {
            console.error('Access token not found in local storage');
            return;
          }         
            this.router.navigate(['/dashboard']); // Redirect to dashboard for admin
         
        }, (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Le nom de l\'utilisateur ou le mot de passe est incorrect';
        });
    }
  }
  

}
