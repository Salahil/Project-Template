import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface ReservaDialogData {
  selectedDate: Date;
  selectedTime: string;
  selectedGuests: number;
  selectedComments: string;
  availableSlots: any[];
  disabledDate: (current: Date) => boolean;
  isLoading: boolean;
  restauranteNome: string;
  onDateSelectCallback?: (date: Date) => void; // Callback para atualizar slots no componente pai
}

@Component({
  selector: 'app-reserva-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NzCalendarModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './reserva-dialog.component.html',
  styleUrls: ['./reserva-dialog.component.scss']
})
export class ReservaDialogComponent implements OnInit {
  bookingStep = 1;
  selectedDate: Date;
  selectedTime: string;
  selectedGuests: number;
  selectedComments: string;
  availableSlots: any[];
  disabledDate: (current: Date) => boolean;
  isLoading: boolean;
  bookingData: any = null;

  constructor(
    public dialogRef: MatDialogRef<ReservaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReservaDialogData
  ) {
    this.selectedDate = data.selectedDate;
    this.selectedTime = data.selectedTime;
    this.selectedGuests = data.selectedGuests;
    this.selectedComments = data.selectedComments;
    this.availableSlots = data.availableSlots;
    this.disabledDate = data.disabledDate;
    this.isLoading = data.isLoading;
  }

  ngOnInit(): void {
    this.prepareBookingData();
  }

  setBookingStep(step: number): void {
    if (step <= this.bookingStep || step === 1) {
      this.bookingStep = step;
    }
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
    this.bookingStep = 2;
    // Chama callback para atualizar slots no componente pai
    if (this.data.onDateSelectCallback) {
      this.data.onDateSelectCallback(date);
    }
  }
  
  // Método para atualizar slots (chamado pelo componente pai)
  atualizarSlots(slots: any[]): void {
    this.availableSlots = slots;
  }

  onTimeSelect(time: string): void {
    this.selectedTime = time;
    this.bookingStep = 3;
  }

  onGuestsSelect(guests: number): void {
    this.selectedGuests = guests;
    this.bookingStep = 4;
    this.prepareBookingData();
  }

  goBackStep(): void {
    if (this.bookingStep > 1) {
      this.bookingStep--;
    }
  }

  prepareBookingData(): void {
    this.bookingData = {
      date: this.selectedDate,
      time: this.selectedTime,
      guests: this.selectedGuests,
      restaurant: this.data.restauranteNome,
      formattedDate: this.getFormattedDate(),
      comments: this.selectedComments,
    };
  }

  getFormattedDate(): string {
    return this.selectedDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  confirmar(): void {
    this.dialogRef.close({
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      selectedGuests: this.selectedGuests,
      selectedComments: this.selectedComments
    });
  }
}

