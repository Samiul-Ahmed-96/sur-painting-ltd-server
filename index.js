const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvzsfvb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    console.log("db connected");
    const database = client.db("sur_painting_ltd");
    const servicesCollection = database.collection("services");
    const projectsCollection = database.collection("projects");
    const contactListCollection = database.collection("contact-list");
    //Get Services
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send({ status: true, data: services });
    });
    //Get Projects
    app.get("/projects", async (req, res) => {
      const cursor = projectsCollection.find({});
      const projects = await cursor.toArray();
      res.send({ status: true, data: projects });
    });
    //Get Projects
    app.get("/contacts", async (req, res) => {
      const cursor = contactListCollection.find({});
      const contacts = await cursor.toArray();
      res.send({ status: true, data: contacts });
    });
    //Get Projects
    app.get("/projects", async (req, res) => {
      const cursor = projectsCollection.find({});
      const projects = await cursor.toArray();
      res.send({ status: true, data: projects });
    });
    //Get Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await servicesCollection.findOne({ _id: ObjectId(id) });
      res.send({ status: true, data: result });
    });
    //Get Single Projects
    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const result = await projectsCollection.findOne({ _id: ObjectId(id) });
      res.send({ status: true, data: result });
    });
    //Add Project Api
    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectsCollection.insertOne(project);
      res.send({ status: true, data: result });
    });
    //Add Project Api
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send({ status: true, data: result });
    });
    //Add Project Api
    app.post("/contacts", async (req, res) => {
      const contact = req.body;
      const result = await contactListCollection.insertOne(contact);
      res.send({ status: true, data: result });
    });
    //Delete single item from Services Api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json({ status: true, data: result });
    });
    //Delete single item from projects Api
    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await projectsCollection.deleteOne(query);
      res.json({ status: true, data: result });
    });
    //Delete single item from contact Api
    app.delete("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await contactListCollection.deleteOne(query);
      res.json({ status: true, data: result });
    });

    //Update Single Service
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const updatedService = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updatedService.title,
          img: updatedService.img,
          details: updatedService.details,
        },
      };
      const result = await servicesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ status: true, data: result });
    });
    //Update Single Project
    app.put("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProject = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedProject.status,
          location: updatedProject.location,
          type: updatedProject.type,
          img: updatedProject.img,
        },
      };
      const result = await projectsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ status: true, data: result });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Sur Painting Ltd");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
