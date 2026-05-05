export type NitrosendAISDKErrorCode =
  | 'AUTH_MISSING'
  | 'AUTH_INVALID_PREFIX'
  | 'CLIENT_INIT_FAILED'
  | 'TOOLS_LIST_FAILED';

export class NitrosendAISDKError extends Error {
  readonly code: NitrosendAISDKErrorCode;

  constructor(
    code: NitrosendAISDKErrorCode,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options as ErrorOptions);
    this.code = code;
    this.name = 'NitrosendAISDKError';
  }
}
