import { format, createLogger, transports } from "winston";

const { timestamp, combine, errors, json } = format;

const buildProdLogger = () => {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: "worri-api" },
    transports: [new transports.Console()],
  });
};

export default buildProdLogger;
