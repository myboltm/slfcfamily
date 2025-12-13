import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentPayload {
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  reference: string;
  message?: string;
}

interface VerifyPayload {
  reference: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (path.includes("/verify")) {
      const { reference }: VerifyPayload = await req.json();

      const verifyResponse = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
          },
        }
      );

      const verifyData = await verifyResponse.json();

      if (verifyData.status && verifyData.data.status === "success") {
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);

          const metadata = verifyData.data.metadata?.custom_fields || [];
          const donorName = metadata.find((field: { variable_name: string; value: string }) =>
            field.variable_name === "donor_name"
          )?.value || "";
          const phone = metadata.find((field: { variable_name: string; value: string }) =>
            field.variable_name === "phone_number"
          )?.value || "";
          const message = metadata.find((field: { variable_name: string; value: string }) =>
            field.variable_name === "message"
          )?.value || "";

          await supabase.from("donations").insert({
            amount: verifyData.data.amount / 100,
            currency: verifyData.data.currency,
            donor_name: donorName,
            donor_email: verifyData.data.customer.email,
            donor_phone: phone,
            transaction_id: verifyData.data.id.toString(),
            status: "completed",
            reference: reference,
            message: message,
          });
        }

        return new Response(
          JSON.stringify({
            status: "success",
            message: "Payment verified successfully",
            data: verifyData.data,
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "Payment verification failed",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    if (path.includes("/webhook")) {
      const event = await req.json();

      if (event.event === "charge.success") {
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);

          const metadata = event.data.metadata?.custom_fields || [];
          const donorName = metadata.find((field: { variable_name: string; value: string }) =>
            field.variable_name === "donor_name"
          )?.value || "";
          const phone = metadata.find((field: { variable_name: string; value: string }) =>
            field.variable_name === "phone_number"
          )?.value || "";
          const message = metadata.find((field: { variable_name: string; value: string }) =>
            field.variable_name === "message"
          )?.value || "";

          await supabase.from("donations").upsert({
            amount: event.data.amount / 100,
            currency: event.data.currency,
            donor_name: donorName,
            donor_email: event.data.customer.email,
            donor_phone: phone,
            transaction_id: event.data.id.toString(),
            status: "completed",
            reference: event.data.reference,
            message: message,
          }, {
            onConflict: 'reference'
          });
        }
      }

      return new Response(
        JSON.stringify({ status: "success" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const payload: PaymentPayload = await req.json();

    const paystackPayload = {
      email: payload.customer_email,
      amount: payload.amount * 100,
      currency: payload.currency,
      reference: payload.reference,
      callback_url: `${new URL(req.url).origin}/?payment=success`,
      metadata: {
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: payload.customer_name,
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: payload.customer_phone || "",
          },
          {
            display_name: "Message",
            variable_name: "message",
            value: payload.message || "",
          },
        ],
      },
    };

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paystackPayload),
      }
    );

    const paystackData = await paystackResponse.json();

    if (paystackData.status) {
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        await supabase.from("donations").insert({
          amount: payload.amount,
          currency: payload.currency,
          donor_name: payload.customer_name,
          donor_email: payload.customer_email,
          donor_phone: payload.customer_phone,
          transaction_id: paystackData.data.reference,
          status: "pending",
          reference: payload.reference,
          message: payload.message,
        });
      }

      return new Response(
        JSON.stringify({
          status: "success",
          message: "Payment link generated successfully",
          data: {
            authorization_url: paystackData.data.authorization_url,
            access_code: paystackData.data.access_code,
            reference: paystackData.data.reference,
          },
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
