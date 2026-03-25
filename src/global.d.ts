// Global type declarations for browser APIs
declare var HTMLDivElement: {
  prototype: HTMLDivElement;
  new(): HTMLDivElement;
};

declare var HTMLInputElement: {
  prototype: HTMLInputElement;
  new(): HTMLInputElement;
};

declare var HTMLTextAreaElement: {
  prototype: HTMLTextAreaElement;
  new(): HTMLTextAreaElement;
};

declare var HTMLElement: {
  prototype: HTMLElement;
  new(): HTMLElement;
};

declare var DOMRect: {
  prototype: DOMRect;
  new(): DOMRect;
};

declare var crypto: {
  getRandomValues(array: Uint8Array): Uint8Array;
  randomUUID(): string;
};

declare const NodeJS: {
  process?: {
    env?: {
      NODE_ENV?: string;
    };
  };
};
