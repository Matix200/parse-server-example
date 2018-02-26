
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.afterSave("CountCommentIncrement", function(request) {
  // Get the movie id for the Review
  // Query the Movie represented by this review
  var Calendar = Parse.Object.extend("CalendarCounter");
  var query = new Parse.Query(Calendar);
  query.get("M44CuODDAF").then(function(Calendar) {
    // Increment the reviews field on the Movie object
    Calendar.increment("Counter");
    Calendar.save();
  }, function(error) {
    throw "Got an error " + error.code + " : " + error.message;
  });
});
