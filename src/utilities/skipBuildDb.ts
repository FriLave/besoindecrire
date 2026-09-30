// Docker image builds have no database: generateStaticParams returns [] and pages are
// generated on first request (ISR). Set only by the Dockerfile.
export const skipBuildDb = (): boolean => process.env.SKIP_BUILD_DB === '1'
