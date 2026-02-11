"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const database_1 = __importDefault(require("../config/database"));
class ApplicationController {
    static async create(req, res) {
        try {
            const { name, url, owner } = req.body;
            const app = await database_1.default.application.create({
                data: { name, url, owner }
            });
            res.status(201).json(app);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create application' });
        }
    }
    static async list(req, res) {
        try {
            const apps = await database_1.default.application.findMany();
            res.json(apps);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to list applications' });
        }
    }
    static async get(req, res) {
        try {
            const { id } = req.params;
            const app = await database_1.default.application.findUnique({
                where: { id: String(id) },
                include: { findings: true, risks: true }
            });
            if (!app) {
                res.status(404).json({ error: 'Application not found' });
                return;
            }
            res.json(app);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get application' });
        }
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=ApplicationController.js.map