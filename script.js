/* C PROGRAMMING DAILY PROGRESS TRACKER — FIREBASE LIVE VERSION */

const members = ["Afif", "Saikot", "Tanim", "Tashfia", "Akib", "Bushra", "Lubaba"];

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


/* Firebase Console থেকে পাওয়া values এখানে বসাতে হবে */
const firebaseConfig = {
    apiKey: "AIzaSyAFGYyVHXQpOcFuQX_2cYcTD4-jIcZenSI",
    authDomain: "vur-progress-tracker.firebaseapp.com",
    projectId: "vur-progress-tracker",
    storageBucket: "vur-progress-tracker.firebasestorage.app",
    messagingSenderId: "187659926227",
    appId: "1:187659926227:web:d96981572598c203ba3226"
};

/*
Firebase Authentication-এ এই email দিয়ে user তৈরি করবেন।
সেই user-এর password-ই হবে আপনার Admin PIN।
*/

const ADMIN_EMAIL = "admin@cprogress.app";

const STATE_COLLECTION = "tracker";
const STATE_DOCUMENT = "publicState";


let savedProgress = {};
let savedHistory = [];
let selectedTodayTopic = "";
let isAdmin = false;

let auth = null;
let stateRef = null;
let liveDataReady = false;


const connectionStatus =
    document.getElementById("connectionStatus");


function firebaseIsConfigured() {

    return !Object.values(firebaseConfig)
        .some(value =>
            String(value).startsWith("PASTE_")
        );

}


function setConnectionStatus(text, type) {

    connectionStatus.textContent = text;
    connectionStatus.className =
        `connection-status ${type}`;

}


function getAllTopics() {

    return roadmap.flatMap(
        phase => phase.topics
    );

}


function topicKey(topic, member) {

    return `${topic}__${member}`;

}


function getToday() {

    return new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


document.getElementById("todayDate")
    .textContent = getToday();


/* NAVIGATION */

function showSection(sectionName) {

    document.querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document.getElementById(sectionName)
        .classList.add("active");

    document.querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.section === sectionName
            );

        });

    document.getElementById("navMenu")
        .classList.remove("show");

    renderAll();

}


window.showSection = showSection;


document.querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            showSection(
                button.dataset.section
            );

        });

    });


document.getElementById("menuBtn")
    .addEventListener("click", () => {

        document.getElementById("navMenu")
            .classList.toggle("show");

    });


/* PROGRESS CALCULATION */

function isCompleted(topic, member) {

    return savedProgress[
        topicKey(topic, member)
    ] === true;

}


function getTopicProgress(topic) {

    const completed =
        members.filter(member =>
            isCompleted(topic, member)
        ).length;

    return Math.round(
        (completed / members.length) * 100
    );

}


