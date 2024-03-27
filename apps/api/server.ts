import app from "./app";
import cluster from "cluster";
import os from "os";
import logger from "./logger/index";

const Port = process.env.PORT || 8000;
const numCPUs = os.cpus().length;

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.listen(Port, () => {
    logger.info(`Launched on port ${Port} 🚀`);
  });
} else {
  if (cluster.isPrimary) {
    logger.info(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    app.listen(Port, () => {
      logger.info(`Launched on port ${Port} 🚀 worker: ${process.pid}`);
    });
  }
}
