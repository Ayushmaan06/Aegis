import { Request, Response } from 'express';
import prisma from '../config/database';

export class ApplicationController {
    static async create(req: Request, res: Response) {
        try {
            const { name, url, owner } = req.body;
            const app = await prisma.application.create({
                data: { name, url, owner }
            });
            res.status(201).json(app);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create application' });
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const apps = await prisma.application.findMany();
            res.json(apps);
        } catch (error) {
            res.status(500).json({ error: 'Failed to list applications' });
        }
    }

    static async get(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const app = await prisma.application.findUnique({
                where: { id: String(id) },
                include: { findings: true, risks: true }
            });
            if (!app) {
                res.status(404).json({ error: 'Application not found' });
                return;
            }
            res.json(app);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get application' });
        }
    }
}
