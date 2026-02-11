import prisma from '../config/database';

export class ThreatService {
    /**
     * Ingest a security event and trigger analysis
     */
    static async ingestEvent(eventData: {
        applicationId?: string;
        eventType: string;
        ipAddress: string;
        userAgent?: string;
        metadata?: any;
    }) {
        // 1. Log the event
        const event = await prisma.securityEvent.create({
            data: {
                applicationId: eventData.applicationId,
                eventType: eventData.eventType,
                ipAddress: eventData.ipAddress,
                userAgent: eventData.userAgent,
                metadata: eventData.metadata || {},
            }
        });

        // 2. Trigger Real-time Analysis
        await this.analyzePattern(eventData.ipAddress, eventData.eventType);

        return event;
    }

    /**
     * Analyze for specific threat patterns
     */
    private static async analyzePattern(ipAddress: string, eventType: string) {
        if (eventType === 'LOGIN_FAILED') {
            await this.detectBruteForce(ipAddress);
        }
    }

    /**
     * Detect Brute Force: > 5 failed logins from same IP in last 60 seconds
     */
    private static async detectBruteForce(ipAddress: string) {
        const windowStart = new Date(Date.now() - 60 * 1000); // 1 minute ago

        const count = await prisma.securityEvent.count({
            where: {
                ipAddress,
                eventType: 'LOGIN_FAILED',
                timestamp: {
                    gte: windowStart
                }
            }
        });

        if (count >= 5) {
            // Create Alert
            await prisma.threatAlert.create({
                data: {
                    type: 'BRUTE_FORCE',
                    severity: 'HIGH',
                    description: `Detected brute force attempt from IP ${ipAddress} (${count} failed attempts)`,
                    status: 'OPEN',
                    metadata: { ipAddress, count }
                }
            });
            console.log(`[ALERT] Brute force detected from ${ipAddress}`);
        }
    }
}
