const express = require("express");
const app = express();
const { Pool, Client } = require("pg");

let config;
try { config = require("./config.js"); } catch(e) {}

const pool = new Pool(config);

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
                        return client.query(query.query, query.values || []);
                    }

                    return client.query(query);
                }));

                await client.query("COMMIT");

                res.json(
                    results.map(result => ({
                        rowCount : result.rowCount,
                        rows     : result.rows
                    }))
                );
            } catch(e) {
                await client.query("ROLLBACK");
                throw e;
            } finally {
                client.release();
            }
        })().catch(e => {
            console.error(e.stack);
            res.json({ error : e.message });
        })
    }
});

app.listen(3000, () => console.log("Listening on port 3000"));
