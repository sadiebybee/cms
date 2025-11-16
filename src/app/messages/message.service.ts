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

  private maxMessageId: number = 0;
  private firebaseUrl =
    'https://sadiebybee-cms-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http.get<Message[]>(this.firebaseUrl).subscribe(
      (messages: Message[] | null) => {
        this.messages = messages || [];
        this.maxMessageId = this.getMaxId();
        this.sortAndSend();
      },
      (error) => {
        console.error('Error fetching messages from Firebase:', error);
      }
    );
  }

  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.firebaseUrl, this.messages, { headers })
      .subscribe(() => {
        this.sortAndSend();
      });
  }

  getMessage(id: string): Message | null {
    return this.messages.find((m) => m.id === id) || null;
  }

  addMessage(newMessage: Message) {
    if (!newMessage) return;
    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    this.storeMessages();
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;
    const pos = this.messages.indexOf(originalMessage);
    if (pos < 0) return;
    newMessage.id = originalMessage.id;
    this.messages[pos] = newMessage;
    this.storeMessages();
  }

  deleteMessage(message: Message) {
    if (!message) return;
    const pos = this.messages.indexOf(message);
    if (pos < 0) return;
    this.messages.splice(pos, 1);
    this.storeMessages();
  }

  private sortAndSend() {
    this.messages.sort((a, b) =>
      a.subject > b.subject ? 1 : a.subject < b.subject ? -1 : 0
    );
    this.messageListChangedEvent.next(this.messages.slice());
  }

  private getMaxId(): number {
    let maxId = 0;
    for (let msg of this.messages) {
      const currentId = parseInt(msg.id, 10);
      if (currentId > maxId) maxId = currentId;
    }
    return maxId;
  }
}
