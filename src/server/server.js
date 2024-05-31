import express from "express";
import ReactDOMServer from "react-dom/server";

import App from "../components/app";

const server = express();
server.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
});
server.use(express.static("dist"));
server.use(express.static("public")); // Add this line for development


server.get("/", (req, res) => {
  const initialMarkup = ReactDOMServer.renderToString(<App />);

  res.send(`
    <html>
      <head>
        <title>Sample React App</title>
        <link rel="icon" type="image/png" href="/img/favicon-android.png">  <!-- Update this line -->
      </head>
      <body>
        <div id="app">${initialMarkup}</div>
        <script src="/bundle.js"></script> <!-- Ensure this matches your actual JS bundle name -->
      </body>
    </html>
  `);
});


server.listen(4242, () => console.log("Server is running..."));