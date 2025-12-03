import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new Subject<Contact>();

  private contactsUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  // GET all contacts
  getContacts() {
    this.http.get<{ message: string; contacts: Contact[] }>(this.contactsUrl)
      .subscribe(
        (response) => {
          this.contacts = response.contacts || [];
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Error fetching contacts:', error);
        }
      );
  }

  // GET a single contact by id
  getContact(id: string): Contact | null {
    return this.contacts.find(c => c.id === id) || null;
  }

  // POST a new contact
  addContact(newContact: Contact) {
    if (!newContact) return;

    newContact.id = ''; // server assigns id

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; contactObject: Contact }>(
      this.contactsUrl,
      newContact,
      { headers }
    ).subscribe(
      (response) => {
        this.contacts.push(response.contactObject);  // use contactObject
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error adding contact:', error);
      }
    );
  }

  // PUT: update an existing contact
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    newContact._id = (originalContact as any)._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(
      `${this.contactsUrl}/${originalContact.id}`,
      newContact,
      { headers }
    ).subscribe(
      () => {
        this.contacts[pos] = newContact;
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }

  // DELETE a contact
  deleteContact(contact: Contact | null) {
    if (!contact) return;

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.http.delete(`${this.contactsUrl}/${contact.id}`)
      .subscribe(
        () => {
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Error deleting contact:', error);
        }
      );
  }
}
