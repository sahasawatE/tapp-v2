import moment from "moment";

class Util {
  groupBy(xs: any[], key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  getKEY(obj: any) {
    return Object.keys(obj);
  }

  wait(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // console.log(`Waited ${ms}`);
        resolve();
      }, ms);
    });
  }

  cashFormat(string_value: string) {
    const s_v = new Intl.NumberFormat("en-US");
    return s_v.format(parseFloat(string_value));
  }

  dateView(date: string, format: string = "YYYY-MM-DDTHH:mm:ss"): string {
    const format_date = moment(date, format)
      .add(543, "years")
      .format("DD/MM/YYYY");
    return format_date;
  }

  dateViewFull(date: string, format: string = "YYYY-MM-DDTHH:mm:ss"): string {
    const format_date = moment(date, format)
      .add(543, "years")
      .format("DD/MM/YYYY HH:mm");
    return format_date;
  }

  NumOnly(data: string) {
    return data.replace(/[^0-9]+/g, "");
  }

  dateInput(date: string) {
    if (!date || date === "") return "";

    const num = this.NumOnly(date);
    const l_num = num.length;
    let return_date = "";

    if (l_num >= 0 && l_num <= 2) {
      return_date = num;
    } else if (l_num >= 2 && l_num <= 4) {
      return_date = num.replace(/(\d{2})/, "$1/");
    } else if (l_num >= 4 && l_num <= 8) {
      return_date = num.replace(/(\d{2})(\d{2})/, "$1/$2/");
    }

    return return_date;
  }
}

const util = new Util();

export default util;
