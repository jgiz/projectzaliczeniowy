var express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
var cors = require('cors');
const {MongoClient, ServerApiVersion} = require("mongodb");
var app = express()
var loger = morgan("dev")
app.use(bodyParser.json())
app.use(cors());
app.use(cookieParser())
app.use(loger)


app.use((req,res,next)=>{
    const uri = "mongodb+srv://tasks:L3ITj2LxTSUWztLs@cluster0.7w3hedf.mongodb.net/?retryWrites=true&w=majority";
    req.mongoClient = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    next()
})

app.use(async (req, res, next) => {
    const code = req.headers['x-code']
    if (req.headers['x-code']) {
        try {
            await req.mongoClient.connect();
            const auth = await req.mongoClient.db("tasks").collection('auth').findOne({code: code})
            if (auth) {
                const user = await req.mongoClient.db("tasks").collection('users').findOne({_id: auth.userID})
                if(user) {
                    req.auth = {state: true, user:user}
                }
                else{
                }
            } else {

                req.auth = {state: false}
            }

        } catch (e) {
            console.log(e)
            res.status(500).json({error: e.message})
        } finally {
            await req.mongoClient.close();
        }
    } else {
        req.auth = {state: false}
    }
    next()
})

const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const noteRoute = require('./routes/note')

app.use('/auth',authRoute)
app.use('/users',usersRoute)
app.use('/note',noteRoute)

app.listen(3000,()=>{
    console.log("Api ready on port 3000")
})