import axios from "axios";
import { merge } from "lodash";

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

export interface Configuration {
    url : string;
    debug : boolean;
}

let config : Configuration = {
    url: "",
    debug: false
}

const getUrl = (path : string) => new URL(path, config.url).toString();

export function configure(cfg : Partial<Configuration>) {
    config = merge(config, cfg);
}

const request = <T extends any = any>(path : string, payload? : object, userId ?: string) => {
    const url = getUrl(path);
    const data = JSON.stringify({
        userId,
        payload
    });

    if(config.debug) {
        console.log(`[Authenticator] ${url} ${data}`);
    }

    return axios({
        url,
        data,
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.data as T).catch((err) => { throw new Error(err?.response?.data?.error ?? err.message) })
}

/**
 * Get the Github OAuth url, providing a redirect string and a data object
 */
export function getAuthURL(state?: object) {
    return request<{url : string}>("url", state).then(d => d.url)
}

/**
 * Given the code from the Github OAuth redirect, returns the userID
 */
export function requestUserID(code : string) {
    return request<{UserId : string}>("authenticate", { code }).then(d => d.UserId);
}

export function validate(userId : string) {
    return request<{valid : boolean, GithubId: number }>("valid", undefined, userId);
}

export function getGithubUser(userId : string) {
    return request<GithubUser>("user", undefined, userId);
}