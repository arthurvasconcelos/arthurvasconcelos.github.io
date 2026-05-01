import { queryCollection } from "@nuxt/content/server";

const BASE_URL = "https://arthurvasconcelos.com.br";

export default defineEventHandler(async (event) => {
  const allPosts = await queryCollection(event, "blog")
    .where("path", "LIKE", "/en-gb/blog/%")
    .order("date", "DESC")
    .all();

  const posts = allPosts.filter((p) => !p.draft);

  const items = posts
    .map((post) => {
      const postSlug = post.path.split("/").pop();
      const link = `${BASE_URL}/blog/${postSlug}`;
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${link}</guid>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Arthur Vasconcelos — Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Articles by Arthur Vasconcelos on software engineering, open source, and more.</description>
    <language>en-gb</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return xml;
});
