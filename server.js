const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const os = require("os");
const cli = require("@angular/cli").default;

cli({ cliArgs: ["serve"] });