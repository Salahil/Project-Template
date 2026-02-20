import { Component, inject, type OnInit, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { NgxMaskDirective } from "ngx-mask"
import { HttpClient } from "@angular/common/http"
import { GlobalSpinnerComponent } from "../../spin/global-spinner/global-spinner.component"

// Angular Material
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDividerModule } from "@angular/material/divider"

// NG-Zorro
import { NzUploadModule } from "ng-zorro-antd/upload"
import { NzMessageModule } from "ng-zorro-antd/message"

import { AuthService } from "../../core/services/auth.service"
import { ToastrService } from "ngx-toastr"
import type { IUserData } from "../../Interfaces/IUserData.interface"
import type { IRestaurante } from "../../Interfaces/IRestaurante.interface"
import { RestauranteService } from "../../core/services/restaurante.service"
import { ClienteService } from "../../core/services/cliente.service"
import { UsuariosService, type IUpdateUsuarioPayload } from "../../core/services/usuarios.service"
import { environment } from "../../../environments/environment"

@Component({
  selector: "app-configuracoes",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GlobalSpinnerComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    NzUploadModule,
    NzMessageModule,
    NgxMaskDirective,
  ],
  templateUrl: "./configuracoes.component.html",
  styleUrls: ["./configuracoes.component.scss"],
})
export class ConfiguracoesComponent implements OnInit {
  private auth = inject(AuthService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)
  private restauranteService = inject(RestauranteService)
  private clienteService = inject(ClienteService)
  private router = inject(Router)
  private http = inject(HttpClient)
  private usuariosService = inject(UsuariosService)

  // Estados de edição
  editingInfo = false
  editingAddress = false
  editingRestaurant = false

  showInfoMessage = false
  showAddressMessage = false
  showRestaurantMessage = false

  previewImage: string | null = null

  infoForm!: FormGroup
  addressForm!: FormGroup
  restaurantForm!: FormGroup

  loading = false
  mensagemCepInvalido = ""
  public isMobile = false

