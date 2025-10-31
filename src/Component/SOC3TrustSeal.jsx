/**
 * SOC 3 TRUST SEAL (Optimized)
 */

import React, { useState } from 'react';
import './SOC3TrustSeal.css';

const SOC3TrustSeal = ({ size = 'medium', showDetails = false }) => {
    const [expanded, setExpanded] = useState(false);
    const sizes = { small: '100px', medium: '150px', large: '200px' };

    return (
        <div className="soc3-container">
            <div className={`soc3-seal ${size} ${expanded ? 'expanded' : ''}`} style={{ width: sizes[size] }} onClick={() => showDetails && setExpanded(!expanded)}>
                <div className="seal-header">
                    <div className="seal-icon">🛡️</div>
                    <div className="seal-title">SOC 3 CERTIFIED</div>
                </div>
                <div className="seal-body">
                    <div className="company-name">AVGallery</div>
                    <div className="trust-badges">
                        {['🔒', '⚡', '✔️', '🔐', '🛡️'].map((icon, i) => (
                            <div key={i} className="trust-badge" title={['Security', 'Availability', 'Integrity', 'Confidentiality', 'Privacy'][i]}>{icon}</div>
                        ))}
                    </div>
                    <div className="validity-period">Valid: Oct 2025 - Oct 2026</div>
                </div>
                {showDetails && <div className="seal-footer">Click for details</div>}
            </div>

            {expanded && showDetails && (
                <div className="seal-details">
                    <div className="details-header">
                        <h3>🛡️ SOC 3 Certification</h3>
                        <button className="close-btn" onClick={() => setExpanded(false)}>×</button>
                    </div>
                    <div className="details-content">
                        <div className="detail-section">
                            <h4>What is SOC 3?</h4>
                            <p>Public trust seal demonstrating highest standards of security, availability, processing integrity, confidentiality, and privacy.</p>
                        </div>
                        <div className="detail-section">
                            <h4>Trust Services Principles</h4>
                            <div className="principles-list">
                                {[
                                    { icon: '🔒', title: 'Security', desc: 'Protected against unauthorized access' },
                                    { icon: '⚡', title: 'Availability', desc: 'Available for operation as committed' },
                                    { icon: '✔️', title: 'Processing Integrity', desc: 'Processing is complete, valid, and accurate' },
                                    { icon: '🔐', title: 'Confidentiality', desc: 'Confidential information is protected' },
                                    { icon: '🛡️', title: 'Privacy', desc: 'Personal information handled properly' }
                                ].map((p, i) => (
                                    <div key={i} className="principle">
                                        <span className="principle-icon">{p.icon}</span>
                                        <div className="principle-content">
                                            <strong>{p.title}</strong>
                                            <p>{p.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="detail-section">
                            <h4>Certification Period</h4>
                            <p><strong>Issued:</strong> Oct 30, 2025<br /><strong>Expires:</strong> Oct 30, 2026<br /><strong>Next Audit:</strong> Jul 30, 2026</p>
                        </div>
                        <div className="detail-section">
                            <h4>What This Means</h4>
                            <ul>
                                {[
                                    'Enterprise-grade security',
                                    '24/7 system monitoring',
                                    'Secure & accurate processing',
                                    'Confidential information protected',
                                    'Privacy rights respected'
                                ].map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                        </div>
                        <div className="detail-section certifications">
                            <h4>Our Compliance</h4>
                            <div className="cert-badges">
                                {[
                                    { icon: '📊', name: 'SOC 1 Type II' },
                                    { icon: '🔒', name: 'SOC 2 Type II' },
                                    { icon: '🏆', name: 'SOC 3' }
                                ].map((c, i) => (
                                    <div key={i} className="cert-badge">
                                        <div className="cert-icon">{c.icon}</div>
                                        <div className="cert-name">{c.name}</div>
                                        <div className="cert-status">✅ Certified</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const SOC3TrustSealCompact = () => (
    <div className="soc3-compact">
        <div className="compact-icon">🛡️</div>
        <div className="compact-text">
            <div className="compact-title">SOC 3 Certified</div>
            <div className="compact-subtitle">Trust & Security</div>
        </div>
    </div>
);

export const SOC3Badge = () => (
    <div className="soc3-badge">
        <div className="badge-top">
            <div className="badge-icon">🏆</div>
            <div className="badge-text">SOC 3</div>
        </div>
        <div className="badge-bottom">
            <div className="badge-label">CERTIFIED</div>
            <div className="badge-year">2025-2026</div>
        </div>
    </div>
);

export default SOC3TrustSeal;
