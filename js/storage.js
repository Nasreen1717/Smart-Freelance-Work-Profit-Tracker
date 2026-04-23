const Storage = (() => {
    const STORAGE_KEYS = {
        sessions: 'ft_sessions',
        expenses: 'ft_expenses',
        projects: 'ft_projects',
        settings: 'ft_settings'
    };

    const getItem = (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    };

    const setItem = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    return {
        // Sessions CRUD
        getSessions() {
            return getItem(STORAGE_KEYS.sessions) || [];
        },

        addSession(session) {
            const sessions = this.getSessions();
            session.id = Date.now().toString();
            sessions.push(session);
            setItem(STORAGE_KEYS.sessions, sessions);
            return session;
        },

        deleteSession(id) {
            const sessions = this.getSessions();
            const filtered = sessions.filter(s => s.id !== id);
            setItem(STORAGE_KEYS.sessions, filtered);
        },

        // Expenses CRUD
        getExpenses() {
            return getItem(STORAGE_KEYS.expenses) || [];
        },

        addExpense(expense) {
            const expenses = this.getExpenses();
            expense.id = Date.now().toString();
            expenses.push(expense);
            setItem(STORAGE_KEYS.expenses, expenses);
            return expense;
        },

        deleteExpense(id) {
            const expenses = this.getExpenses();
            const filtered = expenses.filter(e => e.id !== id);
            setItem(STORAGE_KEYS.expenses, filtered);
        },

        // Projects CRUD
        getProjects() {
            return getItem(STORAGE_KEYS.projects) || [];
        },

        addProject(project) {
            const projects = this.getProjects();
            project.id = Date.now().toString();
            project.createdAt = new Date().toISOString();
            projects.push(project);
            setItem(STORAGE_KEYS.projects, projects);
            return project;
        },

        deleteProject(id) {
            const projects = this.getProjects();
            const filtered = projects.filter(p => p.id !== id);
            setItem(STORAGE_KEYS.projects, filtered);
        },

        // Settings
        getSettings() {
            return getItem(STORAGE_KEYS.settings) || {
                defaultHourlyRate: 50,
                darkMode: false
            };
        },

        updateSettings(settings) {
            setItem(STORAGE_KEYS.settings, settings);
        },

        // Data Export/Import
        exportData() {
            return {
                sessions: this.getSessions(),
                expenses: this.getExpenses(),
                projects: this.getProjects(),
                settings: this.getSettings(),
                exportedAt: new Date().toISOString()
            };
        },

        importData(data) {
            if (data.sessions) setItem(STORAGE_KEYS.sessions, data.sessions);
            if (data.expenses) setItem(STORAGE_KEYS.expenses, data.expenses);
            if (data.projects) setItem(STORAGE_KEYS.projects, data.projects);
            if (data.settings) setItem(STORAGE_KEYS.settings, data.settings);
        },

        clearAllData() {
            localStorage.removeItem(STORAGE_KEYS.sessions);
            localStorage.removeItem(STORAGE_KEYS.expenses);
            localStorage.removeItem(STORAGE_KEYS.projects);
            localStorage.removeItem(STORAGE_KEYS.settings);
        }
    };
})();
