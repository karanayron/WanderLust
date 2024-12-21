const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const { listingSchema } = require("./schema.js");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hey, I'm root");
})

// app.get("/testlisting", (req, res) =>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     sampleListing.save();
//     console.log("sample was saved");
//     res.send("Sucessful testing");
//     console.log("Sample listing data:", sampleListing);

// });

// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("./listings/index.ejs", { allListings });
// });
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}).lean();
    res.render("./listings/index.ejs", { allListings });
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new");
})


app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).lean();
    res.render("listings/show", { listing });
}));

//create route
app.post("/listings", wrapAsync(async (req, res, next) => {
    console.log(req.body); // Debugging purpose
    // if(!req.body.listng){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error);
    }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).lean();
    if (listing.image) {
        listing.image = listing.image.url;
    } else {
        listing.image = null;
    }
    res.render("listings/edit.ejs", { listing });
    
}));

// Updatee Route

app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listing to 8080");
});