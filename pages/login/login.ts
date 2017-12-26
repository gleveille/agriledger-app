import {Component} from '@angular/core';
import {NavController, NavParams, Form, AlertController, LoadingController} from 'ionic-angular';
import {NgForm} from "@angular/forms/forms";
import {ToastProvider} from "../../providers/toast";
import {TabsPage} from "../tabs/tabs";
import {UserService} from "../../providers/user.service";
import {ChangePasswordPage} from "../change-password/change-password";
import {ForgotPasswordPage} from "../forgot-password/forgot-password";
import {AssetsService} from "../../providers/assets.service";
import {PasscodeLockPage} from "../passcode-lock/passcode-lock";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl:NavController, public navParams:NavParams,private loadingCtrl:LoadingController,
              private userService:UserService,
              private assetService:AssetsService,
              private toastService:ToastProvider, public alerCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(f:NgForm) {
    let loader = this.loadingCtrl.create({
      content: 'Logging you..'
    });
    loader.present();
    this.userService.login({email: f.value.email, password: f.value.password}).subscribe((user:any)=> {
      loader.dismiss();
      if(!user.isPasswordChanged){
        this.navCtrl.setRoot(ChangePasswordPage)
      }
      else if(!user.profiles.passcode){
        this.navCtrl.setRoot(PasscodeLockPage)
      }
      else{
        this.navCtrl.setRoot(TabsPage)

      }
    }, (err)=> {
      loader.dismiss();
      this.toastService.presentToast(err.message || 'Login failed');
    })
  }

  termsAndConditions() {
    let confirm = this.alerCtrl.create({
      title: 'Terms and Conditions',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec gravida varius erat non faucibus. Nulla facilisi. Nulla consectetur faucibus mi, a rhoncus turpis imperdiet vitae. Aenean dignissim odio odio. Praesent malesuada lacus eu nunc vulputate dictum. In tincidunt in nisi at egestas. Curabitur tristique, turpis porta sagittis gravida, felis elit hendrerit augue, eget sodales mauris augue in orci. Nullam eu nunc sit amet ipsum tincidunt gravida. Fusce in lacinia augue. Vivamus sagittis finibus fringilla. In ornare nisi nec ultrices rutrum. Fusce nec luctus nisi, in posuere turpis. Proin consequat ullamcorper libero, ac convallis turpis viverra eget. Ut porta auctor elit, a dignissim enim tristique ut. Suspendisse euismod, ligula vel eleifend ornare, nunc sem ultrices risus, ut vehicula eros nisi quis lorem. Maecenas sit amet neque sodales, accumsan libero eu, interdum orci. Aenean finibus at est nec euismod. Etiam interdum nisl felis, iaculis facilisis urna consequat non. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras sem odio, hendrerit vel justo vitae, malesuada tincidunt leo. Nunc elementum tincidunt dui, a luctus ligula. Sed vel elit vel elit ultricies faucibus ac eget nibh. Etiam vel lorem a nibh viverra vulputate sed eget nulla. Nullam sollicitudin tincidunt dictum. Integer sit amet augue fringilla sapien pharetra aliquet sit amet id mi. Pellentesque ante metus, pretium ut lectus ut, sollicitudin vehicula lacus. Maecenas sit amet dictum turpis. Donec semper mi a sem vestibulum, non luctus urna venenatis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras vel ultricies justo. Ut vel venenatis tortor. Suspendisse potenti. Nam elementum ante cursus laoreet finibus. Sed ipsum odio, vestibulum eu pulvinar non, tristique in neque. Integer nisi est, placerat eget eleifend iaculis, aliquam id velit. Fusce non tortor feugiat erat feugiat luctus. Aliquam lorem nulla, euismod pulvinar urna quis, dignissim dictum dui. Quisque porta lorem in consequat aliquet. Suspendisse potenti. Mauris semper sed nunc et iaculis. Donec commodo semper facilisis. Nunc sed ex ornare tellus lobortis varius. Maecenas dictum ut tellus at interdum. Pellentesque ac nisi a nisl pellentesque porttitor eget sollicitudin dui. Mauris a metus congue, tincidunt ante vel, varius nisi. In dignissim velit vitae turpis aliquam ultrices. Donec efficitur magna vel gravida lobortis. Donec placerat luctus viverra. Pellentesque sodales risus libero, semper pharetra justo gravida non. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget ex mollis, rutrum eros nec, mattis neque. Proin tristique eros urna, a cursus tellus volutpat ac.',
      buttons: [
        /*{
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },*/
        {
          text: 'OK',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present()
  }

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage)
  }

}
