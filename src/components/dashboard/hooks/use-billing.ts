"use client";

import { useCallback, useState } from "react";
import type { UsageStats } from "./use-usage";

export function useBilling(usageStats: UsageStats | null) {
  const [isBillingLoading, setIsBillingLoading] = useState(false);

  const handleBilling = useCallback(async () => {
    setIsBillingLoading(true);
    try {
      const plan = usageStats?.plan?.plan ?? "free";
      const isPaid = plan === "pro" || plan === "enterprise";

      if (isPaid) {
        const res = await fetch("/api/billing/portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ returnUrl: window.location.href }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error?.message ?? "Failed to launch billing portal");
        }
      } else {
        const priceId =
          process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "price_mock_pro_12345";
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            successUrl: `${window.location.origin}/dashboard?session_id=cs_mock_${Date.now()}&price_id=${priceId}`,
            cancelUrl: `${window.location.origin}/dashboard?checkout=cancel`,
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error?.message ?? "Failed to launch checkout session");
        }
      }
    } catch (err) {
      console.error("Billing action failed:", err);
      alert("Billing system encountered an error. Please try again.");
    } finally {
      setIsBillingLoading(false);
    }
  }, [usageStats]);

  return { isBillingLoading, handleBilling };
}
