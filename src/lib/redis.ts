import { Redis } from '@upstash/redis';
import { UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN } from '$env/static/private';
// Initialize your Upstash Redis connection
export const redis = new Redis({
	url: UPSTASH_REDIS_URL,
	token: UPSTASH_REDIS_TOKEN
});
