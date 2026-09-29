const express =require("express");
const path =require("path");


exports.addResume=async(req,res)=>{
    try{
        const {user,job_desc}=req.body;
        console.log(user,job_desc);

    }catch(err){
        console.log(err);
        res.status(500)
    }..........
}