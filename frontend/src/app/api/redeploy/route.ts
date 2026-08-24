/**
 * Strapi (or anything else) POSTs here to trigger a Railway redeploy of this
 * service — the mechanism by which content updates go live, since pages are
 * rendered fresh per request (see `dynamic = "force-dynamic"` on the pages
 * that read from Strapi) rather than revalidated on a timer.
 *
 * Configure this as a webhook in Strapi (Settings > Webhooks), pointed at
 * POST /api/redeploy, with header `x-redeploy-secret: <REDEPLOY_SECRET>`.
 */
export async function POST(request: Request) {
  const secret = process.env.REDEPLOY_SECRET;
  if (!secret) {
    console.error("REDEPLOY_SECRET is not configured");
    return Response.json(
      { success: false, error: "Not configured" },
      { status: 500 }
    );
  }
  if (request.headers.get("x-redeploy-secret") !== secret) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const projectToken = process.env.RAILWAY_TOKEN;
  const accessToken = process.env.RAILWAY_ACCESS_TOKEN;
  const environmentId = process.env.RAILWAY_ENVIRONMENT_ID;
  const serviceId = process.env.RAILWAY_SERVICE_ID;

  if (!projectToken || !accessToken || !environmentId || !serviceId) {
    console.error(
      "Missing one of RAILWAY_TOKEN, RAILWAY_ACCESS_TOKEN, RAILWAY_ENVIRONMENT_ID, RAILWAY_SERVICE_ID"
    );
    return Response.json(
      { success: false, error: "Not configured" },
      { status: 500 }
    );
  }

  const resp = await fetch("https://backboard.railway.com/graphql/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Project-Access-Token": projectToken,
      authorization: accessToken,
    },
    body: JSON.stringify({
      query: `
        mutation ServiceInstanceRedeploy {
          serviceInstanceRedeploy(
            environmentId: "${environmentId}"
            serviceId: "${serviceId}"
          )
        }`,
    }),
  });

  const data = await resp.json();

  if (data.errors) {
    console.error(data.errors);
    return Response.json({ success: false, error: data.errors }, { status: 502 });
  }

  return Response.json({ success: true });
}
