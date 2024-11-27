import prisma from '@/lib/prisma'

export const getSalesCount = async (): Promise<number> => {
   const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) AS count
    FROM "Order"
    WHERE "isPaid" = true
  `

   // Convert the BigInt to a regular number
   return Number(result[0]?.count || 0)
}
