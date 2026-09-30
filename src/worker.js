export default {
  async fetch(request, env, ctx) {
    console.log("token present:", !!env.DISCORD_BOT_TOKEN, "len:", env.DISCORD_BOT_TOKEN?.length, "channel:", env.DISCORD_CHANNEL_ID);
    const url = new URL(request.url);

    if (!/\.(css|js|png|jpe?g|svg|ico|webp|woff2?)$/.test(url.pathname)) {
      const cf = request.cf || {};
      const content =
        `🌐 **${request.method}** ${url.pathname}\n` +
        `IP: ${request.headers.get("CF-Connecting-IP")} | ` +
        `${cf.city || "?"}, ${cf.country || "?"}\n` +
        `UA: ${(request.headers.get("User-Agent") || "").slice(0, 100)}`;

      ctx.waitUntil(
        fetch(`https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_ID}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bot ${env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }).then(async (r) => {
          if (!r.ok) console.log("Discord error", r.status, await r.text());
        })
      );
    }

    return env.ASSETS.fetch(request);
  },
};