  userData!: IUserData

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.checkMobile();
  }

  ngOnInit() {
    this.checkMobile();
    this.loading = true
    const userRole = this.auth.perfil?.tipo

    if (userRole === "RESTAURANTE") {
      const idRestaurante = this.auth.perfil?.id
      if (idRestaurante) {
        this.restauranteService.findById(idRestaurante).subscribe({
          next: (data) => this.handleUserData(data, "RESTAURANTE"),
          error: (err) => this.handleError(err, "restaurante"),
        })
      } else {
        this.toastr.error("ID do restaurante não encontrado. Faça login novamente.")
        this.loading = false
      }
    } else if (userRole === "CLIENTE") {
      this.clienteService.getCliente().subscribe({
        next: (data) => this.handleUserData(data, "CLIENTE"),
        error: (err) => this.handleError(err, "cliente"),
      })
    }
  }

  private handleUserData(data: IUserData | IRestaurante, tipo: "CLIENTE" | "RESTAURANTE") {
    if (tipo === "RESTAURANTE") {
      const restData = data as IRestaurante
      this.userData = {
        nome: restData.nome,
        email: restData.email,
        telefone: restData.telefone,
        endereco: { ...restData.endereco, cep: restData.endereco?.cep || "", pais: "Brasil" },
        tipo: "RESTAURANTE",
        senha: "",
        tipoCozinha: restData.tipoCozinha,
        horaFuncionamento: restData.horariosFuncionamento,
        descricao: restData.descricao,
        servicos: restData.servicos,
        imagens: restData.imagens,
      }
      this.previewImage = restData.imagemUsuario
        ? this.getCorretedImageUrl(restData.imagemUsuario)
        : "assets/png/avatar-padrao-restaurante-tavola.png"
    } else {
      const clientData = data as IUserData
      this.userData = {
        ...clientData,
        endereco: { ...(clientData.endereco || {}), pais: "Brasil" },
        senha: "",
        tipo: "CLIENTE",
      }
      this.previewImage = clientData.imagemPerfil
        ? this.getCorretedImageUrl(clientData.imagemPerfil)
        : "assets/png/avatar-padrao-tavola-cordeirinho.png"
      console.log("[handleUserData] clientData.imagemPerfil:", clientData.imagemPerfil)
      console.log("[handleUserData] final previewImage (client):", this.previewImage)
    }
    this.initForms()
    this.loading = false
  }

  private handleError(error: any, context: string) {
    console.error(`Erro ao carregar dados do ${context}:`, error)
    this.toastr.error(`Erro ao carregar dados do ${context}`)
    this.loading = false
  }

  initForms() {
    this.infoForm = this.fb.group({
      nome: [this.userData.nome, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      telefone: [this.userData.telefone, Validators.required],
      senha: ["", this.validadorSenhaForte],
    })

    this.addressForm = this.fb.group({
      cep: [this.userData.endereco?.cep || "", Validators.required],
      pais: [this.userData.endereco?.pais || "Brasil", Validators.required],
      estado: [this.userData.endereco?.estado || "", Validators.required],
      cidade: [this.userData.endereco?.cidade || "", Validators.required],
      bairro: [this.userData.endereco?.bairro || "", Validators.required],
      rua: [this.userData.endereco?.rua || "", Validators.required],
      numero: [this.userData.endereco?.numero || "", Validators.required],
      complemento: [this.userData.endereco?.complemento || ""],
    })

    if (this.isRestaurante) {
      this.restaurantForm = this.fb.group({
        nome: [this.userData.nome],
        tipoCozinha: [this.userData.tipoCozinha],
        quantidadeMesas: [this.userData.quantidadeMesas],
      })
    }
  }

  saveProfile(): void {
    if (this.infoForm.invalid || this.addressForm.invalid || (this.isRestaurante && this.restaurantForm.invalid)) {
      this.toastr.error("Por favor, preencha todos os campos obrigatórios corretamente.")
      return
    }

    this.loading = true

    const infoValues = this.infoForm.getRawValue()
    const addressValues = this.addressForm.getRawValue()

    const payload: IUpdateUsuarioPayload = {
      nome: infoValues.nome,
      telefone: infoValues.telefone,
      senha: infoValues.senha || null,
      endereco: {
        cep: addressValues.cep,
        estado: addressValues.estado,
        cidade: addressValues.cidade,
        bairro: addressValues.bairro,
        rua: addressValues.rua,
        numero: addressValues.numero,
        complemento: addressValues.complemento,
      },
      imagem: this.previewImage && this.previewImage.startsWith("data:") ? this.previewImage : null,
      imagemBackground: null,
    }

    if (this.isRestaurante) {
      const restaurantValues = this.restaurantForm.getRawValue()
      payload.tipoCozinha = restaurantValues.tipoCozinha
      payload.descricao = this.userData.descricao
      payload.horariosFuncionamento = this.userData.horaFuncionamento
      payload.nomesServicos = this.userData.servicos
      payload.quantidadeMesas = restaurantValues.quantidadeMesas

      if (
        !payload.imagem &&
        this.userData.imagemUsuario &&
        !this.previewImage?.includes("avatar-padrao")
      ) {
        payload.imagem = this.userData.imagemUsuario
      }
    } else {
      if (!payload.imagem && this.userData.imagemPerfil && !this.previewImage?.includes("avatar-padrao")) {
        payload.imagem = this.userData.imagemPerfil
      }
    }

    console.log("[saveProfile] Payload imagem to be sent:", payload.imagem)

    this.usuariosService.updateUsuario(payload).subscribe({
      next: () => {
        this.toastr.success("Perfil atualizado com sucesso!")
        this.ngOnInit()
        this.editingInfo = false
        this.editingAddress = false
        this.editingRestaurant = false
      },
      error: (err) => this.handleError(err, "salvar perfil"),
    })
  }

  saveInfo() {
    this.saveProfile()
  }

  saveAddress() {
    this.saveProfile()
  }

  get isRestaurante(): boolean {
    return this.auth.hasRole("RESTAURANTE")
  }
  get userName(): string {
    return this.auth.perfil?.nome || ""
  }
  get userType(): string {
    return this.auth.perfil?.tipo || ""
  }
  get userAvatar(): string {
    if (this.previewImage) {
      return this.previewImage
    } else if (this.isRestaurante) {
      return "assets/png/avatar-padrao-restaurante-tavola.png"
    } else {
      return "assets/png/avatar-padrao-tavola-cordeirinho.png"
    }
  }

  toggleEditInfo() {
    this.editingInfo = !this.editingInfo
  }
  toggleEditAddress() {
    this.editingAddress = !this.editingAddress
  }
  toggleEditRestaurant() {
    this.editingRestaurant = !this.editingRestaurant
  }

  cancelEditInfo() {
    this.editingInfo = false
    this.infoForm.reset(this.userData)
    this.toastr.info("Edição de informações cancelada")
  }

  cancelEditAddress() {
    this.editingAddress = false
    this.addressForm.reset(this.userData.endereco)
    this.toastr.info("Edição de endereço cancelada")
  }

  cancelEditRestaurant() {
    this.editingRestaurant = false
    this.restaurantForm.reset({
      nome: this.userData.nome,
      tipoCozinha: this.userData.tipoCozinha,
      quantidadeMesas: this.userData.quantidadeMesas,
    })
    this.toastr.info("Edição do restaurante cancelada")
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      if (!file.type.startsWith("image/")) {
        this.toastr.error("Por favor, selecione apenas arquivos de imagem.")
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        this.previewImage = reader.result as string
      
        if (this.isRestaurante) {
          this.userData.imagemUsuario = this.previewImage
        } else {
          this.userData.imagemPerfil = this.previewImage
        }
        this.saveProfile()
      }
      reader.readAsDataURL(file)
    }
  }

  buscarCep() {
    const cep = this.addressForm.get("cep")?.value
    if (!cep || cep.replace(/\D/g, "").length !== 8) return
    this.http.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`).subscribe({
      next: (res: any) => {
        if (res.erro) {
          this.mensagemCepInvalido = "CEP não encontrado."
          return
        }
        this.mensagemCepInvalido = ""
        this.addressForm.patchValue({
          estado: res.uf,
          cidade: res.localidade,
          bairro: res.bairro,
          rua: res.logradouro,
        })
      },
      error: () => {
        this.mensagemCepInvalido = "Erro ao buscar CEP."
      },
    })
  }

  validadorSenhaForte(control: any) {
    const valor = control.value
    if (!valor) return null
    const erros: any = {}
    if (valor.length > 0 && valor.length < 8) {
      erros["minCaracteres"] = "A senha deve ter no mínimo 8 caracteres."
    } else if (valor.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(valor)) {
      erros["semCaractereEspecial"] = "A senha deve conter um caractere especial."
    }
    return Object.keys(erros).length ? erros : null
  }

  private getCorretedImageUrl(path: string): string {
    if (!path) return ""
    if (path.startsWith("http") || path.startsWith("data:")) return path
    return `${environment.apiUrl}${path}`
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }
}
