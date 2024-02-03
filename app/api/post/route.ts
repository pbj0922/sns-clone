import { authOptions } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// 모든 글 내용을 조회
// 로그인 필요 없음
export const GET = async (request: NextRequest) => {
  try {
    // localhost:3000/api/post?page=10&data=abc
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    //  || +page <= 0
    if (!page || isNaN(+page)) {
      return NextResponse.json(
        {
          message: "Not exist page.",
        },
        {
          status: 400,
        }
      );
    }

    // (1-1)*3 = 0~2 012
    // (2-1)*3 = 3~5 345
    // (3-1)*3 = 6~8 678

    const posts = await prismaClient.post.findMany({
      skip: (+page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      // select 또는 include 상황에 맞게 사용
      include: {
        user: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { content } = await request.json();
    const session = await getServerSession(authOptions);

    if (!content) {
      return NextResponse.json(
        {
          message: "Not exist content.",
        },
        {
          status: 400,
        }
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          message: "Not exist session.",
        },
        {
          status: 400,
        }
      );
    }

    const post = await prismaClient.post.create({
      data: {
        content,
        userId: session.user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error,
      },
      {
        status: 500,
      }
    );
  }
};
