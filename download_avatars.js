var args = process.argv.slice(2);
var owner = args[0];
var repo = args[1];

if(owner === undefined || repo === undefined){
  console.log("Error not enough arugemnts");
} else {
  var request = require('request');
  var fs = require('fs');
  var secret  = require('./secrets.js')
  var GITHUB_TOKEN = secret['GITHUB_TOKEN'];;
  console.log('Welcome to the GitHub Avatar Downloader!');

  function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {
      var data = JSON.parse(body);
      cb(err, data);
    });
  }

  function downloadImageByURL(url, filePath) {
    request.get(url)
    .on('error', function(err){
        throw err;
    })

    .on('end', function(){
      console.log('Download Complete...');
    })

    .pipe(fs.createWriteStream(filePath));
  }


  getRepoContributors(owner, repo, function(err, result) {
    console.log("Errors:", err);
    result.forEach(function(element){
      var url = element['avatar_url'];
      var path = element['login'];
      downloadImageByURL(url,path);

    });
  });
}
