const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');
const app = express();

app.use(bodyParser.json());

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id, 
                creator: user.bind(this, event.creator)  
            };
        });
    })
    .catch(err => {
        throw err;
    });
}

const user = userId => {
    return User.findById(userId)
    .then(user => {
        return { ...user._doc, _id: user.id };
    })
    .catch(err => {
        throw err;
    });
}

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
                creator: User!
            }

            type User {
                _id: ID!
                email: String!
                passwod: String
                createdEvents: [Event!]
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
                        return {
                            ...event._doc,
                            _id: event.id,
                            creator: user.bind(this, event._doc.creator)
                        };
                    });
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
                    date: new Date(args.eventInput.date),
                    creator: '5f6c5b6d20dd617d1aea8db1'
                });
                let createdEvent;
                return event
                .save()
                .then(result => {
                    createdEvent = { ...result._doc, _id: result._doc._id.toString() };
                    return User.findById('5f6c5b6d20dd617d1aea8db1')
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User Not Found');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
                return event;
            },
            createUser: args => {
                return User.findOne({email: args.userInput.email})
                .then(user => {
                    if (user) {
                        throw new Error ('User already exists')
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    return{ ...result._doc, password: null,  _id: result.id };
                })
                .catch(err => {
                    throw err;
                });
            }
        },
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
