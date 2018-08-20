import { IEthProvider } from "ethjs";
import { BehaviorSubject } from "rxjs";
import { ConnectorState } from "./constants";

export interface IAccount {
  readonly address$: BehaviorSubject<string>;
  readonly address: string;
}

export interface IConnector {
  readonly state$: BehaviorSubject<ConnectorState>;
  readonly state: ConnectorState;
  readonly account: IAccount;
  readonly provider: IWrappedProvider;
}

export interface IConnectorOptions {
  connectionTimeout?: number;
  accountInterval?: number;
}

export interface IWrappedProvider extends IEthProvider {
  readonly injected$: BehaviorSubject<boolean>;
  readonly injected: boolean;
  updateProvider(provider?: IEthProvider): void;
}
