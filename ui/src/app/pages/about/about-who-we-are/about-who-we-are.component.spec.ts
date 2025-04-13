import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutWhoWeAreComponent } from './about-who-we-are.component';

describe('AboutWhoWeAreComponent', () => {
  let component: AboutWhoWeAreComponent;
  let fixture: ComponentFixture<AboutWhoWeAreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutWhoWeAreComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutWhoWeAreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
