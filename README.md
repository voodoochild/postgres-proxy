# postgres-proxy

Proxy queries sent via POST request to a Postgres database.

## Config

## Usage

```javascript
[
    {
        "sql": "SELECT * FROM partner WHERE id=$1",
        "values": [1]
    },
    "SELECT * FROM contact WHERE partner_id=1"
]
```
