import { Component, inject } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AcessService } from '../../../core/services/access.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { ILoginForm } from '../../../Interfaces/ILoginForm.interface';
import { AuthService } from '../../../core/services/auth.service';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { LoginOutline, UserAddOutline } from '@ant-design/icons-angular/icons';

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
    MatTabsModule,
    NzIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup<ILoginForm>;
  garcomForm: FormGroup;
  showLoginError = false;
  hidePassword = true;
  hideGarcomPassword = true;
  selectedTabIndex = 0;

  // Nova forma de injeção no Angular 19
  private router = inject(Router);
  private loginService = inject(AcessService);
  private toastService = inject(ToastrService);
  private authService = inject(AuthService);

  constructor() {
    this.loginForm = new FormGroup<ILoginForm>({
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      senha: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });

    // Formulário para login do garçom
    this.garcomForm = new FormGroup({
      emailRestaurante: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      codigoIdentidade: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      senha: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }
  emailWithTLDValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    // Regex para verificar se o e-mail termina com um TLD válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (value && !regex.test(value)) {
      return { emailTLD: true };
    }
    return null;
  }

  realizarLogin(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const senha = this.loginForm.get('senha')?.value;

    if (email && senha) {
      this.loginService.login(email, senha).subscribe({
        next: (res) => {
          this.showLoginError = false;
          
          // Verifica se a resposta contém 'idVerificacao'
          if (res.idVerificacao) {
            // CENÁRIO B: Conta não verificada
            this.toastService.info(res.mensagem || "Código de verificação enviado para seu e-mail.");
            // Navega para a tela de confirmar código, passando o ID na URL
            this.router.navigate(['/confirmar-codigo', res.idVerificacao]);
          } else {
            // CENÁRIO A: Login normal e bem-sucedido
            this.toastService.success("Login feito com sucesso!");
            // O AcessService já salvou o perfil no tap(), mas atualizamos aqui também para garantir
            this.authService.setAuthData(
              res.token, 
              res.nome, 
              res.tipoUsuario as 'CLIENTE' | 'RESTAURANTE' | 'FUNCIONARIO', 
              res.id, 
              res.imagem,
              res.restauranteId
            );
            
            if (res.tipoUsuario === 'RESTAURANTE') {
              this.router.navigate(['reserva']);
            } else if (res.tipoUsuario === 'FUNCIONARIO') {
              this.router.navigate(['painel-garcom']);
            } else {
              this.router.navigate(['home']);
            }
          }
        },
        error: (err) => {
          this.showLoginError = true;
          const errorMessage = err.error?.erro || err.error?.message || "Não foi possível acessar sua conta. Verifique seu e-mail e senha e tente novamente.";
          this.toastService.error(errorMessage);
        }
      });
    } else {
      this.showLoginError = true;
      this.toastService.error("Email ou senha inválidos.");
    }
  }

  irParaCadastro(){
    this.router.navigate(["signup"]);
  }

  forgotPassword(){
    const email = this.loginForm.get('email')?.value;
    
    if (!email) {
      this.toastService.warning("Por favor, digite seu e-mail antes de solicitar a redefinição de senha.");
      return;
    }

    // Valida se o email está válido
    if (this.loginForm.get('email')?.invalid) {
      this.toastService.warning("Por favor, digite um e-mail válido.");
      return;
    }

    this.loginService.esqueciMinhaSenha(email).subscribe({
      next: (res) => {
        this.toastService.success("Instruções para redefinição de senha foram enviadas para seu e-mail!");
      },
      error: (err) => {
        const errorMessage = err.error?.erro || err.error?.message || "Erro ao enviar e-mail de redefinição. Tente novamente.";
        this.toastService.error(errorMessage);
      }
    });
  }

  /**
   * Realiza login do garçom
   * O AcessService já salva o token e o perfil corretamente no operador tap(),
   * então não precisamos chamar setAuthData novamente aqui.
   */
  realizarLoginGarcom() {
    if (this.garcomForm.invalid) {
      this.garcomForm.markAllAsTouched();
      return;
    }

    const emailRestaurante = this.garcomForm.get('emailRestaurante')?.value;
    const codigoIdentidade = this.garcomForm.get('codigoIdentidade')?.value;
    const senha = this.garcomForm.get('senha')?.value;

    if (emailRestaurante && codigoIdentidade && senha) {
      // O AcessService já salva o token e o perfil (incluindo restauranteId)
      // no operador tap() dentro do loginGarcom()
      this.loginService.loginGarcom(emailRestaurante, codigoIdentidade, senha).subscribe({
        next: (res) => {
          this.showLoginError = false;
          this.toastService.success("Login realizado com sucesso!");
          
          // NÃO PRECISA CHAMAR setAuthData() AQUI.
          // O SERVIÇO JÁ FEZ ISSO CORRETAMENTE COM O restauranteId.
          
          // Apenas redireciona para o painel do garçom
          this.router.navigate(['painel-garcom']);
        },
        error: (err) => {
          this.showLoginError = true;
          const errorMessage = err.error?.erro || err.error?.message || "Não foi possível acessar. Verifique os dados e tente novamente.";
          this.toastService.error(errorMessage);
        }
      });
    } else {
      this.showLoginError = true;
      this.toastService.error("Preencha todos os campos.");
    }
  }
}
