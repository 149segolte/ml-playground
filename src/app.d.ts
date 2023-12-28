// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: null | {
                uid: string;
                displayName: string;
                email: string;
                photoURL: string | null;
                providerId: string;
                phoneNumber: string | null;
            };
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export { };
