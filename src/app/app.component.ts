import {
  Component,
  inject
} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet
  ]
})
export class AppComponent {
  private translate: TranslateService = inject(TranslateService);

  constructor() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent ) => {
      localStorage.setItem('locale', event.lang);
    });

    let locale = localStorage.getItem('locale');
    if(!locale) locale ="ru";
    this.translate.setDefaultLang(locale);
    this.translate.use(locale);

  }
}
