# Welcome to Social Crypto Stats project

## Description
Now you can detect crypto marketing on Twitter in time for free. Surf the wave together whales!
Data updated every minute! 

![alt Social Crypto Stats](screenshot/socialcryptostats.png?raw=true "Social Crypto Stats")

## Live (demo)
Have a look [here](https://socialcrypto.decomprasporlared.com).

## Installation

- Clone repository in local directory.
- Execute <strong>npm start</strong>

## Backend

This application requires two external services:
- Coinbase API to get cryptocurrency prices in realtime.
- Custom websocket server to get number of tweets per crypto every minute.  This application is based on Python (Tweepy) and currently works on RaspberryPI 4 through Docker.

Endpoints for both external services are configure in .env file:

- REACT_APP_WEBSOCKET_URL=wss://723d-217-217-232-133.ngrok.io
- REACT_APP_WEBSOCKET_COINBASE_URL=wss://ws-feed.pro.coinbase.com
