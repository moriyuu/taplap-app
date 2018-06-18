import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { PrepareRacePage } from '../prepare_race/prepare_race';

@Component({
  selector: 'page-race',
  templateUrl: 'race.html'
})
export class RacePage {

  public timerOn = 0;
  public unreseted = 0;
  public timer_lap50_text = "0:00.00";
  public timer_lap50_msec = 0;
  public timer_lap100_text = "0:00.00";
  public timer_lap100_msec = 0;
  public timer_lap200_text = "0:00.00";
  public timer_lap200_msec = 0;
  public startTime;
  public elapsedTime = 0;
  public time = "0:00.00";
  public timerId;

  public next = {player: 0, split: 50};
  public date = {};
  public title = "";
  public distance = 400;
  public split = {
    0: {"text": '0:00.00', "msec": 0},
    50: {"text": '—', "msec": 0},
    100: {"text": '—', "msec": 0},
    150: {"text": '—', "msec": 0},
    200: {"text": '—', "msec": 0},
    250: {"text": '—', "msec": 0},
    300: {"text": '—', "msec": 0},
    350: {"text": '—', "msec": 0},
    400: {"text": '—', "msec": 0},
    450: {"text": '—', "msec": 0},
    500: {"text": '—', "msec": 0},
    550: {"text": '—', "msec": 0},
    600: {"text": '—', "msec": 0},
    650: {"text": '—', "msec": 0},
    700: {"text": '—', "msec": 0},
    750: {"text": '—', "msec": 0},
    800: {"text": '—', "msec": 0}
  }
  public players = [
    { // players[0]
      "name": "選手１",
      "lapPer50": {50: {"text": '—', "msec": undefined}, 100: {"text": '—', "msec": undefined}, 150: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer100": {100: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer200": {200: {"text": '—', "msec": undefined}},
    }, // ....
    { // players[1]
      "name": "選手２",
      "lapPer50": {50: {"text": '—', "msec": undefined}, 100: {"text": '—', "msec": undefined}, 150: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer100": {100: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer200": {200: {"text": '—', "msec": undefined}},
    }, // ....
    { // players[2]
      "name": "選手３",
      "lapPer50": {50: {"text": '—', "msec": undefined}, 100: {"text": '—', "msec": undefined}, 150: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer100": {100: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer200": {200: {"text": '—', "msec": undefined}},
    }, // ....
    { // players[3]
      "name": "選手４",
      "lapPer50": {50: {"text": '—', "msec": undefined}, 100: {"text": '—', "msec": undefined}, 150: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer100": {100: {"text": '—', "msec": undefined}, 200: {"text": '—', "msec": undefined}},
      "lapPer200": {200: {"text": '—', "msec": undefined}},
    }, // ....
  ];
  public splitDistanceArr = []

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
  ) {
    console.log("distance = ", this.distance);
    console.log("next = ",this.next);
    this.setSplitDistanceArr();
  }

  countUp() {
    this.timerId = setTimeout(() => {
      this.elapsedTime = Date.now() - this.startTime;
      console.log("elapsedTime = ",this.elapsedTime);

      // LAPタイムのlively表示
      let nextSplit = this.next.split;
      this.timer_lap50_msec = this.elapsedTime - this.split[nextSplit-50]["msec"];
      if (nextSplit >= 100) {
        if (nextSplit % 100 === 0) {
          this.timer_lap100_msec = this.elapsedTime - this.split[nextSplit-100]["msec"];
        } else {
          this.timer_lap100_msec = this.elapsedTime - this.split[nextSplit-50]["msec"];
        }
      } else {
        this.timer_lap100_msec = this.elapsedTime;
      }
      if (nextSplit >= 200 ) {
        this.timer_lap200_msec = this.elapsedTime - this.split[nextSplit-200]["msec"];
      } else {
        this.timer_lap200_msec = this.elapsedTime;
      }

      this.updateTimerText();
      this.countUp();
    }, 10);
  }

  updateTimerText() {
    this.time = this.timeMsecToText(this.elapsedTime, 2);
    this.timer_lap50_text = this.timeMsecToText(this.timer_lap50_msec, 2);
    this.timer_lap100_text = this.timeMsecToText(this.timer_lap100_msec, 2);
    this.timer_lap200_text = this.timeMsecToText(this.timer_lap200_msec, 2);
  }

  start() {
    this.startTime = Date.now();
    this.date = this.getDate();
    this.timerOn = 1;
    console.log("startTime = ",this.startTime);
    this.countUp();
    console.log("start() next = ",this.next);
  }
  stop() {
    clearTimeout(this.timerId);
    this.timerOn = 0;
    this.unreseted = 1;
  }
  reset() {
    this.elapsedTime = 0;
    this.timer_lap50_msec = 0;
    this.timer_lap100_msec = 0;
    this.timer_lap200_msec = 0;
    this.updateTimerText();
    this.next = {player: 0, split: 50};
    this.unreseted = 0;
  }

  takeTheTime() {
    if (this.split[this.distance].msec === 0) {

      // SPLITを記録
      let currentTime = Date.now() - this.startTime;
      let nextPlayer = this.next.player;
      let nextSplit = this.next.split;
      // console.log("next = ",this.next);
      // console.log("nextPlayer =", nextPlayer); // int
      // console.log("nextSplit =", nextSplit); // int
      console.log("currentTime =", currentTime);

      this.split[nextSplit]["msec"] = currentTime;
      this.split[nextSplit]["text"] = this.timeMsecToText(this.split[nextSplit]["msec"], 2);

      // LAPを記録
      var a = this.distance===200 ? 50 : this.distance===400 ? 100: 200;
      console.log("lapPer50", nextSplit-(nextPlayer*a));
      this.players[nextPlayer].lapPer50[nextSplit-(nextPlayer*a)]["msec"] = currentTime - this.split[nextSplit-50]["msec"];
      this.players[nextPlayer].lapPer50[nextSplit-(nextPlayer*a)]["text"] = this.timeMsecToText(this.players[nextPlayer].lapPer50[nextSplit-(nextPlayer*a)]["msec"], 2);
      if (nextSplit % 100 === 0 && this.distance >= 400) {
        console.log("nextSplit =", nextSplit); // int
        console.log("lapPer100", nextSplit-(nextPlayer*a));
        var a = this.distance===400 ? 100 : 200;
        this.players[nextPlayer].lapPer100[nextSplit-(nextPlayer*a)]["msec"] = currentTime - this.split[nextSplit-100]["msec"];
        this.players[nextPlayer].lapPer100[nextSplit-(nextPlayer*a)]["text"] = this.timeMsecToText(this.players[nextPlayer].lapPer100[nextSplit-(nextPlayer*a)]["msec"], 2);
      }
      if (nextSplit % 200 === 0 && this.distance >= 800) {
        console.log("nextSplit =", nextSplit); // int
        console.log("lapPer200", 200);
        this.players[nextPlayer].lapPer200[200]["msec"] = currentTime - this.split[nextSplit-200]["msec"];
        this.players[nextPlayer].lapPer200[200]["text"] = this.timeMsecToText(this.players[nextPlayer].lapPer200[200]["msec"], 2);
      }
      console.log("players = ",this.players);

      // this.nextの設定
      if (this.distance === 200 || (this.distance === 400 && nextSplit % 100 === 0) || (this.distance === 800 && nextSplit % 200 === 0)) {
        this.next.player++;
      }
      this.next.split+=50;
    }
  }

  stopConfirm() {
    let alert = this.alertCtrl.create({
      title: '確認',
      message: '再開はできません！<br>本当にストップしますか？',
      buttons: [
        {
          text: 'キャンセル',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ストップ',
          handler: () => {
            console.log('REALLY stop');
            this.stop();
          }
        }
      ]
    });
    alert.present();
  }
  resetConfirm() {
    let alert = this.alertCtrl.create({
      title: '確認',
      message: '計測結果は削除されます！<br>本当にリセットしますか？',
      buttons: [
        {
          text: 'キャンセル',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'リセット',
          handler: () => {
            console.log('REALLY reset');
            this.reset();
          }
        }
      ]
    });
    alert.present();
  }

  goPreparePage() {
    let playerNames = [this.players[0].name, this.players[1].name, this.players[2].name, this.players[3].name];
    let modal = this.modalCtrl.create(PrepareRacePage, {playerNames});
    modal.onDidDismiss(data => {
      console.log(data);
      if (data !== undefined) {
        this.title = data.title;
        this.distance = parseInt(data.distance);
        this.setSplitDistanceArr();
        this.players[0].name = data.playerNames[0];
        this.players[1].name = data.playerNames[1];
        this.players[2].name = data.playerNames[2];
        this.players[3].name = data.playerNames[3];
        console.log("players = ", this.players);
      }
    });
    modal.present();
  }

  setSplitDistanceArr() {
    switch (this.distance) {
      case 200:
        this.splitDistanceArr = [50,100,150,200];
        break;
      case 400:
        this.splitDistanceArr = [50,100,150,200,250,300,350,400];
        break;
      case 800:
        this.splitDistanceArr = [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750,800];
        break;
    }
  }

  getDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return {year, month, day, hour, minute};
  }

  timeTextToMsec(time_text, digit) { // 0:00.0 => 0000000
    let min = parseInt(time_text.substr(-7,1));
    let sec = parseInt(time_text.substr(-5,2));
    let decimalPart = parseInt(time_text.substr(-2,digit));
    let time_msec = (min*60 + sec)*1000 + decimalPart*100;
    console.log("timeTextToMsec!! " + time_text +'=>'+ time_msec);
    return time_msec;
  }
  timeMsecToText(time_msec, digit) { // 0000000 => 0:00.0 (or 0:00.00)
    let min = Math.floor(time_msec / 60000);
    let sec = Math.floor(time_msec % 60000 / 1000);
    let msec = time_msec % 1000;
    let ss = ('0' + sec).substr(-2,2);
    let ms = ('00' + msec).substr(-3,digit);
    let time_text = min + ':' + ss + '.' + ms;
    console.log("timeMsecToText!! " + time_msec +'=>'+ time_text);
    return time_text;
  }

  floor(devided, devide) {
    return Math.floor(devided / devide);
  }


}
