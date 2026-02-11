
export interface MockFinding {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
}

export class Scanner {
    private static VULNERABILITY_POOL: MockFinding[] = [
        { type: 'SQL Injection', severity: 'CRITICAL', description: 'Possible SQL injection in login parameter' },
        { type: 'Cross-Site Scripting (XSS)', severity: 'HIGH', description: 'Reflected XSS in search query' },
        { type: 'Insecure Direct Object References', severity: 'HIGH', description: 'User ID parameter exposes other users data' },
        { type: 'Security Misconfiguration', severity: 'MEDIUM', description: 'Default error pages enabled' },
        { type: 'Missing Security Headers', severity: 'LOW', description: 'X-XSS-Protection header missing' },
        { type: 'Weak Password Policy', severity: 'MEDIUM', description: 'Password length requirement too low' },
    ];

    /**
     * Simulate a scan on a target URL
     */
    public static async scan(url: string): Promise<MockFinding[]> {
        return new Promise((resolve) => {
            // Simulate scan delay
            setTimeout(() => {
                const findings: MockFinding[] = [];
                const numberOfFindings = Math.floor(Math.random() * 5) + 1; // 1 to 5 findings

                for (let i = 0; i < numberOfFindings; i++) {
                    const randomIdx = Math.floor(Math.random() * this.VULNERABILITY_POOL.length);
                    findings.push(this.VULNERABILITY_POOL[randomIdx]);
                }

                resolve(findings);
            }, 1000);
        });
    }
}
