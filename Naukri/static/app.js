// Naukri Apply - Frontend JS

const API = "/api";

let statusPollInterval = null;

document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    loadConfig();
    loadEnv();
    loadResumeProfile();
    loadQACache();
    checkLoginStatus();
    startStatusPolling();
});

function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.dataset.tab).classList.add("active");
        });
    });

    // Dashboard buttons
    document.getElementById("btn-login").addEventListener("click", startLogin);
    document.getElementById("btn-login-success").addEventListener("click", loginSuccess);
    document.getElementById("btn-search").addEventListener("click", startSearch);

    // Save buttons
    document.getElementById("btn-save-config").addEventListener("click", saveConfig);
    document.getElementById("btn-save-env").addEventListener("click", saveEnv);
    document.getElementById("btn-save-resume").addEventListener("click", saveResumeProfile);
    document.getElementById("btn-save-qa").addEventListener("click", saveQACache);

    // Ollama logs
    document.getElementById("btn-ollama-logs").addEventListener("click", fetchOllamaLogs);
    document.getElementById("btn-copy-logs").addEventListener("click", copyLogs);
    document.getElementById("btn-clear-logs").addEventListener("click", clearLogs);
}

async function checkLoginStatus() {
    try {
        const res = await fetch(`${API}/login/status`);
        const data = await res.json();
        const el = document.getElementById("login-status");
        const loginBtn = document.getElementById("btn-login");
        const successBtn = document.getElementById("btn-login-success");
        const searchBtn = document.getElementById("btn-search");

        if (data.logged_in) {
            el.textContent = "✓ Logged in to Naukri";
            el.className = "status logged-in";
            loginBtn.disabled = true;
            successBtn.disabled = false;
            searchBtn.disabled = false;
        } else {
            el.textContent = "✗ Not logged in";
            el.className = "status logged-out";
            loginBtn.disabled = false;
            successBtn.disabled = true;
            searchBtn.disabled = true;
        }
        loadConfigDisplay();
    } catch (e) {
        console.error("Login status check failed:", e);
    }
}

async function loadConfigDisplay() {
    try {
        const res = await fetch(`${API}/config`);
        const cfg = await res.json();
        document.getElementById("cfg-role").textContent = cfg.role || "-";
        document.getElementById("cfg-location").textContent = cfg.location || "-";
        document.getElementById("cfg-applicants").textContent = cfg.applicants || "-";
        document.getElementById("cfg-max-apps").textContent = cfg.max_applications || "-";
    } catch (e) {
        console.error("Config load failed:", e);
    }
}

async function startLogin() {
    const btn = document.getElementById("btn-login");
    btn.disabled = true;
    btn.textContent = "Starting...";

    try {
        const res = await fetch(`${API}/login`, { method: "POST" });
        const data = await res.json();
        if (data.started) {
            btn.textContent = "Login Window Opened";
            document.getElementById("login-status").textContent = "Waiting for login...";
            document.getElementById("login-status").className = "status checking";
            document.getElementById("btn-login-success").disabled = false;
        } else {
            btn.disabled = false;
            btn.textContent = "Start Login";
            alert("Login already in progress or failed to start.");
        }
    } catch (e) {
        btn.disabled = false;
        btn.textContent = "Start Login";
        alert("Failed to start login: " + e.message);
    }
}

function loginSuccess() {
    checkLoginStatus();
}

async function startSearch() {
    const btn = document.getElementById("btn-search");
    btn.disabled = true;
    btn.textContent = "Starting Search...";

    try {
        const res = await fetch(`${API}/search`, { method: "POST" });
        const data = await res.json();
        if (!data.started) {
            btn.disabled = false;
            btn.textContent = "Start Search";
            alert("Search already in progress or failed to start.");
        }
    } catch (e) {
        btn.disabled = false;
        btn.textContent = "Start Search";
        alert("Failed to start search: " + e.message);
    }
}

function startStatusPolling() {
    statusPollInterval = setInterval(pollStatus, 2000);
}

async function pollStatus() {
    try {
        const res = await fetch(`${API}/status`);
        const data = await res.json();
        updateProgress(data);
        updateLogs(data.logs);

        const searchBtn = document.getElementById("btn-search");
        if (data.running && data.task === "search") {
            searchBtn.disabled = true;
            searchBtn.textContent = "Search Running...";
        } else if (data.running && data.task === "login") {
            document.getElementById("btn-login").disabled = true;
            document.getElementById("btn-login").textContent = "Login Running...";
        } else {
            searchBtn.disabled = false;
            searchBtn.textContent = "Start Search";
            document.getElementById("btn-login").disabled = false;
            document.getElementById("btn-login").textContent = "Start Login";
        }

        if (!data.running && data.task && data.returncode !== null) {
            if (data.returncode === 0) {
                showProgress("Task completed successfully!", 100);
            } else {
                showProgress("Task failed. Check logs.", 0);
            }
            checkLoginStatus();
        }
    } catch (e) {
        console.error("Status poll failed:", e);
    }
}

