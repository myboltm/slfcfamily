import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
  tx_ref: string;
  message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: PaymentPayload = await req.json();

    const flutterwaveKey = 'FLWSECK_TEST-f804b42b2aa9a815f2142075fb6385db-X';
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const flutterwavePayload = {
      tx_ref: payload.tx_ref,
      amount: payload.amount,
      currency: payload.currency,
      customer: {
        email: payload.customer_email,
        name: payload.customer_name,
        phone_number: payload.customer_phone,
      },
      customizations: {
        title: "Shining Light Family Church",
        description: payload.message || "Church Donation",
        logo: "https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/slfclogo-removebg-preview.png",
      },
      redirect_url: `${new URL(req.url).origin}/?payment=success`,
    };

    const flutterwaveResponse = await fetch(
      "https://api.flutterwave.com/v3/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${flutterwaveKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flutterwavePayload),
      }
    );

    const flutterwaveData = await flutterwaveResponse.json();

    if (flutterwaveData.status !== "success") {
      throw new Error(flutterwaveData.message || "Failed to create payment");
    }

    if (supabaseUrl && supabaseServiceKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/donations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseServiceKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            amount: payload.amount,
            currency: payload.currency,
            donor_name: payload.customer_name,
            donor_email: payload.customer_email,
            donor_phone: payload.customer_phone,
            transaction_id: flutterwaveData.data.id,
            status: "pending",
            reference: payload.tx_ref,
            message: payload.message,
          }),
        });
      } catch (dbError) {
        console.error("Database insertion error:", dbError);
      }
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Payment link generated successfully",
        data: {
          link: flutterwaveData.data.link,
          reference: payload.tx_ref,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
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