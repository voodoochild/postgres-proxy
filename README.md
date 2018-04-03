# postgres-proxy

Proxy queries sent via POST request to a Postgres database.

## Config

Create a copy of `config.example.js` named `config.js`. Updated values as required.

```javascript
module.exports = {
    user     : "myuser",
    host     : "mydb.host.com",
    database : "mydb",
    password : "password",
    port     : 4321
};
```

__Note:__ [node-postgres](https://node-postgres.com/features/connecting) defaults to using environment variables (i.e. `PGUSER`, `PGHOST`, `PGPASSWORD`, `PGDATABASE`, and `PGPORT`).

## Usage

Queries are sent as an array via POST request with `Content-Type: application/json`. They can either be a string, or an object which specifies both the query to execute and the values for any [parameters](https://node-postgres.com/features/queries#parameterized-query).

```
[
    // Text-only; no parameters
    "SELECT * FROM contact WHERE partner_id=1",

    // Object; parameterized query
    {
        "query": "SELECT * FROM partner WHERE id=$1",
        "values": [1]
    }
]
```

The response is a JSON array containing one object for each query that was executed comprising the number of rows returned alongside the data rows:

```
[
    {
        "rowCount": 117,
        "rows": [
            {
                "id": 24,
                "name": "Kriss"
            },
            ...
        ]
    },
    ...
]
```

In the case of an error the response will contain an object with a single `error` field:

```
{
    "error": "You screwed that up somehow."
}
```
