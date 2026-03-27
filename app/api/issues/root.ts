import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      include: { createdBy: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(issues);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, priority } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique ticket ID
    const ticketId = `ISS-${Date.now()}`;

    const issue = await prisma.issue.create({
      data: {
        ticketId,
        title,
        description,
        priority: priority || 'Medium',
        status: 'New',
        createdById: parseInt(session.user.id),
      },
      include: { createdBy: true },
    });

    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create issue' },
      { status: 500 }
    );
  }
}