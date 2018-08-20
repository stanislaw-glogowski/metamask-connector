import { IConnector, IConnectorOptions } from "./interfaces";
import { Connector } from "./Connector";

/**
 * connects MetaMask
 * @param options
 */
export function connectMetaMask(options: IConnectorOptions = {}): IConnector {
  return Connector.create(options);
}
