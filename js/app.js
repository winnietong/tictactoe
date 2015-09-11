var app = angular.module('tttApp', [
    'ngRoute',
    'ui.bootstrap'
]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/game.html',
            controller: gameController
        })
        .otherwise({redirectTo: '/'});
});