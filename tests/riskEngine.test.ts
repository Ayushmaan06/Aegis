import { RiskEngine } from '../src/services/RiskEngine';
import { Finding } from '@prisma/client';

describe('RiskEngine', () => {
    it('should calculate LOW risk for single low severity finding', () => {
        const findings = [
            { severity: 'LOW' }
        ] as Finding[];

        const result = RiskEngine.calculateRisk(findings);
        expect(result.score).toBe(1);
        expect(result.level).toBe('LOW');
    });

    it('should calculate CRITICAL risk for multiple high severity findings', () => {
        const findings = [
            { severity: 'CRITICAL' }, // 10
            { severity: 'CRITICAL' }, // 10
            { severity: 'CRITICAL' }, // 10
            { severity: 'CRITICAL' }, // 10
            { severity: 'CRITICAL' }, // 10
            { severity: 'CRITICAL' }, // 10 -> 60
        ] as Finding[];

        const result = RiskEngine.calculateRisk(findings);
        expect(result.score).toBeGreaterThan(59);
        expect(result.level).toBe('CRITICAL');
    });

    it('should handle empty findings', () => {
        const result = RiskEngine.calculateRisk([]);
        expect(result.score).toBe(0);
        expect(result.level).toBe('LOW');
    });
});
