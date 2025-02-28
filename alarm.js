var alarmPageHTML = 
`  
 <div id="alertPageParentWrapper">
   <div id="alertTimerBtnWrapper">
     <button id="setAlarmBtn">New Alarm</button>
   </div>
   <div id="allAlarmsWrapperDiv>
    
   </div>
 </div>
`

function addAlarmToggleListeners() {
  const allAlarmSections = document.querySelectorAll('.switch')
  allAlarmSections.forEach((alarm) => {
    alarm.onclick = function(e) {
      if (e.target.tagName !== 'SPAN') return;
      const id = e.target.id.slice(e.target.id.indexOf('-')+1)
      allAlarms[id].isActive = !allAlarms[id].isActive
      const nodeToEdit = document.querySelector(`#alarm-${id}-wrapper`).children[0]
      nodeToEdit.style.color = allAlarms[id].isActive ? 'black' : 'red'
      nodeToEdit.style.textDecoration = allAlarms[id].isActive ? 'none' : 'line-through'
      localStorage.setItem('alarms', JSON.stringify(allAlarms)) 
      
    }
})
}
function handleAlarmUpdateBtn(e) {
  let id = e.target.id
  if (!newAlarmTimer.value) {
    alert('invalid time')
    return
  }
  let alertTimeForTmr = false
  let timeInSeconds = inputValueToSeconds(newAlarmTimer.value)
  let isPM = newAlarmTimer.value.slice(0,2) > 11 ? 'PM' : 'AM'

  if (secondsPassedInDay > timeInSeconds) {
    alertTimeForTmr = true
    timeInSeconds = (86400 - (secondsPassedInDay - timeInSeconds))
  } else {timeInSeconds = (timeInSeconds - secondsPassedInDay )}
  
  
  let startTimeAPM = newAlarmTimer.value
  let startingHour = startTimeAPM.slice(0,2)
  let startingMins = startTimeAPM.slice(3)
      startingHour = startingHour == 0 ? '12' : startingHour
      startingHour = startingHour > 12 ? String(startingHour - 12) : startingHour
      startingHour = Number(startingHour)
      startingHour+=':'
  const timeObj = {countdownTimeSecs: timeInSeconds,
                   countdownTimeHrs: timeInSeconds / 3600,
                  startTimeAMPM: startingHour + startingMins, 
                  isForTmr: alertTimeForTmr, isPM:isPM , isActive: true,
                  index: allAlarms.length
                  };
        
  allAlarms.push(timeObj) 
  bigDaddyWrapper.innerHTML = renderAlarmsHTML()
  addDeleteAlarmListeners()
  addAlarmToggleListeners()
  // setTimeout(() => updateAlarmsLIVE_HR_MIN(), 1550)

  closeModal()
  localStorage.setItem('alarms', JSON.stringify(allAlarms)) 

}

function renderAlarmsHTML() {
  let format = ''
  bigDaddyWrapper.innerHTML = ''
  allAlarms.forEach((alarm,i) => {
   format+= `
     <section id=alarm-${i}-wrapper >
      <h1 style="color: ${alarm.isActive ? 'black' : 'red'};
                 text-decoration:${alarm.isActive ? 'none' : 'line-through'};">alarm <p class="ampmSPAN" id="AmpmAlarmStartTime-${i}">${alarm.startTimeAMPM} ${alarm.isPM}</p></h1>
      <div class="alarmsWrapper">
        <label class="switch" id="alarmLabel-${i}">
          <input type="checkbox" id="alarmInput-${i}" ${alarm.isActive ? 'checked' : ''}>
          <span class="slider round" id="alarmSpan-${i}"></span>
        </label>
        <button class="alarmDeleteBtn" id="deleteAlarm-${i}">X</button>
      </div>
     </section>
   
   `
  })

  return format
}
function addDeleteAlarmListeners() {
  const allAlarmDeleteBtns = document.querySelectorAll('.alarmDeleteBtn')
  allAlarmDeleteBtns.forEach((btn) => {
     btn.onclick = function() {
        const index = this.id.slice(this.id.indexOf('-')+1)
        allAlarms.splice(index,1)
        document.querySelector(`#alarm-${index}-wrapper`).remove()
        localStorage.setItem('alarms', JSON.stringify(allAlarms))
     }
  })
}
function updateAlarmsLIVE_HR_MIN() {
  const date = new Date()
  let exactTime = date.toLocaleString([], {
        hour: "numeric",
        minute: "numeric" 
    });
  
   for (let i = 0; i < allAlarms.length; i++) {
       const currentAlarm = document.querySelector(`#AmpmAlarmStartTime-${i}`)
       if (exactTime == currentAlarm.textContent && document.querySelector(`#alarmInput-${i}`).checked) {
          // alert('ALARM RINGING FOR ' + currentAlarm.textContent + ' ALARM')
          currentAlarm.parentElement.style.color = 'red'
          currentAlarm.parentElement.style.textDecoration = 'line-through'
          allAlarms[i].isActive = false
          document.querySelector(`#alarmLabel-${i}`).remove()
          localStorage.setItem('alarms', JSON.stringify(allAlarms))
          return void 0
       }
   }

}
taskSwitcherHTML.onclick = highlightCurrentUserChoice
alarmTabHTML.onclick = function handleAlarmTabClick(e) {
  if (currentPageDisplayed !== 'alarms') {
    currentPageDisplayed = 'alarms'
    savedCurrentTasksHTML = bigDaddyWrapper.innerHTML
    
    bigDaddyWrapper.innerHTML = renderAlarmsHTML()
    alarmSectionWrapper.innerHTML = alarmPageHTML
    addDeleteAlarmListeners()
    addAlarmToggleListeners()
  }
    setAlarmBtn.onclick = (e) => openModal(e.target.id)
    intervals = clearInterval(intervals)
    intervals = setInterval(displayHeaderExactTime,1000)
  
}

tasksTabHTML.onclick = function handleTaskTabClick(e) {
  if (currentPageDisplayed != 'tasks') {
    currentPageDisplayed = 'tasks'
    // highlightCurrentUserChoice() 
    alarmSectionWrapper.innerHTML = ''
    savedCurrentAlarmsHTML = bigDaddyWrapper.innerHTML
    renderTasksHTML()
  }

    intervals = clearInterval(intervals)
    intervals = setInterval(updateTime, 1000)
}

function highlightCurrentUserChoice() {
  const isTasks = currentPageDisplayed == 'tasks'
  tasksTabHTML.style.backgroundColor = isTasks ? 'cyan':'white'
  alarmTabHTML.style.backgroundColor = isTasks ? 'white':'cyan'

}
