import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};


export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
     
    const { id } = await context.params; 
    
    const body = await request.json();
    const { columnId } = body;

    
    // await db.patient.update({ where: { id }, data: { columnId } });

    return NextResponse.json({ message: "Patient déplacé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // await db.patient.delete({ where: { id } });

    return NextResponse.json({ message: "Patient supprimé" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}