function updateProgress(data) {
    const progressEl = document.getElementById("progress");
    const fillEl = document.querySelector(".progress-fill");

    if (data.running) {
        if (data.task === "login") {
            progressEl.textContent = "Login window open - please sign in to Naukri";
            fillEl.style.width = "10%";
        } else if (data.task === "search") {
            const lastLog = data.logs[data.logs.length - 1] || "";
            if (lastLog.includes("Applied to")) {
                const match = lastLog.match(/Applied to (\d+) job/);
                if (match) {
                    progressEl.textContent = `Applied to ${match[1]} job(s)`;
                    fillEl.style.width = "80%";
                } else {
                    progressEl.textContent = lastLog;
                    fillEl.style.width = "50%";
                }
            } else {
                progressEl.textContent = lastLog || "Searching and applying...";
                fillEl.style.width = "30%";
            }
        }
    } else if (data.task) {
        if (data.returncode === 0) {
            progressEl.textContent = "Completed successfully";
            fillEl.style.width = "100%";
        } else if (data.returncode !== null) {
            progressEl.textContent = "Failed - check logs";
            fillEl.style.width = "0%";
        }
    }
}

function showProgress(msg, pct) {
    document.getElementById("progress").textContent = msg;
    document.querySelector(".progress-fill").style.width = pct + "%";
}

function updateLogs(logs) {
    const el = document.getElementById("log-output");
    el.textContent = logs.join("\n");
    el.scrollTop = el.scrollHeight;
}

async function fetchOllamaLogs() {
    const btn = document.getElementById("btn-ollama-logs");
    btn.disabled = true;
    btn.textContent = "Loading...";

    try {
        const res = await fetch(`${API}/ollama/logs`);
        const data = await res.json();
        if (data.logs) {
            document.getElementById("log-output").textContent = data.logs;
        } else if (data.error) {
            document.getElementById("log-output").textContent = "Error: " + data.error;
        }
    } catch (e) {
        document.getElementById("log-output").textContent = "Failed to fetch Ollama logs: " + e.message;
    } finally {
        btn.disabled = false;
        btn.textContent = "Ollama Logs";
    }
}

// Config
async function loadConfig() {
    try {
        const res = await fetch(`${API}/config`);
        const data = await res.json();
        document.getElementById("config-editor").value = JSON.stringify(data, null, 2);
    } catch (e) {
        console.error("Load config failed:", e);
    }
}

async function saveConfig() {
    const editor = document.getElementById("config-editor");
    const savedMsg = document.getElementById("config-saved");
    try {
        const data = JSON.parse(editor.value);
        const res = await fetch(`${API}/config`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            savedMsg.classList.remove("hidden");
            setTimeout(() => savedMsg.classList.add("hidden"), 2000);
            loadConfigDisplay();
        }
    } catch (e) {
        alert("Invalid JSON or save failed: " + e.message);
    }
}

// Env
async function loadEnv() {
    try {
        const res = await fetch(`${API}/env`);
        const data = await res.json();
        document.getElementById("env-editor").value = data.value || "";
    } catch (e) {
        console.error("Load env failed:", e);
    }
}

async function saveEnv() {
    const editor = document.getElementById("env-editor");
    const savedMsg = document.getElementById("env-saved");
    try {
        const res = await fetch(`${API}/env`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: editor.value }),
        });
        if (res.ok) {
            savedMsg.classList.remove("hidden");
            setTimeout(() => savedMsg.classList.add("hidden"), 2000);
        }
    } catch (e) {
        alert("Save failed: " + e.message);
    }
}

// Resume Profile
async function loadResumeProfile() {
    try {
        const res = await fetch(`${API}/resume_profile`);
        const data = await res.json();
        document.getElementById("resume-editor").value = JSON.stringify(data, null, 2);
    } catch (e) {
        console.error("Load resume profile failed:", e);
    }
}

async function saveResumeProfile() {
    const editor = document.getElementById("resume-editor");
    const savedMsg = document.getElementById("resume-saved");
    try {
        const data = JSON.parse(editor.value);
        const res = await fetch(`${API}/resume_profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            savedMsg.classList.remove("hidden");
            setTimeout(() => savedMsg.classList.add("hidden"), 2000);
        }
    } catch (e) {
        alert("Invalid JSON or save failed: " + e.message);
    }
}

// QA Cache
async function loadQACache() {
    try {
        const res = await fetch(`${API}/qa_cache`);
        const data = await res.json();
        document.getElementById("qa-editor").value = JSON.stringify(data, null, 2);
    } catch (e) {
        console.error("Load QA cache failed:", e);
    }
}

async function saveQACache() {
    const editor = document.getElementById("qa-editor");
    const savedMsg = document.getElementById("qa-saved");
    try {
        const data = JSON.parse(editor.value);
        const res = await fetch(`${API}/qa_cache`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            savedMsg.classList.remove("hidden");
            setTimeout(() => savedMsg.classList.add("hidden"), 2000);
        }
    } catch (e) {
        alert("Invalid JSON or save failed: " + e.message);
    }
}

function copyLogs() {
    const el = document.getElementById("log-output");
    const text = el.textContent || el.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("btn-copy-logs");
        const original = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("success");
        setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove("success");
        }, 2000);
    }).catch(() => {
        const range = document.createRange();
        range.selectNode(el);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        alert("Auto-copy failed. Text is selected - press Ctrl+C to copy.");
    });
}

function clearLogs() {
    const el = document.getElementById("log-output");
    el.textContent = "";
}