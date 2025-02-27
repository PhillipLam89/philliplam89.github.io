function updateToNewDay() { // only called in updateTime when appropriate
    const date = new Date()        
   
    const fullDate = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };

    currentDayNameHTML.textContent =
        `${date.toLocaleString("en-US", {weekday: "long"})}`
    currentDateHTML.textContent = 
        `${date.toLocaleString('en-US', fullDate)}`
}

function renderTasksHTML() {
    let format = ``
    allTasks = allTasks.sort((a,b) => a.startTimeSecs - b.startTimeSecs)
  
    allTasks.forEach((task,i)=> {
        task.taskDurationSecs = task.endTimeSecs - task.startTimeSecs
        task.index = i

         format += `        
    <section id="tasksWrapper-${task.index}">
         <button class="deleteBtn" id="removeTask-${task.index}">X</button>
          <div>
           <span class="taskStatusHTML" id="task-${task.index}-status"></span>
          
             <p id="task-${task.index}-startTimeAMPM">${task.startTimeAMPM}<br></p><p class="timeDash">to</p>
             <p id="task-${task.index}-endTimeAMPM">${task.endTimeAMPM}</p>
          
          </div>
          <div>
            <h2>Goal (${secondsToAmPm(task.taskDurationSecs, 'CONVERT TO HRS', task.index)} 
                <span id="task-${i}-hrsOrMins"  >hrs</span>
                )
            
            </h2>
           
            <p id="goalTextHTML-${task.index}">${task.Goal}</p>
         
          </div>
          <div>
            <h5 id="timeDivTask-${task.index}">Countdown</h5>
            <p class="countdownTimer" id="task-${task.index}-countdown"></p>
          </div>
          <div class="editBtn" id="editBtnDiv-${task.index}">
            <button id="editBtn-${task.index}">Edit/Add</button>
          </div>

    </section>
    
`          
    bigDaddyWrapper.innerHTML = ''
    bigDaddyWrapper.innerHTML = format

    attachBtnListeners()
    function attachBtnListeners() {
        const addDeleteListeners = () => {
            const allDeleteBtns = this.document.querySelectorAll('.deleteBtn')
    
            allDeleteBtns.forEach(btn => btn.onclick = function(e) {
                 const deleteID = e.target.id.slice(e.target.id.indexOf('-')+1)
              
                 allTasks = allTasks.filter(task => task.index != deleteID)             
                 renderTasksHTML()
             
            })  
        }
        addDeleteListeners()
       
        const addEditListeners = () => {



            const allEditBtns = this.document.querySelectorAll('.editBtn')
            allEditBtns.forEach(btn => btn.onclick = function(e) {
                
                let id = e.target.id
                    id = id.slice(id.indexOf('-')+1,)
                    lastTaskClickedOn = id
                    openModal() //calling openModal w/ no arguments (to open proper modal box)


                currentGoalInput.value = allTasks[id]?.Goal
                timeInputStart.value = secondsToHHMMSS_24HR(allTasks[id].startTimeSecs)
                timeInputEnd.value = secondsToHHMMSS_24HR(allTasks[id].endTimeSecs)
            
            }) 
        }
        addEditListeners()
    }
    
    })
    localStorage.setItem('data', JSON.stringify(allTasks))
    // if (!allTasks.length) {bigDaddyWrapper.innerHTML = ''}
    
    currentTasksHTML = bigDaddyWrapper.innerHTML
    taskSwitcherHTML.style.bottom = '0'
    if (allTasks.length === 1) {document.querySelector('.deleteBtn').disabled = true}
}
function secondsToHHMMSS_24HR(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}`;
  }
function updateBtnHandler(e) {
    

    let taskStartTime = timeInputStart.value
    let taskEndTime = timeInputEnd.value
    if (!currentGoalInput.value.trim()) {
        alert('goal cant be empty')
        return
    }
    if (taskStartTime >= taskEndTime) {
        alert('invalid hours')
        return
    }
    taskSwitcherHTML.style.bottom = '0'
    let id = lastTaskClickedOn

    const newObj = {}
    updateSpecificTask(newObj, id,taskStartTime,taskEndTime)
    closeModal()
    renderTasksHTML()
   
} 
function updateSpecificTask(blankTaskObj,index,taskStartTime,taskEndTime) {
    blankTaskObj.startTimeSecs = inputValueToSeconds(taskStartTime )
    blankTaskObj.endTimeSecs = inputValueToSeconds(taskEndTime )

    blankTaskObj.startTimeAMPM = secondsToAmPm(blankTaskObj.startTimeSecs)
    blankTaskObj.endTimeAMPM = secondsToAmPm(blankTaskObj.endTimeSecs)
    blankTaskObj.Goal = currentGoalInput.value


    index = !newPostOption.checked ? index : allTasks.length
    allTasks[index] = blankTaskObj
}

function displayHeaderExactTime() {
    const date = new Date()
    let exactTime = date.toLocaleString([], {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",            
  });

  secondsPassedInDay = getCurrentSecondsInDay()
  currentTimeHTML.textContent = `${exactTime}`

  if (currentPageDisplayed === 'alarms') {
    console.log('sdsd')
    updateAlarmsLIVE_HR_MIN()

  }
}
function updateTime() {
     displayHeaderExactTime()
     //update seconds passed for all tasks
     allTasks.forEach((t, i) => handleTaskStatusLIVE(i))
     function handleTaskStatusLIVE (index) {
        const task = allTasks[index]
        
        const current = document.querySelector(`#task-${index}-status`)
        const countdownStatus = document.querySelector(`#task-${index}-countdown`)
   
        if (secondsPassedInDay >= task.endTimeSecs) {
            current.innerHTML = ''
            current.innerHTML = `<p>PASSED</p><p> ~<span id="task-${index}-hrsElapsed">1</span></p>`
            current.style.color= 'red' 
            countdownStatus.previousElementSibling.classList.add('hidden')
            countdownStatus.textContent = 'PASSED'
    
                    document.querySelector(`#tasksWrapper-${index}`).style.opacity = 0.65
        
                    document.querySelector(`#task-${index}-countdown`).style.color = 'red'
    
                    const hoursPassed = (secondsPassedInDay - task.endTimeSecs) / 3600
                    const noSigFigs = String(hoursPassed.toFixed(1)) == 1 ? true : false
                    document.querySelector(`#tasksWrapper-${index}`).style.border = '3px solid black'
                    document.querySelector(`#task-${index}-hrsElapsed`).textContent = hoursPassed.toFixed(noSigFigs ? 0 : 1)
                    + ` hr${noSigFigs  ? '' : 's'} ago`
                    
            return
        }
    
    
        if (secondsPassedInDay >= task.startTimeSecs && secondsPassedInDay <= task.endTimeSecs) {
            current.textContent = 'DO NOW'
            
            current.style.color= 'green'
            countdownStatus.style.color=current.style.color
            countdownStatus.innerHTML = `<h5>Time Left</h5>
                                        <p>${updateTaskCountDownLIVE(task.endTimeSecs - secondsPassedInDay, countdownStatus, task)}</p>`
            countdownStatus.style.color = 'green'
            countdownStatus.classList.remove('blink-class')
            countdownStatus.previousElementSibling.classList.add('hidden')
            document.querySelector(`#tasksWrapper-${index}`).style.border = '10px ridge forestgreen'
            document.querySelector(`#tasksWrapper-${index}`).style.boxShadow = 'none'
            
        } 
        else  {
            current.textContent = 'SCHEDULED'
            current.style.color= 'deeppink'
            updateTaskCountDownLIVE(task.startTimeSecs - secondsPassedInDay, countdownStatus,task)
        }
     }
      // updates if time passes to a new date
      const currentDate = new Date()

      const isItNewDay = currentDate.toLocaleString("en-US", {weekday: "long"}).trim() 
                         !== currentDayNameHTML.textContent.trim()

      isItNewDay && updateToNewDay()
}

