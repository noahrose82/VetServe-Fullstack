import { Router } from 'express';
import * as VeteransController from '../controllers/veterans.controller';

const router = Router();

router.get('/', VeteransController.getVeterans);
router.get('/:id', VeteransController.getVeteranById);
router.post('/', VeteransController.postVeteran);
router.put('/:id', VeteransController.putVeteran);
router.delete('/:id', VeteransController.deleteVeteran);

export = router;