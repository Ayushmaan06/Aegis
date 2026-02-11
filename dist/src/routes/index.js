"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApplicationController_1 = require("../controllers/ApplicationController");
const ScanController_1 = require("../controllers/ScanController");
const router = (0, express_1.Router)();
router.post('/applications', ApplicationController_1.ApplicationController.create);
router.get('/applications', ApplicationController_1.ApplicationController.list);
router.get('/applications/:id', ApplicationController_1.ApplicationController.get);
router.post('/scan', ScanController_1.ScanController.triggerScan);
exports.default = router;
//# sourceMappingURL=index.js.map