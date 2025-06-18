import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { Octokit } from "octokit";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", async (c) => {
  const { username, repository, branch, key } = c.req.query();
  const rest = new Octokit({ auth: key ? key : env.GITHUB_PAT }).rest;
  try {
    const checkSuiteResponse = await rest.checks.listSuitesForRef({
      owner: username,
      repo: repository,
      ref: branch,
    });

    const cloudflareCheckSuite = checkSuiteResponse.data.check_suites.find(
      (suite) => suite.app?.slug === "cloudflare-workers-and-pages",
    );

    if (!cloudflareCheckSuite) {
      return c.json(
        {
          error: "Cloudflare Workers and Pages check suite not found.",
          username,
          repository,
          branch,
        },
        404,
      );
    }

    const status = cloudflareCheckSuite.status;
    const conclusion =
      cloudflareCheckSuite.conclusion === "success" ? "passing" : "failing";
    const color =
      cloudflareCheckSuite.conclusion === "success" ? "#2ac44e" : "#D02E3C";

    return c.json({
      schemaVersion: 1,
      labelColor: "#343B42",
      label: "CD",
      message: status === "completed" ? conclusion : status,
      color,
      namedLogo: "cloudflareworkers",
      logoColor: "#F5821F",
    });
  } catch (error: any) {
    return c.json(
      {
        error: error.message || "Failed to fetch commit status",
        username,
        repository,
        branch,
      },
      500,
    );
  }
});

export default app;
