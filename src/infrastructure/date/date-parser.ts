import { DateParser } from "src/domain/shared/date-parser.interface";

export class dateParser implements DateParser {

  private meses: Record<string, number> = {
    "enero": 0, "febrero": 1, "marzo": 2, "abril": 3,
    "mayo": 4, "junio": 5, "julio": 6, "agosto": 7,
    "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11
  };

  parse(dateString: string): Date {
    const regex = /(\d{1,2}) de (\w+), (\d{1,2}):(\d{2}) (a\.m\.|p\.m\.)/i;
    const match = dateString.match(regex);

    if (!match) throw new Error("Formato inválido");

    let [, dia, mes, hora, min, periodo] = match;

    let h = parseInt(hora);
    const m = parseInt(min);

    if (periodo.toLowerCase() === 'p.m.' && h !== 12) h += 12;
    if (periodo.toLowerCase() === 'a.m.' && h === 12) h = 0;

    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMonth(this.meses[mes.toLowerCase()]);
    date.setDate(parseInt(dia));

    return date;
  }
}
