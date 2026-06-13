declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    info: Record<string, unknown>;
  }
  export default function pdf(buffer: Buffer): Promise<PDFData>;
}

declare module 'rate-limit-redis' {
  import { Store } from 'express-rate-limit';
  interface RedisStoreOptions {
    prefix?: string;
    sendCommand: (...args: string[]) => Promise<unknown>;
  }
  export class RedisStore implements Store {
    constructor(options: RedisStoreOptions);
  }
}
