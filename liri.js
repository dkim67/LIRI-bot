require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require('fs');
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var inputOne = process.argv[2];
var inputTwo = process.argv[3]

var getTweets = function () {
    var params = { screen_name: 'Daniel_K24', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log("Tweets Incoming.");
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("================================================================")
            }
        }
    });
}


var getNames = function (artist) {
    return artist.name;
}

var getSongs = function (songName) {
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data.tracks.items[0].artists);
        console.log("Retrieving Song Info")
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            // grab artists using map

            console.log("Artist: " + songs[i].artists.map(getNames));
            console.log("Song Name: " + songs[i].name);
            console.log("Preview: " + songs[i].preview_url);
            console.log("Album: " + songs[i].album.name);
            console.log("===================================================================");

        }
    })

};





var getMovie = function (movieName) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Successful Retrieval")
            jsonBody = JSON.parse(body);
            console.log("Title: " + jsonBody.Title)
            console.log("Year: " + jsonBody.Year);
            console.log("IMDB Rating: " + jsonBody.imdbRating);
            console.log("RottenTomatoes Rating: " + jsonBody.Ratings[1].Value);
            console.log("Country: " + jsonBody.Country);
            console.log("Language: " + jsonBody.Language);
            console.log("Plot: " + jsonBody.Plot);
            console.log("Actors: " + jsonBody.Actors);

        }

    })
}
var doWhat = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        var output = data.split(",");
        inputs(output[0], output[1]);
    });
}



var inputs = function (inputOne, inputTwo) {
    switch (inputOne) {
        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            
            getSongs(inputTwo);
            break;
        case "movie-this":
            getMovie(inputTwo);
            break;
        case "do-what-it-says":
            doWhat();
            break;
    }
}

inputs(inputOne, inputTwo);
