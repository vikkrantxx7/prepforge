type AppErrorCode = 'NOT_FOUND' | 'CONFLICT' | 'UNAUTHORIZED';

type AppError = Error & {
  code: AppErrorCode;
};

function createAppError(code: AppErrorCode, message: string): AppError {
  const error = new Error(message) as AppError;
  error.code = code;

  return error;
}

export function notFoundError(message = 'Not found') {
  return createAppError('NOT_FOUND', message);
}

export function conflictError(message = 'Already exists') {
  return createAppError('CONFLICT', message);
}

export function unauthorizedError(message = 'Unauthorized') {
  return createAppError('UNAUTHORIZED', message);
}

export function isNotFoundError(err: unknown): err is AppError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: string }).code === 'NOT_FOUND'
  );
}

export function isConflictError(err: unknown): err is AppError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: string }).code === 'CONFLICT'
  );
}

export function isUnauthorizedError(err: unknown): err is AppError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: string }).code === 'UNAUTHORIZED'
  );
}

export function isPgError(err: unknown, code: string): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'cause' in err &&
    typeof err.cause === 'object' &&
    err.cause !== null &&
    'code' in err.cause &&
    err.cause.code === code
  );
}
