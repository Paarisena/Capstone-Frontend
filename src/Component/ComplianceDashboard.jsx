/**
 * SOC COMPLIANCE DASHBOARD (Optimized)
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ComplianceDashboard.css';

const API = import.meta.env.VITE_BE_URL;

const ComplianceDashboard = () => {
    const [health, setHealth] = useState(null);
    const [report, setReport] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('24h');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetch = async (url) => {
        try {
            const fullUrl = `${API}${url}`;
            console.log('📡 Fetching:', fullUrl);
            const { data } = await axios.get(fullUrl);
            console.log('✅ Received data from', url, ':', data);
            return data;
        } catch (e) {
            console.error('❌ Error fetching', url, ':', e.message);
            return null;
        }
    };

    const load = async () => {
        console.log('🔄 Loading compliance dashboard data...');
        setLoading(true);
        const [h, r, a, e] = await Promise.all([
            fetch('/api/health'),
            fetch(`/api/compliance/status?period=${period}`),
            fetch(`/api/compliance/analytics?period=${period}`),
            fetch(`/api/compliance/events?limit=50&type=${filter}`)
        ]);
        console.log('📊 Dashboard data loaded:', { health: h, report: r, analytics: a, events: e });
        setHealth(h);
        setReport(r);
        setAnalytics(a);
        setEvents(e?.events || []);
        setLoading(false);
    };

    const generateTestEvent = async () => {
        try {
            console.log('🧪 Generating test event...');
            // Generate a random event type
            const eventTypes = ['SECURITY', 'FINANCIAL', 'PRIVACY', 'CONFIDENTIAL'];
            const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            
            const { data } = await axios.post(`${API}/api/compliance/test-event`, {
                eventType: randomType
            });
            console.log(`✅ Test ${randomType} event generated:`, data);
            
            // Reload both analytics and events immediately
            const [a, e] = await Promise.all([
                fetch(`/api/compliance/analytics?period=${period}`),
                fetch(`/api/compliance/events?limit=50&type=${filter}`)
            ]);
            setAnalytics(a);
            setEvents(e?.events || []);
        } catch (error) {
            console.error('❌ Error generating test event:', error);
        }
    };

    const syncFinancialLogs = async () => {
        try {
            console.log('🔄 Syncing financial audit logs...');
            const { data } = await axios.post(`${API}/api/compliance/sync-financial-logs`);
            console.log('✅ Sync result:', data);
            alert(`Synced ${data.updated} financial logs successfully!`);
            
            // Reload data
            await load();
        } catch (error) {
            console.error('❌ Error syncing financial logs:', error);
            alert('Error syncing financial logs');
        }
    };

    useEffect(() => { load(); }, [period]);
    useEffect(() => { fetch(`/api/compliance/events?limit=50&type=${filter}`).then(d => setEvents(d?.events || [])); }, [filter]);
    useEffect(() => {
        load();
        
        // Only auto-refresh if enabled
        if (autoRefresh) {
            const interval = setInterval(load, 30000); // 30 seconds to avoid rate limiting
            return () => clearInterval(interval);
        }
    }, [autoRefresh, period, filter]);

    if (loading) return <div className="compliance-dashboard loading"><div className="loading-spinner"></div><p>Loading...</p></div>;

    return (
        <div className="compliance-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>🛡️ SOC Compliance Dashboard</h1>
                <div className="header-controls">
                    <button className="refresh-btn" onClick={generateTestEvent} title="Generate a test security event">
                        🧪 Test Event
                    </button>
                    <button className="refresh-btn" onClick={syncFinancialLogs} title="Sync financial audit logs with payment statuses">
                        🔄 Sync Finance
                    </button>
                    <button className={`refresh-btn ${autoRefresh ? 'active' : ''}`} onClick={() => setAutoRefresh(!autoRefresh)}>
                        {autoRefresh ? '⏸️ Auto-Refresh ON' : '▶️ Auto-Refresh OFF'}
                    </button>
                    <button className="refresh-btn" onClick={load}>Refresh</button>
                </div>
            </div>

            {/* Badges */}
            <div className="certification-badges">
                {['SOC 1', 'SOC 2', 'SOC 3'].map((s, i) => (
                    <div key={i} className="badge">
                        <div className="badge-icon">{['📊', '🔒', '🏆'][i]}</div>
                        <div className="badge-content">
                            <h3>{s}</h3>
                            <p>Type II</p>
                            <span className="badge-status certified">✅ CERTIFIED</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Health */}
            {health && (
                <div className="health-section">
                    <h2>🏥 System Health</h2>
                    <div className="health-grid">
                        <div className={`health-card status-${health.status.toLowerCase()}`}>
                            <div className="card-header">
                                <span className="card-icon">{health.status === 'UP' ? '✅' : '⚠️'}</span>
                                <h3>Status</h3>
                            </div>
                            <div className="card-value">{health.status}</div>
                            <div className="card-detail">Uptime: {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m</div>
                        </div>
                        {['database', 'memory', 'cpu'].map((k, i) => (
                            <div key={i} className={`health-card status-${health.checks?.[k]?.status.toLowerCase()}`}>
                                <div className="card-header">
                                    <span className="card-icon">{['🗄️', '💾', '⚡'][i]}</span>
                                    <h3>{k.charAt(0).toUpperCase() + k.slice(1)}</h3>
                                </div>
                                <div className="card-value">{health.checks?.[k]?.status || 'UNKNOWN'}</div>
                                <div className="card-detail">
                                    {k === 'database' && (health.checks?.[k]?.type || 'MongoDB')}
                                    {k === 'memory' && `${health.checks?.[k]?.heapUsed} / ${health.checks?.[k]?.heapTotal}`}
                                    {k === 'cpu' && 'Normal'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Period */}
            <div className="period-selector">
                {['1h', '24h', '7d', '30d'].map(p => (
                    <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>
                        {p === '1h' ? '1 Hour' : p === '24h' ? '24 Hours' : p === '7d' ? '7 Days' : '30 Days'}
                    </button>
                ))}
            </div>

            {/* Compliance */}
            {report && (
                <div className="compliance-section">
                    <h2>📊 Compliance ({period})</h2>
                    <div className="compliance-grid">
                        {[
                            { icon: '🔍', title: 'Total', value: report.totalChecks || 0, detail: `${report.totalRuns || 0} runs` },
                            { icon: '✅', title: 'Passed', value: report.totalPassed || 0, detail: report.averagePassRate || '0%', class: 'success' },
                            { icon: '❌', title: 'Failed', value: report.totalFailed || 0, detail: report.totalFailed === 0 ? 'No issues' : 'Needs attention', class: 'failure' },
                            { icon: report.complianceStatus === 'COMPLIANT' ? '🎉' : '⚠️', title: 'Status', value: report.complianceStatus || 'UNKNOWN', detail: report.complianceStatus === 'COMPLIANT' ? 'Operational' : 'Action required', class: report.complianceStatus === 'COMPLIANT' ? 'success' : 'warning' }
                        ].map((c, i) => (
                            <div key={i} className={`compliance-card ${c.class || ''}`}>
                                <div className="card-icon">{c.icon}</div>
                                <div className="card-content">
                                    <h3>{c.title}</h3>
                                    <div className="card-value">{c.value}</div>
                                    <div className="card-detail">{c.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analytics */}
            {analytics && (
                <div className="analytics-section">
                    <h2>📈 Analytics ({period})</h2>
                    <div className="analytics-grid">
                        {[
                            { icon: '🔐', title: 'Security', data: analytics.security, key: 'totalEvents' },
                            { icon: '💰', title: 'Financial', data: analytics.financial, key: 'totalTransactions' },
                            { icon: '🔒', title: 'Confidential', data: analytics.confidential, key: 'totalAccesses' },
                            { icon: '🔐', title: 'Privacy', data: analytics.privacy, key: 'totalEvents' }
                        ].map((a, i) => (
                            <div key={i} className="analytics-card">
                                <div className="card-header">
                                    <span className="card-icon">{a.icon}</span>
                                    <h3>{a.title}</h3>
                                </div>
                                <div className="card-value">{a.data?.[a.key] || 0}</div>
                                <div className="card-details">
                                    {a.title === 'Financial' && a.data?.totalAmount && (
                                        <div className="detail-row">
                                            <span>Total Amount</span>
                                            <span className="detail-count">${(a.data.totalAmount || 0).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {(a.data?.byType || a.data?.byClassification || []).slice(0, 3).map((d, j) => (
                                        <div key={j} className="detail-row">
                                            <span>{d._id?.classification || d._id}</span>
                                            <span className="detail-count">{d.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trust Services */}
            <div className="trust-services-section">
                <h2>🎯 Trust Services (SOC 2)</h2>
                <div className="trust-grid">
                    {[
                        { icon: '🔒', title: 'Security', desc: 'Protected against unauthorized access' },
                        { icon: '⚡', title: 'Availability', desc: 'Available for operation as committed' },
                        { icon: '✔️', title: 'Processing Integrity', desc: 'Complete, valid, and accurate' },
                        { icon: '🔐', title: 'Confidentiality', desc: 'Confidential information protected' },
                        { icon: '🛡️', title: 'Privacy', desc: 'Personal information properly handled' }
                    ].map((t, i) => (
                        <div key={i} className="trust-card">
                            <div className="trust-icon">{t.icon}</div>
                            <h3>{t.title}</h3>
                            <p>{t.desc}</p>
                            <span className="trust-status">✅ COMPLIANT</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Events */}
            <div className="event-log-section">
                <div className="section-header">
                    <h2>📋 Recent Events</h2>
                    <div className="event-filters">
                        {['all', 'security', 'financial', 'privacy', 'confidential'].map(f => (
                            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                                {f === 'all' ? 'All' : `${{'security':'🔐','financial':'💰','privacy':'🔒','confidential':'🔐'}[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="event-log-container">
                    {events.length === 0 ? (
                        <div className="no-events"><p>📭 No events</p></div>
                    ) : (
                        <div className="event-list">
                            {events.map((e, i) => (
                                <div key={i} className={`event-item ${e.eventCategory?.toLowerCase() || 'unknown'}`}>
                                    <div className="event-icon">{e.icon || '📋'}</div>
                                    <div className="event-details">
                                        <div className="event-header">
                                            <span className="event-category">{e.eventCategory || 'UNKNOWN'}</span>
                                            <span className="event-time">{new Date(e.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className="event-body">
                                            {e.eventCategory === 'FINANCIAL' && (
                                                <>
                                                    <p><strong>TX:</strong> {e.type} - ${e.amount} {e.currency}</p>
                                                    <p><strong>User:</strong> {e.userId}</p>
                                                    <p><strong>Status:</strong> {e.status}</p>
                                                </>
                                            )}
                                            {e.eventCategory === 'SECURITY' && (
                                                <>
                                                    <p><strong>Action:</strong> {e.action}</p>
                                                    <p><strong>User:</strong> {e.userId}</p>
                                                    <p><strong>Result:</strong> {e.result}</p>
                                                    <p><strong>Severity:</strong> <span className={`severity ${e.severity?.toLowerCase()}`}>{e.severity}</span></p>
                                                </>
                                            )}
                                            {e.eventCategory === 'PRIVACY' && (
                                                <>
                                                    <p><strong>Action:</strong> {e.action}</p>
                                                    <p><strong>User:</strong> {e.userId}</p>
                                                </>
                                            )}
                                            {e.eventCategory === 'CONFIDENTIAL' && (
                                                <>
                                                    <p><strong>Resource:</strong> {e.resource}</p>
                                                    <p><strong>User:</strong> {e.userId}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="dashboard-footer">
                <p><strong>Period:</strong> Oct 30, 2025 - Oct 30, 2026 | <strong>Next Audit:</strong> Jul 30, 2026</p>
                <p className="last-updated">Updated: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
};

export default ComplianceDashboard;
