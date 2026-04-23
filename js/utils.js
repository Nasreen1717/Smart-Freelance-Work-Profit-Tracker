const Utils = (() => {
    return {
        // Format currency
        formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        },

        // Format time (HH:MM:SS)
        formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return [hours, minutes, secs]
                .map(v => String(v).padStart(2, '0'))
                .join(':');
        },

        // Parse time string (HH:MM) to seconds
        parseTime(timeString) {
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 3600 + minutes * 60;
        },

        // Calculate duration between two times (in seconds)
        calculateDuration(startTime, endTime) {
            const start = this.parseTime(startTime);
            const end = this.parseTime(endTime);
            return end > start ? end - start : 0;
        },

        // Convert seconds to hours (with decimals)
        secondsToHours(seconds) {
            return (seconds / 3600).toFixed(2);
        },

        // Format date
        formatDate(date) {
            if (typeof date === 'string') date = new Date(date);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        // Format date and time
        formatDateTime(date) {
            if (typeof date === 'string') date = new Date(date);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        // Get today's date in YYYY-MM-DD format
        getTodayDate() {
            const today = new Date();
            return today.toISOString().split('T')[0];
        },

        // Get current time in HH:MM format
        getCurrentTime() {
            const now = new Date();
            return [now.getHours(), now.getMinutes()]
                .map(v => String(v).padStart(2, '0'))
                .join(':');
        },

        // Get start of day as timestamp
        getStartOfDay(date = new Date()) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        },

        // Get end of day as timestamp
        getEndOfDay(date = new Date()) {
            const d = new Date(date);
            d.setHours(23, 59, 59, 999);
            return d.getTime();
        },

        // Get start of week
        getStartOfWeek(date = new Date()) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day;
            d.setDate(diff);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        },

        // Get end of week
        getEndOfWeek(date = new Date()) {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + 6;
            d.setDate(diff);
            d.setHours(23, 59, 59, 999);
            return d.getTime();
        },

        // Get start of month
        getStartOfMonth(date = new Date()) {
            const d = new Date(date);
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        },

        // Get end of month
        getEndOfMonth(date = new Date()) {
            const d = new Date(date);
            d.setMonth(d.getMonth() + 1);
            d.setDate(0);
            d.setHours(23, 59, 59, 999);
            return d.getTime();
        },

        // Filter sessions by date range
        filterByDateRange(items, startDate, endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            return items.filter(item => {
                const itemTime = new Date(item.date || item.createdAt).getTime();
                return itemTime >= start && itemTime <= end;
            });
        },

        // Get date range label
        getDateRangeLabel(startDate, endDate) {
            const start = this.formatDate(startDate);
            const end = this.formatDate(endDate);
            return `${start} - ${end}`;
        },

        // Copy to clipboard
        copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Copied to clipboard');
            });
        },

        // Download file
        downloadFile(data, filename) {
            const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        },

        // Generate CSV from array of objects
        generateCSV(data, headers) {
            const csvHeaders = headers.join(',');
            const csvRows = data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value}"`;
                    }
                    return value;
                }).join(',')
            );
            return [csvHeaders, ...csvRows].join('\n');
        },

        // Debounce function
        debounce(func, delay) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, delay);
            };
        },

        // Format percentage
        formatPercentage(value) {
            return `${(value * 100).toFixed(1)}%`;
        },

        // Group array by key
        groupBy(array, key) {
            return array.reduce((acc, obj) => {
                const group = obj[key];
                if (!acc[group]) acc[group] = [];
                acc[group].push(obj);
                return acc;
            }, {});
        },

        // Sum array of objects by key
        sumBy(array, key) {
            return array.reduce((sum, obj) => sum + (obj[key] || 0), 0);
        },

        // Average array of objects by key
        averageBy(array, key) {
            if (array.length === 0) return 0;
            return this.sumBy(array, key) / array.length;
        },

        // Capitalize string
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        // Get week number
        getWeekNumber(date = new Date()) {
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        },

        // Get day name
        getDayName(date = new Date()) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        },

        // Get month name
        getMonthName(date = new Date()) {
            return date.toLocaleDateString('en-US', { month: 'short' });
        }
    };
})();
