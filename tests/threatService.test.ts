import { ThreatService } from '../src/services/ThreatService';
import prisma from '../src/config/database';

// Mock Prisma
jest.mock('../src/config/database', () => ({
    __esModule: true,
    default: {
        securityEvent: {
            create: jest.fn().mockResolvedValue({ id: '123' }),
            count: jest.fn(),
        },
        threatAlert: {
            create: jest.fn(),
        },
    },
}));

describe('ThreatService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should analyze brute force and create alert when count >= 5', async () => {
        // Mock count to return 5
        (prisma.securityEvent.count as jest.Mock).mockResolvedValue(5);

        await ThreatService.ingestEvent({
            eventType: 'LOGIN_FAILED',
            ipAddress: '192.168.1.1',
        });

        // Check if security event was created
        expect(prisma.securityEvent.create).toHaveBeenCalled();

        // Check if alert was created
        expect(prisma.threatAlert.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    type: 'BRUTE_FORCE',
                    severity: 'HIGH',
                }),
            })
        );
    });

    it('should NOT create alert when count < 5', async () => {
        // Mock count to return 4
        (prisma.securityEvent.count as jest.Mock).mockResolvedValue(4);

        await ThreatService.ingestEvent({
            eventType: 'LOGIN_FAILED',
            ipAddress: '192.168.1.1',
        });

        expect(prisma.threatAlert.create).not.toHaveBeenCalled();
    });
});
