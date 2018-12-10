angular.module("mainModule").controller("movieCtrl", ["$scope", "$http", "Movies", "Users", function($scope, $http, Movies, Users){

    $scope.movies = null;

    // Used in collection.html to create 5 empty rating stars
    $scope.numberOfStars = 5;

     // Holds the value in which the movie collection will be ordered (ie. title, year, etc)
     $scope.orderBy = {
        order: "title"
    };

    // Holds the search value
    $scope.search = {};

    // Holds the movie being edited
    $scope.selectedMovie = {};

    $scope.movieAdded = "";

    $scope.suggestedMovies = null;

    if(Users.getUser()){
        Movies.getMovies(Users.getUserId()).then(
            movies => { console.log(movies); $scope.movies = movies; },
            () => { $scope.movies = null; }
        );
    }

    // Called when a new movie is added to the collection
    $scope.formSubmit = function(){
        if(Users.getUser()){
            Movies.addMovie(Users.getUserId(), createMovie()).then(
                (updatedMovies) => { $scope.movies = updatedMovies; displayHint(); },
                (response) => { $scope.msg = response; }
            );
        }
        document.querySelector(".movieForm").reset();
        $scope.suggestedMovies = null;
    };

    // Called when the edit button is clicked. Populates the inputs with selected movie values
    $scope.editMovie = function(movie){
        $scope.selectedMovie = movie;
        document.querySelector(".modal-title").textContent = movie.title;
        var inputs = document.querySelectorAll("#editModal .modal-body input:not([type=submit]), #editModal .modal-body select");
        inputs[0].value = movie.title;
        inputs[1].value = movie.year;
        inputs[2].value = movie.format;
        inputs[3].value = movie.watched;
    };

    // Called when the save button is selected in the edit screen. Updates the database with the edited movie.
    $scope.saveChanges = function(){
        var movie = $scope.selectedMovie;
        movie.title = document.querySelector("#editModal #dvd-title").value;
        movie.year = document.querySelector("#editModal #dvd-year").value;
        movie.format = document.querySelector("#editModal #dvd-format").value;
        movie.watched = document.querySelector("#editModal #times-watched").value;
        Movies.updateMovie(Users.getUserId(), movie).then(
            (response) => { $scope.msg = response },
            (response) => { $scope.msg = response }
        );
    };

    // Called when the delete button is selected. Removes the movie from the database.
    $scope.deleteMovie = function(movie){
        console.log(movie._id);
        Movies.deleteMovie(Users.getUserId(), movie).then(
            (updatedMovies) => { $scope.movies = updatedMovies },
            (response) => { $scope.msg = response }
        );
    };

    /**
     * Sets the rating stars for a movie on page load and on a rating update
     * @param {*} movie The movie being updated
     * @param {*} index The index of the movie being updated
     */
    $scope.setStars = function(movie, index){
        console.log("setting stars...");
        document.querySelector("tr:nth-of-type(" + (index + 1) + ") > th > div.stars > span.stars-inner").style.width = (movie.rating * 20) + "%";
    };

    /**
     * On a mouse-enter event, fills the rating stars up to the one the pointer is on.
     * @param {*} pIndex The index of the table row
     * @param {*} index The index of the star within the row
     */
    $scope.fillStars = function(pIndex, index){
        var width = (index + 1) * 20;
        document.querySelector("tr:nth-of-type(" + (pIndex + 1) + ") > th > div.stars > span.stars-inner").style.width = width + "%";
    };

    /**
     * On a mouse-click event, sets the rating of the movie to the star that was clicked
     * @param {*} movie The movie being rated
     * @param {*} score The score being set
     */
    $scope.setRating = function(movie, score){
        movie.rating = score;
        Movies.setRating(Users.getUserId(), movie).then(
            (response) => { console.log(response); },
            (response) => { $scope.$parent.msg = response; }
        );
    };

    $scope.data = {
        filtered: null
    };

    $scope.getMovieSuggestions = function(){
        if(this.movieAdded.length >= 4){
          console.log($scope.data.filtered);
          if(!$scope.data.filtered || $scope.data.filtered.length < 6){
            $http.get("https://api.themoviedb.org/3/search/movie?api_key=5aa71e27f6bb19b08d763f5b5239d2a2&language=en-US&query=" + this.movieAdded +"&page=1&include_adult=false")
                .then(function(response){
                    console.log(response);
                    $scope.suggestedMovies = response.data;
                    document.querySelector(".movieForm .dropdown").style.display = "block";
                }, function(response){
                    console.log(response);
                });
          }
        }
    };

    $scope.fillFormWithSuggestion = function(movie){
      console.log(movie);
      document.getElementById("dvd-title").value = movie.original_title;
      document.getElementById("dvd-year").value = movie.release_date.slice(0, 4);
    };

    $scope.showMovieSuggestions = function(){
      if($scope.suggestedMovies){
        document.querySelector(".movieForm .dropdown").style.display = "block";
      }
    };

    $scope.hideMovieSuggestions = function(){
        document.querySelector(".movieForm .dropdown").style.display = "none";
    };

    $scope.testData = {
        "page": 1,
        "total_results": 2104,
        "total_pages": 106,
        "results": [
          {
            "vote_count": 0,
            "id": 292141,
            "video": false,
            "vote_average": 0,
            "title": "Ungdommens Ret",
            "popularity": 0.6,
            "poster_path": null,
            "original_language": "en",
            "original_title": "Ungdommens Ret",
            "genre_ids": [
              
            ],
            "backdrop_path": null,
            "adult": false,
            "overview": "Directed by August Blom.",
            "release_date": "1911-01-02"
          },
          {
            "vote_count": 28,
            "id": 31651,
            "video": false,
            "vote_average": 7.2,
            "title": "The Field",
            "popularity": 3,
            "poster_path": "/zyDJw9USd4nuzKIzpN7LO4O780s.jpg",
            "original_language": "en",
            "original_title": "The Field",
            "genre_ids": [
              18
            ],
            "backdrop_path": "/8EFrbzQQvJl5mwTca13yfDmp7wb.jpg",
            "adult": false,
            "overview": "\"Bull\" McCabe's family has farmed a field for generations, sacrificing much in the name of the land. When the widow who owns the field decides to sell it in a public auction, McCabe knows that he must own it. While no local dare bid against him, a wealthy American decides he requires the field to build a highway. \"Bull\" and his son decide they must try to convince the American to let go of his ambition and return home, but the consequences of their plot prove sinister.",
            "release_date": "1990-09-21"
          },
          {
            "vote_count": 1,
            "id": 339642,
            "video": false,
            "vote_average": 5,
            "title": "Utta Danella - Mit dir die Sterne sehen",
            "popularity": 0.6,
            "poster_path": null,
            "original_language": "de",
            "original_title": "Utta Danella - Mit dir die Sterne sehen",
            "genre_ids": [
              18
            ],
            "backdrop_path": null,
            "adult": false,
            "overview": "Pretty Floriane does not believe in love anymore, since she has learned that her boyfriend is really married and does not even think about leaving his wife. Surprisingly, the charming townspeople Sebastian comes into their lives: The handsome contractor was actually just passing through - but after a car breakdown, he hired himself in Florianes small country inn. It does not take long for an intimate love to develop between the two. But then it turns out that Sebastian also has a girlfriend who is ready to fight him.",
            "release_date": "2008-04-11"
          },
          {
            "vote_count": 1,
            "id": 286439,
            "video": false,
            "vote_average": 7,
            "title": "For frihed og ret",
            "popularity": 0.6,
            "poster_path": "/doimzB22Uh87DvxLOnSa5c4KE01.jpg",
            "original_language": "da",
            "original_title": "For frihed og ret",
            "genre_ids": [
              36,
              18
            ],
            "backdrop_path": null,
            "adult": false,
            "overview": "",
            "release_date": "1949-10-28"
          },
          {
            "vote_count": 0,
            "id": 270618,
            "video": false,
            "vote_average": 0,
            "title": "Med ret til at dræbe",
            "popularity": 0.6,
            "poster_path": "/6TDhDEFAhVDbHMYEZYFAfqiuibc.jpg",
            "original_language": "da",
            "original_title": "Med ret til at dræbe",
            "genre_ids": [
              99
            ],
            "backdrop_path": null,
            "adult": false,
            "overview": "﻿﻿﻿﻿﻿This 2003 documentary looks at the Danish resistance movement's execution of 400 informers during the Nazi occupation -- and the ensuing cover-up.",
            "release_date": "2003-10-28"
          },
          {
            "vote_count": 96,
            "id": 43316,
            "video": false,
            "vote_average": 7.3,
            "title": "All That Heaven Allows",
            "popularity": 6.614,
            "poster_path": "/aTP5FknptVwPGVv5wCQaeuYFuEB.jpg",
            "original_language": "en",
            "original_title": "All That Heaven Allows",
            "genre_ids": [
              18,
              10749
            ],
            "backdrop_path": "/kCyJHIgxv5xkZeTqwN2CIw7nVkF.jpg",
            "adult": false,
            "overview": "Two different social classes collide when Cary Scott, a wealthy upper-class widow, falls in love with her much younger and down-to-earth gardener, prompting disapproval and criticism from her children and country club friends.",
            "release_date": "1955-12-25"
          },
          {
            "vote_count": 0,
            "id": 517012,
            "video": false,
            "vote_average": 0,
            "title": "El jinete justiciero en retando a la muerte",
            "popularity": 1.091,
            "poster_path": "/hx2ruAiaV2x2VcBvIu3VOmv9JMK.jpg",
            "original_language": "es",
            "original_title": "El jinete justiciero en retando a la muerte",
            "genre_ids": [
              
            ],
            "backdrop_path": null,
            "adult": false,
            "overview": "Guy gets mugged on horseback and left for dead; farmgal nurses him back to health and when he's on his feet again, he puts a domino on and swings into J J action.",
            "release_date": "1966-01-06"
          },
          {
            "vote_count": 0,
            "id": 238903,
            "video": false,
            "vote_average": 0,
            "title": "Har jeg Ret til at tage mit eget Liv?",
            "popularity": 0.6,
            "poster_path": null,
            "original_language": "en",
            "original_title": "Har jeg Ret til at tage mit eget Liv?",
            "genre_ids": [
              
            ],
            "backdrop_path": null,
            "adult": false,
            "overview": "Do I Have the Right to Take My Own Life? - Its melodramatic story answers the question of the title with a resounding \"No!\". A young clerk, tempted by easy money, get involved in crooked financial dealings. When they go badly wrong, and exposure and disgrace loom, he takes his own life. Not only does his suicide plunge his wife into destitution, his own immortal soul will live in a different dimension, doomed to eternal torment.",
            "release_date": "1920-10-21"
          },
          {
            "vote_count": 127,
            "id": 73936,
            "video": false,
            "vote_average": 5.6,
            "title": "Retreat",
            "popularity": 6.738,
            "poster_path": "/ZjfCPOLpIN50RqcbfVHV3DIWGM.jpg",
            "original_language": "en",
            "original_title": "Retreat",
            "genre_ids": [
              18,
              53,
              27,
              878
            ],
            "backdrop_path": "/hEUEUF9dRnyZUBi5MnQeonLPwJ5.jpg",
            "adult": false,
            "overview": "Kate and Martin escape from personal tragedy to an Island Retreat. Cut off from the outside world, their attempts to recover are shattered when a man is washed ashore, with news of airborne killer disease that is sweeping through Europe.",
            "release_date": "2011-10-14"
          },
          {
            "vote_count": 59,
            "id": 26689,
            "video": false,
            "vote_average": 5.9,
            "title": "Retroactive",
            "popularity": 5.599,
            "poster_path": "/cIWR7BgNyXqVbd3dB476xK9Obam.jpg",
            "original_language": "en",
            "original_title": "Retroactive",
            "genre_ids": [
              878,
              53
            ],
            "backdrop_path": "/caFlSsy1TsjhlNF0STkGC2zV2pa.jpg",
            "adult": false,
            "overview": "A psychiatrist makes multiple trips through time to save a woman that was murdered by her brutal husband.",
            "release_date": "1997-01-01"
          },
          {
            "vote_count": 2726,
            "id": 364,
            "video": false,
            "vote_average": 6.8,
            "title": "Batman Returns",
            "popularity": 19.844,
            "poster_path": "/jX5THE1yW3zTdeD9dupcIyQvKiG.jpg",
            "original_language": "en",
            "original_title": "Batman Returns",
            "genre_ids": [
              28,
              14
            ],
            "backdrop_path": "/wNIE5dpkiHU2csDRptMutFjAGiV.jpg",
            "adult": false,
            "overview": "Having defeated the Joker, Batman now faces the Penguin - a warped and deformed individual who is intent on being accepted into Gotham society. Crooked businessman Max Schreck is coerced into helping him become Mayor of Gotham and they both attempt to expose Batman in a different light. Selina Kyle, Max's secretary, is thrown from the top of a building and is transformed into Catwoman - a mysterious figure who has the same personality disorder as Batman. Batman must attempt to clear his name, all the time deciding just what must be done with the Catwoman.",
            "release_date": "1992-06-19"
          },
          {
            "vote_count": 3,
            "id": 523792,
            "video": false,
            "vote_average": 6.3,
            "title": "Retina",
            "popularity": 4.067,
            "poster_path": "/6p8OUn2NdOGVKpEdRV8Y6U4jQWe.jpg",
            "original_language": "en",
            "original_title": "Retina",
            "genre_ids": [
              18,
              53
            ],
            "backdrop_path": "/fIfSCunfo855N3Vc29wYTi0Pqpa.jpg",
            "adult": false,
            "overview": "A young woman participates in a medical study. After a series of nightmares and unusual side effects, the line between dreams and reality is blurred. She finds herself on the run from those involved, desperate to uncover the truth.",
            "release_date": "2017-12-31"
          },
          {
            "vote_count": 2075,
            "id": 1452,
            "video": false,
            "vote_average": 5.5,
            "title": "Superman Returns",
            "popularity": 15.24,
            "poster_path": "/e3aLTaD5ppxo3en0GAGceekEPAe.jpg",
            "original_language": "en",
            "original_title": "Superman Returns",
            "genre_ids": [
              12,
              14,
              28,
              878
            ],
            "backdrop_path": "/pkX4ytzAXswpMhea0JKxgA5Vmqo.jpg",
            "adult": false,
            "overview": "Superman returns to discover his 5-year absence has allowed Lex Luthor to walk free, and that those he was closest to felt abandoned and have moved on. Luthor plots his ultimate revenge that could see millions killed and change the face of the planet forever, as well as ridding himself of the Man of Steel.",
            "release_date": "2006-06-28"
          },
          {
            "vote_count": 67,
            "id": 447665,
            "video": false,
            "vote_average": 4.7,
            "title": "Kickboxer: Retaliation",
            "popularity": 10.637,
            "poster_path": "/oMWP4cAoy8WBauuKZAVTIfuY3Fw.jpg",
            "original_language": "en",
            "original_title": "Kickboxer: Retaliation",
            "genre_ids": [
              28,
              18
            ],
            "backdrop_path": "/nTH63dIC9D9lWhQlvCu4zSoESKj.jpg",
            "adult": false,
            "overview": "One year after the events of \"Kickboxer: Vengeance\", Kurt Sloan has vowed never to return to Thailand. However, while gearing up for a MMA title shot, he finds himself sedated and forced back into Thailand, this time in prison. He is there because the ones responsible want him to face a 6'8\" 400 lbs. beast named Mongkut and in return for the fight, Kurt will get two million dollars and his freedom back. Kurt at first refuses, in which a bounty is placed on his head as a way to force him to face Mongkut. Kurt soon learns he will have no other choice and will undergo his most rigorous training yet under some unexpected mentors in order to face Mongkut in hopes to regain his freedom.",
            "release_date": "2018-01-26"
          },
          {
            "vote_count": 2,
            "id": 499394,
            "video": false,
            "vote_average": 0,
            "title": "Retablo",
            "popularity": 2.787,
            "poster_path": "/sb9o4IR5dhRASL3GoQl4cLWBDlO.jpg",
            "original_language": "qu",
            "original_title": "Retablo",
            "genre_ids": [
              18
            ],
            "backdrop_path": null,
            "adult": false,
            "overview": "Segundo sees silence as his only option for dealing with his father Noé’s secret. The 14-year-old lives with his parents in a village high up in the mountains of Peru. Noé is a respected artisan and Segundo’s role model. With loving eye for detail, he artfully crafts altarpieces for church and homes, and is preparing his son to follow in his footsteps. But cracks form in their tight bond.",
            "release_date": "2018-12-19"
          },
          {
            "vote_count": 910,
            "id": 19899,
            "video": false,
            "vote_average": 5.4,
            "title": "Couples Retreat",
            "popularity": 8.008,
            "poster_path": "/6mdsH9XA2u4jnVKwWlKE1Mg2OQM.jpg",
            "original_language": "en",
            "original_title": "Couples Retreat",
            "genre_ids": [
              35,
              10749
            ],
            "backdrop_path": "/8NDf9WGgv2glSslJdzK63Sbdwzy.jpg",
            "adult": false,
            "overview": "Four couples, all friends, descend on a tropical island resort. Though one husband and wife are there to work on their marriage, the others just want to enjoy some fun in the sun. They soon find, however, that paradise comes at a price: Participation in couples therapy sessions is mandatory. What started out as a cut-rate vacation turns into an examination of the common problems many face.",
            "release_date": "2009-09-19"
          },
          {
            "vote_count": 3414,
            "id": 1734,
            "video": false,
            "vote_average": 6.1,
            "title": "The Mummy Returns",
            "popularity": 16.651,
            "poster_path": "/hioiYUZVIuYIhagDGhIAjyNEUu0.jpg",
            "original_language": "en",
            "original_title": "The Mummy Returns",
            "genre_ids": [
              12,
              28,
              14
            ],
            "backdrop_path": "/zlHeYjpHrHLpH4ylN5xYRdr7NlB.jpg",
            "adult": false,
            "overview": "Rick and Evelyn O’Connell, along with their 8-year-old son Alex, discover the key to the legendary Scorpion King’s might: the fabled Bracelet of Anubis. Unfortunately, a newly resurrected Imhotep has designs on the bracelet as well, and isn’t above kidnapping its new bearer, Alex, to gain control of Anubis’s otherworldly army.",
            "release_date": "2001-05-04"
          },
          {
            "vote_count": 3672,
            "id": 72559,
            "video": false,
            "vote_average": 5.5,
            "title": "G.I. Joe: Retaliation",
            "popularity": 12.93,
            "poster_path": "/iFWxbu2LLtfaWv6D1TSrY11huTe.jpg",
            "original_language": "en",
            "original_title": "G.I. Joe: Retaliation",
            "genre_ids": [
              12,
              28,
              878,
              53
            ],
            "backdrop_path": "/b9OVFl48ZV2oTLzACSwBpNrCUhJ.jpg",
            "adult": false,
            "overview": "Framed for crimes against the country, the G.I. Joe team is terminated by Presidential order. This forces the G.I. Joes into not only fighting their mortal enemy Cobra; they are forced to contend with threats from within the government that jeopardize their very existence.",
            "release_date": "2013-03-26"
          },
          {
            "vote_count": 7234,
            "id": 1892,
            "video": false,
            "vote_average": 8,
            "title": "Return of the Jedi",
            "popularity": 15.73,
            "poster_path": "/lrJWyjOVjPhghl4KyAMtOepAxs.jpg",
            "original_language": "en",
            "original_title": "Return of the Jedi",
            "genre_ids": [
              12,
              28,
              878
            ],
            "backdrop_path": "/koE7aMeR2ATivI18mCbscLsI0Nm.jpg",
            "adult": false,
            "overview": "As Rebel leaders map their strategy for an all-out attack on the Emperor's newer, bigger Death Star. Han Solo remains frozen in the cavernous desert fortress of Jabba the Hutt, the most loathsome outlaw in the universe, who is also keeping Princess Leia as a slave girl. Now a master of the Force, Luke Skywalker rescues his friends, but he cannot become a true Jedi Knight until he wages his own crucial battle against Darth Vader, who has sworn to win Luke over to the dark side of the Force.",
            "release_date": "1983-05-23"
          },
          {
            "vote_count": 0,
            "id": 400650,
            "video": false,
            "vote_average": 0,
            "title": "Mary Poppins Returns",
            "popularity": 15.378,
            "poster_path": "/3D4Z2MxV54t6d40hHzGpeUmVdsr.jpg",
            "original_language": "en",
            "original_title": "Mary Poppins Returns",
            "genre_ids": [
              14,
              10402,
              10751
            ],
            "backdrop_path": "/aGSqYpbuGxfzwP60lEO5ELUHiyX.jpg",
            "adult": false,
            "overview": "In Depression-era London, a now-grown Jane and Michael Banks, along with Michael's three children, are visited by the enigmatic Mary Poppins following a personal loss. Through her unique magical skills, and with the aid of her friend Jack, she helps the family rediscover the joy and wonder missing in their lives.",
            "release_date": "2018-12-19"
          }
        ]
      }

}]);