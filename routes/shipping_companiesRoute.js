const express = require('express');
const router = express.Router();
const db = require('../database');
const multer = require('multer')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs')
const Sequelize = require('sequelize');
const { shipping_rate, collection_rate } = require('../database');
const Op = Sequelize.Op;


router.get('/api/getAllShippingCompanies',async(req,res)=>{
    db.shipping_companies.findAll({
        include:[{model : db.collection_rate},{model:db.shipping_rate}]
    }).then(
    companies =>{
        res.json({data:companies})
    }
    )
})

router.put('/api/updateDefaultShippingCompany',async (req,res)=>{
 
   var def= await db.shipping_companies.findOne({
        where:{
            default: 'TRUE'
        }
    })
  if(def){ def.update({
default : null
    })
}
db.shipping_companies.findOne({
    where:{
        shipping_companies_id : req.body.shipping_companies_id
    }
}).then (company=>{
    company.update({
        default : 'TRUE'

    })
    res.json({message : "default Company updated"})
})
})


router.post('/api/addNewShippingCompany',async (req,res)=>{
    console.log('datataaaaa' , req.body.shippingTable)
    console.log('datataaaaa' , req.body.collectionTable)
var shippingTable = req.body.shippingTable
var collectionTable = req.body.collectionTable
    db.shipping_companies.create({
        company_name : req.body.company_name ,
        company_number : req.body.company_number,
        company_address1 : req.body.company_address1,
        company_address2 : req.body.company_address2,
        company_address3 : req.body.company_address3
        
    }).then (async company =>{
        for(let i=0 ; i<shippingTable.length ; i++){
            await db.shipping_rate.create({
                country : shippingTable[i].country,
                shipping_rate : shippingTable[i].shipping_rate , 
                governorate : shippingTable[i].governorate,
                shipping_companies_id : company.shipping_companies_id,
                region:shippingTable[i].region
            })
        }
       for(let x=0 ; x<collectionTable.length; x++){
        await db.collection_rate.create({
            amount  : collectionTable[x].amount,
           collection_rate : collectionTable[x].collection_rate,
            shipping_companies_id : company.shipping_companies_id
    })
       }
        res.json({message : 'Company is added successfully'})
    }).catch(err=>{
        res.json({message:'Error occurred'})
    })
})



router.put('/api/deleteShippingCompany',async (req,res)=>{
    console.log(req.body.shipping_companies_id)
db.shipping_companies.findOne({
    where:{ 
        shipping_companies_id : req.body.shipping_companies_id
    }
}).then( async company=>{
company.destroy();
    res.json({message : 'company data deleted successfully'})
var collectionRate = await db.collection_rate.findAll({
    where:{
        shipping_companies_id : company.shipping_companies_id
    }
})
var shippingRate = await db.shipping_rate.findAll({
    where:{
        shipping_companies_id : company.shipping_companies_id

    }
})
shippingRate.destroy()
collectionRate.destroy()

})
})

router.put('/api/updateShippingCompany',async(req,res)=>{
    if(req.body.shipping_companies_id){
    db.shipping_companies.findOne({
        where:{
            shipping_companies_id: req.body.shipping_companies_id
        }
    }).then(async company=>{
        await company.update({
            company_name : req.body.company_name ,
            company_number : req.body.company_number ,
             company_address1 : req.body.company_address1,
             company_address2 : req.body.company_address2 , 
             company_address3 : req.body.company_address3 
             
        })
        res.json({message:"Updated Successfully"})
    })
}
if(req.body.rate_id){
    console.log('shipping data : ' ,req.body.shipping_rate ,req.body.governorate,req.body.region)
        await db.shipping_rate.findOne({
            where:{
                rate_id : req.body.rate_id
            }
        }).then(companyShippingRate =>{
companyShippingRate.update({
    country : req.body.country,
    shipping_rate : req.body.shipping_rate , 
    governorate : req.body.governorate,
   region:req.body.region,
})
res.json({message:"Updated Successfully"})
        })
    }
    if(req.body.collection_id){

    
        db.collection_rate.findOne({
            where:{
                collection_id : req.body.collection_id
            }
        }).then(collectionRate=>{
            collectionRate.update({
                amount  : req.body.amount ,
               collection_rate : req.body.collection_rate
               
            })
            res.json({message:"Updated Successfully"})
        })
    }
   
})

router.put('/api/getDefaultCompany',(req,res)=>{
    db.shipping_companies.findOne({
        where:{
            default:'true'
        },
        include:[{model : db.collection_rate},{model:db.shipping_rate}]
    }).then(company=>{
        if(company)res.json({data: company , Message:'default company found'})
else res.json({ Message:'No company FOUND'})
    })
})


router.post('/api/addOrRemoveShippingRate' , async(req,res)=>{
    var shippingTable=req.body.shippingTable?req.body.shippingTable:null 
   
    //add shippnig rate
    if(shippingTable){
        var company = await db.shipping_companies.findOne({
            where:{
                shipping_companies_id:req.body.shipping_companies_id
            }
        })
        for(let i=0 ; i<shippingTable.length ; i++){
        
            await db.shipping_rate.create({
                country : shippingTable[i].country,
                shipping_rate : shippingTable[i].shipping_rate , 
                governorate : shippingTable[i].governorate,
                shipping_companies_id : company.shipping_companies_id,
                region:shippingTable[i].region
            })
            res.json({message:'Shipping row added successfully'})
        }
    }
   
    //remove shipping Rate
    else{
db.shipping_rate.findOne({
    where:{
        rate_id : req.body.rate_id
    }
}).then(row=>{
row.destroy();
res.json({message:'Shipping rate deleted successfully'})
})
    }
})


router.post('/api/addOrRemoveCollectionRate',async(req,res)=>{
    var collectionTable= req.body.collectionTable?req.body.collectionTable:null
if(collectionTable){
    var company=await db.shipping_companies.findOne({
        where:{
            shipping_companies_id:req.body.shipping_companies_id
        }
    })
    for(let x=0 ; x<collectionTable.length; x++){
        await db.collection_rate.create({
            amount  : collectionTable[x].amount,
           collection_rate : collectionTable[x].collection_rate,
            shipping_companies_id : company.shipping_companies_id
    })
}
res.json({message:'Collection data added successfully'})
}
else{
    db.collection_rate.findOne({
        where:{
            collection_id:req.body.collection_id
        }
    }).then(row=>{
        row.destroy();
        res.json({message:"Collection data removed"})
    })
}
})





module.exports = router;