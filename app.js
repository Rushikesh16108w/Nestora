const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodoverride = require("method-override");
const ejsmate=require("ejs-mate");
const wrapasync = require("./utils/wrapAsync.js");
const expressError= require("./utils/expressError.js");
const ExpressError = require("./utils/expressError.js");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true})); //for parsing the data from parameter req.params
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

main()
    .then(()=>{
     console.log("connected to DB");
    })
    .catch(err =>{
     console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
};

//index route
app.get("/listings",wrapasync(async (req,res) =>{
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs",{allListing});
}));

//new route
app.get("/listing/new",(req,res)=>{
   res.render("./listing/new.ejs"); 
});

//show route
app.get("/listings/:id",wrapasync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/show.ejs",{listing});
}));

//creat route
app.post("/listings",wrapasync(async (req,res) => {
    // let{title, description, image, price, country ,location} =req.body;
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})
);

//edit route
app.get("/listings/:id/edit",wrapasync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",wrapasync(async (req,res) =>{
    let{id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapasync(async (req,res)=>{
    let {id} = req.params;
   let deletedlisting = await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   res.redirect("/listings")
}));

app.all("*",(err,req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});
 
app.use((err,req,res,next) =>{
    let{statuscode=500,message="something went wrong!"} = err;
    res.status(statuscode).send(message);   
});

app.listen(3000,(req,res) =>{
    console.log("listening to port 3000");
});
