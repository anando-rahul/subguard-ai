import { prisma } from "../apps/api/src/utils/prisma";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "super@gmail.com" },
  });

  if (!user) {
    console.error("Super user not found");
    return;
  }

  // Clear existing subscriptions for a clean demo state
  await prisma.subscription.deleteMany({
    where: { userId: user.id },
  });

  const now = new Date();

  await prisma.subscription.createMany({
    data: [
      {
        userId: user.id,
        name: "Netflix Premium",
        price: 186000,
        currency: "IDR",
        billingCycle: "MONTHLY",
        billingSource: "MERCHANT_WEBSITE",
        category: "ENTERTAINMENT",
        status: "ACTIVE",
        usageFrequency: "OFTEN",
        paymentMethod: "Credit Card",
        nextBillingDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        userId: user.id,
        name: "Spotify Duo",
        price: 73000,
        currency: "IDR",
        billingCycle: "MONTHLY",
        billingSource: "APPLE_APP_STORE",
        category: "ENTERTAINMENT",
        status: "ACTIVE",
        usageFrequency: "OFTEN",
        paymentMethod: "Apple Pay",
        nextBillingDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
      {
        userId: user.id,
        name: "Google One 2TB",
        price: 1350000,
        currency: "IDR",
        billingCycle: "YEARLY",
        billingSource: "GOOGLE_PLAY",
        category: "CLOUD",
        status: "ACTIVE",
        usageFrequency: "OFTEN",
        paymentMethod: "GoPay",
        nextBillingDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
      },
      {
        userId: user.id,
        name: "Adobe Creative Cloud",
        price: 800000,
        currency: "IDR",
        billingCycle: "MONTHLY",
        billingSource: "MERCHANT_WEBSITE",
        category: "WORK_TOOLS",
        status: "ACTIVE",
        usageFrequency: "RARELY",
        paymentMethod: "Credit Card",
        isCancellationCandidate: true,
        nextBillingDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        userId: user.id,
        name: "Vercel Pro",
        price: 310000, // ~20 USD
        currency: "IDR",
        billingCycle: "MONTHLY",
        billingSource: "MERCHANT_WEBSITE",
        category: "WORK_TOOLS",
        status: "ACTIVE",
        usageFrequency: "SOMETIMES",
        paymentMethod: "Credit Card",
        nextBillingDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        name: "Indosat IM3 100GB",
        price: 150000,
        currency: "IDR",
        billingCycle: "MONTHLY",
        billingSource: "TELCO_BUNDLE",
        category: "TELCO",
        status: "ACTIVE",
        usageFrequency: "OFTEN",
        paymentMethod: "OVO",
        nextBillingDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        name: "ChatGPT Plus",
        price: 320000, // ~20 USD
        currency: "IDR",
        billingCycle: "MONTHLY",
        billingSource: "MERCHANT_WEBSITE",
        category: "AI_TOOLS",
        status: "ACTIVE",
        usageFrequency: "OFTEN",
        paymentMethod: "Credit Card",
        nextBillingDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        name: "Notion Plus",
        price: 1200000, // roughly yearly
        currency: "IDR",
        billingCycle: "YEARLY",
        billingSource: "MERCHANT_WEBSITE",
        category: "WORK_TOOLS",
        status: "ACTIVE",
        usageFrequency: "SOMETIMES",
        paymentMethod: "Credit Card",
        nextBillingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        name: "Ruangguru",
        price: 1500000,
        currency: "IDR",
        billingCycle: "YEARLY",
        billingSource: "IN_APP_DIRECT",
        category: "EDUCATION",
        status: "ACTIVE",
        usageFrequency: "RARELY",
        paymentMethod: "Bank Transfer",
        nextBillingDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.id,
        name: "Disney+ Hotstar",
        price: 200000,
        currency: "IDR",
        billingCycle: "YEARLY",
        billingSource: "TELCO_BUNDLE",
        category: "ENTERTAINMENT",
        status: "ACTIVE",
        usageFrequency: "SOMETIMES",
        paymentMethod: "Telkomsel",
        nextBillingDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log("Database seeded successfully with 10 realistic demo subscriptions!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
