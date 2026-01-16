// consts
const homePage = document.getElementById("home-page")

const createHabitPage = document.getElementById("create-habit-page")

const viewHabitPage = document.getElementById("view-habit-page")

const statsPage = document.getElementById("statistics-page")

const settingsPage = document.getElementById("settings-page")

const icons = document.querySelectorAll('.icon');

const pages = document.querySelectorAll('.app > div'); 

const addTagBtn = document.getElementById("add-tag-btn")

const createHabitForm = document.getElementById("create-habit-form")

const tagInput = document.getElementById("habit-tags")

const tagsDiv = document.getElementById("tags-div")

const habitsContainer = document.querySelector('.habits-container');

const toggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

const habitNameEl = document.querySelector('.h-name')
const habitDescriptionEl = document.querySelector('.h-description')

const todaysDateEl = document.querySelector('.todays-date')
const calendarMonthEl = document.querySelector('.calendar-month')

const calendarDaysDiv = document.querySelector(".days")

let markedDays = []

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


// state 
let habitsArray = JSON.parse(localStorage.getItem("habits")) || []
renderHabits()
let tagsArray = []

// storage 
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habitsArray))
}

function addHabit(habit) {
    habitsArray.push(habit)
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

/* ui */ 
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

function showPageById (id) {
    pages.forEach(p => {
        p.classList.remove('visible')
        p.classList.add('hidden')
    })
    const target = document.getElementById(id)
    if (target) {
        target.classList.remove('hidden')
        target.classList.add('visible')
    }
}


const today = new Date()
const thisYear = today.getFullYear()

let currentYear = today.getFullYear()

let currentMonth = today.getMonth()

let currentDay = today.getDate()

todaysDateEl.textContent = `${monthNamesAbrev[currentMonth]} ${currentDay}, ${currentYear}`


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

function showHabitDetails(id) {
    const habit = habitsArray.find(h => h.id === id)
    if (!habit) return

    console.log(habit)

    habitNameEl.textContent = habit.name
    habitDescriptionEl.textContent += habit.description


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
addTagBtn.addEventListener('click', () => {
    const formData = new FormData(createHabitForm)

    const tag = formData.get("tag")

    if (tag) {
        tagsArray.push(tag)
        renderTag(tag)
        tagInput.value = ''
    }
})

// delete tag
tagsDiv.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-tag-btn') 

    const tagEl = btn.closest('.tag') 

    const tagText = tagEl.querySelector('span')?.textContent || '' 
    const idx = tagsArray.indexOf(tagText) 
    if (idx > -1) tagsArray.splice(idx, 1)

    tagEl.remove()
})

//view habit page

//calendar 
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

    renderCalendar()
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

function renderCalendar() {
    const grid = document.getElementById('calendarGrid')
    grid.innerHTML = ''

    grid.appendChild(createMonth(currentYear, currentMonth))
}

function saveDaysCompleted(id) {
    const habit = habitsArray.find(h => h.id === id)
    habit.daysCompleted = markedDays
    
}


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

renderCalendar()
console.log(habitsArray)

// function popHabitsArray() {
//     habitsArray.pop()
//     saveHabits()
//     console.log(habitsArray)
// }

// navbar
icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const group = icon.closest('.nav-items')
        if (group) group.querySelectorAll('.icon').forEach(i => i.classList.remove('active'))
        icon.classList.add('active');
        
        const targetId = icon.dataset.target
        if (targetId) showPageById(targetId)
    })
})
