// consts
const homePage = document.getElementById("home-page")
const createHabitPage = document.getElementById("create-habit-page")
const viewHabitPage = document.getElementById("view-habit-page")
const editPage = document.getElementById("edit-page")
const statsPage = document.getElementById("statistics-page")
const settingsPage = document.getElementById("settings-page")

const icons = document.querySelectorAll('.icon')

const pages = document.querySelectorAll('.page')

const createHabitForm = document.getElementById("create-habit-form")
const tagInput = document.getElementById("habit-tags")

const toggle = document.getElementById("theme-toggle")

const habitNameEl = document.querySelector('.h-name')
const habitDescriptionEl = document.querySelector('.h-description')
const todaysDateEl = document.querySelector('.todays-date')
const calendarMonthEl = document.querySelector('.calendar-month')
const pageTitleEl = document.getElementById("page-title")

const tagsDiv = document.getElementById("tags-div")
const calendarDaysDiv = document.querySelector(".days")
const habitsContainer = document.querySelector('.habits-container')

const addTagBtn = document.getElementById("add-tag-btn")
const editHabitBtn = document.getElementById("edit-habit-btn")
const deleteHabitBtn = document.getElementById("delete-habit-btn")
const backBtn = document.querySelector(".back-btn")
const cancelBtn = document.querySelector(".cancel-btn")

const savedTheme = localStorage.getItem("theme");
const savedPageId = localStorage.getItem("savedPageId")


const monthNames = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
]

const monthNamesAbrev = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const today = new Date()
const thisYear = today.getFullYear()

const pageNames = new Map()

pageNames.set("home-page", "Habit Tracker")
pageNames.set("create-habit-page", "New Habit")
pageNames.set("edit-page", "Edit Habit")
pageNames.set("statistics-page", "Statistics")
pageNames.set("settings-page", "Settings")
pageNames.set("view-habit-page", "Habit Detail")

let markedDays = []

let currentHabitId = null 

let habitsArray = JSON.parse(localStorage.getItem("habits")) || []

let tagsArray = []
let allTagsArray = []

let currentYear = today.getFullYear()
let currentMonth = today.getMonth()
let currentDay = today.getDate()

let currentPageId = savedPageId || 'home-page'
let previousPageId = null

renderHabits()
showPageById(currentPageId)

// storage 
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habitsArray))
}

function addHabit(habit) {
    const habitInArray = habitsArray.find(h => h.id === habit.id)

    if (habitInArray) {
        habitsArray[indexOf(habitInArray)] = habit
    } else {
        habitsArray.push(habit)
    }

    saveHabits()
}

// helper functions
function renderTag(tag) {
    const tagEl = document.createElement('div')
    tagEl.className = 'tag'
    tagEl.innerHTML =   `    
                        <span>${tag}</span>
                        <span class="delete-tag-btn">x</span>
                        `
    tagsDiv.appendChild(tagEl)
}

function getStreak (habit) {
    return habit.daysCompleted.length
}

function getCurrentHabit() {
    return habitsArray.find(h => h.id === currentHabitId)
}

function loadHabitDays(habit) {
    markedDays = habit.daysCompleted ? [...habit.daysCompleted] : []
}


/* ui */ 
if (savedTheme === "dark") {
  document.body.classList.add("dark")
  toggle.checked = true
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark")
  
  localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    )
})


todaysDateEl.textContent = `${monthNamesAbrev[currentMonth]} ${currentDay}, ${currentYear}`

function renderPageTitle(pageId) {
    pageTitleEl.textContent = pageNames.get(pageId)
}

function showPageById(id) {
    pages.forEach(page => {
        page.classList.remove('visible')
        page.classList.add('hidden')
    })

    const target = document.getElementById(id)
    if (!target) return

    previousPageId = currentPageId
    currentPageId = id

    localStorage.setItem("savedPageId", currentPageId)

    target.classList.remove('hidden')
    target.classList.add('visible')

    updateActiveIcon(currentPageId)
    renderPageTitle(currentPageId)
}

function renderHabits() {
    habitsContainer.innerHTML = ''

    if (habitsArray.length == 0) {
        habitsContainer.innerHTML = 
        `
            <p class="empty-state">No habits yet. Create your first one ✨</p>
        `
        return
    }

    habitsArray.forEach( habit => {
        const habitEl = document.createElement('div')
        habitEl.classList.add('habit-element');
        habitEl.dataset.id = habit.id;

        habitEl.innerHTML = `
            <h4>${habit.name}</h4>
            <p>Streak: ${getStreak(habit)} days</p>
        `

        habitsContainer.appendChild(habitEl)
    })
}

habitsContainer.addEventListener('click', (e) => {
    const habitEl = e.target.closest('.habit-element')
    if (!habitEl) return

    const habitId = Number(habitEl.dataset.id)
    showHabitDetails(habitId)

})

function showPreviousPage() {
    showPageById(previousPageId ||'home-page')
}

