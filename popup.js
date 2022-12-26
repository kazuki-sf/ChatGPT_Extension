async function getAccessToken() {
    const resp = await fetch('https://chat.openai.com/api/auth/session');
    if (resp.status === 403) {
        throw new Error('CLOUDFLARE');
    }
    const data = await resp.json().catch(() => ({}));
    if (!data.accessToken) {
        throw new Error('UNAUTHORIZED');
    }
    return data.accessToken;
}
async function run() {
    try {
        await getAccessToken();
        const state = document.getElementById("state");
        const chatGPTLink = document.getElementById("chatGPTLink");
        const chatGPTiframe = document.getElementById("chatGPTiframe");
        if (state?.textContent)
            state.textContent = "";
        chatGPTLink?.setAttribute("hidden", "true");
        chatGPTiframe?.removeAttribute("hidden");
    }
    catch (error) {
        const state = document.getElementById("state");
        const chatGPTLink = document.getElementById("chatGPTLink");
        const chatGPTiframe = document.getElementById("chatGPTiframe");
        chatGPTLink?.removeAttribute("hidden");
        chatGPTiframe?.setAttribute("hidden", "true");
        if (error.message === 'UNAUTHORIZED' || error.message === 'CLOUDFLARE') {
            if (state?.textContent)
                state.textContent = "It seems like you are currently not logged into chatGPT.\r\nPlease login first";
            return;
        }
        console.log(error);
        if (state?.textContent)
            state.textContent = "An error occurred.\r\nTry to login again";
    }
}
run();
