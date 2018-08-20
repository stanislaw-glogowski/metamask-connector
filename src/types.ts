import { IEthProvider } from "ethjs";

export type TWindow = Partial<Window> & {
  ethereum?: IEthProvider;
  web3?: {
    currentProvider: IEthProvider;
  }
};
