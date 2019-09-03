# Use the latest, official ubuntu release
FROM ubuntu

# Set the file maintainer
MAINTAINER calvinhartwell

# install nodejs
RUN \
  apt-get update && \
  apt-get install -y nodejs npm git git-core && \
  mkdir /tmp/c3-bank-demo && mkdir /tmp/c3-bank-demo/src && \
  mkdir /tmp/c3-bank-demo/webpack && mkdir /tmp/c3-bank-demo/www &&  \
  npm config set @cct:registry https://npm.cct.ericsson.net

# Copy the code from the repo to tmp
COPY * /tmp/c3-bank-demo/
COPY src /tmp/c3-bank-demo/src
COPY www /tmp/c3-bank-demo/www
COPY webpack /tmp/c3-bank-demo/webpack 

# Copy and run the script
ADD start.sh /tmp/
RUN chmod +x /tmp/start.sh
CMD ./tmp/start.sh

# Expose ports.
EXPOSE 8080
