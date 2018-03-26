const express = require("express");
const { Pool, Client } = require("pg");

const app = express();
const pool = new Pool();

app.use(express.json());

app.post("/", (req, res) => {
    let queries = [].concat(req.body);

    if(queries.length) {
        (async () => {
            let client = await pool.connect();

            try {
                await client.query("BEGIN");

                let results = await Promise.all(queries.map(query => {
                    if(typeof query === "object") {
                        return client.query(query.sql, query.values || []);
                    }

                    return client.query(query);
                }));

                res.json(
                    results.map(result => ({
                        rowCount : result.rowCount,
                        rows     : result.rows
                    }))
                );

                await client.query("COMMIT");
            } catch(e) {
                await client.query("ROLLBACK");
                throw e;
            } finally {
                client.release();
            }
        })().catch(e => console.error(e.stack))
    }
});

app.listen(3000, () => console.log("Listening on port 3000"));
