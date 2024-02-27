import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/prismaClient";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const post = await prismaClient.post.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          message: "Not exist post.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(post);
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
