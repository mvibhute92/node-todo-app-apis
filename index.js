const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId, Logger } = require("mongodb");
const http = require("http");
const bcryptjs = require("bcryptjs");



const client = new MongoClient(
  "mongodb+srv://mayuriningdalli:Shaila%4094@cluster0.xi9xhjp.mongodb.net/employee_dashboard"
);

const db = client.db(`employee_dashboard`);

const app = express();
app.use(bodyParser.json());

// // parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header('Access-Control-Allow-Headers', 'Authorization, x-auth-token, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function compare(userPass, hashPass) {
  const res = await bcryptjs.compareSync(userPass, hashPass);

  return res;
}
async function hashPasswrd(userPass, dbPass) {
  const res = await bcryptjs.hash(dbPass, 10);
  return compare(userPass, res);
}

//get api for user list
app.get("/getemployee", async (req, res) => {
let result ={};
 
 
  
      result = await db.collection("employees").find().toArray();
   
      return res.status(200).json({employeeList:result});
     
 
    
 
  
});
//post api for adding new user
app.post("/addemployee", async (req, res) => {

    
        result = await db.collection("employees").insertOne(req.body);
     
        return res.status(200).json({employee_added:result});
      
  
  });
//put api for update existing user
app.put("/editemployee/:id", async (req, res) => {
   
     let id = new ObjectId(req.params.id);
     let body ={
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone
     }
    
        result = await db.collection("employees").findOneAndUpdate ({ _id: id  },
        { $set: body },
        { returnDocument : true });
      
        return res.status(200).json({message:"employee updated sucessfully."});
       
     
  });

//delete api to delete user
app.delete("/deleteemployee/:id", async (req, res) => {
 
   let id = new ObjectId(req.params.id);


      result = await db.collection("employees").deleteOne ({ _id: id  },
      { $set: req.body },
      { returnDocument : true });
      
      return res.status(200).json({message:"employee deleted  sucessfully."});
     
})
// delete multiple record
// app.post("/deletemultiple", async (req, res) => {

//   var token = req.headers['x-auth-token'];
//   if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
//   else{
//     jwt.verify(token,jwtSecret,async (err)=>{ 
//       if(err){  
//         res.status(403).send({message: 'user invalid' })
//     }else{
//       let ids =  [];
//       Object.values(req.body).map(element => {
//         ids.push(new ObjectId(element));
//       });
//       result = await db.collection("userdetails").deleteMany({_id: { $in: ids}});

//       return res.status(200).json({userDetails:result});
//       }
//      });
    
//   }
  
// });




const port = 8000 || 5000;

server.listen(port, () => {
  console.log("Listening on port " + port);
});
