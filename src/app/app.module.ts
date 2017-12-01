import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import {AlertPage} from "../pages/alert/alert";
import {UploadPage} from "../pages/upload/upload";
import {SpinnerDialog} from "@ionic-native/spinner-dialog";
import {FileUploadModule} from "ng2-file-upload/index";
import { IonicStorageModule } from '@ionic/storage';
import {ProfilePage} from "../pages/profile/profile";
import {PipesModule} from "../pipes/pipes.module";
import {WalletPage} from "../pages/wallet/wallet";
import { ToastProvider } from '../providers/toast';
import { SpinnerProvider } from '../providers/spinner';
import { UploadProvider } from '../providers/upload';
import {ComponentsModule} from "../components/components.module";
import {ComingsoonComponent} from "../components/comingsoon/comingsoon";
import {InformationPage} from "../pages/information/information";
import {ClipboardModule} from "ngx-clipboard/dist/src";
import {LoginPage} from "../pages/login/login";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {File} from '@ionic-native/file';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { FingerprintProvider } from '../providers/fingerprint';
import {CommunityPage} from "../pages/community/community";
import { PinDialog } from '@ionic-native/pin-dialog';
import { PinDialogProvider } from '../providers/pin-dialog';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslateServiceProvider } from '../providers/translate-service';
import { HeaderPage } from '../pages/header/header';
import {FinancePage} from "../pages/finance/finance";
import {AssetsPage} from "../pages/assets/assets";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {AssetInfoPage} from "../pages/asset-info/asset-info";
import {CreateAssetPage} from "../pages/create-asset/create-asset";
import { WeatherProvider } from '../providers/weather';
import {InterceptorService} from "../providers/interceptor.service";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {UserService} from "../providers/user.service";
import {AssetsService} from "../providers/assets.service";
import {ErrorHandlerService} from "../providers/error-handler.service";

/*export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,'./assets/translate/', '.json');
}*/
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,'./assets/translate/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    WelcomePage,
    AlertPage,
    UploadPage,
    ProfilePage,
    WalletPage,
    InformationPage,
    LoginPage,
    CommunityPage,
    HeaderPage,
    FinancePage,
    AssetsPage,
    AssetInfoPage,
    CreateAssetPage
  ],
  imports: [
    HttpClientModule,
    ComponentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    PipesModule,
    FileUploadModule,
    ClipboardModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite','indexeddb', 'websql']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    TabsPage,
    WelcomePage,
    AlertPage,
    UploadPage,
    ProfilePage,
    WalletPage,
    ComingsoonComponent,
    InformationPage,
    LoginPage,
    CommunityPage,
    HeaderPage,
    FinancePage,
    AssetsPage,
    AssetInfoPage,
    CreateAssetPage
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    StatusBar,
    SplashScreen,
    ErrorHandlerService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SpinnerDialog,
    ToastProvider,
    SpinnerProvider,
    UploadProvider,
    File,
    FingerprintAIO,
    PinDialog,
    FingerprintProvider,
    PinDialogProvider,
    TranslateServiceProvider,
    PhotoViewer,
    WeatherProvider,
    UserService,
    AssetsService
  ]
})
export class AppModule {}
