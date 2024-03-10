import { dev } from '$app/environment';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
import posthog from 'posthog-js'
import { browser } from '$app/environment';

export const load = async () => {
injectSpeedInsights();
inject({ mode: dev ? 'development' : 'production' });
if (browser) {
    posthog.init('phc_x3RuhYg4kAzDOEwuldkIdptsKM5eHvzaX7xbhC9MRQ8', {
        session_recording: {
            maskAllInputs: false,
            maskInputOptions: {
                password: true, // Highly recommended as a minimum!!
                email: true
        }
    }
    })
  }
  return
}