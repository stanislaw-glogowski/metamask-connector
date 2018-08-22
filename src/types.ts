import { BehaviorSubject } from "rxjs";
import { IEthProvider } from "ethjs";
import { ConnectorState } from "./constants";

export type TWindow = Partial<Window> & {
  ethereum?: IEthProvider;
  web3?: {
    currentProvider: IEthProvider;
  }
};

export type TStateSubject = BehaviorSubject<ConnectorState>;
