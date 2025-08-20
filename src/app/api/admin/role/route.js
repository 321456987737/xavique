import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/model/User";

export async function GET(req) {
  try {
    await dbConnect();
console.log(1)
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const role = (searchParams.get("role") || "all").toLowerCase();
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10"), 1),
      100
    );
console.log(2)

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }
    if (["customer", "admin", "superadmin"].includes(role)) {
      filter.role = role;
    }

    const skip = (page - 1) * limit;
console.log(3)

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
console.log(4)

    return NextResponse.json(
      {
        users,
        pagination: {
          total,
          page,
          limit,
          pageCount: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/users error", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
