const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
const BASE_URL = "http://136.239.173.3:6610";

// Allow all origins
app.use(cors());

// Manually set headers for streaming
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// Proxy all GET requests
app.get("/*", (req, res) => {
  const targetUrl = `${BASE_URL}${req.originalUrl}`;

  req
    .pipe(request(targetUrl))
    .on("response", function (response) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", response.headers["content-type"]);
    })
    .pipe(res);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
