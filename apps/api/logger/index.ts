import buildDevLogger from "./devLogger";
import buildProdLogger from "./prodLogger";
import { Logger } from "winston";

let logger: Logger;

if (process.env.NODE_ENV === "DEVELOPMENT") {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export default logger;
