import { Component, inject } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AcessService } from '../../../core/services/access.service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { ISignupForm } from '../../../Interfaces/ISignupForm.interface';
import { AuthService } from '../../../core/services/auth.service';
import { NzIconModule} from 'ng-zorro-antd/icon';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, DefaultLoginLayoutComponent, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatDividerModule, MatSelectModule,
    MatRadioModule, MatTabsModule, MatCheckboxModule, NzIconModule, NgxMaskDirective
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {

   // NOVO: Objeto para controlar a visibilidade de cada campo de senha
   passwordVisibility: { [key: string]: boolean } = {
    senhaCliente: true,
    confirmSenhaCliente: true,
    senhaRestaurante: true,
    confirmSenhaRestaurante: true
  };

  selectedTabIndex = 0;
  tiposCozinha = [
    'Italiana', 'Brasileira', 'Japonesa', 'Hamburgueria', 'Chinesa', 'Mexicana', 'Árabe', 'Francesa', 'Indiana', 'Outros'
  ];
  diasSemana = [
    { label: 'Domingo', value: 'DOMINGO' }, { label: 'Segunda', value: 'SEGUNDA' },
    { label: 'Terça', value: 'TERCA' }, { label: 'Quarta', value: 'QUARTA' },
    { label: 'Quinta', value: 'QUINTA' }, { label: 'Sexta', value: 'SEXTA' },
    { label: 'Sábado', value: 'SABADO' }
  ];

  clienteForm: FormGroup<ISignupForm>;
  restauranteForm: FormGroup;

  private router = inject(Router);
  private loginService = inject(AcessService);
  private toastService = inject(ToastrService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  mensagemCepInvalido = '';
  mensagemCepInvalidoRestaurante = '';

  constructor() {
    this.clienteForm = new FormGroup<ISignupForm>({
        nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        senha: new FormControl('', { nonNullable: true, validators: [Validators.required, this.validadorSenhaForte] }),
        passwordConfirm: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        tipo: new FormControl<'CLIENTE' | 'RESTAURANTE'>('CLIENTE', { nonNullable: true, validators: [Validators.required] }),
        cep: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        estado: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        cidade: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        bairro: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        rua: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        numero: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        complemento: new FormControl('', { nonNullable: true }),
        telefone: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    }, { validators: this.passwordMatchValidator });

    this.restauranteForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, this.validadorSenhaForte]],
      passwordConfirm: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', Validators.required],
        estado: ['', Validators.required],
        cidade: ['', Validators.required],
        bairro: ['', Validators.required],
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: ['']
      }),
      tipoCozinha: ['', Validators.required],
      telefone: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      quantidadeMesas: [1, [Validators.required, Validators.min(1)]],
      horaFuncionamento: this.fb.array([], Validators.required)
    // CORREÇÃO: Usamos a mesma função validadora para ambos os forms
    }, { validators: this.passwordMatchValidator });
  }

  get horaFuncionamento(): FormArray {
    return this.restauranteForm.get('horaFuncionamento') as FormArray;
  }

  get enderecoFormGroup(): FormGroup {
    return this.restauranteForm.get('endereco') as FormGroup;
  }

  // CORREÇÃO: Validadores definidos como arrow functions para manter o contexto do 'this'.
  validadorSenhaForte = (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;
    const erros: ValidationErrors = {};
    if (valor.length < 8) {
      erros['minCaracteres'] = true;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(valor)) {
      erros['semCaractereEspecial'] = true;
    }
    return Object.keys(erros).length ? erros : null;
  }

  togglePasswordVisibility(field: string): void {
    this.passwordVisibility[field] = !this.passwordVisibility[field];
  }

  passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('senha')?.value;
    const passwordConfirm = group.get('passwordConfirm');
    if (password !== passwordConfirm?.value) {
      passwordConfirm?.setErrors({ passwordMismatch: true });
    } else {
      const currentErrors = { ...passwordConfirm?.errors };
      delete currentErrors['passwordMismatch'];
      passwordConfirm?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
    }
    return null;
  }

  // A função 'passwordMatchValidatorRestaurante' era redundante e foi removida.

  buscarCepGenerico(formGroup: FormGroup, mensagemProperty: 'mensagemCepInvalido' | 'mensagemCepInvalidoRestaurante') {
    const isRestaurante = !!formGroup.get('endereco.cep');
    const cepControl = isRestaurante ? formGroup.get('endereco.cep') : formGroup.get('cep');
    const cep = cepControl?.value || '';
    
    if (!cep || cep.replace(/\D/g, '').length !== 8) return;

    this.http.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`).subscribe({
      next: (res: any) => {
        if (res.erro) {
          this[mensagemProperty] = 'CEP não encontrado.';
          return;
        }
        this[mensagemProperty] = '';
        const addressData = {
          estado: res.uf,
          cidade: res.localidade,
          bairro: res.bairro,
          rua: res.logradouro
        };
        formGroup.patchValue(isRestaurante ? { endereco: addressData } : addressData);
      },
      error: () => {
        this[mensagemProperty] = 'Erro ao buscar CEP.';
      }
    });
  }

  cadastrarCliente() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }
    const formValue = this.clienteForm.getRawValue();
    const payload = {
      nome: formValue.nome,
      email: formValue.email,
      senha: formValue.senha,
      telefone: formValue.telefone,
      endereco: {
        pais: 'Brasil',
        cep: formValue.cep,
        estado: formValue.estado,
        cidade: formValue.cidade,
        bairro: formValue.bairro,
        rua: formValue.rua,
        numero: formValue.numero,
        complemento: formValue.complemento,
      },
      tipo: 'CLIENTE'
    };
    this.loginService.signup(payload).subscribe({
      next: (res) => {
        // Salva o email e idVerificacao para usar na tela de verificação
        localStorage.setItem('emailCadastro', formValue.email);
        localStorage.setItem('idVerificacao', res.idVerificacao);
        this.toastService.success(res.mensagem);
        this.router.navigate(['verificacao-email']);
      },
      error: (err: any) => {
        const errorMessage = err.error?.erro || err.error?.message || "Erro inesperado! Tente novamente mais tarde";
        this.toastService.error(errorMessage);
      }
    });
  }

  cadastrarRestaurante() {
    if (this.restauranteForm.invalid) {
      this.restauranteForm.markAllAsTouched();
      return;
    }
    const form = this.restauranteForm.getRawValue();
    
    const horaFuncionamento = form.horaFuncionamento
      .filter((h: any) => h.diaSemana && h.abertura && h.fechamento)
      .map((h: any) => ({
        diaSemana: h.diaSemana,
        abertura: h.abertura,
        fechamento: h.fechamento
      }));

    const payload = {
      nome: form.nomeCompleto,
      email: form.email,
      senha: form.senha,
      tipo: 'RESTAURANTE',
      tipoCozinha: form.tipoCozinha,
      quantidadeMesas: form.quantidadeMesas,
      telefone: form.telefone,
      descricao: form.descricao,
      endereco: {
        cep: form.endereco.cep,
        pais: 'Brasil',
        estado: form.endereco.estado,
        cidade: form.endereco.cidade,
        bairro: form.endereco.bairro,
        rua: form.endereco.rua,
        numero: form.endereco.numero,
        complemento: form.endereco.complemento
      },
      horaFuncionamento
    };

    this.loginService.signup(payload).subscribe({
      next: (res) => {
        // Salva o email e idVerificacao para usar na tela de verificação
        localStorage.setItem('emailCadastro', form.email);
        localStorage.setItem('idVerificacao', res.idVerificacao);
        this.toastService.success(res.mensagem);
        this.router.navigate(['verificacao-email']);
      },
      error: (err: any) => {
        const errorMessage = err.error?.erro || err.error?.message || "Erro inesperado! Tente novamente mais tarde";
        this.toastService.error(errorMessage);
      }
    });
  }

  submitForm() {
    if (this.selectedTabIndex === 0) {
      this.cadastrarCliente();
    } else {
      this.cadastrarRestaurante();
    }
  }

  addHorario() {
    this.horaFuncionamento.push(this.fb.group({
      diaSemana: ['', Validators.required],
      abertura: ['', Validators.required],
      fechamento: ['', Validators.required]
    }));
  }

  removeHorario(index: number) {
    this.horaFuncionamento.removeAt(index);
  }

  isCurrentFormValid(): boolean {
    return this.selectedTabIndex === 0 ? this.clienteForm.valid : this.restauranteForm.valid;
  }

  irParaLogin() {
    this.router.navigate(["/login"]);
  }
}
