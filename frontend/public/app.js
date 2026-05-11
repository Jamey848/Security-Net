// Configuration - students will need to configure this via environment variables in their container
const API_URL = "http://localhost:3000/api";
/*window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : `${window.location.protocol}//${window.location.hostname}:3000/api`;*/

// Application state
let audits = [];
let findings = [];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Security Audit Tracker initialized');
    console.log('API URL:', API_URL);

    checkAPIHealth();
    loadDashboardData();
    setupEventListeners();

    // Refresh data every 30 seconds
    setInterval(loadDashboardData, 30000);
});

// Event Listeners
function setupEventListeners() {
    const auditForm = document.getElementById('auditForm');
    if (auditForm) {
        auditForm.addEventListener('submit', handleAuditSubmit);
    }
}

// API Health Check
async function checkAPIHealth() {
    const statusElement = document.getElementById('apiStatus');
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();

        if (data.status === 'healthy') {
            statusElement.textContent = 'Healthy';
            statusElement.className = 'status-indicator healthy';
        } else {
            statusElement.textContent = 'Degraded';
            statusElement.className = 'status-indicator';
        }
    } catch (error) {
        console.error('Health check failed:', error);
        statusElement.textContent = 'Unavailable';
        statusElement.className = 'status-indicator unhealthy';
    }
}

// Load all dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadAudits(),
        loadFindings(),
        loadStats()
    ]);
}

// Load audits from API
async function loadAudits() {
    try {
        const response = await fetch(`${API_URL}/audits`);
        if (!response.ok) throw new Error('Failed to fetch audits');

        audits = await response.json();
        renderAuditsTable();
    } catch (error) {
        console.error('Error loading audits:', error);
        showError('auditsTableBody', 'Failed to load audits. Please check API connection.');
    }
}

// Load findings from API
async function loadFindings() {
    try {
        const response = await fetch(`${API_URL}/findings?severity=critical`);
        if (!response.ok) throw new Error('Failed to fetch findings');

        findings = await response.json();
        renderFindings();
    } catch (error) {
        console.error('Error loading findings:', error);
        showError('findingsList', 'Failed to load findings. Please check API connection.');
    }
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');

        const stats = await response.json();
        renderStats(stats);
    } catch (error) {
        console.error('Error loading stats:', error);
        // Set default values on error
        document.getElementById('totalAudits').textContent = '0';
        document.getElementById('criticalFindings').textContent = '0';
        document.getElementById('pendingActions').textContent = '0';
        document.getElementById('resolvedIssues').textContent = '0';
    }
}

// Render statistics
function renderStats(stats) {
    document.getElementById('totalAudits').textContent = stats.totalAudits || 0;
    document.getElementById('criticalFindings').textContent = stats.criticalFindings || 0;
    document.getElementById('pendingActions').textContent = stats.pendingActions || 0;
    document.getElementById('resolvedIssues').textContent = stats.resolvedIssues || 0;
}

// Render audits table
function renderAuditsTable() {
    const tbody = document.getElementById('auditsTableBody');

    if (audits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No audits found. Create your first audit!</td></tr>';
        return;
    }

    tbody.innerHTML = audits.map(audit => `
        <tr>
            <td><strong>${escapeHtml(audit.system_name)}</strong></td>
            <td>${formatAuditType(audit.audit_type)}</td>
            <td>${escapeHtml(audit.auditor)}</td>
            <td>${formatDate(audit.audit_date)}</td>
            <td><span class="status-badge status-${audit.status}">${formatStatus(audit.status)}</span></td>
            <td><span class="severity-${audit.severity_level || 'low'}">${audit.findings_count || 0} findings</span></td>
            <td>
                <button class="btn btn-danger" onclick="deleteAudit(${audit.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Render findings
function renderFindings() {
    const container = document.getElementById('findingsList');

    if (findings.length === 0) {
        container.innerHTML = '<p class="loading">No critical findings found. Great job!</p>';
        return;
    }

    container.innerHTML = findings.map(finding => `
        <div class="finding-card ${finding.severity}">
            <div class="finding-header">
                <div class="finding-title">${escapeHtml(finding.title)}</div>
                <span class="severity-${finding.severity}">${finding.severity.toUpperCase()}</span>
            </div>
            <div class="finding-description">${escapeHtml(finding.description)}</div>
            <div class="finding-meta">
                System: ${escapeHtml(finding.system_name)} |
                Discovered: ${formatDate(finding.discovered_date)} |
                Status: ${formatStatus(finding.status)}
            </div>
        </div>
    `).join('');
}

// Handle audit form submission
async function handleAuditSubmit(e) {
    e.preventDefault();

    const formData = {
        system_name: document.getElementById('systemName').value,
        audit_type: document.getElementById('auditType').value,
        auditor: document.getElementById('auditor').value
    };

    try {
        const response = await fetch(`${API_URL}/audits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to create audit');

        // Reset form and reload data
        document.getElementById('auditForm').reset();
        hideAddAuditForm();
        await loadDashboardData();

        alert('Audit created successfully!');
    } catch (error) {
        console.error('Error creating audit:', error);
        alert('Failed to create audit. Please try again.');
    }
}

// Delete audit
async function deleteAudit(id) {
    if (!confirm('Are you sure you want to delete this audit?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/audits/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete audit');

        await loadDashboardData();
        alert('Audit deleted successfully!');
    } catch (error) {
        console.error('Error deleting audit:', error);
        alert('Failed to delete audit. Please try again.');
    }
}

// UI Helper Functions
function showAddAuditForm() {
    document.getElementById('addAuditForm').style.display = 'block';
}

function hideAddAuditForm() {
    document.getElementById('addAuditForm').style.display = 'none';
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}

// Formatting helpers
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatAuditType(type) {
    return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatStatus(status) {
    return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
