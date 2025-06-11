let allNotesArray = []
let currentEditingObj = {}
window.userInputForm.onsubmit = function(e) {
    e.preventDefault()
    const submittedNote = e.target.children[0].value
    e.target.children[0].value = ''
    if (!submittedNote.trim()) {
        alert('cant be empty')
        return
    }

    storeNewNote(submittedNote)
    renderNewNote()
}

window.clearAll.onclick = function() {
    window.allNotesContainer.innerHTML = ''
    this.disabled = true
    allNotesArray = []
}

window.allNotesContainer.onclick = handleEditDeleteOptions

function handleEditDeleteOptions(e) {
    e.target.className === 'deleteBtn' && handlePostDelete(e)
    e.target.id === 'editBtn' && handleEditPost(e)

}

function handleEditPost(e) {
   const stickyParentDiv = e.target.parentElement.parentElement
   const SpanElement = e.target.parentElement.nextElementSibling.children[0]
    if (e.target.textContent ==='Edit') {
        const oldText = e.target.parentElement.nextElementSibling.children[0].textContent
        currentEditingObj  = allNotesArray.find(note => note.post === oldText)
        
        e.target.textContent = 'Done ✔️'      
        SpanElement.setAttribute('contenteditable', true)
        SpanElement.style.border = '4px solid forestgreen'
        return
    }
    
    if (e.target.textContent.includes('Done')) {
    
        e.target.textContent = 'Edit'
        SpanElement.setAttribute('contenteditable', false)
        SpanElement.style.border = 'none'

    
        const newText = e.target.parentElement.nextElementSibling.children[0].textContent
         currentEditingObj.post = newText
         SpanElement.setAttribute('contenteditable', false)
         currentEditingObj.postDay = "Edited On: "+ new Date().toLocaleDateString('en-US', 
                            { weekday: 'short' })
         currentEditingObj.postDate = new Date().toLocaleDateString()                             
         currentEditingObj.postTime = new Date().toLocaleTimeString()

         stickyParentDiv.querySelector(`#postDay`).textContent = currentEditingObj.postDay
         stickyParentDiv.querySelector(`#postDate`).textContent = currentEditingObj.postDate
         stickyParentDiv.querySelector(`#postTime`).textContent = currentEditingObj.postTime
    }
}

function handlePostDelete(e) {
    if (e.target.className !== 'deleteBtn') return 

   let selectedText = e.target.parentElement.nextElementSibling.textContent
   console.log(selectedText)
       selectedText = selectedText.slice(selectedText.indexOf(' ')+1)
   e.target.parentElement.parentElement.remove()
   const removalIndex = allNotesArray.findIndex(post => 
                        post.post === selectedText)
   allNotesArray.splice(removalIndex,1)
   if (!allNotesArray.length) window.clearAll.disabled = true
   
}

function storeNewNote(note) {
    const noteObj = {}
          noteObj.post = note
          noteObj.postDay = new Date().toLocaleDateString('en-US', 
                            { weekday: 'short' })
          noteObj.postDate = new Date().toLocaleDateString()                             
          noteObj.postTime = new Date().toLocaleTimeString()
    allNotesArray.push(noteObj)
   
}

function renderNewNote() {
 
   const newPost = allNotesArray.at(-1)
   const str = 
    `
    <div  class=stickyNote >
       <section class="postBtnWrapper">
            <button id="editBtn">Edit</button>
            <button class=deleteBtn >X</button>
        </section>
        <p>note: <span contenteditable=false>${newPost.post}</span></p>
        
        <hr>
        <p id="postDay">${newPost.postDay}</p>
        <p id="postDate">${newPost.postDate}</p>
        <p id="postTime">${newPost.postTime}</p>
    </div>
    `
 
   window.allNotesContainer.insertAdjacentHTML('beforeend', str)
   window.clearAll.disabled = false
}