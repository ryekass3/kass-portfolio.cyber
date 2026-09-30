export async function onRequest(context) {
  const { request, env, waitUntil } = context;
  const url = new URL(request.url);

  // Skip noise (assets, favicon, etc.)
  if (!/\.(css|js|png|jpg|svg|ico|woff2?)$/.test(url.pathname)) {
    const cf = request.cf || {};
    const content =
      `🌐 **${request.method}** ${url.pathname}\n` +
      `IP: ${request.headers.get("CF-Connecting-IP")} | ` +
      `${cf.city || "?"}, ${cf.country || "?"}\n` +
      `UA: ${(request.headers.get("User-Agent") || "").slice(0, 100)}`;

    waitUntil(
      fetch(`https://discord.com/api/v10/channels/${env.DISCORD_CHANNEL_ID}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bot ${env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })
    );
  }

  return context.next();
}