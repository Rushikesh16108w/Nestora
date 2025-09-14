const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description: String,
    image: {
       type:String,
       default:"https://wallpapercave.com/wp/wp7694052.jpg",

       set: (v)=>
        v==="" ?"https://wallpapercave.com/wp/wp7694052.jpg": v,
    },
    price: Number,
    location: String,
    country: String,
});

 const Listing = mongoose.model("listing",listingSchema);
 module.exports = Listing; 