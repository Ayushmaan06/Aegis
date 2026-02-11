"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
class Scanner {
    static async scan(url) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const findings = [];
                const numberOfFindings = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < numberOfFindings; i++) {
                    const randomIdx = Math.floor(Math.random() * this.VULNERABILITY_POOL.length);
                    findings.push(this.VULNERABILITY_POOL[randomIdx]);
                }
                resolve(findings);
            }, 1000);
        });
    }
}
exports.Scanner = Scanner;
Scanner.VULNERABILITY_POOL = [
    { type: 'SQL Injection', severity: 'CRITICAL', description: 'Possible SQL injection in login parameter' },
    { type: 'Cross-Site Scripting (XSS)', severity: 'HIGH', description: 'Reflected XSS in search query' },
    { type: 'Insecure Direct Object References', severity: 'HIGH', description: 'User ID parameter exposes other users data' },
    { type: 'Security Misconfiguration', severity: 'MEDIUM', description: 'Default error pages enabled' },
    { type: 'Missing Security Headers', severity: 'LOW', description: 'X-XSS-Protection header missing' },
    { type: 'Weak Password Policy', severity: 'MEDIUM', description: 'Password length requirement too low' },
];
//# sourceMappingURL=Scanner.js.map