import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';

import { PreparePage } from '../prepare/prepare';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public timerOn = 0;
  public unreseted = 0;
  public timer_value_text = "0:00.00";
  public timer_value_msec = 0;
  public startTime;
  public elapsedTime = 0;
  public time = "0:00.00";
  public timerId;

  public timesArray = [];
  public next = {player: 0, times: 1, split: 50};
  public date = {};
  public title = "";
  public distance = 100;
  public times = 10;
  public circle_text = "02:10";
  public circle_msec = 130000; // ミリ秒
  public interval = 5000; // 5秒おき
  public players = [
    { // player[0]
      "name": "選手１",
      "split50": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 50mならここまで
      "lap100": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split100": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 100mならここまで
      "lap150": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split150": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "lap200": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split200": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 200mならここまで
    }, // ....
    { // player[1]
      "name": "選手２",
      "split50": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 50mならここまで
      "lap100": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split100": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 100mならここまで
      "lap150": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split150": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "lap200": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split200": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 200mならここまで
    }, // ....
    { // player[2]
      "name": "選手３",
      "split50": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 50mならここまで
      "lap100": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split100": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 100mならここまで
      "lap150": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split150": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "lap200": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'},
      "split200": {'1':'—', '2':'—', '3':'—', '4':'—', '5':'—', '6':'—', '7':'—', '8':'—', '9':'—', '10':'—'}, // 200mならここまで
    } // ....
  ];
  public initialPlayers = [];

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
    console.log("distance = ", this.distance);
    // console.log("next.player = ",this.next.player);
    // console.log("next.times = ",this.next.times);
    // console.log("next.split = ",this.next.split);
    console.log("next = ",this.next);
    this.setTimesArray();

    // this.initialPlayers = [].concat(this.players);
    for (let i=0; i<this.players.length; i++) {
      this.initialPlayers.push(this.players[i]);
    }
    console.log("initialPlayers = ", this.initialPlayers);
  }

  countUp() {
    this.timerId = setTimeout(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.timer_value_msec = this.elapsedTime - this.circle_msec*(this.next.times-1) - (this.interval*this.next.player);
      // console.log("Date.now() = ",Date.now());
      // console.log("startTime = ",this.startTime);
      console.log("elapsedTime = ",this.elapsedTime);
      this.updateTimerText();
      this.countUp();
    }, 10);
  }

  updateTimerText() {
    this.time = this.timeMsecToText(this.elapsedTime, 2);
    this.timer_value_text = this.timeMsecToText(this.timer_value_msec, 2);
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
    this.timer_value_msec = 0;
    this.updateTimerText();
    this.next = {player: 0, times: 1, split: 50};
    console.log("initialPlayers = ", this.initialPlayers);
    this.players = new Array();
    for (let i=0; i<this.initialPlayers.length; i++) {
      this.players.push(this.initialPlayers[i]);
    }
    console.log("players = ", this.players);
    this.unreseted = 0;
  }

  takeTheTime() {
    console.log("next = ",this.next);
    let currentTime = Date.now() - this.startTime;
    let time_msec = currentTime - this.circle_msec*(this.next.times-1) - (this.interval*this.next.player);
    let time_text = this.timeMsecToText(time_msec, 1);
    console.log("time_text = ",time_text);
    let nextPlayer = this.next.player;
    let nextSplit = 'split'+this.next.split;
    let nextTimes = this.next.times;
    console.log("nextPlayer =", nextPlayer); // int
    console.log("nextSplit =", nextSplit); // str
    console.log("nextTimes =", nextTimes); // int
    this.players[nextPlayer][nextSplit][nextTimes] = time_text;
    // this.players.nextPlayer.nextSplit.nextTimes = time_text;
    console.log("players = ",this.players);

    console.log("next = ",this.next);

    let drawnSplit;
    let pulledSplit;
    // switch (this.next.split) {
    //   case 100:
    //     console.log("case 100:");
    //     drawnSplit = this.timeTextToMsec(this.players[this.next.player].split100[this.next.times]);
    //     pulledSplit = this.timeTextToMsec(this.players[this.next.player].split50[this.next.times]);
    //     this.players[this.next.player].lap100[this.next.times] = this.timeMsecToText(drawnSplit - pulledSplit, 1);
    //     if (this.players[this.next.player].lap100[this.next.times] === "NaN:aN.N") {
    //       this.players[this.next.player].lap100[this.next.times] = "エラー";
    //     }
    //     console.log("next100! = ",this.next);
    //     break;
    //   case 150:
    //     console.log("case 150:");
    //     drawnSplit = this.timeTextToMsec(this.players[this.next.player].split150[this.next.times]);
    //     pulledSplit = this.timeTextToMsec(this.players[this.next.player].split100[this.next.times]);
    //     this.players[this.next.player].lap150[this.next.times] = this.timeMsecToText(drawnSplit - pulledSplit, 1);
    //     if (this.players[this.next.player].lap150[this.next.times] === "NaN:aN.N") {
    //       this.players[this.next.player].lap150[this.next.times] = "エラー";
    //     }
    //     break;
    //   case 200:
    //     console.log("case 200:");
    //     drawnSplit = this.timeTextToMsec(this.players[this.next.player].split200[this.next.times]);
    //     pulledSplit = this.timeTextToMsec(this.players[this.next.player].split150[this.next.times]);
    //     this.players[this.next.player].lap200[this.next.times] = this.timeMsecToText(drawnSplit - pulledSplit, 1);
    //     if (this.players[this.next.player].lap200[this.next.times] === "NaN:aN.N") {
    //       this.players[this.next.player].lap200[this.next.times] = "エラー";
    //     }
    //     break;
    //   default: // case '50':
    //     console.log("case '50':");
    //     console.log("next50! = ",this.next);
    //     break;
    // }

    if (this.next.split == 100) {
        console.log("case 100:");
        drawnSplit = this.timeTextToMsec(this.players[this.next.player].split100[this.next.times]);
        pulledSplit = this.timeTextToMsec(this.players[this.next.player].split50[this.next.times]);
        console.log("い！",this.timeMsecToText(drawnSplit - pulledSplit, 1));
        this.players[this.next.player].lap100[this.next.times] = this.timeMsecToText(drawnSplit - pulledSplit, 1);
        if (this.players[this.next.player].lap100[this.next.times] === "NaN:aN.N") {
          this.players[this.next.player].lap100[this.next.times] = "エラー";
        }
        console.log("next100! = ",this.next);
      } else if (this.next.split == 150) {
        console.log("case 150:");
        drawnSplit = this.timeTextToMsec(this.players[this.next.player].split150[this.next.times]);
        pulledSplit = this.timeTextToMsec(this.players[this.next.player].split100[this.next.times]);
        this.players[this.next.player].lap150[this.next.times] = this.timeMsecToText(drawnSplit - pulledSplit, 1);
        if (this.players[this.next.player].lap150[this.next.times] === "NaN:aN.N") {
          this.players[this.next.player].lap150[this.next.times] = "エラー";
        }
      } else if (this.next.split == 200) {
        console.log("case 200:");
        drawnSplit = this.timeTextToMsec(this.players[this.next.player].split200[this.next.times]);
        pulledSplit = this.timeTextToMsec(this.players[this.next.player].split150[this.next.times]);
        this.players[this.next.player].lap200[this.next.times] = this.timeMsecToText(drawnSplit - pulledSplit, 1);
        if (this.players[this.next.player].lap200[this.next.times] === "NaN:aN.N") {
          this.players[this.next.player].lap200[this.next.times] = "エラー";
        }
      } else if (this.next.split == 50) {
        console.log("case 50:");
        console.log("next50! = ",this.next);
      }


    console.log("next = ",this.next);

    // switch (this.distance) {
    //   case 50:
    //     this.next.times++;
    //     break;
    //   case 100:
    //     switch (this.next.split) {
    //       case 50:
    //         this.next.split = 100;
    //         break;
    //       case 100:
    //         this.next.times++;
    //         this.next.split = 50;
    //         break;
    //     }
    //     break;
    //   case 200:
    //     switch (this.next.split) {
    //       case 50:
    //         this.next.split = 100;
    //         break;
    //       case 100:
    //         this.next.split = 150;
    //         break;
    //       case 150:
    //         this.next.split = 200;
    //         break;
    //       case 200:
    //         this.next.times++;
    //         this.next.split = 50;
    //         break;
    //     }
    //     break;
    // }

    if (this.next.player < this.players.length - 1) { // 最後の選手でなければ
      this.next.player++;
    } else { // 最後の選手なら、次の段へ
      this.next.player = 0;
      if (this.distance == 50) {
        this.next.times++;
      } else if (this.next.split == 50) { // 100mでも200mでもsplit50->split100
        this.next.split = 100;
      } else if (this.distance == 100 && this.next.split == 100) {
        this.next.times++;
        this.next.split = 50;
      } else if (this.distance == 200 && this.next.split == 100) {
        this.next.split = 150;
      } else if (this.distance == 200 && this.next.split == 150) {
        this.next.split = 200;
      } else if (this.distance == 200 && this.next.split == 200) {
        this.next.times++;
        this.next.split = 50;
      }
    }

    console.log("initialPlayers = ", this.initialPlayers);

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
    let circle_msec;
    let circleMin;
    let circleSec;
    let modal = this.modalCtrl.create(PreparePage);
    modal.onDidDismiss(data => {
      console.log(data);
      if (data !== undefined) {
        this.title = data.title;
        this.distance = data.distance;
        this.times = parseInt(data.times);
        console.log("times = ", this.times);
        circleMin =  parseInt(data.circle.substr(0,2));
        circleSec =  parseInt(data.circle.substr(-2,2));
        circle_msec = (circleMin*60 + circleSec) * 1000;
        this.circle_text = data.circle;
        this.circle_msec = circle_msec;
        this.interval = data.interval;
        this.players = data.players;

        this.setTimesArray();
        this.initialPlayers = [];
        for (let i=0; i<this.players.length; i++) {
          this.initialPlayers.push(this.players[i]);
        }
        console.log("players = ", this.players);
        console.log("initialPlayers = ", this.initialPlayers);
        // console.log("circle_msec = ", circle_msec);
        // console.log("next = ", this.next);
      }
    });
    modal.present();
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

  setTimesArray() {
    this.timesArray = new Array();
    for (let i=1; i<=this.times; i++) {
      this.timesArray.push(i);
    }
    console.log("timesArray = ",this.timesArray);
  }

  timeTextToMsec(time_text) { // 0:00.0 => 0000000
    let min = parseInt(time_text.substr(-7,1));
    let sec = parseInt(time_text.substr(-5,2));
    let decimalPart = parseInt(time_text.substr(-2,1));
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


}
