type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[90m",
  info: "\x1b[36m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

const RESET = "\x1b[0m";

class Logger {
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = "info") {
    this.minLevel =
      (process.env.LOG_LEVEL as LogLevel) || minLevel;
  }

  private log(level: LogLevel, context: string, message: string, data?: unknown) {
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.minLevel]) return;

    const timestamp = new Date().toISOString();
    const color = LEVEL_COLORS[level];
    const prefix = `${color}[${level.toUpperCase()}]${RESET}`;
    const ctx = `\x1b[90m[${context}]${RESET}`;

    console.log(`${timestamp} ${prefix} ${ctx} ${message}`);
    if (data !== undefined) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  debug(context: string, message: string, data?: unknown) {
    this.log("debug", context, message, data);
  }

  info(context: string, message: string, data?: unknown) {
    this.log("info", context, message, data);
  }

  warn(context: string, message: string, data?: unknown) {
    this.log("warn", context, message, data);
  }

  error(context: string, message: string, data?: unknown) {
    this.log("error", context, message, data);
  }
}

export const logger = new Logger();
