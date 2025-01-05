/**
 * @fileoverview Componente di gioco per la gestione delle donazioni e del punteggio.
 *
 * @module GameComponent
 */
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CountUp } from "countup.js";
import { SurveyService } from "./survey.service";
import { HttpClient } from "@angular/common/http";
import { combineLatest } from "rxjs";
import { PostSurvey } from "../data/post.survey";
import { Model, SurveyModel } from "survey-core";
import { PreSurvey } from "../data/pre.survey";
import { GameService } from "./game.service";
declare var $, bootstrap: any;
declare var SurveyTheme: any;

/**
 * Componente di gioco per la gestione delle donazioni e del punteggio.
 *
 * @class
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, AfterViewInit {

  /**
   * Flag per confermare la propria tirchieria
   */
  keep = false;
  /**
   * Numero di osservatori casuali.
   * @type {number}
   */
  observers = Math.round(Math.random() * 5);
  /**
   * Punteggio attuale.
   * @type {number}
   */
  score = 0;
  /**
   * Contatore del punteggio.
   * @type {CountUp}
   */
  scoreContainer: CountUp;
  /**
   * Numero totale di vite.
   * @type {number}
   */
  TOTAL_LIVES = 1;
  /**
   * Array delle vite.
   * @type {number[]}
   */
  life = new Array(this.TOTAL_LIVES).fill(0);
  /**
   * Stato interno del gioco.
   * @type {number}
   */
  internalState = +localStorage.getItem("state") || State.PRE;
  /**
   * Punteggio totale.
   * @type {number}
   */
  totalScore = 0;
  /**
   * Classifica dei giocatori.
   * @type {any[]}
   */
  leaderboard = [];
  /**
   * Oggetto contenente gli audio.
   * @type {Object}
   */
  audios = {};
  /**
   * Stato del gioco.
   * @type {typeof State}
   */
  status = State;
  /**
   * Codice macchina.
   * @type {string | null}
   */
  machineCode = localStorage.getItem("machineCode");
  /**
   * Donazione attuale.
   * @type {Donation}
   */
  donation: Donation = {
    amount: 0,
    lives: 10,
    name: "",
    message: "",
  };
  /**
   * Donazione in arrivo.
   * @type {Donation}
   */
  incomingDonation: Donation = {
    amount: 2,
    lives: 0,
    name: "Deleter",
    message: "Good luck!",
  };
  /**
   * Partita corrente.
   * @type {number}
   */
  currentMatch = 1;
  /**
   * Modello del sondaggio post-partita.
   * @type {SurveyModel}
   */
  postSurvey: SurveyModel;
  /**
   * Modello del sondaggio pre-partita.
   * @type {SurveyModel}
   */
  preSurvey: SurveyModel;
  /**
   * Numero totale di partite.
   * @type {number}
   */
  TOTAL_MATCHES = 2;

  /**
   * Getter per lo stato del gioco.
   * @returns {number}
   */

  answers = {
    q1: null,
    q2: null,
    q3: null,
  };

  lifeves = "";
  lifevesMax = "";
  lifevesKeep = "";
 

  correctAnswers = {
    q1: 'A',
    q2: 'B',
    q3: 'C',
  };

  tutorialStep = 1;

  areAllAnswersCorrect(): boolean {
    return (
      this.answers.q1 === this.correctAnswers.q1 &&
      this.answers.q2 === this.correctAnswers.q2 &&
      this.answers.q3 === this.correctAnswers.q3
    );
  }

  get state() {
    return this.internalState;
  }

  /**
   * Setter per lo stato del gioco.
   * @param {number} v - Nuovo stato del gioco.
   */
  set state(v) {
    this.internalState = v;
    localStorage.setItem("state", v.toString());
  }

  /**
   * Getter per l'array delle donazioni.
   * @returns {number[]}
   */
  get donationArray() {
    return new Array(Math.max(0, this.donation.lives - 1)).fill(0);
  }

  constructor(public http: HttpClient, private gameService: GameService, private surveyService: SurveyService) {}

  /**
   * Metodo di inizializzazione del componente.
   * @returns {void}
   */
  ngOnInit(): void {
    if (!this.machineCode || location.href.includes("force")) {
      this.machineCode = SurveyService.generateMachineCode();
      localStorage.setItem("machineCode", this.machineCode);
      this.state = State.PRE;
    }

  
    this.preSurvey = new Model(PreSurvey);
    // Ottiene il dispositivo e il browser dell'utente.
    const device = this.surveyService.getDeviceAndBrowser();
    this.preSurvey.setValue('experiment_group', this.machineCode[0] === '0' ? 'anonimo' : 'non_anonimo');
    this.preSurvey.setValue('device', device.device);
    this.preSurvey.setValue('browser', device.browser);
    this.preSurvey.setValue('start_time', new Date().toISOString());

    // Ottiene il paese dell'utente.
    try {
      this.surveyService.getCountry().then((country) => {
        this.preSurvey.setValue('country', country.country);
        this.preSurvey.setValue('city', country.city);
        this.preSurvey.setValue('region', country.region);
      }).catch(() => {
        this.preSurvey.setValue('country', 'unknown');
      });
    } catch (e) {
      this.preSurvey.setValue('country', 'unknown');
    }
    this.preSurvey.showPrevButton = false;
    this.preSurvey.applyTheme(SurveyTheme.ContrastDark);
    this.preSurvey.cookieName = this.machineCode;
    this.preSurvey.onComplete.add(() => {
      this.state = State.TUTORIAL;
      this.sendData("pre", this.preSurvey).subscribe(() => {
        this.start();
      });
    });
    this.postSurvey = new Model(PostSurvey);
    this.postSurvey.applyTheme(SurveyTheme.ContrastDark);
    this.postSurvey.showPrevButton = false;
    this.postSurvey.cookieName = this.machineCode;
    this.postSurvey.onComplete.add(() => {
      this.getLeaderboard();
      this.sendData("post", this.postSurvey).subscribe(() => {});
      this.http
        .put(
          SurveyService.getUrl(this.machineCode + "/totalScore"),
          this.totalScore
        )
        .subscribe(() => {});
      this.state = State.LEADERBOARD;
    });

    this.http
      .get(SurveyService.getUrl(`lastDonation${this.machineCode[0]}`))
      .subscribe((donation: Donation) => {
        this.incomingDonation = donation || this.incomingDonation;
      });

    setInterval(() => {
      if (Math.random() > 0.6) {
        this.observers += Math.round((Math.random() - 0.5) * 2);
        if (this.observers < 0) {
          this.observers = 0;
        }
      }
    }, 5000);
  }

  /**
   * Metodo per ottenere la classifica.
   * @returns {void}
   */
  getLeaderboard() {
    this.http.get(SurveyService.getUrl("")).subscribe((data: any) => {
      this.leaderboard = [];
      for (const key in data) {
        if (!(data[key].totalScore >= 0)) {
          continue;
        }
        if (key[0] === this.machineCode[0]) {
          data[key].machineCode = key;
          this.leaderboard.push(data[key]);
        }
      }
      const me = this.leaderboard.find((e) => e.machineCode === this.machineCode);
      if (me) {
        me.name = "You";
        me.me = true;
      } else {
        this.leaderboard.push({
          totalScore: this.totalScore,
          name: this.donation?.name,
          donation1: {
            amount: this.donation?.amount,
            message: this.donation?.message
          },
          me: true,
        });
      }
      this.leaderboard = this.leaderboard.sort(
        (a, b) => b.totalScore - a.totalScore
      );
    });
  }

  max(a, b) {
    return Math.max(a, b);
  }

  min(a, b) {
    return Math.min(a, b);
  }

  /**
   * Metodo chiamato dopo l'inizializzazione della vista.
   * @returns {void}
   */
  ngAfterViewInit() {
    document.querySelectorAll("audio").forEach((e) => {
      this.audios[e.id] = e;
    });
    if (
      this.internalState === State.WAITING ||
      this.internalState === State.PAUSED ||
      this.internalState === State.GAME_OVER ||
      this.internalState === State.PLAYING
    ) {
      this.state = State.WAITING;
      this.start();
    } else if (this.internalState === State.LEADERBOARD) {
      this.getLeaderboard();
    } else if (this.state === State.TUTORIAL) {
      this.start();
    } else if (this.state === State.UNDERSTANDING) {
      this.start();
    }
  }

  /**
   * Metodo per avviare il gioco.
   * @returns {void}
   */
  start() {
    this.audios["start"].play();
    this.gameService.start.bind(this)();
  }

  /**
   * Metodo chiamato quando il gioco termina.
   * @returns {void}
   */
  gameOver() {
    this.audios["end"].play();
    this.state = State.GAME_OVER;
    this.totalScore += this.score;
    this.donation.lives = 0;
    // this.donation.amount = 0;
    setTimeout(() => {
      const scoreDown = new CountUp("xp", 0, { startVal: this.score });
      const lifeUp = new CountUp("xpLife", 0);
      const earnedLife = Math.max(2, Math.ceil(this.score / 500));
      this.donation.lives = earnedLife;
      scoreDown.start();
      lifeUp.update(earnedLife);
    }, 1000);
  }

  /**
   * Metodo per impostare il tooltip.
   * @returns {void}
   */
  setTooltip() {
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 300);
  }

  incrementAfterDonation() {
    this.donation.lives += +this.incomingDonation.amount || 0;
    this.state = State.PAUSED;
    this.life = new Array(this.donation.lives).fill(
      0
    );
  }

  /**
   * Metodo per passare alla partita successiva.
   * @returns {void}
   */
  next() {
    const calls = [
      this.http.put(
        SurveyService.getUrl(
          this.machineCode + "/donation" + this.currentMatch
        ),
        {
          ...this.donation
        }
      ),
    ];
    if (this.donation.amount > 0) {
      calls.push(
        this.http.put(
          SurveyService.getUrl(`lastDonation${this.machineCode[0]}`),
          { ...this.donation, amount: this.donation.amount }
        )
      );
    }
    combineLatest(calls).subscribe(() => {
      this.currentMatch++;
      if (this.currentMatch > this.TOTAL_MATCHES) {
        this.state = State.POST;
      } else {
        this.life = new Array(this.donation.lives - this.donation.amount).fill(
          0
        );
        this.donation.lives = this.life.length;
              this.state = State.RECEIVING_DONATION;
        this.setTooltip();
        this.score = 0;
        this.start();
      }
    });
  }

  /**
   * Metodo per inviare i dati del sondaggio.
   * @param {string} bin - Tipo di sondaggio (pre o post).
   * @param {SurveyModel} sender - Modello del sondaggio.
   * @returns {Observable<any>}
   */
  sendData(bin: string, sender: SurveyModel) {
    return this.http.put(
      SurveyService.getUrl(this.machineCode + "/" + bin),
      sender.getData()
    );
  }

  isMobile() {
    let check = false;
    (function(a) {if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) { check = true; }})(navigator.userAgent || navigator.vendor);
    return check;
  }
}

/**
 * Classe che rappresenta gli stati del gioco.
 * @class
 */
export class State {
  static GAME_OVER = 10;
  static PLAYING = 1;
  static PAUSED = 2;
  static WAITING = 3;
  static RECEIVING_DONATION = 4;
  static POST = 5;
  static PRE = 6;
  static LEADERBOARD = 7;
  static TUTORIAL = 8;
  static UNDERSTANDING = 9;
}

/**
 * Classe che rappresenta una donazione.
 * @class
 */
class Donation {
  /**
   * Importo della donazione.
   * @type {number}
   */
  amount: number;

  /**
   * Numero di vite donate.
   * @type {number}
   */
  lives: number;

  /**
   * Nome del donatore.
   * @type {string}
   */
  name: string;

  /**
   * Messaggio del donatore.
   * @type {string}
   */
  message: string;
}
