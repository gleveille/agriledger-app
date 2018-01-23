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
import {SpinnerDialog} from "@ionic-native/spinner-dialog";
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
import {LoginPage} from "../pages/login/login";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import {AssetInfoPage} from "../pages/asset-info/asset-info";
import {CreateAssetPage} from "../pages/create-asset/create-asset";
import { WeatherProvider } from '../providers/weather';
import {InterceptorService} from "../providers/interceptor.service";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {UserService} from "../providers/user.service";
import {AssetsService} from "../providers/assets.service";
import {ErrorHandlerService} from "../providers/error-handler.service";
import {HomePage} from "../pages/home/home";
import {SocialSharing} from "@ionic-native/social-sharing";
import {TermsPage} from "../pages/terms/terms";
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {CompleteWeatherPage} from "../pages/complete-weather/complete-weather";
import {HttpModule} from "@angular/http";
import {CacheModule} from 'ionic-cache';
import { FileTransfer } from '@ionic-native/file-transfer';
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {ChartsModule} from "ng2-charts";
import {ResetPasswordPage} from "../pages/reset-password/reset-password";
import {FingerprintPage} from "../pages/fingerprint/fingerprint";
import { SettingsPage } from '../pages/settings/settings';
import {ForgotPasswordPage} from "../pages/forgot-password/forgot-password";

import { IonicImageViewerModule } from 'ionic-img-viewer';
import {PasscodeLockPage} from "../pages/passcode-lock/passcode-lock";
import {LoanPage} from "../pages/loan/loan";
import {WeatherPage} from "../pages/weather/weather";
import {EmailSentPage} from "../pages/email-sent/email-sent";
import { IndexProvider } from '../providers/index/index';
import { ImageDialogPage } from '../pages/image-dialog/image-dialog';
import { UserDocumentDialogPage } from '../pages/user-document-dialog/user-document-dialog';
import {CreateFarmPage} from "../pages/create-farm/create-farm";
import {FarmInfoPage} from "../pages/farm-info/farm-info";


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
    ProfilePage,
    WalletPage,
    InformationPage,
    LoginPage,
    CommunityPage,
    HeaderPage,
    FinancePage,
    AssetsPage,
    AssetInfoPage,
    CreateAssetPage,
    HomePage,
    TermsPage,
    CompleteWeatherPage,
    ChangePasswordPage,
    ResetPasswordPage,
    FingerprintPage,
    SettingsPage,
    ForgotPasswordPage,
    PasscodeLockPage,
    LoanPage,
    WeatherPage,
    EmailSentPage,
    ImageDialogPage,
    UserDocumentDialogPage,
    CreateFarmPage,
    FarmInfoPage
  ],
  imports: [
    HttpClientModule,
    ComponentsModule,
    BrowserModule,
    ChartsModule,
    BrowserAnimationsModule,
    PipesModule,
    IonicImageViewerModule,
    CacheModule.forRoot(),
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
    CreateAssetPage,
    HomePage,
    TermsPage,
    CompleteWeatherPage,
    ChangePasswordPage,
    ResetPasswordPage,
    FingerprintPage,
    SettingsPage,
    ForgotPasswordPage,
    PasscodeLockPage,
    LoanPage,
    WeatherPage,
    EmailSentPage,
    ImageDialogPage,
    UserDocumentDialogPage,
    CreateFarmPage,
    FarmInfoPage

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
    UserService,
    AssetsService,
    SpinnerProvider,
    UploadProvider,
    FileTransfer,
    FingerprintAIO,
    PinDialog,
    FingerprintProvider,
    PinDialogProvider,
    TranslateServiceProvider,
    WeatherProvider,
    SocialSharing,
    Geolocation,
    Camera,
    InAppBrowser,
    IndexProvider
  ]
})

export class AppModule {}
