import { Router } from 'express';
import {
    addFieldsEngagementScore,
    bucketAutoPostLikes,
    bucketUsersByFollowers,
    countPostsByCategory,
    facetPostStats,
    graphLookupFollowNetwork,
    groupPostsByCategory,
    limitTopPosts,
    lookupPostsWithAuthor,
    matchVerifiedUsers,
    projectUserOverview,
    replaceRootPostAuthor,
    samplePosts,
    skipPostsPagination,
    sortTopPosts,
    unsetPrivateUserFields,
    unwindTags,
} from '../controllers/aggregation.controller.js';

const router = Router();

router.get('/match-verified-users', matchVerifiedUsers);
router.get('/group-posts-by-category', groupPostsByCategory);
router.get('/project-user-overview', projectUserOverview);
router.get('/sort-top-posts', sortTopPosts);
router.get('/limit-top-posts', limitTopPosts);
router.get('/skip-posts-pagination', skipPostsPagination);
router.get('/unwind-tags', unwindTags);
router.get('/lookup-posts-with-author', lookupPostsWithAuthor);
router.get('/graph-lookup-follow-network', graphLookupFollowNetwork);
router.get('/add-fields-engagement-score', addFieldsEngagementScore);
router.get('/unset-private-user-fields', unsetPrivateUserFields);
router.get('/replace-root-post-author', replaceRootPostAuthor);
router.get('/count-posts-by-category', countPostsByCategory);
router.get('/sample-posts', samplePosts);
router.get('/facet-post-stats', facetPostStats);
router.get('/bucket-users-by-followers', bucketUsersByFollowers);
router.get('/bucket-auto-post-likes', bucketAutoPostLikes);

export default router;
