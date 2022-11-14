(function() {
    var allText;
    var gameName = document.getElementById("levels");
    var actualLevelOption = gameName.querySelector('[value="' + gameName.value + '"]');
    var customGame = document.getElementById('customGame');
    var defaultRoute;
    var actualLevel = 0;

    function showGameLevel(event) {
        actualLevel++;
        if (event) {
            actualLevel = 1;
        } else if (Number(actualLevelOption.getAttribute('data-level')) < actualLevel) {
            actualLevel = 1;
            var nextOption = actualLevelOption.nextElementSibling;
            if (nextOption) {
                nextOption.selected = true;
            }
        }
        defaultRoute = 'Levels/' + gameName.value + '/' + actualLevel + '.txt';
        readTextFile(defaultRoute);
    }

    function readTextFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    allText = rawFile.responseText;
                    createBoardGame();
                }
            }
        }
        rawFile.setRequestHeader('Access-Control-Allow-Origin', '*');
        rawFile.send();
    }

    customGame.addEventListener('change', function (event) {
        var input = event.target;

        var reader = new FileReader();
        reader.onload = function () {
            allText = reader.result;
            createBoardGame();
        };
        reader.readAsText(input.files[0]);
    });

    var gameBoard;

    var createBoardGame = function () {
        gameBoard = [];
        var game = allText.split("\n");
        for (var i = 0; i < game.length; i++) {
            gameBoard.push(game[i].split(""));
        }
        drawGame();
    }

    function drawGame() {
        var tbody = document.querySelector("#table tbody");
        var tableLength = tbody.children.length - 1;
        for (var k = tableLength; k >= 0; k--) {
            tbody.deleteRow(k);
        }
        var tr = document.createElement('tr');
        tbody.appendChild(tr);
        var td;
        for (var i = 0; i < gameBoard.length; i++) {
            for (var j = 0; j < gameBoard[i].length; j++) {
                td = document.createElement('td');
                tr.appendChild(td);
                var img = document.createElement('img');
                img.src = getImage(gameBoard[i][j]);
                td.appendChild(img);
                if (gameBoard[i][j] === '.' || gameBoard[i][j] === '*' || gameBoard[i][j] === "+") {
                    td.setAttribute('data-hole', 'true');
                }
                td.setAttribute('data-x', i);
                td.setAttribute('data-y', j);
            }
            tr = document.createElement('tr');
            tbody.appendChild(tr);
        }
    }

    function getImage(element) {
        if (element === "#") {
            return 'http://birrell.org/andrew/sokoban/image.php?img=wall&w=240&h=240&x=240&y=0&r=90';
        }
        else if (element === ".") {
            return  'http://birrell.org/andrew/sokoban/image.php?img=blank';
        }
        else if (element === "*") {
            return 'http://birrell.org/andrew/sokoban/image.php?img=box';
        }
        else if (element === "@") {
            return 'http://birrell.org/andrew/sokoban/image.php?img=man';
        }
        else if (element === "+") {
            return 'http://birrell.org/andrew/sokoban/image.php?img=man';
        }
        else if (element === "$") {
            return  'http://birrell.org/andrew/sokoban/image.php?img=box';
        }
        else if (element === " ") {
            return  'http://birrell.org/andrew/sokoban/image.php?img=blank';
        }
        else {
            return 'http://birrell.org/andrew/sokoban/image.php?img=blank';
        }
    }

    function move(direction) {
        var newboard = [];
        var moveisvalid = false;

        var sokomanposX = 0;
        var sokomanposY = 0;
        var directionX = 0;
        var directionY = 0;

        for (var i = 0; i < gameBoard.length; i++) //game board into two dimensional array
        {
            for (var j = 0; j < gameBoard[i].length; j++) {
                if (gameBoard[i][j] === "@" || gameBoard[i][j] === "+") {
                    sokomanposX = i;
                    sokomanposY = j;
                    break;
                }
            }
        }

        newboard = gameBoard;

        switch (direction) {
            case "left":
                directionY = -1;
                break;
            case "right":
                directionY = 1;
                break;
            case "up":
                directionX = -1;
                break;
            case "down":
                directionX = 1;
                break;

        };

        var charatoldplace = newboard[sokomanposX][sokomanposY];
        var charatnewplace = newboard[sokomanposX + directionX][sokomanposY + directionY];
        var charafternextplace;

        if (charatnewplace == " "	//checking if move is valid
            || charatnewplace == "."
            || charatnewplace == "$"
            || charatnewplace == "*") {
            moveisvalid = true;

            charafternextplace = newboard[sokomanposX + directionX * 2][sokomanposY + directionY * 2];
            if ((charatnewplace == "$" || charatnewplace == "*")
                && (charafternextplace == "#"
                    || charafternextplace == "$"
                    || charafternextplace == "*"))
                moveisvalid = false;
        }

        if (moveisvalid) {
            switch (charatnewplace) {
                case " ":
                    charatnewplace = "@";
                    break;
                case ".":
                    charatnewplace = "+";
                    break;
                case "$":
                    if (charafternextplace == " ")
                        charafternextplace = "$";
                    if (charafternextplace == ".")
                        charafternextplace = "*";
                    charatnewplace = "@";
                    break;
                case "*":
                    if (charafternextplace == " ")
                        charafternextplace = "$";
                    if (charafternextplace == ".")
                        charafternextplace = "*";
                    charatnewplace = "+";
                    break;

            };
            switch (charatoldplace) {
                case "@":
                    charatoldplace = " ";
                    break;
                case "+":
                    charatoldplace = ".";
                    break;

            };

            newboard[sokomanposX][sokomanposY] = charatoldplace;
            newboard[sokomanposX + directionX][sokomanposY + directionY] = charatnewplace;
            newboard[sokomanposX + directionX * 2][sokomanposY + directionY * 2] = charafternextplace;

            gameBoard = newboard;
        }
        updateGame(sokomanposX, sokomanposY, directionX, directionY);
        if (checkWinCondition()) {
            alert("Win");
            showGameLevel();
        }
    }

    function updateGame(sokomanposX, sokomanposY, directionX, directionY) {
        var sokoman = document.querySelector("[data-x='" + sokomanposX + "'][data-y='" + sokomanposY + "'] img");
        sokoman.src = getImage(gameBoard[sokomanposX][sokomanposY]);

        var newSokoman = document.querySelector("[data-x='" + (sokomanposX + directionX) + "'][data-y='" + (sokomanposY + directionY) + "'] img");
        newSokoman.src = getImage(gameBoard[sokomanposX + directionX][sokomanposY + directionY]);

        var afterNextReplace = document.querySelector("[data-x='" + (sokomanposX + directionX * 2) + "'][data-y='" + (sokomanposY + directionY * 2) + "'] img");
        if (afterNextReplace) {
            afterNextReplace.src = getImage(gameBoard[sokomanposX + directionX * 2][sokomanposY + directionY * 2]);
        }
    }

    function checkKey(e) {
        e = e || window.event;
        if (e.keyCode == '37')
            move("left");
        if (e.keyCode == '38')
            move("up");
        if (e.keyCode == '39')
            move("right");
        if (e.keyCode == '40')
            move("down");
    }

    var checkWinCondition = function () {
        for (var i = 0; i < gameBoard.length; i++) {
            for (var j = 0; j < gameBoard[i].length; j++) {
                if (gameBoard[i][j] === '$') {
                    return false;
                }
            }
        }
        return true;
    }
    gameName.addEventListener('change', showGameLevel);
    document.addEventListener('keydown', checkKey);
    showGameLevel();
})();
