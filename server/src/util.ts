import querystring from "querystring";

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