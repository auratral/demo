import React from 'react';
import { ShieldCheck, Lock, CheckCircle, FileText } from 'lucide-react';
import './ComplianceBar.css';

const ComplianceBar = () => {
    return (
        <div className="compliance-bar-wrapper">
            <div className="compliance-bar glass-panel">
                <div className="compliance-item">
                    <ShieldCheck className="text-blue-400" size={20} />
                    <div>
                        <div className="compliance-title">HIPAA Compliant</div>
                        <div className="compliance-desc">Safe Harbor / Expert Determination</div>
                    </div>
                </div>

                <div className="compliance-divider"></div>

                <div className="compliance-item">
                    <Lock className="text-purple-400" size={20} />
                    <div>
                        <div className="compliance-title">GDPR Health Data</div>
                        <div className="compliance-desc">Article 9 Special Category Ready</div>
                    </div>
                </div>

                <div className="compliance-divider"></div>

                <div className="compliance-item">
                    <ShieldCheck className="text-green-400" size={20} />
                    <div>
                        <div className="compliance-title">DPDP Act India</div>
                        <div className="compliance-desc">Digital Personal Data Protection</div>
                    </div>
                </div>

                <div className="compliance-divider"></div>

                <div className="compliance-item">
                    <CheckCircle className="text-pink-400" size={20} />
                    <div>
                        <div className="compliance-title">ISO 27001 Status</div>
                        <div className="compliance-desc">Certification In Progress (Roadmap)</div>
                    </div>
                </div>

                <div className="compliance-divider"></div>

                <div className="compliance-item">
                    <FileText className="text-blue-400" size={20} />
                    <div>
                        <div className="compliance-title">Ethical Use</div>
                        <div className="compliance-desc">IRB-Compatible DUA Available</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceBar;
