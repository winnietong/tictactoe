function gameController($scope, Game, $modal) {

    $scope.outcome = '';
    $scope.outcomeBody = "Click 'New Game' to try your luck again!";

    // ---------------
    // Initializations
    // ---------------

    (function init() {
        $scope.game = Game;
        Game.startGame();
    })();

    // --------------
    // Modal Instance
    // --------------

    var openModal = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'partials/modal.html',
            controller: modalController,
            size: 'sm',
            scope: $scope,
            resolve: {
            }
        });

        modalInstance.result.then(function() {
            Game.startGame();
        });
    };

    // ---------
    // Functions
    // ---------

    $scope.selectSquare = function(index) {
        Game.setPlayerMove(index);
    };

    $scope.newGame = function() {
        Game.startGame();
    };

    $scope.drawMethod = function() {
        $scope.outcome = "It's a draw!";
        openModal();
    };

    $scope.loseMethod = function() {
        $scope.outcome = "Computer wins!";
        openModal();
    };
}

// -----------------
// Modal Controller
// -----------------

function modalController($scope, $modalInstance) {

    $scope.close = function() {
        $modalInstance.dismiss();
    };

    $scope.newGame = function() {
        $modalInstance.close();
    };

}