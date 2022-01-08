const { Pool } = require('pg');

// eslint-disable-next-line consistent-return
module.exports = (config) => {
  try {
    const client = new Pool(config);

    return {
      testConnection: async () => {
        try {
          console.log('INFO: test connection pg');
          await client.query('SELECT NOW()');
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      close: async () => {
        console.log('INFO: Closing pg DB wrapper');
        client.end();
      },

      dbInitialization: async () => {
        try {
          await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
          await client.query(
            // eslint-disable-next-line max-len
            'CREATE TABLE IF NOT EXISTS products (id uuid NOT NULL DEFAULT uuid_generate_v4(),	item varchar NOT NULL, "type" varchar NOT NULL,	measure varchar NOT NULL,	measurevalue integer NULL, pricetype varchar NOT NULL, pricevalue varchar NOT NULL,	created_at timestamptz NULL, updated_at timestamptz NULL,	deleted_at timestamptz NULL)',
          );
          console.log('INFO: database initialization complete');
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      createProduct: async ({
        item,
        type,
        measure,
        measurevalue,
        pricetype,
        pricevalue,
      }) => {
        try {
          if (!item) {
            throw new Error('ERROR: No product item defined');
          }
          if (!type) {
            throw new Error('ERROR: No product type defined');
          }
          if (!measure) {
            throw new Error('ERROR: No product measure defined');
          }
          if (!measurevalue) {
            throw new Error('ERROR: No product measurevalue defined');
          }
          if (!pricetype) {
            throw new Error('ERROR: No product pricetype defined');
          }
          if (!pricevalue) {
            throw new Error('ERROR: No product pricevalue defined');
          }

          const timestamp = new Date();

          const res = await client.query(
            // eslint-disable-next-line max-len
            'INSERT INTO products(item, type, measure, measurevalue, pricetype, pricevalue, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [
              item,
              type,
              measure,
              measurevalue,
              pricetype,
              pricevalue,
              timestamp,
              timestamp,
            ],
          );

          // eslint-disable-next-line max-len
          console.log(
            `DEBUG: New product created: ${JSON.stringify(res.rows[0])}`,
          );
          return res.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      getProduct: async (id) => {
        try {
          if (!id) {
            throw new Error('ERROR: No product id defined');
          }

          const res = await client.query(
            'SELECT * FROM products WHERE id = $1 AND deleted_at is NULL',
            [id],
          );

          return res.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      updateProduct: async ({ id, ...product }) => {
        try {
          if (!id) {
            throw new Error('ERROR: No product id defined');
          }

          const query = [];
          const values = [];

          // eslint-disable-next-line no-restricted-syntax
          for (const [i, [k, v]] of Object.entries(product).entries()) {
            query.push(`${k} = $${i + 1}`);
            values.push(v);
          }

          if (!values.length) {
            throw new Error('ERROR: Nothing to update');
          }

          query.push(`${'updated_at'} = $${query.length + 1}`);
          values.push(new Date());

          values.push(id);

          const res = await client.query(
            `UPDATE products SET ${query.join(',')} WHERE id = $${
              values.length
            } RETURNING *`,
            values,
          );

          console.log(`DEBUG: Product updated: ${JSON.stringify(res.rows[0])}`);
          return res.rows[0];
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },

      deleteProduct: async (id) => {
        try {
          if (!id) {
            throw new Error('ERROR: No product id defined');
          }

          // await client.query('DELETE FROM products WHERE id = $1', [id]);
          await client.query(
            'UPDATE products SET deleted_at = $1 WHERE id = $2',
            [new Date(), id],
          );
          return `delete product with id - ${id} successfully`;
        } catch (err) {
          console.error(err.message || err);
          throw err;
        }
      },
    };
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
};
