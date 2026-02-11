import { Router } from 'express';
import { ApplicationController } from '../controllers/ApplicationController';
import { ScanController } from '../controllers/ScanController';

import { ThreatController } from '../controllers/ThreatController';
import { IncidentController } from '../controllers/IncidentController';

const router = Router();

// Application Routes
router.post('/applications', ApplicationController.create);
router.get('/applications', ApplicationController.list);
router.get('/applications/:id', ApplicationController.get);

// Scan Routes
router.post('/scan', ScanController.triggerScan);

// Threat Routes
router.post('/events', ThreatController.reportEvent);
router.get('/alerts', ThreatController.getAlerts);

// Incident Routes
router.post('/incidents', IncidentController.create);
router.get('/incidents', IncidentController.list);
router.patch('/incidents/:id', IncidentController.update);

export default router;
