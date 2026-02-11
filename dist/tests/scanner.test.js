"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Scanner_1 = require("../src/services/Scanner");
describe('Scanner', () => {
    it('should return findings for a given URL', async () => {
        const findings = await Scanner_1.Scanner.scan('http://example.com');
        expect(findings.length).toBeGreaterThan(0);
        expect(findings[0]).toHaveProperty('type');
        expect(findings[0]).toHaveProperty('severity');
    });
});
//# sourceMappingURL=scanner.test.js.map