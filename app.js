const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type User {
                _id: ID!
                email: String!
                passwod: String
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input UserInput {
                email: String!
                password: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc };
                    })
                })
                .catch(err => {
                    throw err;
                });
            },
            createEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date)
                });
                return event
                .save()
                .then(result => {
                    console.log(result);
                    return {...result._doc};
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
                return event;
            },
            createUser: args => {
                return bcrypt
                .hash(args.userInput.password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    return{ ...result._doc, _id: result.id };
                })
                .catch(err => {
                    throw err;
                });
            }
        },
        graphiql: true,
    }),
);

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.oxtkc.mongodb.net/<dbname>?retryWrites=true&w=majority')
.then(() => {

})
.catch(err => {
    console.log(err);
});
app.listen(3000);
