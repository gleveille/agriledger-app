import { NgModule } from '@angular/core';
import { TxnTypePipe } from './txn-type/txn-type';
import { TimestampPipe } from './timestamp/timestamp';
import { XasPipe } from './xas/xas';
@NgModule({
	declarations: [TxnTypePipe,
    TimestampPipe,
    XasPipe],
	imports: [],
	exports: [
    TxnTypePipe,
    TimestampPipe,
    XasPipe]
})
export class PipesModule {}
