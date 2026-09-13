//Puxa historico
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []
orderLeaderboard()
localStorage.setItem("leaderboard", JSON.stringify(leaderboard))

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

// Faz a lista

function appearList() {
    const area = document.getElementById("LeaderboardArea")
    for (let i = 0; i < leaderboard.length; i++) {
        const position = document.createElement("p")
        position.classList = "position"
        position.id = i+1
        position.textContent = i+1 + ") " + leaderboard[i].username + ", Classe: " + leaderboard[i].Class + ", Pontos: " + leaderboard[i].points + ", Dificuldade: " + leaderboard[i].difficulty
        area.appendChild(position)
    }
    
}
appearList()