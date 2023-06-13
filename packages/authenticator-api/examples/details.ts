import * as Authenticator from "../src";

Authenticator.configure({
    url: "http://localhost:8080/"
});

const run = async () => {
    console.log(
        await Authenticator.getGithubUser("abf15166d2a8d7fc0faa3b02926efea319697063")
    )
}

run();