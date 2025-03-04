let secondsPassedInDay = getCurrentSecondsInDay()
function getCurrentSecondsInDay() {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
  
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds
    return totalSeconds
}
let lastTaskClickedOn = null
let allTasks = [
    {startHour: '10', startMinutes: '36', Goal: 'Default Goal', Done:false, index:0,
                   isPM: true, trueValue: 22*60 + 36,
                   startTimeAMPM: '4:30 PM', endTimeAMPM: '7:30 PM',
                   startTimeSecs:16*3600+30*60, endTimeSecs:19*3600+30*60
    }
]

let currentPageDisplayed = 'tasks'
let intervals = null



allTasks = JSON.parse(localStorage.getItem('data'))
         || allTasks
window.onload = function runOnBoot() { //loads current date
            updateToNewDay()
            renderTasksHTML()
            updateBtn.onclick  = updateBtnHandler
            tasksTabHTML.style.backgroundColor = 'cyan'
            intervals = this.setInterval(updateTime, 1000)

            //see helperFuncs.js for other functions
}
