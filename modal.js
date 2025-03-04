const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  alarmSound.pause()
  alarmSound.currentTime = 0
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);


document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const defaultModalHTML =  
 ` <div class="flex"> 
          <button id="modalCloseBtn" class="btn-close">⨉</button>
        </div>

        <div id="taskParentWrapper">
           <label for="timeInputStart">From</label>
           <input id="timeInputStart" type="time">
           <br>
           <label for="timeInputEnd">To</label>     
           <input id="timeInputEnd" type="time">
           <br>
           <label id="currentGoal">Goal:</label>
           <input id="currentGoalInput">
           <br>
           <br>
           <label for="newPostOption">Add as new post</label> 
           <input type="checkbox" id="newPostOption">
           <button id="updateBtn" class="btn">Update!</button>
   </div>`

const infoModalHTML =  
` <div class="flex"> 
        <button id="modalCloseBtn" class="btn-close">⨉</button>
  </div>

  <div id="taskParentWrapper">
       <li>Tasks cant be set more than 24 hrs apart</li>
       <li>Cannot delete all tasks </li>
       <li>Tasks in progress has remaining timers</li>
       <li>Tasks ~5 mins away will blink <span style="color: red;">red</span> </li>
       <li>Task more than 1 hr away will have <span style="color: green;">green countdown</span></li>
       <li>Task less than 1 hr away will have  <span style="color: red;">red countdown</span></li>
   </div>`


const setAlarmModal = 
 ` <div class="flex"> 
        <button id="modalCloseBtn" class="btn-close">⨉</button>
   </div>
   <br>
   <div id="taskParentWrapper">
      <label for="newAlarmTimer">New Alarm</label>
      <input id="newAlarmTimer" type="time">
      <br>
      <br>
      <button id="updateBtnAlarms" class="btn">Update!</button>
   </div>`


var allAlarms = [];



allAlarms = JSON.parse(localStorage.getItem('alarms')) || allAlarms

function createAlarmPopUp(index) {
  let popUpHTML  = 
  `<div class="flex"> 
        <button id="modalCloseBtn" class="btn-close">⨉</button>
   </div>
   <br>
  <section>
     <div id="alarmTimeDisplayDiv">9:10 ALARM RINGING</div>
     <button id="alarmOkBtn">OK</button>
  </section>
  `
  setTimeout(() => {
    alarmTimeDisplayDiv.textContent = 
        allAlarms[index].startTimeAMPM + ' ' + allAlarms[index].isPM + ' ALARM IS RINGING!';
  }, 2);
  
  return popUpHTML
}

 
const openModal = function (EventPassedIn = false, index) {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  if (EventPassedIn == 'alarmRang') {
    modal.innerHTML = createAlarmPopUp(index)
    window.modalCloseBtn.onclick = closeModal
    window.alarmOkBtn.onclick = closeModal
    alarmSound.loop = true
    alarmSound.play()
    return
  }
  
  if (EventPassedIn == 'setAlarmBtn')  {
    modal.innerHTML = setAlarmModal
    window.modalCloseBtn.onclick = closeModal
    updateBtnAlarms.onclick = handleAlarmUpdateBtn
    return
  }

  modal.innerHTML = EventPassedIn ? infoModalHTML : defaultModalHTML
  if(window.updateBtn) updateBtn.onclick  = updateBtnHandler;

  window.modalCloseBtn.onclick = closeModal
}
infoBtn.onclick =  openModal //onclick will auto pass in Event, makin EventPassedIn true
// open modal event
