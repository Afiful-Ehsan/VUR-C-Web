/* =========================================
   C PROGRAMMING DAILY PROGRESS TRACKER
   ========================================= */


// ================================
// MEMBERS
// ================================

const members = [
    "Afif",
    "Saikot",
    "Tanim",
    "Tashfia",
    "Akib",
    "Bushra",
    "Lubaba"
];


// ================================
// ROADMAP
// ================================

const roadmap = [

    {
        title: "Phase 1 — C Basics",
        topics: [
            "Introduction to C",
            "C Program Structure",
            "Variables & Constants",
            "Data Types",
            "Input & Output",
            "Format Specifiers",
            "Operators",
            "Type Casting"
        ]
    },

    {
        title: "Phase 2 — Conditional & Loops",
        topics: [
            "Conditional Statements",
            "if-else",
            "switch-case",
            "Loops",
            "for Loop",
            "while Loop",
            "do-while Loop",
            "Nested Loops",
            "break & continue",
            "Pattern Printing"
        ]
    },

    {
        title: "Phase 3 — Functions",
        topics: [
            "Functions",
            "Function Parameters & Return",
            "Recursion"
        ]
    },

    {
        title: "Phase 4 — Arrays & Strings",
        topics: [
            "Arrays",
            "1D Array",
            "2D Array",
            "Strings",
            "String Functions"
        ]
    },

    {
        title: "Phase 5 — Algorithms",
        topics: [
            "Searching",
            "Sorting"
        ]
    },

    {
        title: "Phase 6 — Pointers",
        topics: [
            "Pointers",
            "Pointer Arithmetic",
            "Pointers & Arrays",
            "Pointers & Functions"
        ]
    },

    {
        title: "Phase 7 — Advanced C",
        topics: [
            "Structures",
            "Unions",
            "Enums",
            "typedef",
            "Dynamic Memory Allocation",
            "File Handling",
            "Preprocessor & Macros",
            "Storage Classes",
            "Command Line Arguments",
            "Function Pointers",
            "Bit Manipulation"
        ]
    },

    {
        title: "Phase 8 — Data Structures",
        topics: [
            "Data Structures with C",
            "Linked List",
            "Stack",
            "Queue",
            "Tree",
            "Graph"
        ]
    },

    {
        title: "Phase 9 — Project",
        topics: [
            "C Project Practice"
        ]
    }

];


// ================================
// STORAGE
// ================================

const savedProgress =
    JSON.parse(localStorage.getItem("cProgress")) || {};

const savedHistory =
    JSON.parse(localStorage.getItem("cHistory")) || [];

const savedToday =
    localStorage.getItem("todayTopic") || "";


// ================================
// ALL TOPICS
// ================================

function getAllTopics() {

    let topics = [];

    roadmap.forEach(phase => {
        phase.topics.forEach(topic => {
            topics.push(topic);
        });
    });

    return topics;
}


// ================================
// UNIQUE KEY
// ================================

function topicKey(topic, member) {
    return `${topic}__${member}`;
}


// ================================
// SAVE DATA
// ================================

function saveData() {

    localStorage.setItem(
        "cProgress",
        JSON.stringify(savedProgress)
    );

    localStorage.setItem(
        "cHistory",
        JSON.stringify(savedHistory)
    );

    if (selectedTodayTopic) {

        localStorage.setItem(
            "todayTopic",
            selectedTodayTopic
        );

    }

}


// ================================
// TODAY TOPIC
// ================================

let selectedTodayTopic = savedToday;


// ================================
// DATE
// ================================

function getToday() {

    const date = new Date();

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}

document.getElementById("todayDate").textContent =
    getToday();


// ================================
// NAVIGATION
// ================================

const navButtons =
    document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showSection(
            button.dataset.section
        );

    });

});


function showSection(sectionName) {

    document.querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document.getElementById(sectionName)
        .classList.add("active");


    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === sectionName
        );

    });

    document.getElementById("navMenu")
        .classList.remove("show");

    renderAll();

}


// ================================
// MOBILE MENU
// ================================

document.getElementById("menuBtn")
    .addEventListener("click", () => {

        document.getElementById("navMenu")
            .classList.toggle("show");

    });


// ================================
// PROGRESS FUNCTIONS
// ================================

function isCompleted(topic, member) {

    return savedProgress[
        topicKey(topic, member)
    ] === true;

}


function getTopicProgress(topic) {

    let completed = 0;

    members.forEach(member => {

        if (isCompleted(topic, member)) {
            completed++;
        }

    });

    return Math.round(
        (completed / members.length) * 100
    );

}


function getMemberProgress(member) {

    const topics = getAllTopics();

    let completed = 0;

    topics.forEach(topic => {

        if (isCompleted(topic, member)) {
            completed++;
        }

    });

    return {
        completed,
        total: topics.length,
        percent: Math.round(
            (completed / topics.length) * 100
        )
    };

}


