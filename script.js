const chapters = [
  {
    id: 1,
    title: "Welcome & How to Use This Course",
    est: "10 min",
    objectives: [
      "Understand course navigation and progress tracking",
      "See how the PDF source maps into chapters",
      "Set a goal for completing the full playbook"
    ],
    content: [
      "This website is built as an interactive layer on top of the Smaller Challenger Playbook PDF.",
      "Use the chapter menu to move through lessons, complete activities, and track mastery over time.",
      "To fully align each chapter with the original document, replace placeholder lesson text with exact section summaries from the source PDF."
    ],
    activity: "Create a personal learning goal and timeline for finishing the course.",
    note: "Tip: keep the source PDF open in a second tab while reading each lesson."
  },
  {
    id: 2,
    title: "Challenger Mindset Fundamentals",
    est: "20 min",
    objectives: ["Define challenger positioning", "Recognize market dynamics", "Identify differentiators"],
    content: [
      "Introduce the challenger mindset and why smaller agencies can outperform with focused positioning.",
      "Map the common strategic traps and how this playbook helps avoid them."
    ],
    activity: "Write a one-paragraph challenger thesis for your agency.",
    note: "Focus on specificity over broad claims."
  },
  {
    id: 3,
    title: "Offer Design and Packaging",
    est: "25 min",
    objectives: ["Structure clear offers", "Improve value communication", "Reduce buyer friction"],
    content: [
      "Break down service packaging into outcomes, process, timelines, and proof.",
      "Use chapter worksheets to standardize offers and make sales conversations easier."
    ],
    activity: "Turn one existing service into a three-tier offer ladder.",
    note: "Good offers answer: who, outcome, timeline, and next step."
  },
  {
    id: 4,
    title: "Go-to-Market Execution",
    est: "30 min",
    objectives: ["Prioritize channels", "Build repeatable outreach", "Improve conversion loops"],
    content: [
      "Operationalize weekly go-to-market actions with measurable experiments.",
      "Tie outreach to a consistent narrative and documented qualification criteria."
    ],
    activity: "Build a 2-week GTM sprint plan with daily actions.",
    note: "Keep experiments small, fast, and measurable."
  }
];

const chapterList = document.getElementById("chapterList");
const lesson = document.getElementById("lesson");
const search = document.getElementById("search");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const markComplete = document.getElementById("markComplete");
const nextChapter = document.getElementById("nextChapter");

let currentChapterId = 1;
const completed = new Set(JSON.parse(localStorage.getItem("completedChapters") || "[]"));

function renderChapterButtons(items) {
  chapterList.innerHTML = "";
  items.forEach((chapter) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `Chapter ${chapter.id}: ${chapter.title}`;
    button.classList.toggle("active", chapter.id === currentChapterId);
    button.classList.toggle("complete", completed.has(chapter.id));
    button.addEventListener("click", () => {
      currentChapterId = chapter.id;
      render();
    });
    li.appendChild(button);
    chapterList.appendChild(li);
  });
}

function renderLesson(chapter) {
  const tmpl = document.getElementById("lessonTemplate").content.cloneNode(true);
  tmpl.querySelector("h2").textContent = `Chapter ${chapter.id}: ${chapter.title}`;
  tmpl.querySelector(".chapter-meta").textContent = `Estimated completion: ${chapter.est}`;

  const objectives = tmpl.querySelector(".learning-objectives");
  objectives.innerHTML = `<h3>Learning objectives</h3><ul>${chapter.objectives.map((o) => `<li>${o}</li>`).join("")}</ul>`;

  const content = tmpl.querySelector(".chapter-content");
  content.innerHTML = chapter.content.map((p) => `<p>${p}</p>`).join("");

  tmpl.querySelector(".activity p").textContent = chapter.activity;
  tmpl.querySelector(".note").textContent = chapter.note;

  lesson.innerHTML = "";
  lesson.appendChild(tmpl);
}

function renderProgress() {
  const pct = Math.round((completed.size / chapters.length) * 100);
  progressBar.value = pct;
  progressLabel.textContent = `${pct}% completed`;
  localStorage.setItem("completedChapters", JSON.stringify([...completed]));
}

function render() {
  const keyword = search.value.trim().toLowerCase();
  const filtered = chapters.filter((c) => c.title.toLowerCase().includes(keyword));
  const chapter = chapters.find((c) => c.id === currentChapterId) ?? chapters[0];
  renderChapterButtons(filtered);
  renderLesson(chapter);
  renderProgress();
}

search.addEventListener("input", render);
markComplete.addEventListener("click", () => {
  completed.add(currentChapterId);
  render();
});
nextChapter.addEventListener("click", () => {
  const i = chapters.findIndex((c) => c.id === currentChapterId);
  currentChapterId = chapters[(i + 1) % chapters.length].id;
  render();
});

render();
