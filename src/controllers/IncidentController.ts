import { Request, Response } from 'express';
import { IncidentService } from '../services/IncidentService';
import prisma from '../config/database';

export class IncidentController {

    static async create(req: Request, res: Response) {
        try {
            const { title, description, severity } = req.body;
            const incident = await IncidentService.createIncident({ title, description, severity });
            res.status(201).json(incident);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create incident' });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const incidents = await prisma.incident.findMany({ orderBy: { createdAt: 'desc' } });
            res.json(incidents);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list incidents' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status, logEntry } = req.body;
            const incident = await IncidentService.updateStatus(String(id), status, logEntry);
            res.json(incident);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update incident' });
        }
    }
}