function getOverallProgress() {

    const topics = getAllTopics();

    let completed = 0;

    topics.forEach(topic => {

        members.forEach(member => {

            if (isCompleted(topic, member)) {
                completed++;
            }

        });

    });

    const total =
        topics.length * members.length;

    return Math.round(
        (completed / total) * 100
    );

}


// ================================
// DASHBOARD
// ================================

function renderDashboard() {

    const topics = getAllTopics();

    document.getElementById("totalMembers")
        .textContent = members.length;

    document.getElementById("totalTopics")
        .textContent = topics.length;


    let totalCompleted = 0;

    topics.forEach(topic => {

        members.forEach(member => {

            if (isCompleted(topic, member)) {
                totalCompleted++;
            }

        });

    });

    document.getElementById("totalCompleted")
        .textContent = totalCompleted;


    const overall =
        getOverallProgress();

    document.getElementById("overallProgress")
        .textContent = `${overall}%`;


    const todayProgress =
        selectedTodayTopic
            ? getTopicProgress(selectedTodayTopic)
            : 0;


    document.getElementById("todayProgressText")
        .textContent = `${todayProgress}%`;

    document.getElementById("todayProgressBar")
        .style.width = `${todayProgress}%`;


    const info =
        document.getElementById("todayTaskInfo");


    if (selectedTodayTopic) {

        info.innerHTML =
            `<strong>${selectedTodayTopic}</strong>
             <br>
             ${Math.round(
                 (todayProgress / 100) * members.length
             )} of ${members.length} members completed`;

    } else {

        info.textContent =
            "No task selected for today.";

    }


    renderMiniMembers();

}


// ================================
// MINI MEMBER LIST
// ================================

function renderMiniMembers() {

    const container =
        document.getElementById("memberMiniList");

    container.innerHTML = "";

    members.forEach(member => {

        const data =
            getMemberProgress(member);

        container.innerHTML += `

            <div class="member-mini">

                <div class="avatar">
                    ${member.charAt(0)}
                </div>

                <div class="member-mini-info">

                    <strong>${member}</strong>

                    <div class="mini-progress">
                        <div
                            style="width:${data.percent}%">
                        </div>
                    </div>

                </div>

                <span>
                    ${data.percent}%
                </span>

            </div>

        `;

    });

}


// ================================
// ROADMAP
// ================================

function renderRoadmap() {

    const container =
        document.getElementById("roadmapContainer");

    container.innerHTML = "";

    let globalNumber = 0;


    roadmap.forEach((phase, phaseIndex) => {

        let phaseCompleted = 0;

        phase.topics.forEach(topic => {

            if (getTopicProgress(topic) === 100) {
                phaseCompleted++;
            }

        });


        const phasePercent =
            Math.round(
                (phaseCompleted /
                    phase.topics.length) * 100
            );


        let topicsHTML = "";

        phase.topics.forEach(topic => {

            globalNumber++;

            const progress =
                getTopicProgress(topic);

            topicsHTML += `

                <div class="topic">

                    <div class="topic-name">

                        <div class="topic-number">
                            ${globalNumber}
                        </div>

                        <span>
                            ${topic}
                        </span>

                    </div>

                    <div class="topic-progress">
                        ${progress}%
                    </div>

                </div>

            `;

        });


        container.innerHTML += `

            <div class="phase">

                <div class="phase-header">

                    <h3>${phase.title}</h3>

                    <span>
                        ${phasePercent}%
                    </span>

                </div>

                <div class="topic-list">
                    ${topicsHTML}
                </div>

            </div>

        `;

    });


    document.getElementById("roadmapProgress")
        .textContent =
        `${getOverallProgress()}%`;

}


// ================================
// MEMBERS
// ================================

function renderMembers() {

    const container =
        document.getElementById("membersContainer");

    container.innerHTML = "";

    members.forEach(member => {

        const data =
            getMemberProgress(member);


        container.innerHTML += `

            <div class="member-card">

                <div class="member-card-top">

                    <div class="avatar">
                        ${member.charAt(0)}
                    </div>

                    <div>
                        <h3>${member}</h3>
                        <p>C Programming</p>
                    </div>

                </div>

                <div class="member-percent">
                    ${data.percent}%
                </div>

                <div class="progress-bar">
                    <div
                        style="width:${data.percent}%">
                    </div>
                </div>

                <div class="member-stats">

                    <span>
                        Completed: ${data.completed}
                    </span>

                    <span>
                        Remaining:
                        ${data.total - data.completed}
                    </span>

                </div>

            </div>

        `;

    });

}


// ================================
// CONTROL
// ================================

