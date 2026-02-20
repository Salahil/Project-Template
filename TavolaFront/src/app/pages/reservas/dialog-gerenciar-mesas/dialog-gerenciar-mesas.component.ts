import { Component, Inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { IMesa } from "../../../Interfaces/IMesa.interface"
import { IDialogGerenciarMesasData } from "../../../Interfaces/IDialogGerenciarMesasData.interface"
import { IAmbiente } from "../../../Interfaces/IAmbiente.interface"
import { MesaService } from "../../../core/services/mesa.service"
import { ToastrService } from "ngx-toastr"
import { finalize } from "rxjs"

@Component({
  selector: "app-dialog-gerenciar-mesas",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./dialog-gerenciar-mesas.component.html",
  styleUrls: ["./dialog-gerenciar-mesas.component.scss"],
})
export class DialogGerenciarMesasComponent implements OnInit {
  form!: FormGroup
  ambientes: IAmbiente[] = []
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private mesaService: MesaService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: IDialogGerenciarMesasData,
    public dialogRef: MatDialogRef<DialogGerenciarMesasComponent>
  ) {
    dialogRef.disableClose = true
    if (data.ambientes) {
      this.ambientes = data.ambientes
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [this.data.modo === "editar" ? this.data.mesa?.nome || "" : "", Validators.required],
      capacidade: [
        this.data.modo === "editar" ? this.data.mesa?.capacidade || null : null,
        [Validators.required, Validators.min(1)],
      ],
      tipo: [this.data.modo === "editar" ? this.data.mesa?.tipo || "retangular" : "retangular", Validators.required],
      vip: [this.data.modo === "editar" ? this.data.mesa?.vip || false : false],
      ambienteId: [this.data.modo === "editar" ? this.data.mesa?.ambienteId : this.data.idAmbiente, this.data.modo === "criar" ? Validators.required : []],
    })

    if (this.data.modo === "editar") {
      this.form.get("ambienteId")?.disable()
    }
  }

  cancelar(): void {
    this.dialogRef.close()
  }

  salvar(): void {
    if (this.form.valid) {
      this.isLoading = true
      const mesaData = {
        nome: this.form.get("nome")?.value,
        tipo: this.form.get("tipo")?.value,
        capacidade: this.form.get("capacidade")?.value,
        vip: this.form.get("vip")?.value,
      }

      if (this.data.modo === "criar") {
        const ambienteId = this.form.get("ambienteId")?.value
        this.mesaService.postCriarMesa(ambienteId, mesaData)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: () => {
              this.toastr.success("Mesa criada com sucesso!")
              this.dialogRef.close(true)
            },
            error: () => this.toastr.error("Erro ao criar mesa.")
          })
      } else {
        this.mesaService.putAtualizarMesa(this.data.mesa!.id, mesaData)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: () => {
              this.toastr.success("Mesa atualizada com sucesso!")
              this.dialogRef.close(true)
            },
            error: () => this.toastr.error("Erro ao atualizar mesa.")
          })
      }
    }
  }
}