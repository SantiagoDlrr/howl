// src/server/api/routers/microsoft.ts
import { createTRPCRouter, publicProcedure } from "howl/server/api/trpc";
import axios from "axios";

export const microsoftRouter = createTRPCRouter({
  getCallRecords: publicProcedure
    .query(async () => {
    // return { id: "abc123", name: "Test Call" };


    const res = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
        client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ).catch((err) => {
      console.error("Error fetching token:", err.response?.data || err.message);
      throw new Error("Failed to fetch access token");
    });

    console.log("RESULTTTTT", res.data);

    const accessToken = res.data.access_token;
    // return accessToken;
    // const users = await axios.get("https://graph.microsoft.com/v1.0/users", {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    
    // console.log("Users:", users.data.value);
    const calendar = await axios.get(
      `https://graph.microsoft.com/v1.0/users/alecoeto@hotmail.com/calendar/events`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    // const events = await axios.get(
    //   `https://graph.microsoft.com/v1.0/users/${userInfo.data.id}/events`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );

    // console.log("EVENTS", events.data);
    const callRecords = await axios.get(
      "https://graph.microsoft.com/v1.0/communications/callRecords",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("RECORDSS", callRecords.data);
    return callRecords.data;
  }),
});
