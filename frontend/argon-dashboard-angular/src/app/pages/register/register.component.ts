import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SignupRequestPayload } from 'src/app/DTO/SignupRequestPayload';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public signupForm !: FormGroup;
  signupRequestPayload:SignupRequestPayload;
  isAllergyChecked: boolean = false;
  existingUsers: any[] = [];

  constructor( private signupService:AuthService,private router: Router,private toastr: ToastrService,private formBuilder: FormBuilder) 
  {  this.signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,Validators.required]],
    firstname: ['', [Validators.required,Validators.required]],
    lastname: ['', [Validators.required,Validators.required]],



  });
  this.signupRequestPayload ={
    email:'',
    password:'',
    firstname: '',
    lastname: '',
  }}

  ngOnInit() {
  }
  signup() {
    if (this.signupForm.valid) {
      // Check if this.existingUsers is an array
      if (!Array.isArray(this.existingUsers)) {
        console.error('Les données des utilisateurs existants ne sont pas un tableau :', this.existingUsers);
      this.toastr.error('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      return;
      }
  
      // Check if username or email already exists
      const email = this.signupForm.value.email;
      const emailExists = this.existingUsers.some(user => user.email === email);
  
      if ( emailExists) {
        this.toastr.error('Le nom d\'utilisateur ou l\'e-mail est déjà utilisé. Veuillez en choisir un autre.');
        return; // Stop further execution
      }
  
      // If username and email are unique, proceed with signup
      this.signupRequestPayload = this.signupForm.value;
      this.signupService.signup(this.signupRequestPayload).subscribe(
        () => {
          this.toastr.success('Inscription réussie ! Merci !');
          this.router.navigate(['/login']);
        },
        (error) => {
          this.toastr.error('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer plus tard.');
        console.error('Erreur d\'inscription :', error);
        }
      );
    } else {
      this.toastr.warning('Veuillez remplir tous les champs obligatoires et accepter les conditions et la politique.');
    }
  }
  

}
