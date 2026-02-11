
import { Finding, RiskAssessment } from '@prisma/client';

export class RiskEngine {
    private static SEVERITY_WEIGHTS: Record<string, number> = {
        LOW: 1,
        MEDIUM: 3,
        HIGH: 7,
        CRITICAL: 10,
    };

    /**
     * Calculate risk score based on findings
     */
    public static calculateRisk(findings: Finding[]): { score: number; level: string } {
        let totalScore = 0;

        findings.forEach((finding) => {
            const weight = this.SEVERITY_WEIGHTS[finding.severity] || 0;
            // We can add logic for Likelihood if finding has it, assuming fixed likelihood for now (1.0)
            totalScore += weight;
        });

        const level = this.determineRiskLevel(totalScore);

        return { score: totalScore, level };
    }

    private static determineRiskLevel(score: number): string {
        if (score < 10) return 'LOW';
        if (score < 30) return 'MEDIUM';
        if (score < 60) return 'HIGH';
        return 'CRITICAL';
    }
}
