import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private subscription!: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getMessages();

    this.subscription = this.messageService.messageListChangedEvent.subscribe(
      (updatedMessages: Message[]) => {
        this.messages = updatedMessages;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
