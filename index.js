const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongodb er code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.raxgazv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
//1st
    const serviceCollection = client.db('carDoctors').collection('services');
//4th
const bookingCollection = client.db('carDoctors').collection('bookings')
//2nd
    app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })
//3rd
app.get('/services/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }

    const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
    };

    const result = await serviceCollection.findOne(query, options);
    res.send(result);
})
//bookings
//6th get is for to get the data
// app.get('/bookings', async(req,res)=>{
//   const result = await bookingCollection.find().toArray()
//   res.send(result)
// }) to get all the bookings data
app.get('/bookings', async(req,res)=>{
  // to get specific things some data related
  console.log(req.query.email)
  let query = {};
  if(req.query?.email){
    query = {email:req.query.email}
  }
  const result = await bookingCollection.find(query).toArray()
  res.send(result)
}) 

//5th 
//post is for to create anything
  app.post('/bookings', async(req,res)=>{
    const booking = req.body;
    console.log(booking)
    const result  = await bookingCollection.insertOne(booking);
    res.send(result);
  })
  //8th Update. We can use put or patch
  app.patch('/bookings/:id', async(req,res)=>{
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const updatedBooking = req.body;
    console.log(updatedBooking);
    const updateDoc = {
      $set:{
        status:updatedBooking.status
      }
    }
    const result = await bookingCollection.updateOne(filter,updateDoc)
    res.send(result)
  })

  //7th  delete
  app.delete('/bookings/:id', async(req,res)=>{
    const id= req.params.id;
    const query ={_id: new ObjectId(id)}
    const result = await bookingCollection.deleteOne(query);
    res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











//1st e likhte hoi

app.get('/',(req,res)=>{
    res.send('doctor is running')
})
app.listen(port,()=>{
    console.log(`car doctor is running on port ${port}`)
})