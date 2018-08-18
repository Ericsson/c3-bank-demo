cd /tmp

# try to remove the repo if it already exists
rm -rf c3-bank-demo; true

git clone https://github.com/CalvinHartwell/c3-bank-demo.git

cd c3-bank-demo

npm config set @cct:registry https://npm.cct.ericsson.net
npm install

npm run serve
