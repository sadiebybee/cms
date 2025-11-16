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

  private maxDocumentId: number = 0;

  private firebaseUrl =
    'https://sadiebybee-cms-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {}

  // Fetch from Firebase
  getDocuments() {
    this.http.get<Document[]>(this.firebaseUrl).subscribe(
      (documents: Document[]) => {
        this.documents = documents || [];
        this.maxDocumentId = this.getMaxId();
        this.sortAndSend();
      },
      (error: any) => {
        console.error('Error fetching documents from Firebase:', error);
      }
    );
  }

  // Save Documents from Firebase
  storeDocuments() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.firebaseUrl, this.documents, { headers })
      .subscribe(() => {
        this.sortAndSend();
      });
  }

  getDocument(id: string): Document | null {
    return this.documents.find((doc) => doc.id === id) || null;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) return;
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document | null) {
    if (!document) return;
    const pos = this.documents.indexOf(document);
    if (pos < 0) return;
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  // Sort Documents
  private sortAndSend() {
    this.documents.sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }

  private getMaxId(): number {
    let maxId = 0;
    for (let doc of this.documents) {
      const currentId = parseInt(doc.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
