const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId




const app = express()
const port = process.env.PORT || 4500

//user Name = travel420
//user pas = 0mldwJ3kTTs8DytJ



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ox5tn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('connected database');
        const database = client.db("service");
        const serviceCollection = database.collection("serviceCollection");

        //get api
        app.get('/addservice', async (req, res) => {
            const cursor = serviceCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        //get single api
        app.get("/addservice/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.json(result)
          })
        // post api 
        app.post('/addservice', async (req, res) => {
            const newService = req.body
            const result = serviceCollection.insertOne(newService)
            console.log('getting new service', newService);
            res.send(result)
        })


    }
    finally {
        //  await client.close()
    }
}
run().catch(console.dir)


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})