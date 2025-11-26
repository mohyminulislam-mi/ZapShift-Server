// Import dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// create app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB start here

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@mohyminulislam.uwhwdlk.mongodb.net/?appName=Mohyminulislam`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("ZapShift");
    const parcelsCollection = database.collection("parcels");
    // post parcel data into Database
    app.post("/parcels", async (req, res) => {
      const parcel = req.body;
      parcel.createdAt = new Date();
      const result = await parcelsCollection.insertOne(parcel);
      res.send(result);
    });
    // get parcel data from Database
    app.get("/parcels", async (req, res) => {
      const query = {};
      // find data with conditions
      const { email } = req.query;
      // /parcels?email=''&
      if (email) {
        query.senderEmail = email;
      }
      const options = { sort: { createdAt: -1 } };
      // --- end conditons for email get data
      const cursor = parcelsCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    });

    // parcel delete options
    app.delete('/parcels/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      
      const result = await parcelsCollection.deleteOne(query);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

// Default route
app.get("/", (req, res) => {
  res.send("ZapShift server running 🚀");
});

// Start server
app.listen(port, () => {
  console.log(`Server running : ${port}`);
});
