const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( () => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hey, I'm root");
})

app.get("/testlisting", (req, res) =>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });
    sampleListing.save();
    console.log("sample was saved");
    res.send("Sucessful testing");
    console.log("Sample listing data:", sampleListing);

});


app.listen(8080, () => {
    console.log("server is listing to 8080");
});