function getMemberProgress(member) {

    const topics = getAllTopics();

    const completed =
        topics.filter(topic =>
            isCompleted(topic, member)
        ).length;

    return {
        completed: completed,
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

    return Math.round(
        (
            completed /
            (topics.length * members.length)
        ) * 100
    );

}


/* DASHBOARD */

function renderDashboard() {

    const topics = getAllTopics();

    let totalCompleted = 0;

    topics.forEach(topic => {

        members.forEach(member => {

            if (isCompleted(topic, member)) {
                totalCompleted++;
            }

        });

    });


    document.getElementById("totalMembers")
        .textContent = members.length;

    document.getElementById("totalTopics")
        .textContent = topics.length;

    document.getElementById("totalCompleted")
        .textContent = totalCompleted;

    document.getElementById("overallProgress")
        .textContent =
        `${getOverallProgress()}%`;


    const todayProgress =
        selectedTodayTopic
            ? getTopicProgress(selectedTodayTopic)
            : 0;


    document.getElementById("todayProgressText")
        .textContent =
        `${todayProgress}%`;

    document.getElementById("todayProgressBar")
        .style.width =
        `${todayProgress}%`;


    const completedMembers =
        selectedTodayTopic
            ? members.filter(member =>
                isCompleted(
                    selectedTodayTopic,
                    member
                )
            ).length
            : 0;


    document.getElementById("todayTaskInfo")
        .innerHTML =
        selectedTodayTopic
            ? `
                <strong>${selectedTodayTopic}</strong>
                <br>
                ${completedMembers} of
                ${members.length} members completed
              `
            : "No task selected for today.";


    renderMiniMembers();

}


/* MINI MEMBERS */

function renderMiniMembers() {

    const container =
        document.getElementById(
            "memberMiniList"
        );

    container.innerHTML =
        members.map(member => {

            const data =
                getMemberProgress(member);

            return `

                <div class="member-mini">

                    <div class="avatar">
                        ${member.charAt(0)}
                    </div>

                    <div class="member-mini-info">

                        <strong>
                            ${member}
                        </strong>

                        <div class="mini-progress">

                            <div style="width:${data.percent}%">
                            </div>

                        </div>

                    </div>

                    <span>
                        ${data.percent}%
                    </span>

                </div>

            `;

        }).join("");

}


/* ROADMAP */

function renderRoadmap() {

    const container =
        document.getElementById(
            "roadmapContainer"
        );

    let globalNumber = 0;


    container.innerHTML =
        roadmap.map(phase => {

            const completedTopics =
                phase.topics.filter(topic =>
                    getTopicProgress(topic) === 100
                ).length;


            const phasePercent =
                Math.round(
                    (
                        completedTopics /
                        phase.topics.length
                    ) * 100
                );


            const topicsHTML =
                phase.topics.map(topic => {

                    globalNumber++;

                    return `

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
                                ${getTopicProgress(topic)}%
                            </div>

                        </div>

                    `;

                }).join("");


            return `

                <div class="phase">

                    <div class="phase-header">

                        <h3>
                            ${phase.title}
                        </h3>

                        <span>
                            ${phasePercent}%
                        </span>

                    </div>

                    <div class="topic-list">
                        ${topicsHTML}
                    </div>

                </div>

            `;

        }).join("");


    document.getElementById("roadmapProgress")
        .textContent =
        `${getOverallProgress()}%`;

}


/* MEMBERS */

function renderMembers() {

    const container =
        document.getElementById(
            "membersContainer"
        );


    container.innerHTML =
        members.map(member => {

            const data =
                getMemberProgress(member);

            return `

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
                            Completed:
                            ${data.completed}
                        </span>

                        <span>
                            Remaining:
                            ${data.total - data.completed}
                        </span>

                    </div>

                </div>

            `;

        }).join("");

}


/* ADMIN CONTROL */

function renderControl() {

    document.getElementById(
        "adminLoginPanel"
    ).hidden = isAdmin;

    document.getElementById(
        "adminContent"
    ).hidden = !isAdmin;


    if (!isAdmin) return;


    const container =
        document.getElementById(
            "controlContainer"
        );


    container.innerHTML =
        getAllTopics().map(topic => {

            const membersHTML =
                members.map(member => {

                    const checked =
                        isCompleted(
                            topic,
                            member
                        );

                    return `

                        <label class="control-member">

                            <span class="check-wrap">

                                <input
                                    type="checkbox"
                                    ${checked ? "checked" : ""}
                                    data-topic="${encodeURIComponent(topic)}"
                                    data-member="${encodeURIComponent(member)}"
                                >

                                <span>
                                    ${member}
                                </span>

                            </span>

                            <span>
                                ${checked ? "✅" : "⏳"}
                            </span>

                        </label>

                    `;

                }).join("");


            return `

                <div class="control-topic panel">

                    <div class="control-topic-header">

                        <strong>
                            ${topic}
                        </strong>

                        <span>
                            ${getTopicProgress(topic)}%
                            Complete
                        </span>

                    </div>

                    ${membersHTML}

                </div>

            `;

        }).join("");


    container
        .querySelectorAll(
            'input[type="checkbox"]'
        )
        .forEach(input => {

            input.addEventListener(
                "change",
                () => {

                    toggleProgress(
                        decodeURIComponent(
                            input.dataset.topic
                        ),
                        decodeURIComponent(
                            input.dataset.member
                        ),
                        input.checked
                    );

                }
            );

        });

}


/* TODAY TOPIC SELECT */

function renderTodaySelect() {

    const select =
        document.getElementById(
            "todayTopicSelect"
        );


    select.innerHTML = `

        <option value="">
            -- Select Topic --
        </option>

    `;


    getAllTopics().forEach(topic => {

        const option =
            document.createElement(
                "option"
            );

        option.value = topic;
        option.textContent = topic;

        option.selected =
            topic === selectedTodayTopic;

        select.appendChild(option);

    });

}


/* HISTORY */

function renderHistory() {

    const container =
        document.getElementById(
            "historyContainer"
        );


    if (!savedHistory.length) {

        container.innerHTML = `

            <p class="muted">
                No progress history yet.
            </p>

        `;

        return;

    }


    container.innerHTML =
        [...savedHistory]
            .reverse()
            .map(item => `

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

            `)
            .join("");

}


/* RENDER EVERYTHING */

function renderAll() {

    renderDashboard();
    renderRoadmap();
    renderMembers();
    renderControl();
    renderTodaySelect();
    renderHistory();

}


/* UPDATE HISTORY */

function updateHistoryInMemory() {

    if (!selectedTodayTopic) return;


    const today =
        new Date()
            .toISOString()
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

}


/* SAVE TO FIREBASE */

async function saveLiveData() {

    if (!isAdmin || !stateRef) {

        throw new Error(
            "Admin access required."
        );

    }


    await stateRef.set({

        progress: savedProgress,
        history: savedHistory,
        todayTopic: selectedTodayTopic,

        updatedAt:
            firebase.firestore
                .FieldValue
                .serverTimestamp()

    }, {
        merge: true
    });

}


/* TOGGLE MEMBER PROGRESS */

async function toggleProgress(
    topic,
    member,
    checked
) {

    if (!isAdmin) return;


    savedProgress[
        topicKey(topic, member)
    ] = checked;


    updateHistoryInMemory();

    renderAll();


    try {

        await saveLiveData();

    } catch (error) {

        alert(
            "Progress save হয়নি। Internet connection এবং Firebase Rules check করুন।"
        );

        console.error(error);

    }

}


/* SAVE TODAY'S TOPIC */

document.getElementById("saveTodayBtn")
    .addEventListener(
        "click",
        async () => {

            if (!isAdmin) return;


            const chosenTopic =
                document.getElementById(
                    "todayTopicSelect"
                ).value;


            if (!chosenTopic) {

                document.getElementById(
                    "selectedTopicMessage"
                ).textContent =
                    "Please select a topic.";

                return;

            }


            selectedTodayTopic =
                chosenTopic;


            document.getElementById(
                "selectedTopicMessage"
            ).textContent =
                `Today's topic: ${selectedTodayTopic}`;


            updateHistoryInMemory();

            renderAll();

            await saveLiveData();

        }
    );


/* RESET TODAY */

document.getElementById("resetTodayBtn")
    .addEventListener(
        "click",
        async () => {

            if (!isAdmin) return;


            if (!selectedTodayTopic) {

                alert(
                    "No topic selected for today."
                );

                return;

            }


            if (
                !confirm(
                    `Reset progress for "${selectedTodayTopic}"?`
                )
            ) {
                return;
            }


            members.forEach(member => {

                delete savedProgress[
                    topicKey(
                        selectedTodayTopic,
                        member
                    )
                ];

            });


            updateHistoryInMemory();

            renderAll();

            await saveLiveData();

        }
    );


/* RESET ALL */

document.getElementById("resetAllBtn")
    .addEventListener(
        "click",
        async () => {

            if (!isAdmin) return;


            if (
                !confirm(
                    "Are you sure you want to reset ALL progress?"
                )
            ) {
                return;
            }


            savedProgress = {};
            savedHistory = [];
            selectedTodayTopic = "";


            renderAll();

            await saveLiveData();

        }
    );


/* ADMIN PIN LOGIN */

document.getElementById("adminLoginForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const pin =
                document.getElementById(
                    "adminPin"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (!firebaseIsConfigured()) {

                message.textContent =
                    "প্রথমে script.js-এ Firebase config বসাতে হবে।";

                return;

            }


            message.textContent =
                "Checking PIN…";


            try {

                await auth
                    .signInWithEmailAndPassword(
                        ADMIN_EMAIL,
                        pin
                    );


                document.getElementById(
                    "adminPin"
                ).value = "";


                message.textContent = "";

            } catch (error) {

                message.textContent =
                    "PIN সঠিক নয়। আবার চেষ্টা করুন।";

                console.error(
                    error.code
                );

            }

        }
    );


/* ADMIN LOGOUT */

document.getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            if (auth) {
                auth.signOut();
            }

        }
    );


