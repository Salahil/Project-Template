import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { GlobalSpinnerService } from "../../core/services/global-spinner.service"

@Component({
  selector: "app-global-spinner",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./global-spinner.component.html",
  styleUrls: ["./global-spinner.component.scss"],
})
export class GlobalSpinnerComponent {
  @Input() visivel = false
  @Input() fastMode = false
  @Input() darkTheme = false

  constructor(private spinnerService: GlobalSpinnerService) {
    this.spinnerService.visibilidade$.subscribe((v) => (this.visivel = v))
  }

  get spinnerClasses() {
    return {
      fast: this.fastMode,
      "dark-theme": this.darkTheme,
    }
  }
}
