import { Prisma, type BillingCycle } from "../../utils/prisma";

type MoneyInput = Prisma.Decimal | number | string;

export function getMonthlyNormalizedCost(price: MoneyInput, billingCycle: BillingCycle) {
  const amount = new Prisma.Decimal(price);

  return billingCycle === "MONTHLY" ? amount : amount.dividedBy(12);
}

export function getYearlyNormalizedCost(price: MoneyInput, billingCycle: BillingCycle) {
  const amount = new Prisma.Decimal(price);

  return billingCycle === "MONTHLY" ? amount.times(12) : amount;
}

export function sumMoney(values: Prisma.Decimal[]) {
  return values.reduce((total, value) => total.plus(value), new Prisma.Decimal(0));
}
