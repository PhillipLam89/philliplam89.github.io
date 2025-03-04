taskSwitcherHTML.onclick = highlightCurrentUserChoice // currentPageDisplayed would be already updated as it would be called first by the children's onclicks aka event bubbling

alarmTabHTML.onclick = () => 
  currentPageDisplayed != 'alarms' && handleAlarmsPageSwitch()

tasksTabHTML.onclick = () => 
      currentPageDisplayed != 'tasks' && handleTasksPageSwitch()


function handleAlarmsPageSwitch() {
  
    currentPageDisplayed = 'alarms'
    savedCurrentTasksHTML = bigDaddyWrapper.innerHTML
  
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
    alarmSectionWrapper.innerHTML = ''
    renderTasksHTML()
    window.bigDaddyWrapper.onclick = ''
    intervals = clearInterval(intervals)
    intervals = setInterval(updateTime, 1000)
}  
function highlightCurrentUserChoice() {
  const isTasks = currentPageDisplayed == 'tasks'
  tasksTabHTML.style.backgroundColor = isTasks ? 'cyan':'white'
  alarmTabHTML.style.backgroundColor = isTasks ? 'white':'cyan'
}