import dbConnect from "../../utils/dbConnect";  // Adjust the relative path based on the file location
import Patient from "../../models/Patient";

export async function GET() {
  await dbConnect();
  const patients = await Patient.find({});
  return new Response(JSON.stringify(patients), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
