import { Scanner } from '../src/services/Scanner';

describe('Scanner', () => {
    it('should return findings for a given URL', async () => {
        const findings = await Scanner.scan('http://example.com');
        expect(findings.length).toBeGreaterThan(0);
        expect(findings[0]).toHaveProperty('type');
        expect(findings[0]).toHaveProperty('severity');
    });
});
