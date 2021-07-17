import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SpotGarageSharedLibsModule, SpotGarageSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [SpotGarageSharedLibsModule, SpotGarageSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [SpotGarageSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpotGarageSharedModule {
  static forRoot() {
    return {
      ngModule: SpotGarageSharedModule
    };
  }
}
