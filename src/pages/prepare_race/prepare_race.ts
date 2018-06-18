import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-prepare_race',
  templateUrl: 'prepare_race.html'
})
export class PrepareRacePage {

  public title = "";
  public distance = 400;
  public playerNames = ["", "", "", ""];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
  ) {
    this.playerNames = navParams.get('playerNames');
    this.checkPlayerInitialName();
  }

  ready() {
    // let requiredOk = this.checkRequired();
    // if (requiredOk === true) {
    //   this.dismiss('withData');
    // }
    this.checkPlayerNameInput();
    this.dismiss('withData');
  }

  // checkRequired() {
  //   if (this.playerNames[0]==="" || this.playerNames[1]==="" || this.playerNames[2]==="" || this.playerNames[3]==="") {
  //     console.log("distance = ", this.distance);
  //     console.log("playerNames[0] = ", this.playerNames[0]);
  //     console.log("playerNames[1] = ", this.playerNames[1]);
  //     console.log("playerNames[2] = ", this.playerNames[2]);
  //     console.log("playerNames[3] = ", this.playerNames[3]);
  //     this.missedRequiredAlert();
  //   } else {
  //     return true;
  //   }
  // }

  checkPlayerInitialName() {
    this.playerNames[0] = this.playerNames[0]==="選手１" ? "" : this.playerNames[0];
    this.playerNames[1] = this.playerNames[1]==="選手２" ? "" : this.playerNames[1];
    this.playerNames[2] = this.playerNames[2]==="選手３" ? "" : this.playerNames[2];
    this.playerNames[3] = this.playerNames[3]==="選手４" ? "" : this.playerNames[3];
  }
  checkPlayerNameInput() {
    this.playerNames[0] = this.playerNames[0]==="" ? "選手１" : this.playerNames[0];
    this.playerNames[1] = this.playerNames[1]==="" ? "選手２" : this.playerNames[1];
    this.playerNames[2] = this.playerNames[2]==="" ? "選手３" : this.playerNames[2];
    this.playerNames[3] = this.playerNames[3]==="" ? "選手４" : this.playerNames[3];
  }

  // missedRequiredAlert() {
  //   let alert = this.alertCtrl.create({
  //     title: 'おっと！',
  //     subTitle: '必須アイテム*が抜けてる！',
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

  dismiss(arg) {
    if (arg === "withData") {
      console.log({
        title: this.title,
        distance: this.distance,
        playerNames: this.playerNames,
      });
      this.viewCtrl.dismiss({
        title: this.title,
        distance: this.distance,
        playerNames: this.playerNames,
      });
    } else {
      this.viewCtrl.dismiss(undefined);
    }
  }

}
