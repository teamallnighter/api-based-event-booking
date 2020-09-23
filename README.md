# Event Bookey

## Steps 

### Install 

```bash
npm init -y
```

```bash
npm i --save express body-parser express-graphql graphql
```

```bash
npm i --save-dev nodemon
```

```json
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "nodemon app.js"
    },
```

```bash
npm start
```

[localhost:3000](https://localhost:3000)

---

### Set Up App.js

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHttp({
        schema: buildSchema(`
            schema {
                query:
                mutation:
            }
        `),
        rootValue: {},
    }),
);

app.listen(3000);
```
