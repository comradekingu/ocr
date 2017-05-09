"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("./worker");
const worker = new worker_1.Worker();
worker.start();
