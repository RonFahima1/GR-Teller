import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      country,
      occupation,
      sourceOfFunds,
      purposeOfRemittance,
    } = body;

    // Validate required fields
    const requiredFields = [
      firstName, lastName, phoneNumber, dateOfBirth,
      address, city, state, zipCode, country,
      occupation, sourceOfFunds, purposeOfRemittance
    ];

    if (requiredFields.some(field => !field)) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Update user profile using raw SQL to avoid type issues
    const updatedUser = await prisma.$executeRaw`
      UPDATE "User" 
      SET 
        name = ${`${firstName} ${lastName}`},
        "onboardingData" = ${JSON.stringify({
          phoneNumber,
          dateOfBirth,
          address,
          city,
          state,
          zipCode,
          country,
          occupation,
          sourceOfFunds,
          purposeOfRemittance,
        })},
        "onboardingStatus" = 'COMPLETED',
        "updatedAt" = NOW()
      WHERE email = ${session.user.email}
    `;

    // Get the updated user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json({
      message: "Onboarding completed successfully",
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
    });

  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("Get onboarding data error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 