import { useEffect, useState } from 'react';

// loading ──resolve──▶ success(data)
//    └─────reject───▶ error
// `data` exists only in `success`, so "success without data" can't be expressed.
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error' };

/** Runs `load` once on mount. Pass a stable (module-level) function. */
export function useAsync<T>(load: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    load().then(
      (data) => active && setState({ status: 'success', data }),
      () => active && setState({ status: 'error' }),
    );
    return () => {
      active = false;
    };
  }, [load]);

  return state;
}
