"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RiskEngine_1 = require("../src/services/RiskEngine");
describe('RiskEngine', () => {
    it('should calculate LOW risk for single low severity finding', () => {
        const findings = [
            { severity: 'LOW' }
        ];
        const result = RiskEngine_1.RiskEngine.calculateRisk(findings);
        expect(result.score).toBe(1);
        expect(result.level).toBe('LOW');
    });
    it('should calculate CRITICAL risk for multiple high severity findings', () => {
        const findings = [
            { severity: 'CRITICAL' },
            { severity: 'CRITICAL' },
            { severity: 'CRITICAL' },
            { severity: 'CRITICAL' },
            { severity: 'CRITICAL' },
            { severity: 'CRITICAL' },
        ];
        const result = RiskEngine_1.RiskEngine.calculateRisk(findings);
        expect(result.score).toBeGreaterThan(59);
        expect(result.level).toBe('CRITICAL');
    });
    it('should handle empty findings', () => {
        const result = RiskEngine_1.RiskEngine.calculateRisk([]);
        expect(result.score).toBe(0);
        expect(result.level).toBe('LOW');
    });
});
//# sourceMappingURL=riskEngine.test.js.map