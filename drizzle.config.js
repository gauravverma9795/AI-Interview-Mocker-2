/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://ai-interview-mocker_owner:1fGw9hvjIXAE@ep-withered-union-a5ivp145.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
  }
};
