import prisma from '@/lib/prisma'

export const getTotalRevenue = async (): Promise<number> => {
   const result = await prisma.$queryRaw<{ totalrevenue: bigint }[]>`
    SELECT
      COALESCE(SUM(oi.price), 0) AS totalrevenue
    FROM
      "Order" o
    JOIN
      "OrderItem" oi
      ON o.id = oi."orderId"
    WHERE
      o."isPaid" = true
  `

   // Convert the BigInt to a regular number
   return Number(result[0]?.totalrevenue || 0)
}
