const DEFAULT_API_PORT = '3001';

type RuntimeEnv = Record<string, string | undefined>;

export const getApiPort = (runtimeEnv: RuntimeEnv = process.env) => {
  const port = runtimeEnv.PORT?.trim();

  return port || DEFAULT_API_PORT;
};

export const getPublicApiBaseUrl = (runtimeEnv: RuntimeEnv = process.env) => {
  const configuredBaseUrl =
    runtimeEnv.EDU_PUBLIC_BASE_URL?.trim() || runtimeEnv.EDU_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  return `http://localhost:${getApiPort(runtimeEnv)}`;
};

export const getPublicArtifactBaseUrl = (...args: Array<string | RuntimeEnv>) => {
  const runtimeEnv =
    args.length > 0 && isRuntimeEnv(args[args.length - 1]) ? (args.pop() as RuntimeEnv) : process.env;
  const segments = args.filter((segment): segment is string => typeof segment === 'string');
  const normalizedSegments = segments
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment.replace(/^\/+|\/+$/g, ''));

  return [getPublicApiBaseUrl(runtimeEnv), 'artifacts', ...normalizedSegments].join('/');
};

const isRuntimeEnv = (value: unknown): value is RuntimeEnv => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};
