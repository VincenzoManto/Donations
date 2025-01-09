/**
 * @file analytics.page.ts
 * @description Componente Angular per la pagina di analisi delle donazioni.
 */

import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SurveyService } from "./survey.service";
import { AnalyticsService } from "./analytics.service";
import { PostSurvey } from "../data/post.survey";
import { PreSurvey } from "../data/pre.survey";
declare var echarts, Grid3DComponent, Bar3DChart;

@Component({
  selector: "analytics-page",
  templateUrl: "./analytics.page.html",
  styleUrls: ["./analytics.page.css"],
})
export class AnalyticsPage {
  /**
   * Word cloud dei messaggi delle donazioni.
   * @type {Object}
  */
  wordCloud = [];
  /**
   * Numero totale di partecipanti al sondaggio.
   */
  totalParticipants = {
    ano: 0,
    non_ano: 0,
    tot: 0,
  };
  /**
   * Dati filtrati in base al valore del filtro.
   */
  data;

  /**
   * Dati originali non filtrati.
   */
  originalData;

  /**
   * JSON contenente i dati del sondaggio.
   */
  json;

  /**
   * Colori utilizzati nei grafici.
   */
  colors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
  ]

  /**
   * Valore del filtro attuale.
   */
  private filterValue;

  /**
   * Categoria selezionata per l'analisi.
   */
  selectedCategory = "donations";

  /**
   * Istogramma dei dati.
   */
  histoChart;

  /**
   * Imposta il valore del filtro e aggiorna i dati filtrati.
   * @param value Il nuovo valore del filtro.
   */
  set filter(value) {
    this.filterValue = value;
    this.data = null;
    setTimeout(() => {
      this.data = this.originalData.filter((e) => e.pre?.experiment_group === value).map(e => e.pre);
    }, 500);
  }

  /**
   * Restituisce il valore attuale del filtro.
   * @returns Il valore del filtro.
   */
  get filter() {
    return this.filterValue;
  }

  /**
   * Genera un istogramma dai dati forniti.
   * @param data I dati da analizzare.
   * @param size La dimensione dei bin dell'istogramma.
   * @returns Un array di coppie [valore, frequenza].
   */
  histogram(data, size) {
    let min = Infinity;
    let max = -Infinity;

    for (const item of data) {
      if (item < min) {
        min = item;
      }
      if (item > max) {
        max = item;
      }
    }

    const bins = Math.ceil((max - min + 1) / size);

    const histo = new Array(bins > 0 ? bins : 0).fill(0);

    for (const item of data) {
      histo[Math.floor((item - min) / size)]++;
    }

    return histo.map((item, index) => [min + (index + 1) * size, item]);
  }

  /**
   * Costruttore del componente AnalyticsPage.
   * @param http Servizio HttpClient per le richieste HTTP.
   * @param analyticsService Servizio per la generazione dei grafici di analisi.
   */
  constructor(private http: HttpClient, private analyticsService: AnalyticsService) {
    this.json = [PreSurvey, PostSurvey];
    this.json.forEach(d => d.pages.forEach((e) => {
      e.elements = e.elements.filter((e) => e.analytics);
    }));
    this.http.get(SurveyService.getUrl("")).subscribe((data: any) => {
      this.originalData = Object.values(data || {}) || [];
      this.filter = "anonimo";
      this.totalParticipants = {
        ano: this.originalData.filter((e) => e.pre?.experiment_group === "anonimo").length,
        non_ano: this.originalData.filter((e) => e.pre?.experiment_group === "non_anonimo").length,
        tot: this.originalData.length - 2
      }
      this.createWordCloud();
      const chartDom = document.getElementById("chart") as HTMLElement;
      this.histoChart = echarts.init(chartDom);
      this.histoChart.setOption({
        textStyle: {
          color: "white",
        },
        color: ["orange", "yellow"],
      });
     /*  if (this.originalData?.length) {
        this.analyticsService.generateEChart.bind(this)();
      } */
    });
  }

  createWordCloud() {
    let message = '';
    this.originalData.forEach((e) => {
      message += (e.donation1?.message || '') + ' ';
    });
    message = message.replace(/[^a-zA-Z ]/g, '');
    const words = message.split(' ').filter(e => e);
    const wordCount = {};
    words.forEach((word) => {
      if (wordCount[word]) {
        wordCount[word]++;
      } else {
        wordCount[word] = 1;
      }
    });
    this.wordCloud = Object.keys(wordCount).map((word) => {
      return {
        text: word,
        value: wordCount[word] * 60,
      };
    });
  }

  /**
   * Genera un grafico EChart per la categoria specificata.
   * @param type Il tipo di grafico da generare (predefinito: 'donations').
   */
  generateEChart(type = 'donations') {
    this.analyticsService.generateEChart.bind(this)(type);
  }
}
