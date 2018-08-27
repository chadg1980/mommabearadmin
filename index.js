require('dotenv').config();
const Airtable = require('airtable');

//mommabear_airtablesync

let base = new Airtable({apiKey: process.env.AIRTABLE_APIKEY}).base(process.env.AIRTABLE_BASE);

exports.handler = function(event, context, callback){
    console.log("Starting...");
    console.log("API: " + process.env.AIRTABLE_APIKEY);
    console.log("apiKey: " +process.env.AIRTABLE_BASE);
    callback(null, "Success!");
}


