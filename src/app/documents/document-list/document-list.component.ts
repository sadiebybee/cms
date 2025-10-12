import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter();

  documents = [
    new Document('1', 'WDD 430 - Web Full-Stack Development', 'This course will teach you how to design and build interactive web based applications using HTML, CSS, JavaScript, and a web development stack.', 'https://www.fullstack.com/1'),
    new Document('2', 'WDD 499 - Technology Product Dev IV', 'This course will provide students with the opportunity to create a technology product.', 'https://www.productdev.com/2'),
    new Document('3', 'REL 301 - Old Testament', 'This course is a study of the Old Testament from Genesis through 2 Samuel, with an emphasis on doctrine and principles.', 'https://www.oldtestament.com/3'),
    new Document('4', 'CSE 340 - Web Backend Development', 'This programming course focuses on constructing dynamic web sites using server-side languages, making use of databases and design patterns. The concepts introduced in Web Frontend Development courses are expected to be continued and implemented.', 'https://www.backenddev.com/4'),
  ];

  constructor() {}

  ngOnInit(): void {}

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
