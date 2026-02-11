"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceEngine = void 0;
class ComplianceEngine {
    static mapFindingToControls(findingType) {
        return this.MAPPINGS[findingType] || [];
    }
}
exports.ComplianceEngine = ComplianceEngine;
ComplianceEngine.MAPPINGS = {
    'SQL Injection': [
        { standard: 'ISO 27001', controlId: 'A.12.6.1', description: 'Technical Vulnerability Management' },
        { standard: 'NIST', controlId: 'SI-10', description: 'Information Input Validation' },
    ],
    'Cross-Site Scripting (XSS)': [
        { standard: 'ISO 27001', controlId: 'A.14.2.1', description: 'Secure Development Policy' },
        { standard: 'NIST', controlId: 'SI-10', description: 'Information Input Validation' },
    ],
    'Security Misconfiguration': [
        { standard: 'ISO 27001', controlId: 'A.12.1.1', description: 'Documented Operating Procedures' },
        { standard: 'NIST', controlId: 'CM-6', description: 'Configuration Settings' },
    ]
};
//# sourceMappingURL=ComplianceEngine.js.map