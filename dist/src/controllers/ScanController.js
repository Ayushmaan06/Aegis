"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanController = void 0;
const database_1 = __importDefault(require("../config/database"));
const Scanner_1 = require("../services/Scanner");
const RiskEngine_1 = require("../services/RiskEngine");
const ComplianceEngine_1 = require("../services/ComplianceEngine");
class ScanController {
    static async triggerScan(req, res) {
        try {
            const { applicationId } = req.body;
            const app = await database_1.default.application.findUnique({ where: { id: applicationId } });
            if (!app) {
                res.status(404).json({ error: 'Application not found' });
                return;
            }
            const findingsData = await Scanner_1.Scanner.scan(app.url);
            const result = await database_1.default.$transaction(async (tx) => {
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
                    const complianceControls = ComplianceEngine_1.ComplianceEngine.mapFindingToControls(f.type);
                    for (const control of complianceControls) {
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
                const { score, level } = RiskEngine_1.RiskEngine.calculateRisk(findings);
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Scan failed' });
        }
    }
}
exports.ScanController = ScanController;
//# sourceMappingURL=ScanController.js.map