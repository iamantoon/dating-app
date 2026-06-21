import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css',
})
export class StarButton {
  public disabled = input<boolean>(false);
  public selected = input<boolean>(false);
  public clickEvent = output<Event>();

  public onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
