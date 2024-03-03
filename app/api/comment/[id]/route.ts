import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/prismaClient";

// localhost:3000/api/comment/abdc POST 대댓글 작성

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const { content } = await request.json();
    const { id } = params;

    if (!content || !id) {
      return NextResponse.json(
        {
          message: "Not exist data",
        },
        {
          status: 400,
        }
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "Wrong session",
        },
        {
          status: 400,
        }
      );
    }

    const existComment = await prismaClient.comment.findUnique({
      where: {
        id,
      },
    });

    if (!existComment) {
      return NextResponse.json(
        {
          message: "Not exist comment.",
        },
        {
          status: 400,
        }
      );
    }

    const comment = await prismaClient.comment.create({
      data: {
        content,
        userId: session.user.id,
        parentCommentId: id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
};
