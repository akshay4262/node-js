var mqtt = require('mqtt');
var mongodb = require('mongodb');
var mongodbClient = mongodb.MongoClient;
var mongodbURI = 'mongodb://localhost:27017/nds_iot';
var deviceRoot = "nds";
var collection,client;

mongodbClient.connect(mongodbURI, setupCollection);
function setupCollection(err, db) {
   if(err) throw err;
   collection=db.collection("mqtt_messages");
   client=mqtt.connect({ host: '15.206.208.179', port: 1883, username: 'napino', password: 'nds@iot'});
   client.subscribe(deviceRoot + "/#");
   client.on('message', insertEvent);
}

function insertEvent(topic,message) {
message = message.toString();   
   var key=topic.replace(deviceRoot,'');
   console.log(topic);
   console.log(message);

   collection.update(
   { key:key }, 
   { $push: { events: { event: {  value:message, when:new Date() } } } }, 
   { upsert:true },

   function(err,docs) {  
   if(err) {
      console.log("Insert fail")		
	 }
 }
 );
}
