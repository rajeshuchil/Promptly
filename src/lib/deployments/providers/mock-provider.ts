import { DeploymentProvider } from "../deployment-provider";
import { DeploymentStep, DeploymentResult } from "../deployment-types";

export class MockDeploymentProvider implements DeploymentProvider {
  getName(): string {
    return "mock";
  }

  async *deployStream(
    projectId: string,
    html: string,
    options?: Record<string, any>
  ): AsyncIterable<DeploymentStep & { result?: DeploymentResult }> {
    // Determine if we should mock a failure
    const shouldFail = options?.shouldFail || html.includes("<!-- trigger-deploy-failure -->");

    // 1. Queued
    yield {
      name: "queued",
      status: "running",
      message: "Deployment request received. Queueing build task...",
    };
    await new Promise((r) => setTimeout(r, 800));

    if (shouldFail && options?.failStep === "queued") {
      yield {
        name: "queued",
        status: "failed",
        message: "Failed to queue deployment: Queue capacity exceeded.",
        result: {
          success: false,
          error: "Queue capacity exceeded",
        },
      };
      return;
    }

    yield {
      name: "queued",
      status: "completed",
      message: "Successfully queued build task.",
    };

    // 2. Building
    yield {
      name: "building",
      status: "running",
      message: "Compiling project bundle and optimizing static assets...",
    };
    await new Promise((r) => setTimeout(r, 1000));

    if (shouldFail && (!options?.failStep || options.failStep === "building")) {
      yield {
        name: "building",
        status: "failed",
        message: "Build Failed: Syntax error or missing compiler dependencies.",
        result: {
          success: false,
          error: "Build compilation failed",
        },
      };
      return;
    }

    yield {
      name: "building",
      status: "completed",
      message: "Static asset optimization complete.",
    };

    // 3. Deploying
    yield {
      name: "deploying",
      status: "running",
      message: "Uploading compiled artifacts to edge CDN nodes...",
    };
    await new Promise((r) => setTimeout(r, 1000));

    if (shouldFail && options?.failStep === "deploying") {
      yield {
        name: "deploying",
        status: "failed",
        message: "Deploy failed: Edge synchronization timeout.",
        result: {
          success: false,
          error: "Edge synchronization timeout",
        },
      };
      return;
    }

    const deployedUrl = `https://fastapp.site/p/${projectId}`;

    yield {
      name: "deploying",
      status: "completed",
      message: "Upload completed. Propagated to all edge CDNs.",
    };

    // 4. Deployed (success)
    yield {
      name: "deployed",
      status: "completed",
      message: "Deployment successful!",
      url: deployedUrl,
      result: {
        success: true,
        url: deployedUrl,
        providerDeploymentId: `dep_mock_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          provider: "mock",
          region: "global-edge",
          framework: "static-html",
          filesUploaded: 1,
          durationMs: 2800,
        },
      },
    };
  }
}
