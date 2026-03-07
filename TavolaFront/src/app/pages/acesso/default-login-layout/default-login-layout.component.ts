import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzIconModule } from "ng-zorro-antd/icon"

@Component({
  selector: "app-default-login-layout",
  standalone: true,
  imports: [CommonModule, MatIconModule, NzButtonModule, NzIconModule],
  templateUrl: "./default-login-layout.component.html",
  styleUrl: "./default-login-layout.component.scss",
})
export class DefaultLoginLayoutComponent {
  @Input() title = ""
  @Input() primaryBtnText = ""
  @Input() secondaryBtnText = ""
  @Input() disablePrimaryBtn = false
  @Input() primaryBtnLoading = false
  @Output() submit = new EventEmitter<void>()
  @Output() navigate = new EventEmitter<void>()

  isDark = typeof document !== "undefined" && document.documentElement.classList.contains("theme-dark")

  onPrimaryClick() {
    this.submit.emit()
  }

  onSecondaryClick() {
    this.navigate.emit()
  }

  toggleTheme() {
    const root = document.documentElement
    root.classList.toggle("theme-dark")
    this.isDark = root.classList.contains("theme-dark")
  }
}