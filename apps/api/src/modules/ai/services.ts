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
  overallSummary: z.string().describe("Ringkasan analisis keseluruhan"),
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
      message: "Tambahkan minimal 3 langganan untuk memulai analisis AI.",
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
      category: sub.category,
      usageFrequency: sub.usageFrequency,
      score,
    };
  });

  // 3. Panggil LLM dengan generateObject
  try {
    const { object } = await generateObject({
      model: openrouter(aiModel),
      schema: recommendationSchema,
      prompt: `Kamu adalah asisten pengatur keuangan. Evaluasi daftar langganan berikut dan berikan rekomendasi pembatalan atau optimasi berdasarkan data yang diberikan.\n\nDaftar langganan:\n${JSON.stringify(
        scoredSubscriptions,
        null,
        2
      )}\n\nBerikan \`overallSummary\` dan list \`recommendations\` sesuai schema. Untuk rekomendasi, sertakan \`subscriptionId\`, \`name\`, tingkat \`urgency\` ("LOW", "MEDIUM", "HIGH"), \`reason\` (berdasarkan frekuensi pakai/biaya), dan \`suggestedAction\`.`,
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
      message: "Gagal memproses analisis AI.",
    };
  }
}
