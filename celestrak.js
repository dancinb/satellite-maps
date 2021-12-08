addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

async function handleRequest(request) {
    const { pathname, search } = new URL(request.url);

    if (pathname.startsWith("/celestrak/satcat/tle.php")) {
        let response = await fetch('https://celestrak.com/satcat/tle.php' + search, request);
        response = new Response(response.body, response);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', '*');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Access-Token');
        response.headers.set('Access-Control-Expose-Headers', '*');
        return response;
    }

    return new Response("404", { status: 404 });
}