import { BehaviorSubject, EMPTY, interval, Observable, of, from, concat } from "rxjs";
import { filter, mergeMap, switchMap, map, take, timeoutWith } from "rxjs/operators";
import * as Eth from "ethjs";
import { Account } from "./Account";
import { ConnectorState, WindowMessageTypes } from "./constants";
import { IConnector, IConnectorOptions } from "./interfaces";
import { TWindow } from "./types";
import { WrappedProvider } from "./WrappedProvider";

/**
 * MetaMask connector
 */
export class Connector implements IConnector {

  /**
   * creates instance
   * @param options
   * @param win
   */
  public static create(options: IConnectorOptions = {}, win: TWindow = null): IConnector {
    let result: IConnector = null;

    if (win) {
      result = new Connector(options, win);
    } else {
      if (!this.instance) {
        this.instance = new Connector(options, win);
      }
      result = this.instance;
    }

    return result;
  }

  private static instance: IConnector = null;

  /**
   * state$ subject
   */
  public readonly state$ = new BehaviorSubject<ConnectorState>(ConnectorState.Connecting);

  /**
   * account
   */
  public readonly account = new Account();

  /**
   * provider
   */
  public readonly provider = new WrappedProvider();

  private readonly eth = new Eth(this.provider);
  private readonly options: IConnectorOptions;

  /**
   * constructor
   * @param options
   * @param win
   */
  private constructor(
    options: IConnectorOptions,
    win: TWindow,
  ) {

    if (!win && typeof window !== "undefined") {
      win = window;
    }

    this.options = {
      connectionTimeout: 1000,
      accountInterval: 1000,
      ...options,
    };

    this.attachSubscribers();

    if (
      win &&
      typeof win === "object"
    ) {
      if (typeof win.addEventListener === "function") {
        win.addEventListener("message", ({ data: event }: { data: { [ key: string ]: any } }) => {
          if (!event || typeof event !== "object") {
            return;
          }

          switch (event.type) {
            case WindowMessageTypes.ProviderSuccess:
              this.provider.updateProvider(win.ethereum);
              break;
          }
        });
      }

      if (
        win.web3 &&
        typeof win.web3 === "object" &&
        win.web3.currentProvider &&
        typeof win.web3.currentProvider === "object"
      ) {
        this.provider.updateProvider(win.web3.currentProvider);
      } else if (typeof win.postMessage === "function") {
        win.postMessage({ type: WindowMessageTypes.ProviderRequest }, "*");
      }
    }
  }

  /**
   * state getter
   */
  public get state(): ConnectorState {
    return this.state$.getValue();
  }

  private get accountAddress$(): Observable<string> {
    return from(
      this.eth
        .accounts()
        .catch(() => [])
        .then((accounts) => {
          let result: string;
          try {
            result = accounts[ 0 ] || null;
          } catch (err) {
            result = null;
          }
          return result;
        }),
    )
      .pipe(
        filter((address) => address !== this.account.address),
      );
  }

  private attachSubscribers(): void {
    const { connectionTimeout, accountInterval } = this.options;

    this
      .provider
      .injected$
      .pipe(
        filter((value) => value),
        take(1),
        timeoutWith(connectionTimeout, of(false)),
        mergeMap(() => this.provider.injected$),
        map((value) => value ? ConnectorState.Connected : ConnectorState.Disconnected),
      )
      .subscribe(this.state$);

    this
      .state$
      .pipe(
        switchMap((state) => {
          let result: Observable<string> = EMPTY;
          switch (state) {
            case ConnectorState.Connected:
              result = concat(
                this.accountAddress$,
                interval(accountInterval)
                  .pipe(switchMap(() => this.accountAddress$)),
              );
              break;
          }

          return result;
        }),
      )
      .subscribe(this.account.address$);
  }
}
