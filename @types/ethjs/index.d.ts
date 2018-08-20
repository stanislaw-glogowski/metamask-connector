declare module "ethjs" {
  const Eth: {
    HttpProvider: {
      new(endpoint: string): any;
    };

    new(provider?: Eth.IEthProvider): Eth.IEth;
  };

  namespace Eth {
    export interface IEth {
      accounts(): Promise<string[]>;
    }

    export interface IEthProvider {
      send?: (payload: any) => any;
      sendAsync: (payload: any, callback: (err: any, response: any) => void,
      ) => void;
      isConnected?: () => boolean;
    }
  }

  export = Eth;
}
