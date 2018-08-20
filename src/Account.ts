import { BehaviorSubject } from "rxjs";
import { IAccount } from "./interfaces";

/**
 * Account
 */
export class Account implements IAccount {

  /**
   * address$ subject
   */
  public readonly address$ = new BehaviorSubject<string>(null);

  /**
   * address getter
   */
  public get address(): string {
    return this.address$.getValue();
  }
}
