import axios from "axios";
const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } = process.env;
import querystring from "querystring";

export const getOAuthURL = (state?: any) => {
    let url = `https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_ID}`
    if (state != undefined) url += `&state=${encodeURIComponent(JSON.stringify(state))}`;
    return url;
};

type State = {
    redirect: string;
    data: object;
}

export const decodeState = (state?: string): State | undefined => {
    if (!state) return undefined;
    try {
        const data = JSON.parse(decodeURIComponent(state));
        if (typeof data !== "object") return undefined;
        if (!data.redirect) return undefined;
        return {
            redirect: data.redirect,
            data: data.data ?? {}
        };
    } catch {
        return undefined;
    }
}

export const composeRedirectURL = (redirect: string, data?: object) => {
    let url = redirect;
    if (data) url += "?" + querystring.stringify(data as any);
    return url;
}

export const getAuthenticationHeaders = (access_token: string) => ({
    Authorization: 'token ' + access_token
})

export async function requestAccessToken(code: string) {
    try {
        console.log(`https://github.com/login/oauth/access_token?client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&code=${code}`);
        const authResponse = await axios({
            method: "POST",
            url: `https://github.com/login/oauth/access_token?client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&code=${code}`,
            headers: {
                Accept: 'application/json'
            }
        })

        if (authResponse.data.access_token) {
            return authResponse.data.access_token as string;
        }
    } catch { }
}

/*
{
  "login": "Tangerie",
  "id": 42930268,
  "node_id": "MDQ6VXNlcjQyOTMwMjY4",
  "avatar_url": "https://avatars.githubusercontent.com/u/42930268?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/Tangerie",
  "html_url": "https://github.com/Tangerie",
  "followers_url": "https://api.github.com/users/Tangerie/followers",
  "following_url": "https://api.github.com/users/Tangerie/following{/other_user}",
  "gists_url": "https://api.github.com/users/Tangerie/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/Tangerie/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/Tangerie/subscriptions",
  "organizations_url": "https://api.github.com/users/Tangerie/orgs",
  "repos_url": "https://api.github.com/users/Tangerie/repos",
  "events_url": "https://api.github.com/users/Tangerie/events{/privacy}",
  "received_events_url": "https://api.github.com/users/Tangerie/received_events",
  "type": "User",
  "site_admin": false,
  "name": "Tangerie",
  "company": "@TangerieOrg ",
  "blog": "http://tangerie.xyz",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": "Josh   \r\n[@j.cavill]",
  "twitter_username": null,
  "public_repos": 39,
  "public_gists": 0,
  "followers": 3,
  "following": 19,
  "created_at": "2018-09-03T08:19:55Z",
  "updated_at": "2023-06-12T14:40:01Z"
}
*/

export interface GithubUser {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    name: string
    company: string
    blog: string
    location: any
    email: any
    hireable: any
    bio: string
    twitter_username: any
    public_repos: number
    public_gists: number
    followers: number
    following: number
    created_at: string
    updated_at: string
}

export const getUserDetails = (access_token: string) => 
    axios({
        method: "GET",
        url: "https://api.github.com/user",
        headers: getAuthenticationHeaders(access_token)
    }).then(r => r.data as GithubUser)

// export async function getUserDetails(access_token: string) {
//     const response = await axios({
//         method: "GET",
//         url: "https://api.github.com/user",
//         headers: getAuthenticationHeaders(access_token)
//     })

//     return response.data as GithubUser;
// }

// export async function isUserValid(access_token: string) {
//     try {
//         await getUserDetails(access_token);
//         return true;
//     } catch {
//         return false;
//     }
// }