import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'language-change',
  templateUrl: './language-change.component.html',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageChangeComponent {
  protected translate: TranslateService = inject(TranslateService);

  changeLang(e:any){
    this.translate.setDefaultLang(e.value);
    this.translate.use(e.value);
  }
}
