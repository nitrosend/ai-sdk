export {
  nitrosend,
  createNitrosendMCPClient,
  withNitrosendTools,
  runWithToolset,
  resolveNitrosendAuth,
  resolveNitrosendUrl,
} from './client.js';
export type {
  NitrosendOptions,
  NitrosendToolset,
  NitrosendTools,
  NitrosendTool,
  NitrosendToolInput,
  NarrowedNitrosendTools,
  ResolvedAuth,
} from './client.js';

export { NitrosendAISDKError } from './errors.js';
export type { NitrosendAISDKErrorCode } from './errors.js';

export {
  nitrosendToolNames,
  nitrosendToolSchemas,
  pickNitrosendToolSchemas,
} from './schemas.generated.js';
export type {
  NitrosendToolName,
  NitrosendToolSchemaMap,
} from './schemas.generated.js';
