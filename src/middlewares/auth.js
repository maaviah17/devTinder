const adminAuth =  (req,res,next)=>{
    console.log("Admin auth middleware is getting checked !!");
    const token = "abcdef";
    const isAdminAuthorized = token === "abcdef";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request !!!");
    }else{
        next();
    }
};


const userAuth =  (req,res,next)=>{
    console.log("User auth middleware is getting checked !!");
    const token = "abcdef";
    const isAdminAuthorized = token === "abcdef";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request !!!");
    }else{
        next();
    }
};



module.exports = {
    adminAuth,
    userAuth,
};