const routes = require('./routes');
const { handleStreamRoutes } = require('./controllers');

// eslint-disable-next-line consistent-return
module.exports = async (req, res) => {
  const { url, headers } = req;

  const { pathname, searchParams } = new URL(url, `https://${headers.host}`);

  if (req.headers['content-type'] === 'text/csv') {
    const filePath = await handleStreamRoutes(req, res).catch((err) =>
      console.log(err),
    );
    return routes(
      {
        ...req,
        filePath,
        pathname,
        params: searchParams,
        headers,
      },
      res,
    );
  }

  let body = [];

  req
    .on('error', (err) => {
      console.error(err);
    })
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();

      return routes(
        {
          ...req,
          pathname,
          body,
          params: searchParams,
          headers,
        },
        res,
      );
    });
};
