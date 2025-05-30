import { NextResponse } from "next/server";
import SessionController from "@/app/controllers/sessionController";
import CallsController from "@/app/controllers/callController";
import { callSchema } from "@/app/utils/schemas/callSchema";
import https from 'https';
import axios, { AxiosError } from "axios";

export async function POST(req: Request) {
  const sessionController = SessionController.getInstance();
  const callsController = CallsController.getInstance();
  const sessionResponse = await sessionController.getSession(req);

  if (sessionResponse.status !== 200) {
    return sessionResponse;
  }

  const sessionData = await sessionResponse.json();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const clientId = formData.get("clientId");
//   const userId = formData.get("userId");

  if (!file || !clientId || !sessionData.id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  console.log("Received file:", file.name);
  console.log("Client ID:", clientId);
  console.log("Session Data:", sessionData);
  try {
    // Forward file to HowlX server
    const forwardFormData = new FormData();
    forwardFormData.append("file", file);
    
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      
    let reportData;
    try {
      const axiosResponse = await axios.post(
        "https://howlx.adriangaona.dev/upload",
        // "https://app.howlx.run.place:443/upload",
        forwardFormData,
        // {
        //   httpsAgent,
        // }
      );
    
      reportData = axiosResponse.data;
    } catch (error: unknown) {
      const errText = error instanceof AxiosError ? error.response?.data || error.message : 'Unknown error';
      console.error("Failed to upload to HowlX:", errText);
      return NextResponse.json({ error: "Upload to HowlX failed", details: errText }, { status: 500 });
    }

    const report = reportData; 
    const consultantId = await sessionController.getConsultantId(sessionData);

    const parsedInput = {
      name: report.name ?? "Recording",
      satisfaction: report.satisfaction ?? undefined,
      duration: parseInt(String(report.duration), 10) || 0,
      summary: report.summary ?? undefined,
      date: new Date(),
      main_ideas: report.keyTopics ?? [],
      type: report.type ?? "recording",
      consultant_id: parseInt(String(consultantId), 10),
      client_id: parseInt(String(clientId), 10),
      feedback: report.feedback ?? undefined,
      sentiment_analysis: report.sentiment ?? undefined,
      risk_words: report.riskWords ?? [],
      output: report.output ?? undefined,
      diarized_transcript: report.transcript ?? undefined,
    };

    const validation = callSchema.safeParse(parsedInput);

    if (!validation.success) {
      console.error("Validation error:", validation.error);
      return NextResponse.json({ error: "Invalid data", details: validation.error }, { status: 400 });
    }

    const finalData = validation.data;

    const savedCall = await callsController.createCall(finalData);
    console.log("Call saved successfully:", savedCall);

    return NextResponse.json(savedCall, { status: 200 });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
