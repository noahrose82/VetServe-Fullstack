import { Router } from 'express';
import * as ServiceRequestsController from '../controllers/serviceRequest.controller';

const router = Router();

router.get('/', ServiceRequestsController.getRequests);
router.get('/:id', ServiceRequestsController.getRequestById);
router.post('/', ServiceRequestsController.postRequest);
router.put('/:id', ServiceRequestsController.putRequest);
router.delete('/:id', ServiceRequestsController.deleteRequest);

export = router;