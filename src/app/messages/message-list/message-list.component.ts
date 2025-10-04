import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Rent', 'Rent is due on the 1st of the month', 'Jane D.'),
    new Message('2', 'Reminder', '1pm meeting this Tuesday', 'Sarah J.'),
    new Message('3', 'Dinner', 'Dinner with Jane at 6pm', 'John D.'),
  ];
  constructor() {}

  ngOnInit(): void {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