function renderControl() {

    const container =
        document.getElementById("controlContainer");

    container.innerHTML = "";


    roadmap.forEach(phase => {

        phase.topics.forEach(topic => {

            const progress =
                getTopicProgress(topic);


            let membersHTML = "";


            members.forEach(member => {

                const checked =
                    isCompleted(topic, member)
                        ? "checked"
                        : "";


                membersHTML += `

                    <label class="control-member">

                        <span class="check-wrap">

                            <input
                                type="checkbox"
                                ${checked}
                                onchange="
                                    toggleProgress(
                                        '${topic.replace(/'/g, "\\'")}',
                                        '${member}',
                                        this.checked
                                    )
                                "
                            >

                            <span>${member}</span>

                        </span>

                        <span>
                            ${isCompleted(topic, member)
                                ? "✅"
                                : "⏳"}
                        </span>

                    </label>

                `;

            });


            container.innerHTML += `

                <div class="control-topic panel">

                    <div class="control-topic-header">

                        <strong>
                            ${topic}
                        </strong>

                        <span>
                            ${progress}% Complete
                        </span>

                    </div>

                    ${membersHTML}

                </div>

            `;

        });

    });

}


// ================================
// TOGGLE PROGRESS
// ================================

function toggleProgress(
    topic,
    member,
    checked
) {

    savedProgress[
        topicKey(topic, member)
    ] = checked;


    saveData();

    updateHistory();

    renderAll();

}


// ================================
// TODAY TOPIC SELECT
// ================================

function renderTodaySelect() {

    const select =
        document.getElementById(
            "todayTopicSelect"
        );

    select.innerHTML =
        `<option value="">
            -- Select Topic --
        </option>`;


    getAllTopics().forEach(topic => {

        const option =
            document.createElement("option");

        option.value = topic;
        option.textContent = topic;

        if (topic === selectedTodayTopic) {
            option.selected = true;
        }

        select.appendChild(option);

    });

}


document.getElementById("saveTodayBtn")
    .addEventListener("click", () => {

        selectedTodayTopic =
            document.getElementById(
                "todayTopicSelect"
            ).value;


        if (!selectedTodayTopic) {

            document.getElementById(
                "selectedTopicMessage"
            ).textContent =
                "Please select a topic.";

            return;

        }


        localStorage.setItem(
            "todayTopic",
            selectedTodayTopic
        );


        document.getElementById(
            "selectedTopicMessage"
        ).textContent =
            `Today's topic: ${selectedTodayTopic}`;


        renderAll();

    });


// ================================
// HISTORY
// ================================

function updateHistory() {

    if (!selectedTodayTopic) return;


    const today =
        new Date().toISOString()
        .split("T")[0];


    const percent =
        getTopicProgress(
            selectedTodayTopic
        );


    const existing =
        savedHistory.find(
            item => item.date === today
        );


    if (existing) {

        existing.topic =
            selectedTodayTopic;

        existing.percent =
            percent;

    } else {

        savedHistory.push({

            date: today,

            topic: selectedTodayTopic,

            percent: percent

        });

    }


    saveData();

}


function renderHistory() {

    const container =
        document.getElementById(
            "historyContainer"
        );


    if (savedHistory.length === 0) {

        container.innerHTML =
            `<p class="muted">
                No progress history yet.
            </p>`;

        return;

    }


    container.innerHTML = "";


    [...savedHistory]
        .reverse()
        .forEach(item => {

            container.innerHTML += `

                <div class="history-row">

                    <span class="history-date">
                        ${item.date}
                    </span>

                    <span class="history-topic">
                        ${item.topic}
                    </span>

                    <span class="history-percent">
                        ${item.percent}%
                    </span>

                </div>

            `;

        });

}


// ================================
// RESET TODAY
// ================================

document.getElementById("resetTodayBtn")
    .addEventListener("click", () => {

        if (!selectedTodayTopic) {

            alert(
                "No topic selected for today."
            );

            return;

        }


        const confirmReset =
            confirm(
                `Reset progress for "${selectedTodayTopic}"?`
            );


        if (!confirmReset) return;


        members.forEach(member => {

            delete savedProgress[
                topicKey(
                    selectedTodayTopic,
                    member
                )
            ];

        });


        saveData();

        renderAll();

    });


// ================================
// RESET ALL
// ================================

document.getElementById("resetAllBtn")
    .addEventListener("click", () => {

        const confirmReset =
            confirm(
                "Are you sure you want to reset ALL progress?"
            );


        if (!confirmReset) return;


        Object.keys(savedProgress)
            .forEach(key => {
                delete savedProgress[key];
            });


        savedHistory.length = 0;

        localStorage.removeItem(
            "todayTopic"
        );

        selectedTodayTopic = "";


        saveData();

        renderAll();

    });


// ================================
// RENDER EVERYTHING
// ================================

function renderAll() {

    renderDashboard();

    renderRoadmap();

    renderMembers();

    renderControl();

    renderTodaySelect();

    renderHistory();

}


// ================================
// INITIAL LOAD
// ================================

renderAll();