import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-viewer',
  standalone:true,
  imports:[NgxExtendedPdfViewerModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent {
  // @Input() pdfUrl: string | null = null;
  @Input() currentModule: { pdfUrl: string; name: string } | null = null;

  @Output() next = new EventEmitter<void>();

  onNextClick() {
    this.next.emit();
  }
}
