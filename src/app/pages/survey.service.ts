import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SurveyService {
  /**
   * Costruisce l'URL per le richieste HTTP.
   * @param {string} obj - Oggetto da aggiungere all'URL.
   * @returns {string} URL costruito.
   */
  static getUrl(obj: string) {
    return `https://donationsexperiment-default-rtdb.europe-west1.firebasedatabase.app/${obj}.json`;
  }

  /**
   * Genera un codice macchina casuale.
   * @returns {string} Codice macchina generato.
   */
  static generateMachineCode() {
    const rand = Math.random();
    const append = rand > 0.45 ? "1" : "0";
    return append + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Ottiene i dati compressi per la visualizzazione.
   * @param {any[]} baseData - Dati ricevuti dal server.
   * @returns {any[] | null} Dati compressi.
   */
  getCompressedData(baseData: any[]) {
    if (!baseData) {
      return null;
    }
    const columns = [
      "donation_motivation",
      "budget_distribution",
      "name",
      "surname",
      "time",
    ];
    const data = baseData.map((e) => {
      const obj: any = {};

      Object.keys(e).forEach((key) => {
        if (columns.includes(key)) {
          obj[key] = e[key];
        }
      });
      return obj;
    });
    return data.sort((a, b) => (b.time > a.time ? 1 : -1));
  }

  getDeviceAndBrowser() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Ottieni informazioni sul browser
    let browser = "Unknown";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      browser = "Chrome";
    } else if (userAgent.includes("Firefox")) {
      browser = "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browser = "Safari";
    } else if (userAgent.includes("Edg")) {
      browser = "Edge";
    } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
      browser = "Internet Explorer";
    }

    // Restituisci il risultato
    return {
      browser: browser,
      device: platform,
    };
  }

  async getCountry() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) {
        throw new Error("Errore nella chiamata API");
      }
      const data = await response.json();
      return {
        country: data.country_name,
        region: data.region,
        city: data.city,
      };
    } catch (error) {
      console.error("Errore nel recupero della posizione:", error);
      return null;
    }
  }
}
