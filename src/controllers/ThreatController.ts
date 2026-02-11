import { Request, Response } from 'express';
import { ThreatService } from '../services/ThreatService';
import prisma from '../config/database';

export class ThreatController {

    static async reportEvent(req: Request, res: Response): Promise<void> {
        try {
            const { applicationId, eventType, ipAddress, userAgent, metadata } = req.body;

            if (!eventType || !ipAddress) {
                res.status(400).json({ error: 'eventType and ipAddress are required' });
                return;
            }

            const event = await ThreatService.ingestEvent({
                applicationId,
                eventType,
                ipAddress,
                userAgent,
                metadata
            });

            res.status(201).json({ message: 'Event logged', eventId: event.id });
        } catch (error) {
            console.error('Error logging event:', error);
            res.status(500).json({ error: 'Failed to log event' });
        }
    }

    static async getAlerts(req: Request, res: Response): Promise<void> {
        try {
            const alerts = await prisma.threatAlert.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.json(alerts);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch alerts' });
        }
    }
}
