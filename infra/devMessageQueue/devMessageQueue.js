const express = require('express');
const http = require('http');

const app = express();
const subscribers = {}; // topic -> [urls]
const PORT = process.env.MESSAGE_BUS_PORT || 9092;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/subscribe', (req, res) => {
  const { topic, url } = req.body;
  if (!subscribers[topic]) subscribers[topic] = [];
  //only push url if it is not already in the subscribers[topic]
  if (!subscribers[topic].includes(url)) {
    subscribers[topic].push(url);
  }
  res.json({ subscribed: true });
  console.log(`Subscribed to topic: ${topic} with url: ${url}`);
});

app.post('/publish/:topic', (req, res) => {
  const { topic } = req.params;
  const message = req.body;
  const urls = subscribers[topic] || [];
  console.log(`Publishing message to topic: ${topic} with message: ${JSON.stringify(message)}`);
  urls.forEach(url => {
    const postData = JSON.stringify(message);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    
    const client = http.request(options);
    client.write(postData);
    client.end();
  });
  
  res.json({ published: true, subscribers: urls.length });
});

app.listen(PORT, () => {
  console.log(`Message bus running on http://localhost:${PORT}`);
});
