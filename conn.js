const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://mrinmaypaul165_db_user:yl7T7rFsLwV854Dr@cluster0.1dxwuqm.mongodb.net/?appName=Cluster0").then(
    (res)=>{
        console.log("Mongo connected successfully");
    }
).catch((err)=>{
    console.log(err);
})
