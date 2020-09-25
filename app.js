const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const app = express();
app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true,
    }),
);

mongoose.connect('mongodb+srv://web-site:2nq0k7fYb9vVxL7v@cluster0.oxtkc.mongodb.net/events?retryWrites=true&w=majority')
.then(() => {

})
.catch(err => {
    console.log(err);
});
app.listen(3000);
