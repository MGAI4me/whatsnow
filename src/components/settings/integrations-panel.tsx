"use client";

import { useEffect, useState, startTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { toast } from "sonner";
import { ShoppingCart, Store, ShoppingBag, Package, CheckCircle2, XCircle } from "lucide-react";

interface IntegrationRow {
  id: string;
  name: string;
  status: "connected" | "disconnected";
  icon: string;
  description: string;
}

const iconMap: Record<string, any> = {
  "ti-shopping-cart": ShoppingCart,
  "ti-building-store": Store,
  "ti-shopping-bag": ShoppingBag,
  "ti-package": Package,
};

export function IntegrationsPanel() {
  const { accountId, canEditSettings } = useAuth();
  const { t } = useLanguage();
  const [integrations, setIntegrations] = useState<IntegrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;

    const fetchIntegrations = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("integrations")
        .select("id, name, status, icon, description")
        .order("position", { ascending: true });

      if (error) {
        toast.error("Failed to load integrations: " + error.message);
      } else if (data) {
        setIntegrations(data as IntegrationRow[]);
      }
      setLoading(false);
    };

    fetchIntegrations();
  }, [accountId]);

  const toggleConnection = async (item: IntegrationRow) => {
    if (!canEditSettings) {
      toast.error("You do not have permission to manage integrations.");
      return;
    }

    setTogglingId(item.id);
    const newStatus = item.status === "connected" ? "disconnected" : "connected";

    const supabase = createClient();
    const { error } = await supabase
      .from("integrations")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", item.id);

    if (error) {
      toast.error("Operation failed: " + error.message);
    } else {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
      );
      toast.success(
        `${item.name} ${
          newStatus === "connected" ? t("common.connected") : t("common.disconnected")
        } successfully!`
      );
    }
    setTogglingId(null);
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {integrations.map((item) => {
          const IconComponent = iconMap[item.icon] || ShoppingBag;
          const isConnected = item.status === "connected";

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 ${
                isConnected
                  ? "border-[#86ccad]/30 bg-slate-900 shadow-md shadow-[#86ccad]/5"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${
                        isConnected
                          ? "bg-[#86ccad]/10 text-[#86ccad]"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <IconComponent className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isConnected ? (
                          <>
                            <CheckCircle2 className="size-3.5 text-[#86ccad]" />
                            <span className="text-xs font-medium text-[#86ccad]">
                              {t("common.connected")}
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3.5 text-slate-500" />
                            <span className="text-xs font-medium text-slate-500">
                              {t("common.disconnected")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {t(`integrations.${item.name.toLowerCase()}.desc`)}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-800/80 pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={togglingId === item.id}
                  onClick={() => toggleConnection(item)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    isConnected
                      ? "bg-slate-800 text-rose-400 hover:bg-slate-700/85 focus:ring-rose-500"
                      : "bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary"
                  }`}
                >
                  {togglingId === item.id
                    ? t("common.saving")
                    : isConnected
                    ? t("common.disconnect")
                    : t("common.connect")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
