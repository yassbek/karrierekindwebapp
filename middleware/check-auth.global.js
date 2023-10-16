import {useAuth} from '~~/store/auth'
import {useNotificationStore} from "~/store/notifcations";
import {getUserTypeById} from "~/utils/helper";
// add all routes that should be available without login
const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/contact',
    '/about',
    '/faq',
    '/terms',
    '/privacy'
]
// add all routes that should be available for companies
const routesUnternehmen = [
    '/open-jobs',
]
// add all routes that should be available for talents
const routesTalente = [
    '/job-requests',
]
// add all routes that should be available when registration is completed
const routesWhenRegistrationCompleted = [
    '/open-jobs',
    '/open-jobs/create',
];

async function redirectToLogin(router, to) {
    const redirectTo = to.fullPath;
    await router.push(redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login");
    //if (process.client) window.location.reload();
}

async function checkUserAccess(auth, route, userType, to, router, notification) {
    const userTypeById = getUserTypeById(auth.user.role);
    if (auth.isLoggedIn && userTypeById === userType && route.includes(to.path)) {
        console.log(`${userType} tried to access unauthorized routes`);
        notification.addNotification(
            'Kein Zugriff',
            'error',
            'Sie haben keinen Zugriff auf diese Seite',
            true
        );
        // Make sure you don't redirect to a route that will cause another redirect.
        if (to.path !== '/') {
            await router.push('/');
        }
    }
}

async function fetchUserProfile(auth, token) {
    if (auth.isLoggedIn && !auth.userProfile && token) {
        await auth.loadUserProfile();
    }
}

async function fetchUser(auth, token) {
    if (!auth.isLoggedIn && token) {
        try {
            await auth.getUser();
            await fetchUserProfile(auth, token);
        } catch (e) {
            console.log('Failed to fetch user', e.message);
            if (process.client) window.location.reload();
        }
    }
}

async function resetAuthIfRequired(auth, token) {
    if (auth.isLoggedIn && !token) {
        auth.$reset();
    }
}
export default defineNuxtRouteMiddleware(async (to, _from) => {
    console.log("Middleware triggered for ", to.path);

    const router = useRouter();
    const auth = useAuth();
    const notification = useNotificationStore();
    const { $directus } = useNuxtApp();
    const token = await $directus.auth.token;

    if (publicRoutes.includes(to.path)) {
        console.log("Public route, passing through");
        return;
    }

    await fetchUserProfile(auth, token);
    await fetchUser(auth, token);
    console.log("Fetched user profile and user");

    if (!auth.isLoggedIn && !token) {
        console.log("Not logged in, redirecting to login");
        await redirectToLogin(router, to);
        return;
    }

    console.log("Checked if token and auth state are consistent");

    await checkUserAccess(auth, routesUnternehmen, 'Unternehmen', router, notification);
    await checkUserAccess(auth, routesTalente, 'Talente', router, notification);
    console.log("Checked user access");

    if (!auth.user.registration_completed && routesWhenRegistrationCompleted.includes(to.path)) {
        notification.addNotification(
            'Unvollständige Registrierung',
            'error',
            'Bitte vervollständigen Sie Ihre Registrierung, um fortzufahren',
            true
        );
        await router.push('/');
    }

    console.log("Checked for incomplete registration");

    console.log("Logged in, continuing");
});
