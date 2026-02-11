"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEngine = void 0;
class RiskEngine {
    static calculateRisk(findings) {
        let totalScore = 0;
        findings.forEach((finding) => {
            const weight = this.SEVERITY_WEIGHTS[finding.severity] || 0;
            totalScore += weight;
        });
        const level = this.determineRiskLevel(totalScore);
        return { score: totalScore, level };
    }
    static determineRiskLevel(score) {
        if (score < 10)
            return 'LOW';
        if (score < 30)
            return 'MEDIUM';
        if (score < 60)
            return 'HIGH';
        return 'CRITICAL';
    }
}
exports.RiskEngine = RiskEngine;
RiskEngine.SEVERITY_WEIGHTS = {
    LOW: 1,
    MEDIUM: 3,
    HIGH: 7,
    CRITICAL: 10,
};
//# sourceMappingURL=RiskEngine.js.map