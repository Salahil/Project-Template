import { FormControl } from '@angular/forms';

export interface ISignupForm {
  nome: FormControl<string>;
  email: FormControl<string>;
  senha: FormControl<string>;
  passwordConfirm: FormControl<string>;
  tipo: FormControl<'CLIENTE' | 'RESTAURANTE'>;
  cep: FormControl<string>;
  estado: FormControl<string>;
  cidade: FormControl<string>;
  bairro: FormControl<string>;
  rua: FormControl<string>;
  numero: FormControl<string>;
  complemento: FormControl<string>;
  telefone: FormControl<string>;
}
