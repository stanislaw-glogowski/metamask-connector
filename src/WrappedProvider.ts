import { BehaviorSubject } from "rxjs";
import { IEthProvider } from "ethjs";
import { errUndefinedMetaMaskProvider } from "./errors";
import { IWrappedProvider } from "./interfaces";

/**
 * MetaMask wrapped provider
 */
export class WrappedProvider implements IWrappedProvider {

  /**
   * injected$ subject
   */
  public readonly injected$ = new BehaviorSubject<boolean>(false);

  private provider: IEthProvider;

  /**
   * constructor
   * @param provider
   */
  constructor(provider: IEthProvider = null) {
    this.updateProvider(provider);
  }

  /**
   * injected getter
   */
  public get injected(): boolean {
    return this.injected$.getValue();
  }

  /**
   * updates provider
   * @param provider
   */
  public updateProvider(provider: IEthProvider = null): void {
    this.provider = provider;
    const injected = !!provider;

    if (this.injected !== injected) {
      this.injected$.next(injected);
    }
  }

  /**
   * sends
   * @param payload
   */
  public send(payload: any): any {
    if (!this.provider) {
      throw errUndefinedMetaMaskProvider;
    }

    return this.provider.send(payload);
  }

  /**
   * sends async
   * @param payload
   * @param callback
   */
  public sendAsync(payload: any, callback: (err: any, response: any) => void): void {
    if (!this.provider) {
      callback(errUndefinedMetaMaskProvider, null);
      return;
    }

    this.provider.sendAsync(payload, callback);
  }

  /**
   * checks if connected
   */
  public isConnected(): boolean {
    return this.provider ? this.provider.isConnected() : false;
  }
}
