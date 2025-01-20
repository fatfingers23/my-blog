export default defineNuxtRouteMiddleware((to) => {
    if(to.path.toLowerCase() === "/feed.xml"){
        return;
    }
    if (to.path.toLowerCase().startsWith("/rss") || to.path.toLowerCase().startsWith("/feed")) {
        return navigateTo("/feed.xml");
    }
});
