const App = (() => {
    let timerInterval = null;
    let timerSeconds = 0;
    let isTimerRunning = false;

    const DOM = {
        // Navigation
        navItems: document.querySelectorAll('.nav-item'),
        sections: document.querySelectorAll('.section'),
        pageTitle: document.getElementById('page-title'),

        // Summary cards
        totalEarnings: document.getElementById('total-earnings'),
        totalExpenses: document.getElementById('total-expenses'),
        netProfit: document.getElementById('net-profit'),
        profitMargin: document.getElementById('profit-margin'),
        totalHours: document.getElementById('total-hours'),
        avgRate: document.getElementById('avg-rate'),
        earningSessions: document.getElementById('earnings-sessions'),
        expensesCount: document.getElementById('expenses-count'),

        // Timer
        timerDisplay: document.getElementById('timer-display'),
        projectSelect: document.getElementById('project-select'),
        taskName: document.getElementById('task-name'),
        hourlyRate: document.getElementById('hourly-rate'),
        startBtn: document.getElementById('start-timer'),
        stopBtn: document.getElementById('stop-timer'),
        resetBtn: document.getElementById('reset-timer'),
        newProjectBtn: document.getElementById('new-project-btn'),
        newProjectInput: document.getElementById('new-project-input'),

        // Manual entry
        manualProject: document.getElementById('manual-project'),
        manualDate: document.getElementById('manual-date'),
        manualStart: document.getElementById('manual-start'),
        manualEnd: document.getElementById('manual-end'),
        manualRate: document.getElementById('manual-rate'),
        addManualBtn: document.getElementById('add-manual-entry'),

        // Sessions list
        sessionsList: document.getElementById('sessions-list'),

        // Projects
        newProjectName: document.getElementById('new-project-name'),
        newProjectRate: document.getElementById('new-project-rate'),
        createProjectBtn: document.getElementById('create-project-btn'),
        projectsList: document.getElementById('projects-list'),

        // Expenses
        expenseName: document.getElementById('expense-name'),
        expenseAmount: document.getElementById('expense-amount'),
        expenseCategory: document.getElementById('expense-category'),
        expenseDate: document.getElementById('expense-date'),
        addExpenseBtn: document.getElementById('add-expense-btn'),
        expensesList: document.getElementById('expenses-list'),

        // Activity
        activityList: document.getElementById('activity-list'),

        // Settings
        globalRate: document.getElementById('global-rate'),
        darkModeSetting: document.getElementById('dark-mode-setting'),
        themeToggle: document.getElementById('theme-toggle'),
        clearDataBtn: document.getElementById('clear-data-btn'),
        exportDataBtn: document.getElementById('export-data-btn'),
        exportBtn: document.getElementById('export-btn')
    };

    const init = () => {
        loadSettings();
        setupEventListeners();
        updateDashboard();
        populateProjectSelects();
        updateSessionsList();
        updateProjectsList();
        updateExpensesList();
        DOM.manualDate.valueAsDate = new Date();
    };

    const setupEventListeners = () => {
        // Navigation
        DOM.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                switchSection(item.dataset.section);
            });
        });

        // Timer
        DOM.startBtn.addEventListener('click', startTimer);
        DOM.stopBtn.addEventListener('click', stopTimer);
        DOM.resetBtn.addEventListener('click', resetTimer);
        DOM.newProjectBtn.addEventListener('click', toggleNewProject);

        // Manual entry
        DOM.addManualBtn.addEventListener('click', addManualEntry);

        // Projects
        DOM.createProjectBtn.addEventListener('click', createProject);

        // Expenses
        DOM.addExpenseBtn.addEventListener('click', addExpense);

        // Settings
        DOM.themeToggle.addEventListener('click', toggleTheme);
        DOM.darkModeSetting.addEventListener('change', (e) => {
            toggleTheme();
        });
        DOM.globalRate.addEventListener('change', (e) => {
            const settings = Storage.getSettings();
            settings.defaultHourlyRate = parseFloat(e.target.value) || 50;
            Storage.updateSettings(settings);
        });
        DOM.clearDataBtn.addEventListener('click', clearAllData);
        DOM.exportDataBtn.addEventListener('click', exportData);
        DOM.exportBtn.addEventListener('click', exportData);
    };

    const switchSection = (sectionId) => {
        DOM.sections.forEach(section => section.classList.remove('active'));
        DOM.navItems.forEach(item => item.classList.remove('active'));

        const section = document.getElementById(sectionId);
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);

        if (section) {
            section.classList.add('active');
            const titles = {
                dashboard: 'Dashboard',
                timer: 'Time Tracker',
                projects: 'Projects',
                expenses: 'Expenses',
                settings: 'Settings'
            };
            DOM.pageTitle.textContent = titles[sectionId] || 'Dashboard';
        }

        if (navItem) navItem.classList.add('active');
    };

    const startTimer = () => {
        if (isTimerRunning) return;

        if (!DOM.projectSelect.value && DOM.projectSelect.value !== '') {
            alert('Please select or create a project');
            return;
        }

        isTimerRunning = true;
        DOM.startBtn.classList.add('hidden');
        DOM.stopBtn.classList.remove('hidden');

        timerInterval = setInterval(() => {
            timerSeconds++;
            DOM.timerDisplay.textContent = Utils.formatTime(timerSeconds);
        }, 1000);
    };

    const stopTimer = () => {
        if (!isTimerRunning) return;

        isTimerRunning = false;
        clearInterval(timerInterval);
        DOM.stopBtn.classList.add('hidden');
        DOM.startBtn.classList.remove('hidden');

        if (timerSeconds > 0) {
            saveTimerSession();
        }
    };

    const resetTimer = () => {
        isTimerRunning = false;
        clearInterval(timerInterval);
        timerSeconds = 0;
        DOM.timerDisplay.textContent = '00:00:00';
        DOM.startBtn.classList.remove('hidden');
        DOM.stopBtn.classList.add('hidden');
    };

    const saveTimerSession = () => {
        const projectId = DOM.projectSelect.value;
        const project = Storage.getProjects().find(p => p.id === projectId);
        const rate = parseFloat(DOM.hourlyRate.value) || project?.hourlyRate || Storage.getSettings().defaultHourlyRate;

        if (timerSeconds < 60) {
            alert('Session must be at least 1 minute');
            return;
        }

        const session = {
            projectId: projectId || 'general',
            projectName: project?.name || 'General Work',
            taskName: DOM.taskName.value || 'Untitled Task',
            startTime: new Date(Date.now() - timerSeconds * 1000).toISOString(),
            endTime: new Date().toISOString(),
            duration: timerSeconds,
            hourlyRate: rate,
            earnings: (timerSeconds / 3600) * rate,
            date: Utils.getTodayDate()
        };

        Storage.addSession(session);
        addActivity(`Time tracked: ${session.projectName}`, 'Session logged');
        resetTimer();
        DOM.projectSelect.value = '';
        DOM.taskName.value = '';
        DOM.hourlyRate.value = '';
        updateSessionsList();
        updateDashboard();
    };

    const addManualEntry = () => {
        const projectId = DOM.manualProject.value;
        const project = Storage.getProjects().find(p => p.id === projectId);

        if (!projectId) {
            alert('Please select a project');
            return;
        }

        if (!DOM.manualStart.value || !DOM.manualEnd.value) {
            alert('Please set start and end times');
            return;
        }

        const duration = Utils.calculateDuration(DOM.manualStart.value, DOM.manualEnd.value);

        if (duration <= 0) {
            alert('End time must be after start time');
            return;
        }

        const rate = parseFloat(DOM.manualRate.value) || project?.hourlyRate || Storage.getSettings().defaultHourlyRate;

        const session = {
            projectId: projectId,
            projectName: project?.name || 'Project',
            taskName: 'Manual Entry',
            startTime: new Date(`${DOM.manualDate.value}T${DOM.manualStart.value}`).toISOString(),
            endTime: new Date(`${DOM.manualDate.value}T${DOM.manualEnd.value}`).toISOString(),
            duration: duration,
            hourlyRate: rate,
            earnings: (duration / 3600) * rate,
            date: DOM.manualDate.value
        };

        Storage.addSession(session);
        addActivity(`Manual entry: ${session.projectName}`, 'Time entry added');
        DOM.manualProject.value = '';
        DOM.manualStart.value = '';
        DOM.manualEnd.value = '';
        DOM.manualRate.value = '';
        DOM.manualDate.valueAsDate = new Date();
        updateSessionsList();
        updateDashboard();
    };

    const createProject = () => {
        const name = DOM.newProjectName.value.trim();
        const rate = parseFloat(DOM.newProjectRate.value) || 0;

        if (!name) {
            alert('Please enter a project name');
            return;
        }

        Storage.addProject({
            name: name,
            hourlyRate: rate
        });

        addActivity(`Project created: ${name}`, 'New project added');
        DOM.newProjectName.value = '';
        DOM.newProjectRate.value = '';
        populateProjectSelects();
        updateProjectsList();
        updateDashboard();
    };

    const deleteProject = (id) => {
        if (confirm('Delete this project?')) {
            Storage.deleteProject(id);
            updateProjectsList();
            populateProjectSelects();
            updateDashboard();
        }
    };

    const addExpense = () => {
        const name = DOM.expenseName.value.trim();
        const amount = parseFloat(DOM.expenseAmount.value);
        const category = DOM.expenseCategory.value;
        const date = DOM.expenseDate.value;

        if (!name || !amount || amount <= 0) {
            alert('Please fill in all fields with valid amounts');
            return;
        }

        Storage.addExpense({
            name: name,
            amount: amount,
            category: category,
            date: date
        });

        addActivity(`Expense added: ${name}`, `${Utils.formatCurrency(amount)}`);
        DOM.expenseName.value = '';
        DOM.expenseAmount.value = '';
        DOM.expenseCategory.value = 'tools';
        DOM.expenseDate.value = Utils.getTodayDate();
        updateExpensesList();
        updateDashboard();
    };

    const deleteExpense = (id) => {
        if (confirm('Delete this expense?')) {
            Storage.deleteExpense(id);
            updateExpensesList();
            updateDashboard();
        }
    };

    const deleteSession = (id) => {
        if (confirm('Delete this session?')) {
            Storage.deleteSession(id);
            updateSessionsList();
            updateDashboard();
        }
    };

    const toggleNewProject = () => {
        DOM.newProjectInput.classList.toggle('hidden');
        DOM.projectSelect.classList.toggle('hidden');
        if (!DOM.newProjectInput.classList.contains('hidden')) {
            DOM.newProjectInput.focus();
        }
    };

    const populateProjectSelects = () => {
        const projects = Storage.getProjects();
        const selects = [DOM.projectSelect, DOM.manualProject];

        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select project</option>';
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                select.appendChild(option);
            });
            select.value = currentValue;
        });
    };

    const updateSessionsList = () => {
        const sessions = Storage.getSessions();
        const today = Utils.getTodayDate();
        const todaySessions = sessions.filter(s => s.date === today).sort((a, b) =>
            new Date(b.startTime) - new Date(a.startTime)
        );

        if (todaySessions.length === 0) {
            DOM.sessionsList.innerHTML = '<p class="empty-state">No sessions today</p>';
            return;
        }

        DOM.sessionsList.innerHTML = todaySessions.map(session => `
            <div class="session-item">
                <div class="session-item-content">
                    <h4>${session.projectName}</h4>
                    <div class="session-item-meta">
                        ${new Date(session.startTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})} -
                        ${new Date(session.endTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                        (${Utils.secondsToHours(session.duration)}h)
                    </div>
                </div>
                <div class="session-item-earnings">${Utils.formatCurrency(session.earnings)}</div>
                <div class="session-item-actions">
                    <button class="btn-delete" onclick="App.deleteSession('${session.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    };

    const updateProjectsList = () => {
        const projects = Storage.getProjects();
        const sessions = Storage.getSessions();

        if (projects.length === 0) {
            DOM.projectsList.innerHTML = '<p class="empty-state">No projects yet</p>';
            return;
        }

        DOM.projectsList.innerHTML = projects.map(project => {
            const projectSessions = sessions.filter(s => s.projectId === project.id);
            const totalEarnings = Utils.sumBy(projectSessions, 'earnings');
            const totalHours = Utils.sumBy(projectSessions, 'duration') / 3600;

            return `
                <div class="project-item">
                    <div class="project-item-content">
                        <h4>${project.name}</h4>
                        <div class="project-item-meta">
                            ${projectSessions.length} sessions • ${totalHours.toFixed(1)}h tracked
                        </div>
                    </div>
                    <div class="project-item-rate">${Utils.formatCurrency(totalEarnings)}</div>
                    <div class="project-item-actions">
                        <button class="btn-delete" onclick="App.deleteProject('${project.id}')" title="Delete">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    };

    const updateExpensesList = () => {
        const expenses = Storage.getExpenses().sort((a, b) => new Date(b.date) - new Date(a.date));

        if (expenses.length === 0) {
            DOM.expensesList.innerHTML = '<p class="empty-state">No expenses yet</p>';
            return;
        }

        DOM.expensesList.innerHTML = expenses.map(expense => `
            <div class="expense-item">
                <div class="expense-item-content">
                    <h4>${expense.name}</h4>
                    <div class="expense-item-meta">
                        ${Utils.formatDate(expense.date)} • ${Utils.capitalize(expense.category)}
                    </div>
                </div>
                <div class="expense-item-amount">-${Utils.formatCurrency(expense.amount)}</div>
                <div class="expense-item-actions">
                    <button class="btn-delete" onclick="App.deleteExpense('${expense.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    };

    const updateDashboard = () => {
        const sessions = Storage.getSessions();
        const expenses = Storage.getExpenses();

        const totalEarnings = Utils.sumBy(sessions, 'earnings');
        const totalExpenses = Utils.sumBy(expenses, 'amount');
        const netProfit = totalEarnings - totalExpenses;
        const totalSeconds = Utils.sumBy(sessions, 'duration');
        const totalHours = totalSeconds / 3600;
        const avgRate = sessions.length > 0 ? totalEarnings / totalHours : 0;
        const profitMargin = totalEarnings > 0 ? netProfit / totalEarnings : 0;

        DOM.totalEarnings.textContent = totalEarnings.toFixed(2);
        DOM.totalExpenses.textContent = totalExpenses.toFixed(2);
        DOM.netProfit.textContent = netProfit.toFixed(2);
        DOM.totalHours.textContent = totalHours.toFixed(1);
        DOM.avgRate.textContent = Utils.formatCurrency(avgRate);
        DOM.profitMargin.textContent = Utils.formatPercentage(profitMargin);
        DOM.earningSessions.textContent = `${sessions.length} session${sessions.length !== 1 ? 's' : ''}`;
        DOM.expensesCount.textContent = `${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`;

        updateCharts();
        updateActivityList();
    };

    const updateCharts = () => {
        const sessions = Storage.getSessions();
        if (sessions.length === 0) return;

        const byProject = Utils.groupBy(sessions, 'projectName');
        const projects = Object.keys(byProject);
        const earnings = projects.map(p => Utils.sumBy(byProject[p], 'earnings'));

        drawEarningsChart(projects, earnings);
        drawWeeklyChart();
    };

    const drawEarningsChart = (labels, data) => {
        const canvas = document.getElementById('earnings-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 200;

        const maxValue = Math.max(...data);
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        let x = 20;
        const barWidth = (canvas.width - 60) / data.length;
        const chartHeight = canvas.height - 40;

        data.forEach((value, i) => {
            const height = (value / maxValue) * chartHeight;
            const color = colors[i % colors.length];

            ctx.fillStyle = color;
            ctx.fillRect(x, canvas.height - 30 - height, barWidth - 10, height);

            ctx.fillStyle = '#6b7280';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(Utils.formatCurrency(value), x + (barWidth - 10) / 2, canvas.height - 5);

            x += barWidth;
        });
    };

    const drawWeeklyChart = () => {
        const sessions = Storage.getSessions();
        const today = new Date();
        const weekData = {};

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = Utils.formatDate(date);
            const dayStr = Utils.getDayName(date);
            weekData[dayStr] = 0;
        }

        sessions.forEach(session => {
            const sessionDate = new Date(session.date);
            const dayStr = Utils.getDayName(sessionDate);
            if (dayStr in weekData) {
                weekData[dayStr] += session.earnings;
            }
        });

        const days = Object.keys(weekData);
        const values = Object.values(weekData);
        const maxValue = Math.max(...values, 1);

        const container = document.getElementById('weekly-bars');
        if (!container) return;

        container.innerHTML = values.map((value, i) => `
            <div class="bar" style="height: ${(value / maxValue) * 100 + 20}%;">
                <div class="bar-value">${Utils.formatCurrency(value)}</div>
                <div class="bar-label">${days[i]}</div>
            </div>
        `).join('');
    };

    const updateActivityList = () => {
        const sessions = Storage.getSessions();
        const expenses = Storage.getExpenses();

        const activities = [
            ...sessions.map(s => ({
                type: 'session',
                icon: '⏱️',
                title: `${s.projectName}`,
                subtitle: `${Utils.secondsToHours(s.duration)}h • ${Utils.formatCurrency(s.earnings)}`,
                time: new Date(s.endTime).getTime()
            })),
            ...expenses.map(e => ({
                type: 'expense',
                icon: '💸',
                title: e.name,
                subtitle: `${Utils.capitalize(e.category)} • -${Utils.formatCurrency(e.amount)}`,
                time: new Date(e.date).getTime()
            }))
        ].sort((a, b) => b.time - a.time).slice(0, 10);

        if (activities.length === 0) {
            DOM.activityList.innerHTML = '<p class="empty-state">No activity yet</p>';
            return;
        }

        DOM.activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.subtitle}</p>
                </div>
                <div class="activity-time">${Utils.formatDate(activity.time)}</div>
            </div>
        `).join('');
    };

    const addActivity = (title, subtitle) => {
        // Activities are auto-generated from sessions and expenses
    };

    const loadSettings = () => {
        const settings = Storage.getSettings();
        DOM.globalRate.value = settings.defaultHourlyRate || 50;
        DOM.manualRate.value = settings.defaultHourlyRate || 50;
        DOM.hourlyRate.value = settings.defaultHourlyRate || 50;

        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
            DOM.darkModeSetting.checked = true;
            DOM.themeToggle.textContent = '☀️';
        }
    };

    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        const settings = Storage.getSettings();
        settings.darkMode = document.body.classList.contains('dark-mode');
        Storage.updateSettings(settings);
        DOM.darkModeSetting.checked = settings.darkMode;
        DOM.themeToggle.textContent = settings.darkMode ? '☀️' : '🌙';
    };

    const clearAllData = () => {
        if (confirm('Are you sure? This will delete all your data. This cannot be undone.')) {
            if (confirm('Really sure? Click OK to delete everything.')) {
                Storage.clearAllData();
                init();
                alert('All data cleared');
            }
        }
    };

    const exportData = () => {
        const data = Storage.exportData();
        Utils.downloadFile(data, `freelance-tracker-${Utils.getTodayDate()}.json`);
    };

    return {
        init,
        deleteSession,
        deleteProject,
        deleteExpense,
        updateDashboard
    };
})();

document.addEventListener('DOMContentLoaded', App.init);
