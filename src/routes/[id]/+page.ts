let url = 'https://apis.149segolte.dev/minor';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    
        let res = await fetch(`${url}/project/${params.id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });

		let data= await res.json()
        return data
    }