import {Component, Renderer2} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ColorModeService} from "./services/color-mode/color-mode.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(
    private colorModeService: ColorModeService,
    private renderer: Renderer2,
  ) {
    this.colorModeService.theme$.subscribe(theme => {
      // Update the `data-bs-theme` attribute on the HTML element
      this.renderer.setAttribute(document.documentElement, 'data-bs-theme', theme)
    })

  }
}
