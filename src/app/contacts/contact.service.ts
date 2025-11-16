import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  contactSelectedEvent = new Subject<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  private maxContactId: number = 0;

  private firebaseUrl =
    'https://sadiebybee-cms-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {}

  // Fetch Contacts from Firebase
  getContacts() {
    this.http.get<Contact[]>(this.firebaseUrl).subscribe(
      (contacts: Contact[] | null) => {
        this.contacts = contacts || [];
        this.maxContactId = this.getMaxId();
        this.sortAndSend();
      },
      (error: any) => {
        console.error('Error fetching contacts from Firebase:', error);
      }
    );
  }

  // Save Contacts to Firebase
  storeContacts() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.firebaseUrl, this.contacts, { headers })
      .subscribe(() => {
        this.sortAndSend();
      });
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id) || null;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) return;
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

  private sortAndSend() {
    this.contacts.sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  private getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
