import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-prepare',
  templateUrl: 'prepare.html'
})
export class PreparePage {

  public title = "";
  public distance = 100;
  public times = 10;
  public circle = "02:10";
  public interval = 5000;
  public temporaryPlayers = ["", "", "", "", "", "", ""];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
  ) {
    console.log("temporaryPlayers = ",this.temporaryPlayers);
  }

  ready() {
    let requiredOk = this.checkRequired();
    if (requiredOk === true) {
      let players = this.makePlayersArray();
      this.dismiss(players);
    }
  }

  makePlayersArray() {
    let emptyObj = {};
    for (let i=1; i<=this.times; i++) {
      emptyObj[i] = "—";
    }

    let players = [];
    console.log("temporaryPlayers = ",this.temporaryPlayers);
    for (let i=0; i<=6; i++) {
      if (this.temporaryPlayers[i] !== "") {
        // switch(this.distance) {
        //   case "50":
        //     players.push({
        //       "name": this.temporaryPlayers[i],
        //       "split50": emptyObj, // 50mならここまで
        //     });
        //     break;
        //   case "100":
        //     players.push({
        //       "name": this.temporaryPlayers[i],
        //       "split50": emptyObj,
        //       "lap100": emptyObj,
        //       "split100": emptyObj, // 100mならここまで
        //     });
        //     break;
        //   case "200":
            players.push({
              "name": this.temporaryPlayers[i],
              "split50": emptyObj,
              "lap100": emptyObj,
              "split100": emptyObj,
              "lap150": emptyObj,
              "split150": emptyObj,
              "lap200": emptyObj,
              "split200": emptyObj, // 200mならここまで
            });
        //     break;
        // }
      }
    }
    return players;
  }

  checkRequired() {
    if (this.temporaryPlayers[0]==="") {
      console.log("distance = ", this.distance);
      console.log("times = ", this.times);
      console.log("circle = ", this.circle);
      console.log("interval = ", this.interval);
      console.log("temporaryPlayers[0] = ", this.temporaryPlayers[0]);
      this.missedRequiredAlert();
    } else {
      return true;
    }
  }

  missedRequiredAlert() {
  let alert = this.alertCtrl.create({
    title: 'おっと！',
    subTitle: '必須アイテム*が抜けてる！',
    buttons: ['OK']
  });
  alert.present();
}

  dismiss(players) {
    if (players) {
      console.log({
        title: this.title,
        distance: this.distance,
        times: this.times,
        circle: this.circle,
        interval: this.interval,
        players: players,
      });
      this.viewCtrl.dismiss({
        title: this.title,
        distance: this.distance,
        times: this.times,
        circle: this.circle,
        interval: this.interval,
        players: players,
      });
    } else {
      this.viewCtrl.dismiss(undefined);
    }
  }

}
