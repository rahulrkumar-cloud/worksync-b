// src/types.d.ts
type ErrorOptions = {
    cause?: Error;
  };
  
  declare class AggregateError extends Error {
    errors: any[];
    constructor(errors: any[], message?: string, options?: ErrorOptions);
  }
  