# Use the latest, official ubuntu release
FROM ubuntu

# Set the file maintainer
MAINTAINER calvinhartwell

# install nodejs
RUN \
  apt-get update && \
  apt-get install -y nodejs npm git git-core && \
  npm config set @cct:registry https://npm.cct.ericsson.net

# Copy and run the script
ADD start.sh /tmp/

RUN chmod +x /tmp/start.sh

CMD ./tmp/start.sh

# Expose ports.
EXPOSE 8080
