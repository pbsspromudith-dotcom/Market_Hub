declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}
declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

interface Window {
  monerisCheckout: any;
}

declare class monerisCheckout {
  constructor();
  setMode(mode: string): void;
  setCheckoutDiv(divId: string): void;
  setCallback(event: string, callback: (data: string) => void): void;
  startCheckout(ticket: string): void;
  closeCheckout(): void;
}
