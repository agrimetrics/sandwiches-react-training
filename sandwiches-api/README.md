# agrimetrics-sandwiches-api

## Running locally
```sh
npm install
npm start

# in another shell:
curl localhost:8080/sandwiches/status
```

By default the service is set to listen to port 8080; define a `PORT` environment variable to override this.

## Building Docker image locally

Use the `docker:build` target, but ensure that you export an `GITHUB_PACKAGES_TOKEN` env var and set `BUILDKITE_COMMIT=dev`; get the `GITHUB_PACKAGES_TOKEN` from your `~/.npmrc` file:
```bash
$ export GITHUB_PACKAGES_TOKEN=$(awk -F= '/_authToken/ {print $2}' < ~/.npmrc | head -1)
$ BUILDKITE_COMMIT=dev npm run docker:build .
$ docker run -it --init --rm -p 8080:8080 docker-private.agrimetrics.co.uk/agrimetrics-sandwiches-api:dev
$ # in another shell...
$ curl http://localhost:8080/sandwiches/status
```
