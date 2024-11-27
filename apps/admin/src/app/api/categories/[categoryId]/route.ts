import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
   req: Request,
   { params }: { params: { categoryId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      const category = await prisma.category.findUnique({
         where: {
            id: params.categoryId,
         },
      })

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORY_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function DELETE(
   req: Request,
   { params }: { params: { categoryId: string } }
) {
   try {
      const userId = req.headers.get('X-USER-ID')

      if (!userId) {
         return new NextResponse('Unauthorized', { status: 401 })
      }

      if (!params.categoryId) {
         return new NextResponse('Category id is required', { status: 400 })
      }

      const category = await prisma.category.delete({
         where: {
            id: params.categoryId,
         },
      })

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORY_DELETE]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { categoryId: string } }
) {
   try {
      const { categoryId } = params
      const body = await req.json()
      const { title, description, bannerIds } = body

      if (!categoryId) {
         return new NextResponse('Category ID is required', { status: 400 })
      }

      // Update the category and its relations
      const category = await prisma.category.update({
         where: { id: categoryId },
         data: {
            title,
            description,
            banners: {
               set: { id: bannerIds }, // Replace existing relations
            },
         },
      })

      return NextResponse.json(category)
   } catch (error) {
      console.error('[CATEGORIES_PATCH]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
