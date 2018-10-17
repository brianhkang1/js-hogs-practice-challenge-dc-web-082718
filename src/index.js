document.addEventListener("DOMContentLoaded", function(){
  fetchHogs()
  submitListener()
})

function fetchHogs(){
  fetch(`http://localhost:3000/hogs`)
    .then(response => response.json())
    .then(hogs => hogs.forEach(hog => render(hog)))
}

function render(hog){
  let divElement = document.createElement("div")
  divElement.classList.add("hog-card")
  divElement.id = `hog-card-${hog.id}`
  document.querySelector("#hog-container").appendChild(divElement)

  let nameElement = document.createElement("h2")
  nameElement.innerText = hog.name
  divElement.appendChild(nameElement)

  let specialtyElement = document.createElement("p")
  specialtyElement.innerText = `Specialty: ${hog.specialty}`
  divElement.appendChild(specialtyElement)

  let weightElement = document.createElement("p")
  weightElement.innerText = `Some weird weight ratio: \n ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]}`
  divElement.appendChild(weightElement)

  let medalElement = document.createElement("p")
  medalElement.innerText = `Highest medal: ${hog["highest medal achieved"]}`
  divElement.appendChild(medalElement)

  let imgElement = document.createElement("img")
  imgElement.src = hog.image
  divElement.appendChild(imgElement)

  let greasedElement = document.createElement("div")
  if(hog.greased){
    greasedElement.innerHTML =
    `<input type="checkbox" id="checkbox-${hog.id}" value=${hog.greased} checked>
    <label for="checkbox-${hog.id}">Greased? </label>`
  } else {
    greasedElement.innerHTML =
    `<input type="checkbox" id="checkbox-${hog.id}" value=${hog.greased}>
    <label for="checkbox-${hog.id}">Greased? </label>`
  }
  divElement.appendChild(greasedElement)
  greasedElement.addEventListener("click", checkboxListener)

  let deleteElement = document.createElement("button")
  deleteElement.innerText = "Delete"
  deleteElement.id = `delete-btn-hog${hog.id}`
  divElement.appendChild(deleteElement)
  deleteElement.addEventListener('click', deleteHogListener)
}

function submitListener(){
  let hogForm = document.querySelector("#hog-form")
  hogForm.addEventListener("submit", function(event){
    event.preventDefault()
    let name = hogForm.querySelectorAll("input")[0].value
    let specialty = hogForm.querySelectorAll("input")[1].value
    let medal = hogForm.querySelectorAll("input")[2].value
    let weight = parseInt(hogForm.querySelectorAll("input")[3].value)
    let image = hogForm.querySelectorAll("input")[4].value
    let greased = hogForm.querySelectorAll("input")[5].checked

    let data = {name: name, specialty: specialty, "highest medal achieved": medal, "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": weight, image: image, greased: greased}

    postNewHog(data)
  })
}

function postNewHog(data){
  fetch(`http://localhost:3000/hogs`, {
    method: "POST",
    headers: {"Content-Type": "application/json", "Accept": "application/json"},
    body: JSON.stringify(data)
  }).then(response => response.json())
    .then(newHog => {
      render(newHog)
      document.querySelector("#hog-form").reset()
    })
}

function deleteHogListener(){
  let hogId = this.id.split("-hog")[1]

  fetch(`http://localhost:3000/hogs/${hogId}`, {method: "DELETE"})
    .then(deleteHog(hogId))
}

function deleteHog(hogId){
  document.querySelector("#hog-container").removeChild(document.querySelector(`#hog-card-${hogId}`))
}

function checkboxListener(){
  let hogId = event.target.id.split("-")[1]

  if (event.target.value === "false"){
    greased = true
    document.querySelector(`#checkbox-${hogId}`).value = "true"
  } else if (event.target.value === "true"){
    greased = false

    document.querySelector(`#checkbox-${hogId}`).value = "false"
  }

  let data = {greased: greased}
  patchGreased(data, hogId)
}

function patchGreased(data, hogId){
  fetch(`http://localhost:3000/hogs/${hogId}`, {
    method: "PATCH",
    headers: {"Content-Type":"application/json", "Accept":"application/json"},
    body: JSON.stringify(data)
  }).then(response => response.json())
    .then(updatedHog => console.log(updatedHog))
}
