import { format, createLogger, transports } from "winston";
import * as emoji from "node-emoji";

const { timestamp, combine, printf, errors } = format;

const levelEmoji: Record<string, string | undefined> = {
  info: emoji.get("evergreen_tree"),
  warn: emoji.get("warning"),
  error: emoji.get("fire"),
  debug: emoji.get("bug"),
};

const buildDevLogger = () => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    const emojiSymbol = level ? levelEmoji[level] : "";
    return `${timestamp} ${emojiSymbol} ${stack || JSON.stringify(message)}`;
  });

  return createLogger({
    format: combine(
      // format.colorize(),
      timestamp({ format: "HH:mm:ss" }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [new transports.Console()],
  });
};

export default buildDevLogger;
