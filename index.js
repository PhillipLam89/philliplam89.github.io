const numberOfRows = 10

let amountToWin = 3
let currentSign = 'O'

window.onload = function () {
    generateGrid(numberOfRows)
    window.container.onclick = function(e) {
        if (e.target.tagName !== 'BUTTON') return
        const selectedBtn = e.target
        const selectedSpan = document.querySelector(`#${selectedBtn.id} > span`)
        let rowCol = selectedBtn.dataset.rowCol.split('-').map(num => Number(num))

        const [row, col] = rowCol
   
    
        if (selectedBtn.dataset.isActive == 'true') return
        selectedSpan.textContent = selectedSpan.textContent === '' ? currentSign : 'X'
        currentSign =  selectedSpan.textContent === 'X'? 'O' : 'X'
        selectedSpan.style.color = selectedSpan.textContent === 'X'? 'blue' : 'green'
        selectedBtn.dataset.isActive = 'true'

        //check for win
          console.log(`sign:${selectedSpan.textContent}, row: ${row}, col ${col}`)
        checkForWin(selectedSpan.textContent,row,col) 
    }
}

function generateGrid (rows) {
        for (let i = 1; i <= rows; i++) {
            const row = document.createElement('div')
            row.id = 'row'+ i
            window.container.appendChild(row)
                    
            for (let j = 1; j <= rows; j++) {
                const btn = document.createElement('button')
                btn.id = 'row'+ i + 'col' + j
                btn.dataset.row = i
                btn.dataset.rowCol = `${i}-${j}`
                btn.dataset.isActive = ''
                btn.textContent = ''
                btn.classList.add(`col${j}`)
                row.appendChild(btn)

                const spanEle = document.createElement('span')
                spanEle.id = 'row'+ i + 'col' + j
                spanEle.dataset.rowCol = `${i}-${j}`
                spanEle.textContent = ''
                btn.appendChild(spanEle)
            }

        }
}


function checkForWin(sign,row,col) {

     const allChecks = [checkLeftRight,checkUpDown,
                        checkDiagonalUpwards,
                        checkDiagonalDownwards]

    if (allChecks.some(func => func(sign,row,col))) {
        window.container.onclick = ''
        return true
    }

}
function checkLeftRight(sign,row,col) {

   
    let allRowBoxes = [...document.querySelectorAll(`#row${row} > button`)].filter(box => box.innerText === sign)
    if (allRowBoxes.length < amountToWin) return
    
    for (const box of allRowBoxes) {
        const val = box.id.slice(box.id.indexOf('l')).replace('l', '')
        allRowBoxes = [...allRowBoxes, Number(val)]
        
    }
     let winCount = 2
    let winnerIDs = []
    for (let i = 0; i < allRowBoxes.length; i++) {
       
        let num = allRowBoxes[i]
        if (allRowBoxes[i+1] !== (num + 1)) {
            continue
        } 
        winnerIDs = [...winnerIDs, `row${row}col${num}`,`row${row}col${allRowBoxes[i+1]}`]
        
      
        if (winCount === amountToWin){
                console.log('won horizontally')
                for (const id of winnerIDs) {
                    const btn = document.getElementById(id)
                    btn.classList.add('winner')
                }
                return true
        }
        winCount++
        
    }
  

   
}

function checkUpDown(sign,row,col) {
    let allColBoxes = [...document.getElementsByClassName(`col${col}`)].filter(box => box.innerText === sign)
 
    
    for (const box of allColBoxes) {
        const val = box.dataset.row
        allColBoxes = [...allColBoxes, Number(val)]
        
    }
    allColBoxes = allColBoxes.filter(val => typeof val === 'number')
     if (allColBoxes.length < amountToWin) return
  

     let winCount = 2
     let winnerIDs = []
    for (let i = 0; i < allColBoxes.length; i++) {
       
        let num = allColBoxes[i]
        if (allColBoxes[i+1] !== (num + 1)) {
            continue
        } 
   winnerIDs =  [...winnerIDs, `row${num}col${col}`,`row${allColBoxes[i+1]}col${col}`]       
        if (winCount === amountToWin){
                winnerIDs = winnerIDs.map(id => document.getElementById(id))
                winnerIDs.forEach(btn => btn.classList.add('winner'))
          
                return true
        }
        winCount++
        
    }
}

function checkDiagonalUpwards(sign,row,col) {
    
    let arr = []

    let currRow = 0
    let currCol = 0
    while (!arr.includes(null)) {
        const val = document.getElementById(`row${row + currRow}col${col - currCol}`)

        arr.push(val)
        currRow++
        currCol++
        
    }
    arr = arr.filter(val => val !== null)

        currRow = 1
        currCol = 1
    while (!arr.includes(null)) {

            const val = document.getElementById(`row${row - currRow}col${col + currCol}`)
    
            arr.push(val)
            currRow++
            currCol++
        
    }
    arr = arr.filter(val => val !== null).sort((a,b) => b.dataset.row - a.dataset.row)

    arr = arr.map(n => ({sign: n.innerText, id: n.id}))

    let index = arr.findIndex(obj => obj.sign === sign)
    let winCount = 1
    let winnerIDs = []
   for (let i = index; i < arr.length; i++) {
   
        if (arr[i + 1]?.sign !== sign) return 
        winCount++ 
        winnerIDs = [...winnerIDs, arr[i].id, arr[i+1].id]
        if (winCount === amountToWin) {
            winnerIDs = [...new Set(winnerIDs)].map(id => document.getElementById(id))
            winnerIDs.forEach(btn => btn.classList.add('winner'))
            console.log('WIN DIAG UP')
            return true
        }
   }

}

function checkDiagonalDownwards(sign,row,col) {
    let arr = []

    let i = 0
    while (i < numberOfRows) {
        const val = document.getElementById(`row${row - i}col${col - i}`)
        if (val == null) break;
        arr.push(val)
        i++
    } 
    i = 1
    while (i < numberOfRows) {
        const val = document.getElementById(`row${row + i}col${col + i}`)
        if (val == null) break;
        arr.push(val)
        i++
    }
    arr = arr.sort((a,b) => a.dataset.row - b.dataset.row)
    arr = arr.map(n => ({sign: n.innerText, id: n.id}))


    let index = arr.findIndex(obj => obj.sign === sign)
    let winCount = 1
    
    let winnerIDs = []
   for (let i = index; i < arr.length; i++) {
        if (arr[i + 1]?.sign !== sign) return; 
        winCount++ 
        winnerIDs = [...winnerIDs, arr[i].id, arr[i+1].id]
        if (winCount === amountToWin) {
            winnerIDs = [...new Set(winnerIDs)].map(id => document.getElementById(id))
            winnerIDs.forEach(btn => btn.classList.add('winner'))
            console.log('win DIAGG DOWN')
            return true
        }
   }
}
