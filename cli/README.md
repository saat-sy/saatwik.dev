# saatwik

Command line client for the [saatwik.dev API](https://saatwik.dev/developers). No dependencies; Node 18 or newer.

```bash
npx saatwik profile
npx saatwik projects --status building
npx saatwik project everygpu
npx saatwik page /about      # any page as Markdown
npx saatwik spec             # the OpenAPI document
```

Output is JSON, except `page`, which prints Markdown. Failures print the API's error code and hint to stderr and exit with 1; a 429 also prints the `Retry-After` wait. Use `--base-url` to point at another server, such as `http://localhost:3000`.
