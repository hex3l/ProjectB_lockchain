const clone = (obj: unknown): object => JSON.parse(JSON.stringify(obj)) as object;

/**
 * Injects Authorization header in fetch calls
 * @param relpath backend realtive path
 * @param params RequestInit object
 * @returns fetch result
 */
const backendCall = async (relpath: string, params: RequestInit) => {
  const headers = clone(params.headers) || {};
  delete params.headers;

  return await fetch(`${process.env.BACKEND}/${relpath}`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
      'Content-Type': 'application/json',
      ...headers,
    },
    ...params,
  });
};

export { clone, backendCall };
