# MetaMask Connector 

[![NPM version][npm-image]][npm-url]

Rx [MetaMask extension](http://metamask.io) connector

## Installation

```bash
$ npm i metamask-connector -S
```

## Usage

```js
import { connectMetaMask } from "metamask-connector";

// or using default export
import connectMetaMask from "metamask-connector";

const connector = connectMetaMask();

// or with options
const connector = connectMetaMask({
  connectionTimeout: 2000, // timeout in ms after DISCONNECTED status is published
                           // defaults to 1000

  accountInterval: 3000,   // account interval in ms 
                           // defaults to 1000 ms
});

connector.status;  // current status (CONNECTING, CONNECTED, DISCONNECTED)  
connector.status$; // current status rx subject

const { account, provider } = connector;

account.address;  // selected account address
account.address$; // selected account address rx subject

provider;           // selected web3 provider
provider.injected;  // is provider injected
provider.injected$; // is provider injected rx subject

```

## Testing

```bash
$ npm test
```

## License

The MIT License

[npm-image]: https://badge.fury.io/js/metamask-connector.svg
[npm-url]: https://npmjs.org/metamask-connector/tempack