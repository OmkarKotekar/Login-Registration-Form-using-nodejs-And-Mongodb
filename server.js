const express = require("express");

const app = express();

const port = 3000;

const { MongoClient } = require("mongodb");


const url = "mongodb://127.0.0.1:27017";
const dbName = "FirstProjectdb";

app.use(express.json());
app.use(express.urlencoded());

async function createDocument(req, res){
    const client = new MongoClient(url);
    try {
      await client.connect();
      console.log("Connected to the database");

      const db = client.db(dbName);

      const collection = db.collection('users');
      //Create user logic here

      const last_id = await collection.countDocuments();

      const {name, password, email, contact} = req.body;

      const newUser = {
        id : (last_id + 1),
        name: name,
        password: password,
        email: email,
        contact: contact,
      }

      const result = await collection.insertOne(newUser);
      console.log("Created document:", result.insertedId);

      res.send(result.insertedId);

    } catch (err) {
        console.error("Error : ",err);
    } finally {
        await client.close();
        console.log("Disconnected from the database");
    }
}

async function readDocument(req, res) {
  const client = new MongoClient(url);
    try {
      await client.connect();
      console.log("Connected to the database");
  
      const db = client.db(dbName);
  
      const collection = db.collection("users");
  
      // Insert the document into the collection
      const {name, password} = req.body;
      filter = {
        name : name,
        password : password,
      }
      const result = await collection.findOne(filter);
      console.log(`${name} and ${password}`)

      res.json(result);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      await client.close();
      console.log("Disconnected from the database");
    }
}

app.get("/", (req, res) => {
    res.send("Hello");
  });

  app.post("/register", (req, res) => {
    createDocument(req, res);
    // res.send("Registration Successful");
  });

  app.post("/login", (req, res) => {
    readDocument(req, res);
  })

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });