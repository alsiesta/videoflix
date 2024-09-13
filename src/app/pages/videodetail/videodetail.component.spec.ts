import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideodetailComponent } from './videodetail.component';

describe('VideodetailComponent', () => {
  let component: VideodetailComponent;
  let fixture: ComponentFixture<VideodetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideodetailComponent]
    });
    fixture = TestBed.createComponent(VideodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
