const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
const BASE_URL = "http://143.44.136.110:6610";

// Only allow this origin
const allowedOrigin = "MIKUY IPTV";

// Strict CORS configuration
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
if (origin === allowedOrigin) {
res.setHeader("Access-Control-Allow-Origin", origin);
} else {
res.status(403).send("Access denied");
return;
}
res.setHeader("Access-Control-Allow-Headers", "*");
next();
});

// Proxy all GET requests
app.get("/*", (req, res) => {
const origin = req.headers.origin;

if (origin !== allowedOrigin) {
return res.status(403).send("Access denied");
}

const targetUrl = BASE_URL + req.originalUrl;

req.pipe(request(targetUrl))
.on("response", function (response) {
res.setHeader("Access-Control-Allow-Origin", origin);
})
.pipe(res);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(Proxy listening on port ${PORT});
});
