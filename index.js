require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
      origin: ['http://localhost:5173', 'https://painting-and-drawing-5bbe7.web.app'],
      credentials: true,
  }),
)

app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obyjfl3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
    // await client.connect();


    const artCollection = client.db('artDB').collection('art');
    const userCollection = client.db('artDB').collection('user');
    const subCategoryCollection = client.db('artDB').collection('sub_category ');
    

    app.get('/art/:id', async (req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; 
      const art = await artCollection.findOne(query);
      res.send(art);
    });
    


    app.get('/art', async(req, res) =>{
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/art/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await artCollection.findOne(query);
      res.send(result);
    })



    app.post('/art', async(req, res) =>{
      const newArt = req.body;
      
      const result = await artCollection.insertOne(newArt);
      res.send(result);
    }
  )

  app.put('/art/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updatedArt = req.body;
    const art = {
      $set: {
        name:updatedArt.name, 
        subcategory:updatedArt.subcategory,
         image:updatedArt.image,
          description:updatedArt.description,
           price:updatedArt.price, 
           rating:updatedArt.rating,
           Customization:updatedArt.Customization, 
           time:updatedArt.time, 
           stock:updatedArt.stock, 
          
      }
    }

    const result = await artCollection.updateOne(filter, art, options);
    res.send(result);
  })


  app.delete('/art/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await artCollection.deleteOne(query);
    res.send(result)

  })


  // user crud
  app.get('/user', async(req,res)=>{
    const cursor = userCollection.find();
    const users = await cursor.toArray();
    res.send(users)
  })

  app.get('/mycrafts', async (req, res) => {
    const userEmail = req.query.email; // Fetch email from query parameters
    const query = { email: userEmail }; // Query to find crafts by email
    const crafts = await artCollection.find(query).toArray(); // Fetch all crafts that match the email
    res.send(crafts); // Send the filtered crafts back to the client
  });

  app.post('/user', async(req, res) =>{
    const user = req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result);
  });

  //category
   //category
  //  app.get('/category', async(req, res) =>{
  //   const cursor = categoryCollection.find();
  //   const result = await cursor.toArray();
  //   res.send(result);
  // })
  // Add a new route to fetch data from the sub_category collection
app.get('/subcategories', async (req, res) => {
  try {
    const subCategoryCollection = client.db('artDB').collection('sub_category');
    const subCategories = await subCategoryCollection.find().toArray();
    res.send(subCategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/artbysubcategory/:subcategory', async (req, res) => {
  const subcategory = req.params.subcategory; // Extract the subcategory from the route parameter
  const query = { subcategory: subcategory.trim() }; // Ensure the query matches the subcategory
  const result = await artCollection.find(query).toArray(); // Find art items with the specified subcategory
  res.send(result); // Return the matching art items
});








    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//middleware




app.get('/', (req, res) => {
    res.send(' server is running')  //show on browser 
})

app.listen(port, () => {
    console.log(` server is running on port: ${port}`) //show on cmd 
})