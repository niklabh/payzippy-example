
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

// Request Test MID by emailing contactus@payzippy.com
// Replace with original thing
var conf = {
  merchant_id: 'MY_MERCHANT_ID',
  secret_key: 'MY_SECRET_KEY',
  merchant_key_id: 'MY_MERCHANT_KEY_ID',
  callback_url: 'http://localhost:3000/pay',
};

var pz = require('payzippy')(conf);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/charge', function(req, res, next){
	pz.charge(req.body, function(err, result){
		if(err) next(err);
		res.redirect(result.url);
	});
});
app.all('/pay', function(req, res){
	res.json(pz.response(req));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