/* OLD LOCALSTORAGE DATA MIGRATION */

async function migrateOldLocalDataIfNeeded() {

    const snapshot =
        await stateRef.get();


    if (snapshot.exists) return;


    savedProgress =
        JSON.parse(
            localStorage.getItem(
                "cProgress"
            ) || "{}"
        );


    savedHistory =
        JSON.parse(
            localStorage.getItem(
                "cHistory"
            ) || "[]"
        );


    selectedTodayTopic =
        localStorage.getItem(
            "todayTopic"
        ) || "";


    await saveLiveData();

}


/* FIREBASE INITIALIZATION */

function initializeFirebase() {

    if (!firebaseIsConfigured()) {

        setConnectionStatus(
            "Firebase setup required",
            "offline"
        );

        renderAll();

        return;

    }


    firebase.initializeApp(
        firebaseConfig
    );


    auth =
        firebase.auth();


    const db =
        firebase.firestore();


    stateRef =
        db.collection(
            STATE_COLLECTION
        ).doc(
            STATE_DOCUMENT
        );


    /* REAL-TIME DATA LISTENER */

    stateRef.onSnapshot(

        snapshot => {

            if (snapshot.exists) {

                const data =
                    snapshot.data();


                savedProgress =
                    data.progress || {};


                savedHistory =
                    data.history || [];


                selectedTodayTopic =
                    data.todayTopic || "";

            }


            liveDataReady = true;


            setConnectionStatus(
                "Live data connected",
                "online"
            );


            renderAll();

        },

        error => {

            setConnectionStatus(
                "Live connection failed",
                "offline"
            );

            console.error(error);

        }

    );


    /* ADMIN LOGIN STATUS */

    auth.onAuthStateChanged(
        async user => {

            isAdmin =
                Boolean(
                    user &&
                    user.email === ADMIN_EMAIL
                );


            if (isAdmin) {

                try {

                    await migrateOldLocalDataIfNeeded();

                } catch (error) {

                    console.error(error);

                }

            }


            renderAll();

        }
    );

}


/* INITIAL LOAD */

renderAll();

initializeFirebase();
