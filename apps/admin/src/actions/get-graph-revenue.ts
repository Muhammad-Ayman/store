import prisma from '@/lib/prisma'

interface GraphData {
   name: string
   total: number
}

export const getGraphRevenue = async (): Promise<GraphData[]> => {
   const monthlyRevenue = await prisma.$queryRaw<
      { month: number; total: number }[]
   >`
    SELECT
      EXTRACT(MONTH FROM o."createdAt") - 1 AS month, -- Subtract 1 to align with JS months (0-11)
      SUM(o."payable") AS total
    FROM
      "Order" o
    WHERE
      o."isPaid" = true
    GROUP BY
      month
    ORDER BY
      month
  `

   // Initialize the graph data with all months set to zero
   const graphData: GraphData[] = [
      { name: 'Jan', total: 0 },
      { name: 'Feb', total: 0 },
      { name: 'Mar', total: 0 },
      { name: 'Apr', total: 0 },
      { name: 'May', total: 0 },
      { name: 'Jun', total: 0 },
      { name: 'Jul', total: 0 },
      { name: 'Aug', total: 0 },
      { name: 'Sep', total: 0 },
      { name: 'Oct', total: 0 },
      { name: 'Nov', total: 0 },
      { name: 'Dec', total: 0 },
   ]

   // Update graphData with the actual totals
   for (const { month, total } of monthlyRevenue) {
      graphData[month].total = total
   }

   return graphData
}
