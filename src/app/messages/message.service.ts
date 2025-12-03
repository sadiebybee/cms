import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();

  private messagesUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  // GET all messages
  getMessages() {
    this.http
      .get<{ message: string; messages: Message[] }>(this.messagesUrl)
      .subscribe(
        (response) => {
          this.messages = response.messages || [];
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
  }

  // GET a single message by id
  getMessage(id: string): Message | null {
    return this.messages.find((m) => m.id === id) || null;
  }

  // POST a new message
  addMessage(newMessage: Message) {
    if (!newMessage) return;
    newMessage.id = ''; // server assigns id

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; messageObject: Message }>(
        this.messagesUrl,
        newMessage,
        { headers }
      )
      .subscribe(
        (response) => {
          this.messages.push(response.messageObject); // use messageObject
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error) => {
          console.error('Error adding message:', error);
        }
      );
  }

  // PUT: update an existing message
  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;

    const pos = this.messages.findIndex((m) => m.id === originalMessage.id);
    if (pos < 0) return;

    newMessage.id = originalMessage.id;
    newMessage._id = (originalMessage as any)._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(`${this.messagesUrl}/${originalMessage.id}`, newMessage, { headers })
      .subscribe(
        () => {
          this.messages[pos] = newMessage;
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error) => {
          console.error('Error updating message:', error);
        }
      );
  }

  // DELETE a message
  deleteMessage(message: Message | null) {
    if (!message) return;

    const pos = this.messages.findIndex((m) => m.id === message.id);
    if (pos < 0) return;

    this.http.delete(`${this.messagesUrl}/${message.id}`).subscribe(
      () => {
        this.messages.splice(pos, 1);
        this.messageListChangedEvent.next(this.messages.slice());
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }
}
