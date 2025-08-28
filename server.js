const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const BASE_URL = "http://143.44.136.110:6610";

// Only allow this origin
const allowedOrigin = "https://ragetb.onrender.com";

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Custom CORS header handling
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

// Proxy GET requests
app.get("/*", async (req, res) => {
  try {
    const targetUrl = `${BASE_URL}${req.originalUrl}`;
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).send(`Error fetching resource: ${response.statusText}`);
    }

    // Pass content type for streams (m3u8, mpd, ts, etc.)
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");

    // Stream response back to client
    response.body.pipe(res);

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy listening on port ${PORT}`);
});
