import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  usePicker = false;
  @Input() showPreview = false;
  @ViewChild('filePicker',{static: true}) filePicker: ElementRef<HTMLInputElement>;
  @Output() imagePic = new EventEmitter<string | File>();
  constructor(private platform: Platform) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && !(this.platform.is('hybrid'))) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePicker.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 300,
      resultType: CameraResultType.Base64
    }).then((image) => {
      this.selectedImage = image.base64String;
      this.imagePic.emit(image.base64String);
    }).catch((err) => {
      console.log('err', err);
      if(this.usePicker) {
        this.filePicker.nativeElement.click();
      }
      return false;
    });
  }

  onFileChoosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if(!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePic.emit(pickedFile);
    }
    fr.readAsDataURL(pickedFile);
  }
}
