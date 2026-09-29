
import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { checkAuth } from '../../middleware/checkAuth';
import { validateSchema } from '../../middleware/validateRequest';

import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';


const router = Router();

router.get('/', ReviewController.getAllReviews);

router.post(
    '/',
    checkAuth(Role.PATIENT),
    validateSchema(ReviewValidation.createReviewZodSchema),
    ReviewController.giveReview
);

router.get('/my-reviews', checkAuth(Role.PATIENT, Role.DOCTOR), ReviewController.myReviews);

router.patch('/:id', checkAuth(Role.PATIENT), validateSchema(ReviewValidation.updateReviewZodSchema), ReviewController.updateReview);

router.delete('/:id', checkAuth(Role.PATIENT), ReviewController.deleteReview);




export const ReviewRoutes = router;