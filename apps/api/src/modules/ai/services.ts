import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "../../utils/prisma";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const aiModel = process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free";

const recommendationSchema = z.object({
  overallSummary: z.string().describe("Overall analysis summary"),
  recommendations: z.array(
    z.object({
      subscriptionId: z.string(),
      name: z.string(),
      urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
      reason: z.string(),
      suggestedAction: z.string(),
    })
  ),
});

export async function reviewSubscriptions(userId: string) {
  // 1. Guardrail: Get user subscriptions that are not CANCELLED
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      status: { not: "CANCELLED" },
    },
  });

  if (subscriptions.length < 3) {
    return {
      success: false,
      message: "Please add at least 3 subscriptions to start AI analysis.",
    };
  }

  // Count active subscriptions by category
  const categoryCounts: Record<string, number> = {};
  for (const sub of subscriptions) {
    if (sub.status === "ACTIVE") {
      categoryCounts[sub.category] = (categoryCounts[sub.category] || 0) + 1;
    }
  }

  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(next7Days.getDate() + 7);

  const formatEnum = (str: string) => 
    str.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  // 2. Kalkulasi Score Internal Backend
  const scoredSubscriptions = subscriptions.map((sub) => {
    let score = 0;

    if (sub.usageFrequency === "RARELY") score += 3;
    if (sub.usageFrequency === "NOT_SURE") score += 1;
    if (sub.status === "TRIAL") score += 2;
    if (sub.status === "PENDING_CANCELLATION") score += 2;
    if (sub.nextBillingDate <= next7Days) score += 2;

    const normalizedMonthlyCost =
      sub.billingCycle === "MONTHLY"
        ? sub.price.toNumber()
        : sub.price.toNumber() / 12;

    if (normalizedMonthlyCost > 100000) score += 2;

    if ((categoryCounts[sub.category] || 0) >= 3) {
      score += 1;
    }

    return {
      subscriptionId: sub.id,
      name: sub.name,
      price: sub.price.toNumber(),
      billingCycle: sub.billingCycle,
      category: formatEnum(sub.category),
      usageFrequency: formatEnum(sub.usageFrequency),
      billingSource: formatEnum(sub.billingSource),
      score,
    };
  });

  // 3. Panggil LLM dengan generateObject
  try {
    const { object } = await generateObject({
      model: openrouter(aiModel),
      schema: recommendationSchema,
      prompt: `You are a financial assistant. Evaluate the following list of subscriptions and provide recommendations for cancellation or optimization based on the given data. Ensure the tone is natural, friendly, and easy to read for the end user (avoid mentioning rigid raw data labels like "Category: Work Tools", but rather weave them into readable sentences). ALL RESPONSES MUST BE IN ENGLISH.\n\nSubscriptions list:\n${JSON.stringify(
        scoredSubscriptions,
        null,
        2
      )}\n\nProvide an \`overallSummary\` and a list of \`recommendations\` according to the schema. For each recommendation, include \`subscriptionId\`, \`name\`, \`urgency\` level ("LOW", "MEDIUM", "HIGH"), \`reason\` (based on usage frequency/cost), and \`suggestedAction\` (including specific steps on how to cancel based on the \`billingSource\`). YOU MUST OUTPUT VALID JSON.`,
    });

    // Save history to AIReviewLog
    await prisma.aIReviewLog.create({
      data: {
        userId,
        inputSummary: scoredSubscriptions as any,
        outputSummary: object as any,
        status: "SUCCESS",
      },
    });

    return {
      success: true,
      data: object,
    };
  } catch (error) {
    console.error("AI Review error:", error);
    await prisma.aIReviewLog.create({
      data: {
        userId,
        inputSummary: scoredSubscriptions as any,
        status: "FAILED",
        errorMessage: (error as Error).message,
      },
    });

    return {
      success: false,
      message: "Failed to process AI analysis.",
    };
  }
}

export async function getAIReviewHistory(userId: string) {
  try {
    const history = await prisma.aIReviewLog.findMany({
      where: { userId, status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: history };
  } catch (error) {
    console.error("Failed to fetch AI review history:", error);
    return { success: false, message: "Failed to fetch history." };
  }
}

export async function deleteAllAIReviewHistory(userId: string) {
  try {
    await prisma.aIReviewLog.deleteMany({
      where: { userId },
    });
    return { success: true, message: "History cleared successfully." };
  } catch (error) {
    console.error("Failed to clear AI review history:", error);
    return { success: false, message: "Failed to clear history." };
  }
}

export async function deleteAIReviewHistoryById(userId: string, id: string) {
  try {
    const log = await prisma.aIReviewLog.findUnique({
      where: { id },
    });
    if (!log || log.userId !== userId) {
      return { success: false, message: "Review log not found or unauthorized." };
    }

    await prisma.aIReviewLog.delete({
      where: { id },
    });
    return { success: true, message: "Review log deleted successfully." };
  } catch (error) {
    console.error("Failed to delete AI review log:", error);
    return { success: false, message: "Failed to delete log." };
  }
}
