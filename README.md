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
Then install dependencies using `npm`. Make sure you are using a recent version, or you might run into trouble when building.
```bash
$ npm install
```
Serve the app locally on [http://localhost:8080/](http://localhost:8080/) by running
```bash
$ npm run serve
```

## Running the Demo on Docker

A Dockerfile is now included as part of the repository as a quick method for building and running the solution locally or as part of a deployment on Kubernetes. To build the container, run the following command:

```
sudo docker build . -t yourdockeruser/c3demo:latest
```

To run this on your machine, use the Docker command: 

``` 
sudo docker run -p 8080:8080 yourdockeruser/c3demo:latest
```

Note that this container will take some-time to start as it has not been optimized, each time it runs it will recompile everything, install and configure node, which takes some-time. It is possible to speed up this process. Eventually the application will be available on localhost through port 8080, it can be accessed in the browser using http://localhost:8080.

## Running the Demo on Kubernetes

To run the demo container on Kubernetes, we need to build and push the Docker container registry. To do this, first build the docker container:

```
sudo docker build . -t yourdockeruser/c3demo:latest
```

Next, push the container to a registry. For this example we will use dockerhub and we have assumed you are already logged in using the docker login command:

```
sudo docker push yourdockeruser/c3demo:latest
```

Now your container is pushed to a Docker Registry, we can run it on a kubernetes cluster. Assuming you already have a cluster and you have kubectl access, you can run the included Kubernetes manifest to deploy the solution:

```
kubectl apply -f kubernetes-c3-bank-demo.yaml
```

Note that this manifest contains several things which should be modified first before deployment. These are the 'host' section in the ingress rule at the bottom, this should be changed to reflect the DNS entries you havepointed to your Kubernetes worker nodes. The other line is the container image name, this should reflect your username and selected docker registry.

# Contributing and Fixes

Contributions are welcome, just fork and submit a PR.
