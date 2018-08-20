import { IEthProvider } from "ethjs";
import { Connector } from "./Connector";
import { ConnectorState, WindowMessageTypes } from "./constants";

describe("Connector", () => {

  describe("constructor()", () => {

    const ADDRESS = "0x0";

    const providerWithLockedAccount: IEthProvider = {
      sendAsync: (payload, callback) => callback(null, { result: [] }),
    };
    const providerWithUnLockedAccount: IEthProvider = {
      sendAsync: (payload, callback) => callback(null, { result: [ ADDRESS ] }),
    };

    const mocks = {
      state$: jest.fn(),
      providerInjected$: jest.fn(),
      accountAddress$: jest.fn(),
    };

    beforeEach(() => {
      mocks.state$.mockClear();
      mocks.providerInjected$.mockClear();
      mocks.accountAddress$.mockClear();
    });

    describe(`state ${ConnectorState.Connected}`, () => {

      test("via window.web3 object with locked account", (done) => {
        const { state$, provider, account } = Connector.create({}, {
          web3: {
            currentProvider: providerWithLockedAccount,
          },
        });

        state$.subscribe(mocks.state$);
        provider.injected$.subscribe(mocks.providerInjected$);
        account.address$.subscribe(mocks.accountAddress$);

        setTimeout(() => {
          expect(mocks.state$).toHaveBeenCalledTimes(1);
          expect(mocks.state$).toBeCalledWith(ConnectorState.Connected);
          expect(mocks.providerInjected$).toHaveBeenCalledTimes(1);
          expect(mocks.providerInjected$).toBeCalledWith(true);
          expect(mocks.accountAddress$).toHaveBeenCalledTimes(1);
          expect(mocks.accountAddress$).toBeCalledWith(null);
          done();
        }, 100);
      });

      test("via window.web3 object with unlocked account", (done) => {
        const { state$, provider, account } = Connector.create({}, {
          web3: {
            currentProvider: providerWithUnLockedAccount,
          },
        });

        state$.subscribe(mocks.state$);
        provider.injected$.subscribe(mocks.providerInjected$);
        account.address$.subscribe(mocks.accountAddress$);

        setTimeout(() => {
          expect(mocks.state$).toHaveBeenCalledTimes(1);
          expect(mocks.state$).toBeCalledWith(ConnectorState.Connected);
          expect(mocks.providerInjected$).toHaveBeenCalledTimes(1);
          expect(mocks.providerInjected$).toBeCalledWith(true);
          expect(mocks.accountAddress$).toHaveBeenCalledTimes(2);
          expect(mocks.accountAddress$).toHaveBeenNthCalledWith(1, null);
          expect(mocks.accountAddress$).toHaveBeenNthCalledWith(2, "0x0");
          done();
        }, 100);
      });

      test("via window message", (done) => {
        const mockAddEventListener = jest.fn((type, callback: (data) => void) => {
          setTimeout(() => {
            callback({
              data: {
                type: WindowMessageTypes.ProviderSuccess,
              },
            });
          }, 10);
        });
        const mockPostMessage = jest.fn();

        const { state$, provider, account } = Connector.create({}, {
          ethereum: providerWithLockedAccount,
          addEventListener: mockAddEventListener,
          postMessage: mockPostMessage,
        });

        state$.subscribe(mocks.state$);
        provider.injected$.subscribe(mocks.providerInjected$);
        account.address$.subscribe(mocks.accountAddress$);

        setTimeout(() => {
          expect(mockAddEventListener).toBeCalled();
          expect(mockPostMessage).toBeCalled();
          expect(mocks.state$).toHaveBeenCalledTimes(2);
          expect(mocks.state$).toHaveBeenNthCalledWith(1, ConnectorState.Connecting);
          expect(mocks.state$).toHaveBeenNthCalledWith(2, ConnectorState.Connected);
          expect(mocks.providerInjected$).toHaveBeenCalledTimes(2);
          expect(mocks.providerInjected$).toHaveBeenNthCalledWith(1, false);
          expect(mocks.providerInjected$).toHaveBeenNthCalledWith(2, true);
          expect(mocks.accountAddress$).toHaveBeenCalledTimes(1);
          expect(mocks.accountAddress$).toBeCalledWith(null);
          done();
        }, 100);
      });
    });

    describe(`state ${ConnectorState.Disconnected}`, () => {

      test("connection timeout", (done) => {
        const { state$, provider, account } = Connector.create({
          connectionTimeout: 10,
        }, {});

        state$.subscribe(mocks.state$);
        provider.injected$.subscribe(mocks.providerInjected$);
        account.address$.subscribe(mocks.accountAddress$);

        setTimeout(() => {
          expect(mocks.state$).toHaveBeenCalledTimes(2);
          expect(mocks.state$).toHaveBeenNthCalledWith(1, ConnectorState.Connecting);
          expect(mocks.state$).toHaveBeenNthCalledWith(2, ConnectorState.Disconnected);
          expect(mocks.providerInjected$).toHaveBeenCalledTimes(1);
          expect(mocks.providerInjected$).toBeCalledWith(false);
          expect(mocks.accountAddress$).toHaveBeenCalledTimes(1);
          expect(mocks.accountAddress$).toBeCalledWith(null);
          done();
        }, 11);
      });
    });
  });
});
