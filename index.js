const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygxql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('VolunteerNetwork');
        const servicesCollection = database.collection('services');
        const usersCollection = database.collection('users');

        // -------------Server--------------
        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray(); 
            res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });

        //UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    description: updatedService.description,
                    price: updatedService.price,
                    img: updatedService.img
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })




        // -------------User--------------

        // GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const services = await cursor.toArray(); 
            res.send(services);
        });

        // GET Single Service
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await usersCollection.findOne(query);
            res.json(service);
        })

        // GET by email
        app.get("/myevent/:email", (req, res) => {
            console.log(req.params);
            usersCollection
              .find({ email: req.params.email })
              .toArray((err, results) => {
                res.send(results);
              });
          });

        // POST API
        app.post('/adduser', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await usersCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        });

        //UPDATE API
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    email: updatedService.email,
                    date: updatedService.date,
                    service: updatedService.service
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Running Genius Server on port', port);
})