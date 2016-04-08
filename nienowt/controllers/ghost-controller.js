'use strict';
require('angular');

angular.module('app',[])
  .controller('GhostController',['$http', function($http) {
    const mainRoute = 'http://localhost:3000/ghosts';
    this.angTest = 'TOO GOOD';
    this.ghosts = [];
    this.getGhosts = function() {
      $http.get(mainRoute)
      .then((results) => {
        console.log(results);
        this.ghosts = results.data.people;
      },(err) => {
        if (err) console.log(err);
      })
    }
  }])
