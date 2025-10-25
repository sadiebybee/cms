import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
})
export class DocumentDetailComponent implements OnInit {
  document: Document | null = null;
  nativeWindow: any;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    public route: ActivatedRoute,
    private windRefService: WindRefService
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.windRefService.getNativeWindow();

    // Subscribe to route params to get the selected document
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.document = this.documentService.getDocument(id);
    });
  }

  // Opens document URL in a new tab
  onView() {
    if (this.document?.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  // Routes to edit page
  onEdit() {
    if (this.document?.id) {
      this.router.navigate(['/documents', this.document.id, 'edit']);
    }
  }

  // Deletes the document and navigates back to the list
  onDelete() {
    if (this.document) {
      this.documentService.deleteDocument(this.document);
      this.router.navigate(['/documents']);
    }
  }
}
