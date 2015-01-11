

'use strict';

/**
 * @ngdoc overview
 * @name angularBallApp
 * @description
 * # angularBallApp
 *
 * Main module of the application.
 */
// angular
//   .module('angularBallApp', [
//     'ngAnimate',
//     'ngCookies',
//     'ngResource',
//     'ngRoute',
//     'ngSanitize',
//     'ngTouch'
//   ])
//   .config(function ($routeProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'views/main.html',
//         controller: 'MainCtrl'
//       })
//       .when('/about', {
//         templateUrl: 'views/about.html',
//         controller: 'AboutCtrl'
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
//   });


/* jshint ignore:start */

var app = angular.module('angularBallApp', []);



app.factory('teamsFactory', ['$http', '$q', function($http, $q){
    var url = 'http://gd2.mlb.com/components/game/mlb/year_2014/month_08/day_05/master_scoreboard.json';
    return {
        getTeams: function() {
            var deferred = $q.defer();
            $http.get(url)
            .success(function(result){
                deferred.resolve(result);
            }); //end .success
            return deferred.promise;
        } // end getTeams
    }; // end return
}]); // end teamsFactory

app.factory('gamesFactory', ['$http', '$q', function($http, $q){
    return {
        getGames: function(codes) {
            var deferred = $q.defer();
            $http.get('http://gd2.mlb.com/components/game/mlb/year_2014/month_08/day_05/gid_2014_08_05_' + codes + 'boxscore.json')
            .success(function(result){
                deferred.resolve(result);
            }); // end .success
            return deferred.promise;
        } // end getGames
    } // end return
}]); // end gamesFactory

