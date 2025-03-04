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
var alarmSound = new Audio('./alarmSound.mp3')

function attachAlarmClickListeners(e) { //put on parent div
  const index = e.target.id.slice(e.target.id.indexOf('-')+1)
   if (e.target.tagName == 'BUTTON') { //to delete an alarm
    allAlarms.splice(index,1)
    document.querySelector(`#alarm-${index}-wrapper`).remove()
    localStorage.setItem('alarms', JSON.stringify(allAlarms))
    return
   } 
    if (e.target.tagName !== 'SPAN') return;
    allAlarms[index].isActive = !allAlarms[index].isActive //to toggle alarms on/off
    const nodeToEdit = document.querySelector(`#alarm-${index}-wrapper`).children[0]
    nodeToEdit.style.color = allAlarms[index].isActive ? 'black' : 'red'
    nodeToEdit.style.textDecoration = allAlarms[index].isActive ? 'none' : 'line-through'
    localStorage.setItem('alarms', JSON.stringify(allAlarms)) 
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

  closeModal()
  localStorage.setItem('alarms', JSON.stringify(allAlarms)) 

}

function renderAlarmsHTML() {
  let format = ''
  bigDaddyWrapper.innerHTML = ''
  allAlarms = allAlarms.sort((a,b) => a.countdownTimeSecs - b.countdownTimeSecs)
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

function updateAlarmsLIVE_HR_MIN() {
  const date = new Date()
  let exactTime = date.toLocaleString([], {
        hour: "numeric",
        minute: "numeric" 
    });
  
   for (let i = 0; i < allAlarms.length; i++) {
       const currentAlarm = document.querySelector(`#AmpmAlarmStartTime-${i}`)
       const isVerified = exactTime == currentAlarm?.textContent && 
                          document.querySelector(`#alarmInput-${i}`)?.checked;
       if (isVerified ) {
          currentAlarm.parentElement.style.color = 'red'
          currentAlarm.parentElement.style.textDecoration = 'line-through'
          allAlarms[i].isActive = false
          document.querySelector(`#alarmLabel-${i}`).remove()          
          localStorage.setItem('alarms', JSON.stringify(allAlarms))
          openModal('alarmRang', i)
          break;
       }
   }

}
