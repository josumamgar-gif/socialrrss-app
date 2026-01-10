declare module '@paypal/checkout-server-sdk' {
  export interface Environment {
    clientId(): string;
    clientSecret(): string;
    baseUrl(): string;
  }

  export class PayPalHttpClient {
    constructor(environment: Environment);
    execute(request: any): Promise<any>;
  }

  export class OrdersCreateRequest {
    constructor();
    prefer(prefer: string): OrdersCreateRequest;
    requestBody(body: any): OrdersCreateRequest;
  }

  export class OrdersCaptureRequest {
    constructor(orderId: string);
    requestBody(body: any): OrdersCaptureRequest;
  }

  export class SandboxEnvironment extends Environment {
    constructor(clientId: string, clientSecret: string);
  }

  export class LiveEnvironment extends Environment {
    constructor(clientId: string, clientSecret: string);
  }

  const core: {
    SandboxEnvironment: typeof SandboxEnvironment;
    LiveEnvironment: typeof LiveEnvironment;
    PayPalHttpClient: typeof PayPalHttpClient;
  };

  const orders: {
    OrdersCreateRequest: typeof OrdersCreateRequest;
    OrdersCaptureRequest: typeof OrdersCaptureRequest;
  };

  const checkout: {
    core: typeof core;
    orders: typeof orders;
  };

  export default checkout;
}

