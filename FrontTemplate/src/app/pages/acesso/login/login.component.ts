import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessService } from '../../../core/services/access.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ILoginForm } from '../../../Interfaces/ILoginForm.interface';
import { AuthService } from '../../../core/services/auth.service';
import { SocialAuthService, SocialUser, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { RecaptchaModule } from 'ng-recaptcha';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    GoogleSigninButtonModule,
    RecaptchaModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup<ILoginForm>;
  showLoginError = false;
  hidePassword = true;
  googleLoginInProgress = false;
  isDark = false;
  readonly siteKey = environment.recaptchaSiteKey;
  captchaToken: string | null = null;

  get googleButtonTheme(): 'outline' | 'filled_black' {
    return this.isDark ? 'filled_black' : 'outline';
  }

  onCaptchaResolved(token: string | null): void {
    this.captchaToken = token;
  }

  private router = inject(Router);
  private accessService = inject(AccessService);
  private toastService = inject(ToastrService);
  private authService = inject(AuthService);
  private socialAuthService = inject(SocialAuthService, { optional: true });
  private googleAuthSub: Subscription | null = null;

  constructor() {
    this.loginForm = new FormGroup<ILoginForm>({
      email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      senha: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
    });
  }

  realizarLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const senha = this.loginForm.get('senha')?.value;

    if (email && senha) {
      if (!this.captchaToken) {
        this.toastService.warning('Confirme o reCAPTCHA antes de entrar.');
        return;
      }
      this.accessService.postAuthLogin(email, senha, this.captchaToken).subscribe({
        next: (res) => {
          this.showLoginError = false;

          if (res.idVerificacao) {
            this.toastService.info(res.mensagem || 'Código de verificação enviado para seu e-mail.');
            this.router.navigate(['/confirmar-codigo', res.idVerificacao]);
            return;
          }

          if (!res.nome || !res.id) {
            this.showLoginError = true;
            this.toastService.error('Resposta de login inválida. Tente novamente.');
            return;
          }

          this.toastService.success(res.mensagem || 'Login feito com sucesso!');
          this.authService.setAuthData(res.token || '', res.nome, res.id, res.imagem);
          this.router.navigate(['app']);
        },
        error: (err: unknown) => {
          this.showLoginError = true;
          this.toastService.error(AccessService.apiErrorMessage(err));
        }
      });
    } else {
      this.showLoginError = true;
      this.toastService.error('Email ou senha inválidos.');
    }
  }

  ngOnInit(): void {
    this.isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('theme-dark');
    if (this.socialAuthService) {
      this.googleAuthSub = this.socialAuthService.authState.subscribe((user: SocialUser | null) => {
        if (user?.idToken) {
          this.googleLoginInProgress = true;
          this.showLoginError = false;
          this.accessService.postAuthLoginGoogle(user.idToken).subscribe({
            next: (res) => {
              this.googleLoginInProgress = false;
              if (res.nome && res.id) {
                this.authService.setAuthData(res.token || '', res.nome, res.id, res.imagem);
                this.toastService.success(res.mensagem || 'Login feito com sucesso!');
                this.router.navigate(['app']);
              } else {
                this.showLoginError = true;
                this.toastService.error('Não foi possível concluir o login. Tente novamente.');
              }
            },
            error: (err: unknown) => {
              this.googleLoginInProgress = false;
              this.showLoginError = true;
              this.toastService.error(AccessService.apiErrorMessage(err));
            }
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.googleAuthSub?.unsubscribe();
  }

  irParaCadastro() {
    this.router.navigate(['signup']);
  }

  forgotPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.toastService.warning('Por favor, digite seu e-mail antes de solicitar a redefinição de senha.');
      return;
    }
    if (this.loginForm.get('email')?.invalid) {
      this.toastService.warning('Por favor, digite um e-mail válido.');
      return;
    }

    this.accessService.postAuthEsqueciSenha(email).subscribe({
      next: () => this.toastService.success('Instruções para redefinição de senha foram enviadas para seu e-mail!'),
      error: (err) =>
        this.toastService.error(err.error?.erro || err.error?.message || 'Erro ao enviar e-mail de redefinição. Tente novamente.')
    });
  }
}
