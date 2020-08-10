const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')


const usersRoute = require('./routes/users.js');
app.use(usersRoute);

const productsRoute = require('./routes/products.js');
app.use(productsRoute);

const loginSignupRoute = require('./routes/login-signup.js');
app.use(loginSignupRoute);

const passwordUpdateRoute = require('./routes/passwordUpdate.js');
app.use(passwordUpdateRoute);

const requestsRoute = require('./routes/requests.js');
app.use(requestsRoute);

const cartRoute = require('./routes/cart.js');
app.use(cartRoute);

require("dotenv").config();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());


app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.listen(3000, () => {
    console.log('listening on port 3000');
})