app.controller('MainCtrl', ['$scope', '$http', 'teamsFactory', 'gamesFactory', function ($scope, $http, teamsFactory, gamesFactory) {
    // $rootScope.game = {};
    $scope.teams = [];
    $scope.codes = [];
    $scope.games = {};
    $scope.gameSelected = false;
    $scope.awayScores = [];
    $scope.homeScores = [];
    $scope.innings = [];
    $scope.awayTeam = '';
    $scope.homeTeam = '';
    $scope.awayPitcher = '';
    $scope.homePitcher = '';
    $scope.awayLineup = [];
    $scope.homeLineup = [];
    $scope.sortedHomeLineup = [];
    $scope.sortedAwayLineup = [];
    $scope.awayRuns = 0;
    $scope.awayHits = 0;
    $scope.awayErrors = 0;
    $scope.homeRuns = 0;
    $scope.homeHits = 0;
    $scope.homeErrors = 0;
    
    $scope.displayGames = function(){
        teamsFactory.getTeams().then(function(result){
            console.log(result)
            for (var i = 0; i < result.data.games.game.length; i++) {
                var awayTeam = result.data.games.game[i].away_team_city + ' ' + result.data.games.game[i].away_team_name;
                var homeTeam = result.data.games.game[i].home_team_city + ' ' + result.data.games.game[i].home_team_name;
                console.log(awayTeam + ' at ' + homeTeam);

                var awayCode = result.data.games.game[i].away_code;
                var homeCode = result.data.games.game[i].home_code;

                $scope.games[i] = {
                    'teams': awayTeam + ' at ' + homeTeam,
                    'codes': awayCode + 'mlb_' + homeCode + 'mlb_1/'
                };
                $scope.teams.push($scope.games[i]);
            };
            console.log($scope.teams);
        });
    };

    $scope.displayGame = function(codes){
        console.log(codes);
        
        gamesFactory.getGames(codes).then(function(result){
            console.log(result);
            $scope.homeLineup = [];
            $scope.awayLineup = [];
            $scope.sortedHomeLineup = [];
            $scope.sortedAwayLineup = [];

            for (var i = 0; i < result.data.boxscore.batting[0].batter.length; i++) {
                var name = result.data.boxscore.batting[0].batter[i].name_display_first_last
                if (result.data.boxscore.batting[0].batter[i].pos.length > 2) {
                    var position = result.data.boxscore.batting[0].batter[i].pos.slice(0,2);
                } else {
                    var position = result.data.boxscore.batting[0].batter[i].pos;
                }

                $scope.homeLineup[i] = {
                    'name': name,
                    'position': position
                };
                
                $scope.homeLineup.push($scope.homeLineup[i]);

                // if ($scope.homeLineup[i].position != 'P' && $scope.homeLineup[i].position != 'PH') {
                //     console.log("Home Lineup: " + $scope.homeLineup[i].name + " - " + $scope.homeLineup[i].position);
                // };
            }; // end for

            function sortHome(a,b) {
              if (a.position < b.position)
                 return -1;
              if (a.position > b.position)
                return 1;
              return 0;
            }

            $scope.homeLineup.sort(sortHome);


            for (var i = 1; i < $scope.homeLineup.length; i++) {
                if ($scope.homeLineup[i].position != $scope.homeLineup[i-1].position) {
                    $scope.sortedHomeLineup.push($scope.homeLineup[i]);
                };    
            };
            
            $scope.sortedHomeLineup.push($scope.homeLineup[0]);
            console.log($scope.sortedHomeLineup);     

            for (var i = 0; i < result.data.boxscore.batting[1].batter.length; i++) {
                var name = result.data.boxscore.batting[1].batter[i].name_display_first_last;
                if (result.data.boxscore.batting[1].batter[i].pos.length > 2) {
                    var position = result.data.boxscore.batting[1].batter[i].pos.slice(0,2);
                } else {
                    var position = result.data.boxscore.batting[1].batter[i].pos;
                }

                $scope.awayLineup[i] = {
                    'name': name,
                    'position': position
                };
                $scope.awayLineup.push($scope.awayLineup[i]);
                if ($scope.awayLineup[i].position != 'P' && $scope.awayLineup[i].position != 'PH') {
                    console.log("Away Lineup: " + $scope.awayLineup[i].name + " - " + $scope.awayLineup[i].position);
                };
            }; // end for

            function sortAway(a,b) {
              if (a.position < b.position)
                 return -1;
              if (a.position > b.position)
                return 1;
              return 0;
            };

            $scope.awayLineup.sort(sortAway);

            for (var i = 1; i < $scope.awayLineup.length; i++) {
                if ($scope.awayLineup[i].position != $scope.awayLineup[i-1].position) {
                    $scope.sortedAwayLineup.push($scope.awayLineup[i]);
                };    
            };
            
            $scope.sortedAwayLineup.push($scope.awayLineup[0]);
            console.log($scope.sortedAwayLineup);     

            if (Array.isArray(result.data.boxscore.pitching[0].pitcher)) {
                $scope.awayPitcher = result.data.boxscore.pitching[0].pitcher[0].name_display_first_last;
            } else {
                $scope.awayPitcher = result.data.boxscore.pitching[0].pitcher.name_display_first_last;
            }; // end if array for pitching[0]
            if (Array.isArray(result.data.boxscore.pitching[1].pitcher)) {
                $scope.homePitcher = result.data.boxscore.pitching[1].pitcher[0].name_display_first_last;
            } else {
            $scope.homePitcher = result.data.boxscore.pitching[1].pitcher.name_display_first_last;
            }; // end if array for pitching[1]
            $scope.awayRuns = result.data.boxscore.linescore.away_team_runs;
            $scope.awayHits = result.data.boxscore.linescore.away_team_hits;
            $scope.awayErrors = result.data.boxscore.linescore.away_team_errors;
            $scope.homeRuns = result.data.boxscore.linescore.home_team_runs;
            $scope.homeHits = result.data.boxscore.linescore.home_team_hits;
            $scope.homeErrors = result.data.boxscore.linescore.home_team_errors;
            $scope.showLogos(result.data.boxscore.away_team_code, result.data.boxscore.home_team_code);
            $scope.showScores(result);
        }); // end gamesFactory.getGames
    }; // end displayGame

    $scope.showLogos = function(awayCode, homeCode){
        $scope.awaySrc = 'images/' + awayCode + '.svg';
        $scope.homeSrc = 'images/' + homeCode + '.svg';
    };

    $scope.showScores = function(result){
        $scope.gameSelected = true;
        $scope.awayScore = result.data.boxscore.linescore.away_team_runs;
        $scope.homeScore = result.data.boxscore.linescore.home_team_runs;
        $scope.awayTeam = result.data.boxscore.away_sname;
        $scope.homeTeam = result.data.boxscore.home_sname;
        $scope.awayScores = [];
        $scope.homeScores = [];
        $scope.innings = [];
        for (var i = 0; i < result.data.boxscore.linescore.inning_line_score.length; i++) {
            $scope.innings.push(result.data.boxscore.linescore.inning_line_score[i].inning);
            $scope.awayScores.push(result.data.boxscore.linescore.inning_line_score[i].away);
            $scope.homeScores.push(result.data.boxscore.linescore.inning_line_score[i].home);
        };
    };

    $scope.homeClicked = function() {
        $scope.home = true;
        $scope.away = false;
    };

    $scope.awayClicked = function() {
        $scope.home = false;
        $scope.away = true;
    };

}]);



/* jshint ignore:end */