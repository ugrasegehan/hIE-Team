
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCf0uFz0Ow5AJCTTREiFWEleAigIWpLqOI",
  authDomain: "takimdurum.firebaseapp.com",
  projectId: "takimdurum",
  storageBucket: "takimdurum.firebasestorage.app",
  messagingSenderId: "24060496942",
  appId: "1:24060496942:web:c5cdee004b18571a48a3bf",
  measurementId: "G-F9P7C1XM6H"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const teamMembers = ["Egehan", "Doğa", "Mina", "Nehir", "Atahan", "Defne", "Berat"];
let statusOptions = ["MS", "Y", "2", "T", "YV", "D", "WC", "L","OUT OF ORDER"];

const teamDiv = document.getElementById("team");

function updateStatus(name, value) {
  set(ref(db, 'teamStatus/' + name), value);
}

function renderTeam(statuses = {}) {
  teamDiv.innerHTML = "";
  teamMembers.forEach(name => {
    const wrapper = document.createElement("div");
    wrapper.className = "person";

    const nameDiv = document.createElement("div");
    nameDiv.textContent = name;

    const select = document.createElement("select");
    statusOptions.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    const statusDisplay = document.createElement("div");
    statusDisplay.className = "status-display";
    statusDisplay.textContent = statuses[name] || "-";

    if (statuses[name]) {
      select.value = statuses[name];
    }

    select.addEventListener("change", () => {
      updateStatus(name, select.value);
    });

    wrapper.appendChild(nameDiv);
    wrapper.appendChild(select);
    wrapper.appendChild(statusDisplay);

    teamDiv.appendChild(wrapper);
  });
}

window.addStatusOption = function () {
  const input = document.getElementById("newStatus");
  const newStatus = input.value.trim();
  if (newStatus && !statusOptions.includes(newStatus)) {
    statusOptions.push(newStatus);
    renderTeam();
    input.value = "";
  }
};

const statusRef = ref(db, 'teamStatus');
onValue(statusRef, (snapshot) => {
  const data = snapshot.val() || {};
  renderTeam(data);
});
