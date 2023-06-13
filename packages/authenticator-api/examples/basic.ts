import * as Authenticator from "../src";

Authenticator.configure({
    url: "http://localhost:8080/"
});
 
// CODE = 354a90bfbf69f32c2713

const run = async () => {
    console.log(
        await Authenticator.getAuthURL({ key: "value" })
    );

    console.log(
        await Authenticator.requestUserID("3deae8245735e882dbee")
    )
}

run();
