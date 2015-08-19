/**
 * How to subscribe for new MongoDB documents in Node.js using tailable cursor
 */



// subscriber function
module.exports.subscribe = function(dbUrl, collectionName, filter, callback, error){

  if ('function' == typeof filter) {
      error = callback;
      callback = filter;
      filter = {};
  }

  if('function' !== typeof callback) throw('Callback function not defined');
  if(!error) {error = function(err) {console.error(err)}};

  // connect to MongoDB
  require('mongodb').MongoClient.connect(dbUrl, function(err, db){

    // make sure you have created capped collection "messages" on db "test"
    db.collection(collectionName, function(err, coll) {

      // seek to latest object
      var seekCursor = coll.find(filter).sort({$natural: -1}).limit(1);
      seekCursor.nextObject(function(err, latest) {
        if (latest) {
          filter._id = { $gt: latest._id }
        }

        // set MongoDB cursor options
        var cursorOptions = {
          tailable: true,
          awaitdata: true,
          numberOfRetries: 3,
          tailableRetryInterval: 3000

        };

        // create stream and listen
        var stream = coll.find(filter, cursorOptions).stream();

        // call the callback
        stream.on('data', callback);
        // call the error callback
        stream.on('error', function(err){error(err)});
      });
    });

  });

};
