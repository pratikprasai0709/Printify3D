// initialization
import app from "./app.js";
import mongoose from "mongoose";
const port = 5000;

const uri = "mongodb+srv://pratik:pratik@professionals.6vnffjd.mongodb.net/?retryWrites=true&w=majority&appName=Professionals";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

//Routes
app.get('/', (_req, res)=>{
    res.send("This is the Homepage");
});

//Starting the server in a port
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started at port ${port}`);
});
