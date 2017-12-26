import { NgModule } from '@angular/core';
import { TxnTypePipe } from './txn-type/txn-type';
import { TimestampPipe } from './timestamp/timestamp';
import { XasPipe } from './xas/xas';
import { MomentPipe } from './moment/moment';
@NgModule({
	declarations: [TxnTypePipe,
    TimestampPipe,
    XasPipe,
    MomentPipe],
	imports: [],
	exports: [
    TxnTypePipe,
    TimestampPipe,
    XasPipe,
    MomentPipe]
})
export class PipesModule {}
