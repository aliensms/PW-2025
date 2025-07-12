
const { response } = require("express")

console.log("oi")

function deletarMajor(id){
    fetch(`/majors/remove/${id}`, {method:'POST'}).then(response => {
        if (response.ok){
            console.log("great sucess")
            window.location.reload();
        } else {
            console.log('erro ao remover')
            console.log(response.status)  
        }
    })
}

function deletarUser(id){
    fetch(`/users/remove/${id}`, {method:'POST'}).then(response => {
        if (response.ok){
            console.log("great sucess")
            window.location.reload();
        } else {
            console.log('erro ao remover')
            console.log(response.status)  
        }
    })
}


