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
    const habit = habitsArray.find(h => h.id === id);
    if (!habit) return;

    // depois você renderiza os detalhes aqui
    console.log(habit);


    

    showPageById('view-habit-page');
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
