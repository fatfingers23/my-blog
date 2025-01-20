import { serverQueryContent } from "#content/server";
import RSS from "rss";

export default defineEventHandler(async (event) => {
    const feed = new RSS({
        title: "Bailey Townsend's Blog",
        description: "Writings on what I am currently working on and interested in. Mostly covering embedded Rust and web development.",
        site_url: "https://baileytownsend.dev",
        feed_url: "https://baileytownsend.dev/feed.xml",
    });

    const docs = await serverQueryContent(event)
        .sort({ date: -1 })
        .where({ _partial: false, draft: false })
        .find();

    const blogPosts = docs.filter((doc) => doc?._path?.includes("/articles"));
    for (const doc of blogPosts) {
        feed.item({
            title: doc.title ?? "-",
            url: `https://baileytownsend.dev${doc._path}`,
            date: doc.date,
            description: doc.description,
        });
    }

    const feedString = feed.xml({ indent: true });
    setResponseHeader(event, "content-type", "text/xml");

    return feedString;
});