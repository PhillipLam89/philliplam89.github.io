taskSwitcherHTML.onclick = highlightCurrentUserChoice // currentPageDisplayed would be already updated as it would be called first by the children's onclicks aka event bubbling

alarmTabHTML.onclick = () => 
  currentPageDisplayed != 'alarms' && handleAlarmsPageSwitch()

tasksTabHTML.onclick = () => 
      currentPageDisplayed != 'tasks' && handleTasksPageSwitch()

stopwatchHTML.onclick = () => 
  (currentPageDisplayed != 'stopwatch') && activateStopwatchPage(); 
 
function activateStopwatchPage() {
  currentPageDisplayed = 'stopwatch'

  bigDaddyWrapper.innerHTML = `<h1 id="swTimeDisplayDiv">0:00.00</h1>`
  alarmSectionWrapper.innerHTML = `
  <section id="stopwatchBtnWrapper">
    <button id="resetStopwatchBtn">Reset</button>
    <button id="stopwatchStartBtn">Start</button>
  </section`

  intervals = clearInterval(intervals)
  intervals = setInterval(displayHeaderExactTime, 1000)
  
  window.stopwatchStartBtn.onclick = handleStopwatchActions
  window.resetStopwatchBtn.onclick = handleResetStopwatch


  function handleStopwatchActions() {
    const tempInterval = function() {
      return setInterval(function() {    
         currentStopwatchTime = currentStopwatchTime + 1
         window.swTimeDisplayDiv.textContent = msToTime(currentStopwatchTime)
       } ,10)
   }

   if (this.textContent == 'Pause') {
       clearInterval(isStopWatchRunning)
       this.textContent = 'Resume'
       return
   } 
   if (this.textContent == 'Resume') {
         isStopWatchRunning = tempInterval()
         this.textContent = 'Pause'
   }
   if (isStopWatchRunning) {        
     return
   }

   isStopWatchRunning = tempInterval()
   this.textContent = 
          this.textContent ===
                        'Start' ? 'Pause' : 'Start';
    
  }
  function handleResetStopwatch() {
    if (window.stopwatchStartBtn.textContent !== 'Start') {
      clearInterval(isStopWatchRunning)
      isStopWatchRunning = null
      currentStopwatchTime = 0
      window.swTimeDisplayDiv.textContent = "0:00.00"
      window.stopwatchStartBtn.textContent = 'Start'
    
    }
  }

}
function msToTime(duration) {
  var milliseconds = parseInt((duration%100))
      , seconds = parseInt((duration/100)%60)
      , minutes = parseInt((duration/(100*60))%60)
      , hours = parseInt((duration/(1000*60*60))%24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  if(hours == 0) hours = ''
  else hours = hours + ":"
  return hours + minutes + ":" + seconds + "." + milliseconds;
}
function handleAlarmsPageSwitch() {
  
    currentPageDisplayed = 'alarms'
    isStopWatchRunning = clearInterval(isStopWatchRunning)
    bigDaddyWrapper.innerHTML = renderAlarmsHTML()
    alarmSectionWrapper.innerHTML = alarmPageHTML
    if (!window.bigDaddyWrapper.onclick) {
      window.bigDaddyWrapper.onclick = attachAlarmClickListeners
    }

    setAlarmBtn.onclick = (e) => openModal(e.target.id)
    intervals = clearInterval(intervals)
    intervals = setInterval(displayHeaderExactTime,1000)
}
function handleTasksPageSwitch() {
    currentPageDisplayed = 'tasks'
    isStopWatchRunning = clearInterval(isStopWatchRunning)
    alarmSectionWrapper.innerHTML = ''
    renderTasksHTML()
    window.bigDaddyWrapper.onclick = ''
    intervals = clearInterval(intervals)
    intervals = setInterval(updateTime, 1000)
}  
function highlightCurrentUserChoice() {
  [...taskSwitcherHTML.children].forEach(tab => {
    tab.style.backgroundColor = 'white'
    if (tab.textContent.toLocaleLowerCase() === currentPageDisplayed) {
      tab.style.backgroundColor = 'cyan'
    }
  })
}
