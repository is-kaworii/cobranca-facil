import * as fs from "fs";

export class Logger {
  // OFF: Nenhuma mensagem é gravada.
  // FATAL: Erros fatais que provavelmente abortaram a aplicação.
  // ERROR: Erros que permitem que a aplicação continue sendo executada.
  // WARN: Situações potencialmente prejudiciais.
  // INFO: Informações sobre as operações do sistema.
  // DEBUG: Informações de depuração.
  // ALL: Qualquer informação sobre o sistema.
  private logDir = "./logs";

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
      console.log(`Pasta de logs criada em: ${this.logDir}`);
    }
  }

  off(message: string, toDiscord: boolean = false): string {
    const formattedMessage = this.formatMessage("OFF", message);
    console.log(formattedMessage);
    return formattedMessage;
  }
  fatal(message: string, error: unknown, toDiscord: boolean = false): string {
    const formattedMessage = this.formatMessage("FATAL", message);
    const formattedError = this.formatError(error);
    console.error(formattedMessage);
    console.error(error);
    this.appendMessage(`${formattedMessage}\n${formattedError}`);
    return formattedMessage;
  }
  error(message: string, error: unknown, toDiscord: boolean = false): string {
    const formattedMessage = this.formatMessage("ERROR", message);
    const formattedError = this.formatError(error);
    console.error(formattedMessage);
    console.error(error);
    this.appendMessage(`${formattedMessage}\n${formattedError}`);
    return formattedMessage;
  }
  warn(message: string, toDiscord: boolean = false): string {
    const formattedMessage = this.formatMessage("WARN", message);
    console.warn(formattedMessage);
    this.appendMessage(formattedMessage);
    return formattedMessage;
  }
  info(message: string, toDiscord: boolean = false): string {
    const formattedMessage = this.formatMessage("INFO", message);
    console.log(formattedMessage);
    this.appendMessage(formattedMessage);
    return formattedMessage;
  }

  private formatError(error: Error | unknown): string {
    if (error instanceof Error) {
      return `Error Message: ${error.message}\nStack: ${error.stack}`
    } else {
      return `Unknow Error: ${JSON.stringify(error)}`
    }
  }

  private getLogFilename() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Meses começam em 0
    const day = today.getDate().toString().padStart(2, "0");
    return `${this.logDir}/app-${year}-${month}-${day}.log`;
  }

  private appendMessage(message: string) {
    fs.appendFile(this.getLogFilename(), `${message}\n`, (err) => {
      if (err) {
        console.error("Error ao escrever no arquivo de log:", err);
      }
    });
  }

  private formatMessage(level: string, message: string): string {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const timestamp = new Date()
      .toLocaleString("pt-BR", dateTimeOptions)
      .replace(",", "");
    const callerFile = this.getCallerFile();
    const [pathFile, lines] = callerFile.split(":::");
    return `[${timestamp}] ${level.padEnd(5)} ln${lines
      .split(":")[0]
      ?.padEnd(3)} ➡️ ${message} ⬜ ${pathFile} `;
  }

  private getCallerFile() {
    const error = new Error();
    Error.captureStackTrace(error, this.getCallerFile);
    const stackLines = error.stack!.split("\n");
    const callerLine = stackLines[3] || "";
    const path = callerLine
      .split("cobranca-facil")[1]
      ?.replace("\\", "")
      ?.replace(".ts:", ".ts:::");
    return path;
  }
}
