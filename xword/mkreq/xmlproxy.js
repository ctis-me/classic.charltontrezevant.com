var http = require('http');
var url = require('url');

http.createServer(function (req, res) {

  var xmlFileName = url.parse(req.url,true).query;

  //Check to see whether the requests made to the server are empty.
  if (isEmptyObject(xmlFileName) || isEmptyString(xmlFileName.filename) )  {

    //If they are...
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    //Log it to the console.
    console.log(dateTime() + " Got empty, invalid, or no query from " + req.connection.remoteAddress + ' (XFF: ' + req.headers['X-Forwarded-For'] + '). \n');
    //And return an error to the user.
    res.write("{ error: \"empty or malformed query\" }", null, 4);
    res.end();

  } else {

    //If the request _isn't_ empty, however...

    //Log it to the console, because it's exciting!
    console.log(dateTime() + " Request received from " + req.connection.remoteAddress + ' (XFF: ' + req.headers['X-Forwarded-For'] + ")" + ", running.");

    try {

      http.get({
            host: 'oc.course.com',
            path: '/xword/' + xmlFileName.filename
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
        res.setHeader('content-type', 'application/xml');
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
            res.setHeader('Access-Control-Allow-Headers', "X-Requested-With");
        res.writeHead(200);
            res.write(body);
            res.end();
            });
        });

    } catch(e) {

      //Otherwise, log the error to the console.
      console.log(dateTime() + " Encountered unparseable URL parameter pre-processing from " + req.connection.remoteAddress + ' (XFF: ' + req.headers['X-Forwarded-For'] + "), stopped. \n");
      //And retun an error to the user.
      res.setHeader('content-type', 'application/json');
      res.writeHead(200);
      res.write("{ error: \"query malformed.\" }", null, 4);
      res.end();
      return;

    }

      }
    }).listen(8083);


//Function to check whether the query object is empty.
function isEmptyObject(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
    }
    return true;
  }

  //function to check whether the query string is empty.
  function isEmptyString(str) {
    return (!str || 0 === str.length);
  }

function dateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

