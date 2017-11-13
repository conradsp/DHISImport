import Config from './config';

export const dhisRead = async(url) => {
    let response = await (await(
        fetch(`${Config.baseUrl}/${url}`, {
            headers: {
                // Change the next line if your username/password is different
                Authorization: `Basic ${btoa('admin:district')}`,
            },
            }).then(res =>{
                return res.json();
            }).catch(err => {
                console.log(err);
            })
        ))
    return response;
}

export async function dhisWrite(url, data) {
    let response = await(await(
        fetch(`${Config.baseUrl}/${url}`, {
            method: "POST",
            body: data,
            headers: {
                // Change the next line if your username/password is different
                Authorization: `Basic ${btoa('admin:district')}`,
                'Content-Type': 'application/json'
            }
        }).then(res =>{
            return res;
        }).catch(err => {
            console.log(err);
        })
    ))
    return response;
}