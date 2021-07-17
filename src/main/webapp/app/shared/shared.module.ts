import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { SpotGarageSharedLibsModule, SpotGarageSharedCommonModule, HasAnyAuthorityDirective } from './';

@NgModule({
    imports: [SpotGarageSharedLibsModule, SpotGarageSharedCommonModule],
    declarations: [HasAnyAuthorityDirective],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    exports: [SpotGarageSharedCommonModule, HasAnyAuthorityDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpotGarageSharedModule {
    static forRoot() {
        return {
            ngModule: SpotGarageSharedModule
        };
    }
}
