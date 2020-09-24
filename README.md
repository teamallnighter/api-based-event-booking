# Event Bookey

## Set Up

### Git Cone 

```bash
git clone https://github.com/teamallnighter/api-based-event-booking.git
```

### Install

```bash
npm install 
```

### Mongo DB

[Mongo DB CLoud](https://cloud.mongodb.com/)

Click connect on your cluster

```javascript
mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGOPASSWORD@cluster0.oxtkc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority
```

#### For Dev

Create nodemon.json

```json
{
    "env": {
        "MONGO_USER": "username",
        "MONGO_PASSWORD": "password",
        "DB_NAME": "dbname"
    }
}
```

#### Production

Create .env

```text
MONGO_USER=username
MONGO_PASSWORD=password
DB_NAME=dbname
```