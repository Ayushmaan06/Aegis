import { Request, Response } from 'express';
import prisma from '../config/database';
import { Scanner } from '../services/Scanner';
import { RiskEngine } from '../services/RiskEngine';
import { ComplianceEngine } from '../services/ComplianceEngine';

export class ScanController {
    static async triggerScan(req: Request, res: Response): Promise<void> {
        try {
            const { applicationId } = req.body;
            const app = await prisma.application.findUnique({ where: { id: applicationId } });

            if (!app) {
                res.status(404).json({ error: 'Application not found' });
                return;
            }

            // 1. Run Scan
            const findingsData = await Scanner.scan(app.url);

            // 2. Save Findings
            // using transaction to ensure data integrity
            const result = await prisma.$transaction(async (tx) => {
                // Clear previous findings? Or keep history? For now let's just add new ones.
                // Actually, let's delete old open findings for simplicity in this demo or just append.
                // Let's append but maybe mark old ones as resolved if not found? 
                // For simplicity, we just create new findings.

                const findings = [];
                for (const f of findingsData) {
                    const finding = await tx.finding.create({
                        data: {
                            applicationId: app.id,
                            type: f.type,
                            severity: f.severity,
                            description: f.description,
                            status: 'OPEN'
                        }
                    });
                    findings.push(finding);

                    // 3. Map Compliance
                    const complianceControls = ComplianceEngine.mapFindingToControls(f.type);
                    for (const control of complianceControls) {
                        // Upsert standard logic omitted for brevity, assuming we create on fly or link
                        // Since we have strict Referencing in DB, we need Standards to exist.
                        // For this demo, we might skip DB relation for Standard if we haven't seeded them,
                        // OR we handle it properly:

                        // Check if standard exists (cache optimizations would be good here)
                        let standard = await tx.complianceStandard.findFirst({
                            where: { name: control.standard }
                        });

                        if (!standard) {
                            standard = await tx.complianceStandard.create({
                                data: { name: control.standard, version: '1.0' }
                            });
                        }

                        await tx.complianceMapping.create({
                            data: {
                                findingId: finding.id,
                                standardId: standard.id,
                                controlId: control.controlId
                            }
                        });
                    }
                }

                // 4. Calculate Risk
                const { score, level } = RiskEngine.calculateRisk(findings);

                const riskAssessment = await tx.riskAssessment.create({
                    data: {
                        applicationId: app.id,
                        score,
                        level
                    }
                });

                return { findings: findings.length, risk: riskAssessment };
            });

            res.status(200).json({ message: 'Scan completed successfully', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Scan failed' });
        }
    }
}
