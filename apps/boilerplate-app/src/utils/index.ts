const clone = (obj: unknown): object => JSON.parse(JSON.stringify(obj)) as object;

/**
 * Injects Authorization header in fetch calls
 * @param relpath backend realtive path
 * @param params RequestInit object
 * @returns fetch result
 */
const backendCall = async (relpath: string, params: RequestInit) => {
  const { headers } = params;
  console.log('backendCall');
  let reqHeaders = {};
  if (headers) reqHeaders = clone(headers);
  delete params.headers;

  const res = await fetch(`${process.env.BACKEND}/${relpath}`, {
    method: 'GET',
    headers: {
      Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
      'Content-Type': 'application/json',
      ...reqHeaders,
    },
    ...params,
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export { clone, backendCall };
