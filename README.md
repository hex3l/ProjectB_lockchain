# ServiceBay setup

- Install node@20.8.0
- Install and execute a PostgreSQL database (run it on standard 5432 port)
- Install ganache and truffle globally ([https://archive.trufflesuite.com/docs/ganache/quickstart/#1-install-ganache](Ganache quickstart) [https://archive.trufflesuite.com/docs/truffle/how-to/install/#install-truffle](Truffle quickstart))
- Create a ganache project with this mnemonic (grab convince arrest old shiver round door grid peace notice slim ugly)
- Edit the .env file under `./backend/main-backend` to reflect your postgres user and create a database for the application
- In this folder execute `npm i` in order to install all the dependencies
- (Optional) Run the sql demo data script `.sql/dati-demo.sql` (tuned for the provided mnemonic)
- Deploy the contracts under `./backend/main-backend/truffle` (navigate to the folder and execute the command `truffle migrate`)
- Start the application by running in this folder `npm run dev`

# Client setup

- Install on your browser Metamask
- Add the ganache local chain to Metamask (default rpc url: HTTP://127.0.0.1:7545)
- Import one of the accounts, using the private key, from the ganache project
- Log in into the site
- Enjoy
