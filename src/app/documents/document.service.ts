import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new Subject<Document>();
  documentListChangedEvent = new Subject<Document[]>();

  private documentsUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {}

  // GET all documents from NodeJS server
  getDocuments() {
    this.http.get<{ message: string; documents: Document[] }>(this.documentsUrl)
      .subscribe(
        (response) => {
          this.documents = response.documents || [];
          this.sortAndSend();
        },
        (error) => {
          console.error('Error fetching documents from server:', error);
        }
      );
  }

  // GET a single document by id
  getDocument(id: string): Document | null {
    return this.documents.find((doc) => doc.id === id) || null;
  }

  // POST a new document
  addDocument(newDocument: Document) {
    if (!newDocument) return;

    newDocument.id = ''; // let the server assign the id

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; document: Document }>(
      this.documentsUrl,
      newDocument,
      { headers }
    ).subscribe(
      (response) => {
        this.documents.push(response.document);
        this.sortAndSend();
      },
      (error) => {
        console.error('Error adding document:', error);
      }
    );
  }

  // PUT: update an existing document
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    newDocument._id = (originalDocument as any)._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(
      `${this.documentsUrl}/${originalDocument.id}`,
      newDocument,
      { headers }
    ).subscribe(
      () => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      },
      (error) => {
        console.error('Error updating document:', error);
      }
    );
  }

  // DELETE a document
  deleteDocument(document: Document | null) {
    if (!document) return;

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) return;

    this.http.delete(`${this.documentsUrl}/${document.id}`)
      .subscribe(
        () => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        },
        (error) => {
          console.error('Error deleting document:', error);
        }
      );
  }

  // Sort documents and emit the updated list
  private sortAndSend() {
    this.documents.sort((a, b) => a.name.localeCompare(b.name));
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
