import axios from "axios";
const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } = process.env;


export const getOAuthURL = (state?: any) => {
    let url = `https://github.com/login/oauth/authorize?client_id=${OAUTH_CLIENT_ID}`
    if (state != undefined) url += `&state=${encodeURIComponent(JSON.stringify(state))}`;
    return url;
};

export const getAuthenticationHeaders = (access_token: string) => ({
    Authorization: 'token ' + access_token
})

export async function requestAccessToken(code: string) {
    try {
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
