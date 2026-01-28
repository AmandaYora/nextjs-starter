process.env.DATABASE_PROVIDER ||= "postgresql";
process.env.DATABASE_URL ||= "postgresql://user:password@localhost:5432/testdb";
process.env.NEXTAUTH_SECRET ||= "super-secret-key-for-next-auth-1234567890";
process.env.NEXTAUTH_URL ||= "http://localhost:3000";
const testKey = Buffer.from("0123456789abcdef0123456789abcdef");
process.env.ENCRYPTION_KEY ||= testKey.toString("base64");