function updateTaskCountDownLIVE(totalSeconds, element,task) { // only called everytime updateTime is called every second to display countdown timers for both scheduled & in-progress tasks
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60

    !hours && minutes <= 5 && 
    !element.className.includes('blink-class') &&
    element.classList.add('blink-class')

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    element.style.color = (Math.abs(secondsPassedInDay  - task.alertTimer) >= 3600 ? 'green' : 'red' )
    element.textContent = `${h}:${m}:${s}`
    return `${h}:${m}:${s}`;       
}
function inputValueToSeconds(timeString) {

    let [hrs, mins] = timeString.split(':')

    return (hrs * 3600 + mins * 60) 
   
 }

function renderDurationHTML (str,i,goalDurationHours) {
    if (goalDurationHours == 1) {str = 'hr'}

    setTimeout(() => //This allow the html to be created first before we set text content
        document.querySelector(`#task-${i}-hrsOrMins`)
            .textContent = str, 69);

    const conversionFactor = str == 'mins' ? 60 : 1        
    return goalDurationHours * conversionFactor
                  
}


 function secondsToAmPm(totalSeconds, usedToDisplayTaskDuration = false, i) {
     if (usedToDisplayTaskDuration) {
        let goalDurationHours = (totalSeconds / 3600).toFixed(1) 
        goalDurationHours = goalDurationHours.includes('.0') ? Number((totalSeconds / 3600).toFixed(0)) : Number(goalDurationHours)
        return renderDurationHTML(goalDurationHours < 1 ? 'mins' : 'hrs',i,goalDurationHours)
     }
     const totalMinutes = Math.floor(totalSeconds / 60);
     const hours = Math.floor(totalMinutes / 60) % 24;
     
     const minutes = totalMinutes % 60;
     const ampm = hours >= 12 ? 'PM' : 'AM';
     const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
   
     const formattedTime = `${formattedHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
     return formattedTime
 }

 