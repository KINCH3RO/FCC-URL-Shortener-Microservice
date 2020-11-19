require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
var bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urls = []

let options = {
  family: 0,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
}
options.all = true;
// Your first API endpoint
app.get("/api/shorturl/:id",(req,res)=>{
  let id=parseInt(req.params.id)
  let index=id-1;
  if(id==0){
    res.json({
      error:"Wrong format"
    })
  }else if(id>urls.length){
    res.json({
      error:"no short url for given input"
    })
  }else{
    res.redirect(urls[index]);
  }
 
})

app.post("/api/shorturl/new", function (req, res) {
  let rawUrl = req.body.url;
  let urlWithouthttp = rawUrl.replace("https://", "");
  let urlCheck = "";
 console.log(urlWithouthttp.indexOf("/"))
    if (urlWithouthttp.indexOf("/") > 0) {
    
      urlCheck = urlWithouthttp.substring(0, urlWithouthttp.indexOf("/")-1);
    } else {
      urlCheck = urlWithouthttp;

    }
  console.log(urlCheck)
 
  dns.lookup(urlCheck, options, function (err, adresse) {


    if (err) {
      res.json({
        error: "Invalid URL"
      })

    } else {
      urls.push(rawUrl);
      res.json({
        original_url: rawUrl,
        short_url: urls.indexOf(rawUrl) + 1
  
      })
    }
   

  })

});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
