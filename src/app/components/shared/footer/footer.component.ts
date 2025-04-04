import { Component, ViewChild } from '@angular/core';
import { PrivacyPolicyModalComponent } from '../privacy-policy-modal/privacy-policy-modal.component';
import { TermsConditionsModalComponent } from '../terms-conditions-modal/terms-conditions-modal.component';
import { LegalNoticeModalComponent } from '../legal-notice-modal/legal-notice-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @ViewChild(PrivacyPolicyModalComponent) privacyModal!: PrivacyPolicyModalComponent;
  @ViewChild(TermsConditionsModalComponent) termsModal!: TermsConditionsModalComponent;
  @ViewChild(LegalNoticeModalComponent) legalModal!: LegalNoticeModalComponent;

  constructor() { }

  openPrivacyModal(event: Event): void {
    event.preventDefault();
    this.privacyModal.open();
  }

  openTermsModal(event: Event): void {
    event.preventDefault();
    this.termsModal.open();
  }

  openLegalModal(event: Event): void {
    event.preventDefault();
    this.legalModal.open();
  }
}