require('dotenv').config();
var Airtable = require('airtable');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var base = new Airtable({apiKey: process.env.AIRTABLE_APIKEY}).base(process.env.AIRTABLE_BASE);

function getRecords(callback){
       
            
    let products =[];
    
    base('Products').select({
        // Selecting the first 3 records in Grid view:
        
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        
        records.forEach(function(record) {
            if(record.get('product_name')){
                products.push({
                    'product_name':record.get('product_name'),
                    'price':record.get('price'),
                    'ingredients': record.get('ingredients'),
                    'image_filename': record.get('image_filename'),
                    'alt_text' : record.get('image_alt_text'),
                    'notes': record.get('notes'),
                    'sold_out': record.get('sold_out'), 
                    'deleted': record.get('deleted')  });
            }
            
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) {"error" +  callback(err); }
        let bucketName =  process.env.BUCKET;

        var params = {
            Body: JSON.stringify(products),
            Bucket: bucketName,
            Key: "assets/index.json"
        }
        
        
        s3.putObject(params, function(err, data){
            if(err) console.log(err, err.stack);
            else console.log(data);
            callback(null, data);
        })
        
    });
};


exports.handler = (event, context, callback) => {
    console.log("starting...")
    getRecords(callback);

}

