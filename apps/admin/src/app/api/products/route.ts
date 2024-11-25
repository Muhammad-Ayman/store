import prisma from '@/lib/prisma'
import { connect } from 'http2'
import { NextResponse } from 'next/server'

export const config = {
   api: {
      bodyParser: false, // Disable default body parsing to handle custom parsing
   },
}

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      // Read the raw body using req.text() and parse it manually
      const data = await req.text()

      // Parse the JSON body
      const parsedData = JSON.parse(data)
      const { categories, ...rest } = parsedData
      console.log(categories)
      // Example of handling the parsed data (you can adjust based on your logic)
      const products = await prisma.product.create({
         data: {
            ...rest,
            categories: {
               connect: { id: categories },
            },
         }, // Assuming data is valid to insert into Prisma
      })

      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCTS_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const { searchParams } = new URL(req.url)

      // Optional query parameters
      const categoryId = searchParams.get('categoryId') || undefined
      const isFeatured = searchParams.get('isFeatured')

      // Handle optional query parameters when searching for products
      const products = await prisma.product.findMany({
         where: {
            ...(categoryId && { categoryId }), // Only apply if categoryId is provided
            ...(isFeatured && { isFeatured: isFeatured === 'true' }), // Convert to boolean
         },
      })

      return NextResponse.json(products)
   } catch (error) {
      console.error('[PRODUCTS_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
