import type { ParsedContent } from "@nuxt/content/dist/runtime/types";
import { serverQueryContent } from "#content/server";
import { asSitemapUrl, defineSitemapEventHandler } from "#imports";

export default defineSitemapEventHandler(async (e) => {
    const contentList = (await serverQueryContent(e).find()) as ParsedContent[];

    const articles = contentList
        .filter(c => c._path.startsWith("/articles"))
        .map((c) => {
            return asSitemapUrl({
                loc: `${c._path}`,
            });
        });

    articles.push({
       loc: "/feed.xml"
    });
    return articles;
});
