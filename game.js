function AppViewModel() {
    let self = this;
    self.player1 = {
        id: 1,
        name: ko.observable('Player 1'),
        disks: ko.observable(21),
        color: "red"
    };

    self.player2 = {
        id: 2,
        name: ko.observable('Player 2'),
        disks: ko.observable(21),
        color: "yellow"
    };
    self.place = [0, 1, 2, 3, 4, 5, 6]
    self.board = ko.observableArray([]);
    self.gameOver = ko.observable(0);
    self.activeplayer = ko.observable(self.player1);
    self.lastTurn = ko.observable();
    self.message = ko.observable();
    self.makeBoard = function() {
        self.board([]);
        var tmp = 0;
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 7; j++) {
                self.board.push(ko.observable(tmp));
                tmp = tmp + 1;
            }
        }
    }
    self.makeBoard();

    self.placedisk = function(data) {
        var ix = data;
        for (var i = 0; i < 6; i++) {
            ix = (i * 7) + data;
            if (!Number.isInteger(self.board()[ix]())) {
                ix = ix - 7;
                break;
            }
        }
        if (ix >= 0) {
            self.board()[ix](self.activeplayer().color);
            if (self.activeplayer().id == 1) {
                self.lastTurn(self.player1.name());
                self.activeplayer(self.player2);
                self.player1.disks(self.player1.disks() - 1);
            } else {
                self.lastTurn(self.player2.name());
                self.activeplayer(self.player1);
                self.player2.disks(self.player2.disks() - 1);
            }
            //check for the winner
            self.checkwin();
            if (self.player1.disks() + self.player2.disks() == 0) {
                self.noMoves();
                return;
            }
        }
    }

    self.checkwin = function() {
        let total = 41; // total index 0-41
        //check for unique vaules
        function isSame(arr) {
            let outputArray = Array.from(new Set(arr))
            return (outputArray.length == 1)
        }

        //check for the disks position from bottom to top (until 21)
        for (var i = total; i >= 21; i--) {
            if (!Number.isInteger(self.board()[i]())) {

                //check horizontal
                if (i % 7 >= 3) {
                    let c_hor = [self.board()[i](), self.board()[i - 1](), self.board()[i - 2](), self.board()[i - 3]()];
                    if (isSame(c_hor)) {
                        self.declareWinner();
                        break;
                    }
                }
                //check vertical
                let c_ver = [self.board()[i](), self.board()[i - 7](), self.board()[i - 14](), self.board()[i - 21]()];
                if (isSame(c_ver)) {
                    self.declareWinner();
                    break;
                }
                // check left digonal
                if (i % 7 >= 3 && i >= 24) {
                    let c_ldig = [self.board()[i](), self.board()[i - 8](), self.board()[i - 16](), self.board()[i - 24]()];
                    if (isSame(c_ldig)) {
                        self.declareWinner();
                        break;
                    }
                }
                // check right digonal
                if (i % 7 <= 3) {
                    let c_rdig = [self.board()[i](), self.board()[i - 6](), self.board()[i - 12](), self.board()[i - 18]()];
                    if (isSame(c_rdig)) {
                        self.declareWinner();
                        break;
                    }
                }
            }
        }
    }

    self.declareWinner = function() {
        self.gameOver(1);
        self.message("Congratulations.");
        self.lastTurn(self.lastTurn() + ' Wins!')
        $("#myModal").modal();
    }

    self.noMoves = function() {
        self.gameOver(1);
        self.lastTurn("Draw");
        self.message("Both played well.");
        $("#myModal").modal();
    }

    self.replay = function() {
        self.lastTurn('');
        self.activeplayer(self.player1);
        self.makeBoard();
        self.player1.disks(21);
        self.player2.disks(21);
        self.gameOver(0);
    }
}

let appViewModel = new AppViewModel();
ko.applyBindings(appViewModel, $('#connectfour')[0]);