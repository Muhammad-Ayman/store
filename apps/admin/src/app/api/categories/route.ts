import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      const body = await req.json() // Explicitly parse the request body
      console.log(body)
      const { title, description, bannerIds } = body // Adjust to handle multiple banners

      if (!title) {
         return new NextResponse('Title is required', { status: 400 })
      }

      if (!bannerIds) {
         return new NextResponse(
            'Banner IDs are required and must be an array',
            { status: 400 }
         )
      }

      // Create a new category with related banners
      const category = await prisma.category.create({
         data: {
            title,
            description,
            banners: {
               connect: { id: bannerIds }, // Connect multiple banners
            },
         },
      })

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORIES_POST]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function GET(req: Request) {
   try {
      // Find all categories
      const categories = await prisma.category.findMany()

      return NextResponse.json(categories)
   } catch (error) {
      console.error('[CATEGORIES_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
