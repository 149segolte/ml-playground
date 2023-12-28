import { type UserInfo } from 'firebase/auth';
import { page } from '$app/stores';
import { derived } from 'svelte/store';

export const auth = derived<typeof page, UserInfo | null>(
    page,
    ($page, set) => {
        const { user } = $page.data;
        if (!user) {
            set(null);
            return;
        }
        set(user);
    },
    null
);
