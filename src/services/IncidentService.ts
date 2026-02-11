import prisma from '../config/database';

export class IncidentService {
    /**
     * Create an incident manually or from an alert/finding
     */
    static async createIncident(data: {
        title: string;
        description: string;
        severity: string;
        status?: string;
    }) {
        return prisma.incident.create({
            data: {
                title: data.title,
                description: data.description,
                severity: data.severity,
                status: data.status || 'OPEN',
                responseLog: 'Incident created. Investigation started.',
            }
        });
    }

    /**
     * Update incident status and log response
     */
    static async updateStatus(id: string, status: string, logEntry: string) {
        const incident = await prisma.incident.findUnique({ where: { id } });
        if (!incident) throw new Error('Incident not found');

        const updatedLog = `${incident.responseLog}\n[${new Date().toISOString()}] ${logEntry}`;

        return prisma.incident.update({
            where: { id },
            data: {
                status,
                responseLog: updatedLog
            }
        });
    }
}