backBtn?.addEventListener('click', showPreviousPage)
cancelBtn?.addEventListener('click', () => showPageById('home-page'))

function showHabitDetails(id) {
    const habit = habitsArray.find(h => h.id === id)
    if (!habit) return

    console.log(habit)

    currentHabitId = id 


    habitNameEl.textContent = habit.name
    habitDescriptionEl.innerHTML = `<span class="span">Description:</span> ${habit.description}`

    loadHabitDays(habit)
    renderCalendar()
    showPageById('view-habit-page')
}


// create and save habit to localStorage
createHabitForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(createHabitForm)

    const newHabit = 
    {
        id: Date.now(),
        name: formData.get("habit-name"), 
        description: formData.get("habit-description"), 
        frequency: formData.get("habit-frequency"), 
        daysCompleted: [], 
        theme: '', 
        tags: tagsArray,
        createdAt: new Date().toISOString()
    }

    
    createHabitForm.reset()
    tagsArray = [];
    tagsDiv.innerHTML = '';

    addHabit(newHabit)
    renderHabits()
    showPageById('home-page')
})

// add tag
addTagBtn?.addEventListener('click', () => {
    const formData = new FormData(createHabitForm)

    const tag = formData.get("tag")

    if (tag) {
        addTagToArray(tag, tagsArray)
        addTagToArray(tag, allTagsArray)

        renderTag(tag)

        tagInput.value = ''
    }
})

function addTagToArray(tag, array) {
    if (!array.includes(tag)) array.push(tag)
}

// delete tag
tagsDiv?.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-tag-btn') 

    const tagEl = btn.closest('.tag') 

    const tagText = tagEl.querySelector('span')?.textContent || ''

    const index = tagsArray.indexOf(tagText) 
    if (index > -1) tagsArray.splice(index, 1)

    tagEl.remove()
})

//view habit page

//calendar 
function changeMonth(delta) {
    currentMonth += delta

    if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
    }

    if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
    }

    renderCalendar()
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay()
}

function isToday(year, month, day) {
    return year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()
}
function getDateKey(year, month, day) {
        return `${year}-${month}-${day}`
    }
function toggleDay(year, month, day) {
    let key = getDateKey(year, month, day)

     if (markedDays.includes(key)) {
        markedDays = markedDays.filter(d => d !== key)
    } else {
        markedDays.push(key)
    }

    console.log(markedDays)

    saveDaysCompleted()
    renderCalendar()
}

function saveDaysCompleted() {
    const habit = getCurrentHabit()
    if (!habit) return

    habit.daysCompleted = [...markedDays]
    
    saveHabits()
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid')
    grid.innerHTML = ''

    grid.appendChild(createMonth(currentYear, currentMonth))
}

function createMonth(year, monthIndex) {
    
    if (currentYear != thisYear) {
        calendarMonthEl.textContent = `${monthNames[monthIndex]}, ${currentYear}`
    } else {
        calendarMonthEl.textContent = monthNames[monthIndex]
    }

    const monthDiv = document.createElement('div')
    monthDiv.className = 'month'

    const weekdaysDiv = document.createElement('div')
    weekdaysDiv.className = 'weekdays'
    weekdays.forEach(day => {
        const weekdayDiv = document.createElement('div')
        weekdayDiv.className = 'weekday'
        weekdayDiv.textContent = day
        weekdaysDiv.appendChild(weekdayDiv)
    });
    monthDiv.appendChild(weekdaysDiv)

    const daysDiv = document.createElement('div')
    daysDiv.className = 'days'

    const firstDay = getFirstDayOfMonth(year, monthIndex)
    const daysInMonth = getDaysInMonth(year, monthIndex)

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div')
        daysDiv.appendChild(emptyDiv)
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div')
        dayDiv.className = 'day'
        dayDiv.textContent = day

        const key = getDateKey(year, monthIndex, day)

        if (markedDays.includes(key)) {
            dayDiv.classList.add('completed')
        }
        
        dayDiv.onclick = () => toggleDay(year, monthIndex, day)

        daysDiv.appendChild(dayDiv)
    }

    monthDiv.appendChild(daysDiv)
    return monthDiv
}

renderCalendar() 

console.log(habitsArray)

// function popHabitsArray() {
//     habitsArray.pop()
//     saveHabits()
//     console.log(habitsArray)
// }

editHabitBtn?.addEventListener( 'click', () => showEditPage( getCurrentHabit() ) )

function showEditPage() {
    showPageById('edit-page')
}

deleteHabitBtn?.addEventListener('click', () => {
    
})

// navbar
function updateActiveIcon(activePageId) {
    const allIcons = document.querySelectorAll('.nav-items .icon')
    
    allIcons.forEach(icon => {
        if (icon.dataset.target === activePageId) {
            icon.classList.add('active')
        } else {
            icon.classList.remove('active')
        }
    })
}

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const targetId = icon.dataset.target
        if (!targetId || targetId === currentPageId) return

        showPageById(targetId)
    })
})

console.log(currentPageId)
console.log(previousPageId)