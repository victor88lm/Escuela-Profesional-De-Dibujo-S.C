import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DibujoPublicitarioComponent } from './dibujo-publicitario.component';

describe('DibujoPublicitarioComponent', () => {
  let component: DibujoPublicitarioComponent;
  let fixture: ComponentFixture<DibujoPublicitarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DibujoPublicitarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DibujoPublicitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
