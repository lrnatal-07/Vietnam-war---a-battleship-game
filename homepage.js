
//Puxa historico
let user 
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []
orderLeaderboard()
console.log(leaderboard)

// salva historico

function saveUser() {
localStorage.setItem("user", JSON.stringify(user))


}

//Manda informacoes do formulario
function sendInfo() {
    const name = document.getElementById('nameTxt').value
    const re = /^\w/
    if (re.test(name) == false) {
        alert("Digite um nome")
        return false
    }
    const playerClass = document.getElementById("playerClass").value
    const difficulty = document.getElementById("difficulty").value
    user = {
    "username": name,
    "Class" : playerClass,
    "points" : 0,
    "difficulty" : difficulty
    }

    console.log(user)
    saveUser()
    //game()
}

//limpa o storage

function clearInfo() {
    localStorage.clear()
    playlist = []
}

//Organiza a lista

function orderLeaderboard() {
    let orderedleaderboard = []
    let len = leaderboard.length
    for (let t = 0; t < len; t++) {
        if (leaderboard == []) {
            break
        } else {
            let highest = leaderboard[0]
            let index = 0
            for (let i = 0; i < leaderboard.length; i++) {
                if (leaderboard[i].points > highest.points) {
                highest = leaderboard[i]
                index = i
                }
            }
        orderedleaderboard.push(highest)
        leaderboard.splice(index, 1)
        }
    }
    leaderboard = orderedleaderboard
    console.log(leaderboard);
}

//function game() {
   // window.location.replace("game.html")
//}