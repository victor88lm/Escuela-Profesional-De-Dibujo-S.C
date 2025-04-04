import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalNoticeModalComponent } from './legal-notice-modal.component';

describe('LegalNoticeModalComponent', () => {
  let component: LegalNoticeModalComponent;
  let fixture: ComponentFixture<LegalNoticeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LegalNoticeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalNoticeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
