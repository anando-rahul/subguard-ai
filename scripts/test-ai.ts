import { reviewSubscriptions } from "../apps/api/src/modules/ai/services";
import { prisma } from "../apps/api/src/utils/prisma";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "super@gmail.com" } });
  if (!user) throw new Error("User not found");
  
  console.log("Testing reviewSubscriptions for user:", user.id);
  const result = await reviewSubscriptions(user.id);
  
  console.log("Result:", JSON.stringify(result, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
