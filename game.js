let user = JSON.parse(localStorage.getItem("user")) || []
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []
console.log(user)
console.log(leaderboard)

let matrix_size = 7;
let user_matrix = [];
let game_matrix = [];

let difficulty = user.difficulty

let moral = 5

dificultySettings()

function dificultySettings () {
    if (difficulty == "Facil") {
        moral = 15
    } else if (difficulty == "Medio") {
        moral = 10
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/* Generate game*/

function generate_item(x) {
    let chance = getRandomInt(0, 100);
    if (x <= matrix_size - 3) {
        if (chance >= 90) {
            return "Soldier";
        } else if (chance >= 75) {
            return "Village";
        } else if (chance >= 60) {
            return "EnemyBoat1";
        } else {
            return "Florest";
        }
    } else {
        if (chance >= 90) {
            return "Soldier";
        } else if (chance >= 75) {
            return "Village";
        } else {
            return "Florest";
        }
    }
}

function create_full_boats() {
    for (let i = 0; i < game_matrix.length; i++) {
        for (let j = 0; j < game_matrix.length; j++) {
            if (game_matrix[i][j] == "EnemyBoat1") {
                try {
                    game_matrix[i][j + 1] = "EnemyBoat2"
                    game_matrix[i][j + 2] = "EnemyBoat3"
                } catch (error) {
                    game_matrix[i][j] = "Florest"
                }
            }
        }
    }
}

function validate_game() {
    let many_boats, many_soldier, many_village, many_florest = 0;
    let game_valid = true

    for (let i = 0; i < game_matrix.length; i++) {
        if (game_matrix[i].length > matrix_size) {
            game_valid = false
        }

        for (let j = 0; j < game_matrix.length; j++) {
            switch (game_matrix[i][j]) {
                case "EnemyBoat1":
                    if (game_matrix[i][j + 1] != "EnemyBoat2") {
                        game_valid = false;
                    }
                    if (game_matrix[i][j + 2] != "EnemyBoat3") {
                        game_valid = false
                    }
                    many_boats += 1;
                    break;
                case "Village":
                    many_village += 1;
                    break;
                case "Florest":
                    many_florest += 1;
                    break;
                case "Soldier":
                    many_soldier += 1;
                    break;
                case "EnemyBoat2":
                case "EnemyBoat3":
                    break;
                default:
                    console.log("Invalid option validating game, option: " + game_matrix[i][j])
                    break;
            }
        }
    }

    /*
    Add game rules.
    Like:
        if game not have at least 3 kids so game is invalid.
        if dont have a boat so game is invalid.
    */

    if (many_boats <= 0 ||
        many_soldier <= 0 ||
        many_village <= 0 ||
        many_florest <= 0) {
        game_valid = false;
    }

    return game_valid;
}

/* Start */

function create_clean_matrix(matrix) {
    for (let i = 0; i < matrix_size; i++) {
        matrix.push([])
        for (let j = 0; j < matrix_size; j++) {
            matrix[i].push(" ");
        }
    }

    console.log(matrix)
}

function generate_full_game_matrix() {

    /* 1- Generate random items */
    for (let i = 0; i < game_matrix.length; i++) {
        for (let j = 0; j < game_matrix[i].length; j++) {
            game_matrix[i][j] = generate_item(j);
        }
    }

    /* 2- Create Full boats */
    create_full_boats();

    /* 3- Validate Items (Boats use 3 spaces in a sequence) */
    let valid_game = validate_game()
    console.log("Valid game: " + valid_game)
}


// Main Function.

function create_game() {
    const table_game = document.getElementById("table-game")
    const button = document.getElementById("button")
    button.onclick = null

    /* Creating matrixes */
    create_clean_matrix(user_matrix)
    create_clean_matrix(game_matrix)

    generate_full_game_matrix()
    console.log(game_matrix)
    showGame()
    objectAmounts()
}

function showGame() {
    const grid = document.getElementById("table-game")
    const health = document.createElement("p")
    const idk = document.createElement("form")
    const skill = document.createElement("input")

    health.id = "moral"
    health.textContent = "Moral: " + moral

    idk.name = "form1"
    
    skill.type = "button"
    skill.onclick = function() {skillMode()}
    skill.id = "skill"
    skill.value = "Use Special"
    
    

    const squareSize = String(100/game_matrix.length + "% ")
    let squareNumber = "" 
    for (let i = 0; i < game_matrix.length; i++) {
        squareNumber = squareNumber + squareSize
    }

    grid.style.gridTemplateColumns = squareNumber
    grid.style.gridTemplateRows = squareNumber

    for (let i = 0; i < game_matrix.length; i++) {
        for (let j = 0; j < game_matrix[i].length; j++) {
            const box = document.createElement("div")
            box.classList = game_matrix[i][j]
            let identificator = String(i) + String(j)
            box.id = identificator
            let position = box.id
            box.onclick = function() {blockSelected(position)}
            grid.appendChild(box)
        }
    }
    const menu = document.getElementById("game-control")
    menu.appendChild(health)
    menu.appendChild(idk)
    idk.appendChild(skill)
    
}

let skillActive = 0

function skillAlreadyUsed() {
    skill.onclick = null
}

function skillMode() {
    skillActive += 1
    skillAlreadyUsed()
    
}


let soldierAmount = 0
let villageAmount = 0
let forestAmount = 0
let basesAmount = 0

function objectAmounts() {
    for (let i = 0; i < game_matrix.length; i++) {
        for (let j = 0; j < game_matrix[i].length; j++) {
            switch(game_matrix[i][j]) {
                case "Soldier":
                    soldierAmount += 1
                    break

                case "Village":
                    villageAmount += 1
                    break

                case "Florest":
                    forestAmount += 1
                    break

                default:
                    basesAmount += 1
                    break
            }
        }
    }
    console.log(soldierAmount)
    console.log(villageAmount)
    console.log(forestAmount)
    console.log(basesAmount)
}

let soldierHits = 0
let villageHits = 0
let florestHits = 0
let basesHits = 0

function blockSelected(value) {
    let area = [value]
    if (skillActive == 1) {
        area = powerHability(value)
        skillActive = 2
        const skill = document.getElementById("skill")
        skill.value = "Power was already used"
    }

    for (i in area) {
        const block = document.getElementById(area[i])
        block.onclick = null
        console.log(block.className)
        if (block.className == "Florest") {
            block.style.backgroundImage = "url('src/aerial-view-of-burnt-out-destroyed-forest-with-road.png')"
            moral -= 1
            const health = document.getElementById("moral")
            health.textContent = "Moral: " + moral
            florestHits += 1
        }
        if (block.className == "Village") {
            block.style.backgroundImage = "url('src/the-grounds-of-the-8th-division-in-the-cholon-area-of-saigon-takes-a-hit-from-two-750-pound.png')"
            moral -= 2
            const health = document.getElementById("moral")
            health.textContent = "Moral: " + moral
            villageHits += 1
        }
        
        if (block.className == "EnemyBoat1") {
            block.style.backgroundImage = "url('src/Camp-Halloway.png')"
            block.style.backgroundSize = String(1500/matrix_size + "px")
            block.style.backgroundPosition = "500px"
            block.style.backgroundPositionX = "left"
            moral += 1
            const health = document.getElementById("moral")
            health.textContent = "Moral: " + moral
            basesHits += 1
        }       

        if (block.className == "EnemyBoat2") {
            block.style.backgroundImage = "url('src/Camp-Halloway.png')"
            block.style.backgroundSize = String(1500/matrix_size + "px")
            block.style.backgroundPosition = "500px"
            block.style.backgroundPositionX = "center"
            moral += 1
            const health = document.getElementById("moral")
            health.textContent = "Moral: " + moral
            basesHits += 1
        }  
        
        if (block.className == "EnemyBoat3") {
            block.style.backgroundImage = "url('src/Camp-Halloway.png')"
            block.style.backgroundSize = String(1500/matrix_size + "px")
            block.style.backgroundPosition = "500px"
            block.style.backgroundPositionX = "right"
            moral += 1
            const health = document.getElementById("moral")
            health.textContent = "Moral: " + moral
            basesHits += 1
        }
        
        if (block.className == "Soldier") {
            block.style.backgroundImage = "url('src/ip11lp1basp61.png')"
            block.style.backgroundPositionX = "center"
            moral += 1
            const health = document.getElementById("moral")
            health.textContent = "Moral: " + moral
            soldierHits += 1
        }
        gameCondition()
    }
          
}

function powerHability(value) {
    if (user.Class == "Artilheiro") {
       return artilheiroPower(value)

    }

    else if (user.Class == "Bombardeiro") {
        return bombardeiroPower(value)
    }

    else if (user.Class == "Comandante de campo") {
        moral += 5
        return [value]
    }
}

function bombardeiroPower(value) {
    const pointNemo = value
    let area = []
    for (let i = 0; i < matrix_size; i++) {
        square = i + pointNemo[1]
        area.push(square)
    }

    return area
    }


function artilheiroPower(value) {
    let pointNemo = parseInt(value)
    let area
    if (value[0] == "1") {
        area = [
            String("0" + (pointNemo - 11)), String("0" + (pointNemo - 10)), String("0" + (pointNemo - 09)), 
            String(pointNemo - 01), String(pointNemo), String(pointNemo + 01),
            String(pointNemo + 09), String(pointNemo + 10), String(pointNemo + 11)
        ]
        
    } else if ((value[0] == "0") && (value[1] == "0")) {
        area = [
            String("0" + (pointNemo)), String("0" + (pointNemo + 01)),
            String(pointNemo + 10), String(pointNemo + 11)
        ]

    } else if ((value[0] == "0") && (value[1] == game_matrix.length-1)) {
        area = [
            String("0" + (pointNemo - 01)), String("0" + (pointNemo)), 
            String(pointNemo + 09), String(pointNemo + 10)
        ]

    } else if ((value[0] == game_matrix.length-1) && (value[1] == "0")) {
        area = [
            String(pointNemo - 10), String(pointNemo - 09), 
            String(pointNemo), String(pointNemo + 01)
        ]

    } else if ((value[0] == game_matrix.length-1) && (value[1] == game_matrix.length-1)) {
        area = [
            String(pointNemo - 11), String(pointNemo - 10), 
            String(pointNemo - 01), String(pointNemo)
        ]
    } else if (value[0] == "0") {
        area = [ 
            String("0" + (pointNemo - 01)), String("0" + (pointNemo)), String("0" + (pointNemo + 01)),
            String(pointNemo + 09), String(pointNemo + 10), String(pointNemo + 11)
        ]
    
    } else if (value[0] == game_matrix.length-1) {
        area = [
            String(pointNemo - 11), String(pointNemo - 10), String(pointNemo - 09), 
            String(pointNemo - 01), String(pointNemo), String(pointNemo + 01)
        ]
    
    } else if (value[1] == "0") {
        area = [
            String(pointNemo - 10), String(pointNemo - 09), 
            String(pointNemo), String(pointNemo + 01),
            String(pointNemo + 10), String(pointNemo + 11)
        ]

    } else if (value[1] == game_matrix.length-1) {
        area = [
            String(pointNemo - 11), String(pointNemo - 10),  
            String(pointNemo - 01), String(pointNemo), 
            String(pointNemo + 09), String(pointNemo + 10)
        ]
        
    } else {
        area = [
            String(pointNemo - 11), String(pointNemo - 10), String(pointNemo - 09), 
            String(pointNemo - 01), String(pointNemo), String(pointNemo + 01),
            String(pointNemo + 09), String(pointNemo + 10), String(pointNemo + 11)
        ]
    }
    console.log(area)
    return area
}

function gameCondition() {
    if ((soldierHits == soldierAmount) && (basesHits == basesAmount)) {
        user.points = moral
        alert("you win!!!")
        leaderboard.push(user)
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
        user = {}
        localStorage.setItem("user", JSON.stringify(user))
        window.location.replace("leaderboard.htm")
    }
    if (moral < 0) {
        alert("you lose")
        window.location.replace("leaderboard.htm")
    }
}

