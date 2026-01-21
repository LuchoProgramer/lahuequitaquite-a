import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret')
    const tag = request.nextUrl.searchParams.get('tag')

    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    if (!tag) {
        return NextResponse.json({ message: 'Missing tag param' }, { status: 400 })
    }

    revalidateTag(tag, 'default')

    return NextResponse.json({ revalidated: true, now: Date.now() })
}
