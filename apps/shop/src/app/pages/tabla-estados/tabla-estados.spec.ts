import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaEstadosComponent as TablaEstados } from './tabla-estados';

describe('TablaEstados', () => {
  let component: TablaEstados;
  let fixture: ComponentFixture<TablaEstados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaEstados],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaEstados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
