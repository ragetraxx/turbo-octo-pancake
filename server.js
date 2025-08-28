const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
const BASE_URL = "http://143.44.136.110:6610";

// Only allow this origin
const allowedOrigin = "https://ragetb.onrender.com";

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Set CORS headers manually for streaming
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  } else {
    res.status(403).send("Access denied");
  }
});

// Proxy all GET requests
app.get("/*", (req, res) => {
  const targetUrl = `${BASE_URL}${req.originalUrl}`;
  
  req.pipe(request(targetUrl))
    .on("response", function (response) {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
      res.setHeader("Content-Type", response.headers["content-type"]);
    })
    .pipe(res);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
