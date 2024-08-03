const express = require('express');
const serverless = require('serverless-http');
const app = require('./netlify/functions/server');

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
    console.log(`Local server is running on port ${PORT}`);
});
