import { IConnector, IConnectorOptions } from "./interfaces";
import { TWindow } from "./types";
import { Connector } from "./Connector";

/**
 * connects MetaMask
 * @param options
 * @param win
 */
export function connectMetaMask(options: IConnectorOptions = {}, win: TWindow = null): IConnector {
  return Connector.create(options, win);
}
