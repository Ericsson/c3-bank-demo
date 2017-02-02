# Ericsson Web Meeting demo

Demo application of many features in the C3 Web SDK, including:
* Voice and video communication
* Screen sharing
* Secure data transfer (both chat and file delivery)
* Client-side media recording
* Advanced PDF editing
* User registration and authentication

The app is hosted on [https://bank-demo.c3.ericsson.net](https://bank-demo.c3.ericsson.net)

If you have questions about Ericsson Contextual Communication Cloud, please reach out at https://discuss.c3.ericsson.net

![sample](src/images/screenshot_login.png)

![sample](src/images/screenshot_inside.png)

# Install and run

Some packages are downloaded from `https://npm.cct.ericsson.net` via the `@cct` scope, so make sure you have run
```bash
$ npm config set @cct:registry https://npm.cct.ericsson.net
```
Then install dependencies using
```bash
$ npm install
```
Serve the app locally on [http://localhost:8080/](http://localhost:8080/) by running
```bash
$ npm run serve
```

Contributions are welcome, just fork and submit a PR.
