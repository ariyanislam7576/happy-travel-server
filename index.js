const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
const orderId = require('mongodb').ObjectId;
const e = require('express');




const app = express()
const port = process.env.PORT || 4500

//user Name = travel420
//user pas = 0mldwJ3kTTs8DytJ

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ox5tn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('connected database');
        const database = client.db("service");
        const serviceCollection = database.collection("serviceCollection");
        const orderCollection = database.collection("order")

        //get addService api
        app.get('/addservice', async (req, res) => {
            const cursor = serviceCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        //get  singleService api
        app.get("/addservice/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })
        //get orders api
        app.get("/myorder", async (req, res) => {
            let query = {}
            const email = req.query.email;
            if (email) {
                query = { email: email }
            }
            const cursor = await orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })



        // post addService api 
        app.post('/addservice', async (req, res) => {
            const newService = req.body
            const result = serviceCollection.insertOne(newService)
            console.log('getting new service', newService);
            res.json(result)
        })



        //post orders
        app.post('/manageorders', async (req, res) => {
            const order = req.body
            const result = orderCollection.insertOne(order)
            console.log('getting order', order);
            res.json(result)
        })
        //delete api
        app.delete('/myorder/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
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