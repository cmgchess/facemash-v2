export const allowCors = (fn) => async (req, res) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      process.env.ALLOWED_METHODS ?? 'GET,OPTIONS,PATCH,POST'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      process.env.ALLOWED_HEADERS ??
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  } else {
    res.status(403).end();
    return;
  }

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};