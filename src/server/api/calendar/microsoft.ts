// src/server/api/calendar/microsoft.ts
import axios from "axios";
import { db } from "@/server/db";

export async function getAccessToken(userId: string) {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: "microsoft-entra-id",
    },
  });

  if (!account?.access_token) {
    throw new Error("No access token found");
  }

  return account.access_token;
}

export async function getCalendarEvents(userId: string) {
  const token = await getAccessToken(userId);

  const response = await axios.get("https://graph.microsoft.com/v1.0/me/calendar/events", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.value;
}

export async function getGraphAppToken() {
  const res = await axios.post(
    `https://login.microsoftonline.com/YOUR_TENANT_ID/oauth2/v2.0/token`,
    new URLSearchParams({
      client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return res.data.access_token;
}

export async function getCallRecords() {
    const token = await getGraphAppToken();
  
    const res = await axios.get(
      "https://graph.microsoft.com/v1.0/communications/callRecords",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return res.data;
  }