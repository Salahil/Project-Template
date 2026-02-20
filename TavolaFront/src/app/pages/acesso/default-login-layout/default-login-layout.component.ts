import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NzButtonModule } from "ng-zorro-antd/button"
import { NzIconModule } from "ng-zorro-antd/icon"

@Component({
  selector: "app-default-login-layout",
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzIconModule],
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

  onPrimaryClick() {
    this.submit.emit()
  }

  onSecondaryClick() {
    this.navigate.emit()
  }
}