/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

//to authenticate


var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const express = require("express");
const app = express();
const db=admin.firestore();
const cors = require("cors");
const { QuerySnapshot } = require("firebase-admin/firestore");
app.use(cors({origin:true}));

// routes

//create
//post
app.post('/api/create-inventory',(req,res)=>{
    (async () =>{
        try
        {
            await db.collection('products').doc('/'+req.body.id+'/')
            .create({
                name:req.body.name,
                description:req.body.description,
                price:req.body.price
            })
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})

//read a specific product on id
//get
app.get('/api/get-inventory/:id',(req,res)=>{
    (async () =>{
        try
        {
            const document=db.collection('products').doc(req.params.id);
            let product=await document.get();
            let response=product.data();
            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})

//read all  products 
//get
app.get('/api/get-inventory/',(req,res)=>{
    (async () =>{
        try
        {
            let query=db.collection('products');// querying the database
            let response=[];
            await query.get().then(QuerySnapshot=>{
                let docs=QuerySnapshot.docs; // result of the query
                for (let doc of docs)
                {
                    const selectedItem={
                        id:doc.id,
                        name:doc.data().name,
                        description:doc.data().description,
                        price:doc.data().price
                    };
                    response.push(selectedItem);
                }
                return response;
            })
            return res.status(200).send(response);
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})

//update
//put
app.put('/api/update-inventory/:id',(req,res)=>{
    (async () =>{
        try
        {
            const document=db.collection("products").doc(req.params.id);
            await document.update({
                name:req.body.name,
                description:req.body.description,
                price:req.body.price
            });
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})

// delete
//delete
app.delete('/api/delete-inventory/:id',(req,res)=>{
    (async () =>{
        try
        {
            const document=db.collection("products").doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
})

exports.app=functions.https.onRequest(app);

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
