import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';

export interface FiltrosDialogData {
  diaSemana?: string;
  notaMinima?: number;
  servicos?: string[];
}

export interface FiltrosDialogResult {
  diaSemana: string;
  notaMinima: number;
  servicos: string[];
}

@Component({
  selector: 'app-filtros-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatCardModule,
    MatDividerModule,
    NzRateModule
  ],
  templateUrl: './filtros-dialog.component.html',
  styleUrls: ['./filtros-dialog.component.scss']
})
export class FiltrosDialogComponent implements OnInit {
  filtrosForm!: FormGroup;
  
  // NOVA PROPRIEDADE SIMPLES para o ngModel
  notaMinimaAtual: number = 0;

  diasSemana = [
    { value: '', label: 'Qualquer dia' },
    { value: 'SEGUNDA', label: 'Segunda-feira' },
    { value: 'TERCA', label: 'Terça-feira' },
    { value: 'QUARTA', label: 'Quarta-feira' },
    { value: 'QUINTA', label: 'Quinta-feira' },
    { value: 'SEXTA', label: 'Sexta-feira' },
    { value: 'SABADO', label: 'Sábado' },
    { value: 'DOMINGO', label: 'Domingo' }
  ];

  todosServicos = [
    { nome: "Wi-Fi gratuito", icone: "wifi" },
    { nome: "Aceita cartões", icone: "credit_card" },
    { nome: "Acessível para cadeirantes", icone: "accessible" },
    { nome: "Estacionamento", icone: "local_parking" },
    { nome: "Ideal para crianças", icone: "child_friendly" },
    { nome: "Música ao vivo", icone: "music_note" },
    { nome: "Permite animais", icone: "pets" },
    { nome: "Valet (serviço de manobrista)", icone: "hail" },
    { nome: "Ar-condicionado", icone: "ac_unit" },
    { nome: "Bar completo", icone: "local_bar" },
    { nome: "Área externa", icone: "deck" }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FiltrosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FiltrosDialogData
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    // Garante que notaMinima seja um número válido
    const notaMinimaInicial = this.data?.notaMinima ?? 0;
    const notaMinimaNumero = typeof notaMinimaInicial === 'number' ? notaMinimaInicial : Number(notaMinimaInicial) || 0;

    // Cria o form, mas NÃO inclui notaMinima nele diretamente para ngModel
    this.filtrosForm = this.fb.group({
      diaSemana: [this.data?.diaSemana || ''],
      servicos: [this.data?.servicos || []]
    });

    // Define a propriedade separada para o [(ngModel)]
    this.notaMinimaAtual = notaMinimaNumero;
    console.log('Formulário inicializado - notaMinimaAtual:', this.notaMinimaAtual);
  }

  onNotaChange(value: number): void {
    console.log('NOTA MUDOU! Novo valor:', value);
    // O [(ngModel)] já atualiza notaMinimaAtual automaticamente
    // Este método é apenas para debug
  }

  onServicoChange(servico: string, isChecked: boolean): void {
    const servicosAtuais = this.filtrosForm.get('servicos')?.value || [];
    
    if (isChecked) {
      if (!servicosAtuais.includes(servico)) {
        servicosAtuais.push(servico);
      }
    } else {
      const index = servicosAtuais.indexOf(servico);
      if (index > -1) {
        servicosAtuais.splice(index, 1);
      }
    }
    
    this.filtrosForm.get('servicos')?.setValue(servicosAtuais);
  }

  isServicoSelecionado(servico: string): boolean {
    const servicosAtuais = this.filtrosForm.get('servicos')?.value || [];
    return servicosAtuais.includes(servico);
  }

  aplicarFiltros(): void {
    // Lê o valor diretamente da propriedade ligada ao ngModel
    const notaMinimaFinal = typeof this.notaMinimaAtual === 'number' ? this.notaMinimaAtual : 0;
    
    console.log('Aplicar filtros - notaMinimaAtual:', this.notaMinimaAtual);
    
    const result: FiltrosDialogResult = {
      diaSemana: this.filtrosForm.get('diaSemana')?.value || '',
      notaMinima: notaMinimaFinal, // Usa o valor da propriedade simples
      servicos: this.filtrosForm.get('servicos')?.value || []
    };
    
    console.log('Resultado final a ser retornado:', result);
    this.dialogRef.close(result);
  }

  limparFiltros(): void {
    // Reseta a propriedade do ngModel
    this.notaMinimaAtual = 0;
    // Reseta o form (sem notaMinima)
    this.filtrosForm.reset({
      diaSemana: '',
      servicos: []
    });
    console.log('Filtros limpos - notaMinimaAtual resetado para 0');
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
