const SentryCli = require("@sentry/cli");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");

async function createReleaseAndUpload() {
  const release = process.env.REACT_APP_SENTRY_RELEASE;
  if (!release) {
    console.warn("REACT_APP_SENTRY_RELEASE is not set");

    return;
  }

  const cli = new SentryCli();

  try {
    console.log("Creating sentry release " + release);
    await cli.releases.new(release);

    console.log("Uploading source maps");
    await cli.releases.uploadSourceMaps(release, {
      include: ["build/static/js"],
      urlPrefix: "~/static/js",
      rewrite: false,
    });

    console.log("Set commit integration");
    await cli.releases.setCommits(release, { auto: true });

    console.log("Finalizing release");
    await cli.releases.finalize(release);

    console.log("Remove source map");
    const sourcemapPath = path.resolve("./build/static/js");
    const mapList = fs.readdirSync(sourcemapPath).filter((file) => /js.map$/.test(file));
    mapList.forEach((file) => {
      fse.removeSync(path.resolve(sourcemapPath, file));
    });
  } catch (e) {
    console.error("Source maps uploading failed:", e);
  }
}

createReleaseAndUpload();
