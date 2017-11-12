import Config from './config';

export const dhisRead = async(url) => {
    const response = await(
        fetch(`${Config.baseUrl}/${url}`, {
            headers: {
                // Change the next line if your username/password is different
                Authorization: `Basic ${btoa('admin:district')}`,
            },
            })
        );
    return response.json();
}

export async function dhisWrite(url, data) {
    const response = await(
        fetch(`${Config.baseUrl}/${url}`, {
            method: "POST",
            body: data,
            headers: {
                // Change the next line if your username/password is different
                Authorization: `Basic ${btoa('admin:district')}`,
                'Content-Type': 'application/json'
            }
        })
    )
    return response;
}