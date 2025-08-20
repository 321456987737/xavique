import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/model/User";

export async function PATCH(_req, { params }) {
  try {
    await dbConnect();
console.log(5)

    const {id} = await params;
    console.log( id )
    const body = await _req.json();
    const { role } = body || {};
console.log(5,role)

    const allowed = ["customer", "admin", "superadmin"];
    if (!allowed.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
console.log(6)

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { role: role } },
      { new: true }
    ).lean();
    console.log(updated)
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
console.log(7)

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/users/[id]/role error", err);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
