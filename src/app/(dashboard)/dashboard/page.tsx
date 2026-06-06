"use client"

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  MessageSquare,
  UserPlus,
  DollarSign,
  Send,
  ShoppingBag,
  TrendingUp,
  Percent,
} from 'lucide-react'

import {
  loadActivity,
  loadConversationsSeries,
  loadMetrics,
  loadPipelineDonut,
  loadResponseTime,
  loadAutomationsRevenue,
  type AutomationRevenueRow,
} from '@/lib/dashboard/queries'
import type {
  ActivityItem,
  ConversationsSeriesPoint,
  MetricsBundle,
  PipelineDonutData,
  ResponseTimeSummary,
} from '@/lib/dashboard/types'

import { MetricCard } from '@/components/dashboard/metric-card'
import { SkeletonCard } from '@/components/dashboard/skeleton'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ConversationsChart } from '@/components/dashboard/conversations-chart'
import { PipelineDonut } from '@/components/dashboard/pipeline-donut'
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { useLanguage } from '@/hooks/use-language'

type RangeDays = 7 | 30 | 90

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const [metrics, setMetrics] = useState<MetricsBundle | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(true)

  const [range, setRange] = useState<RangeDays>(30)
  // Keep a cache per range so switching tabs doesn't re-fetch what we
  // already have. Ranges the user hasn't opened yet stay null and
  // trigger a fetch on first view.
  const [series, setSeries] = useState<Record<RangeDays, ConversationsSeriesPoint[] | null>>({
    7: null,
    30: null,
    90: null,
  })
  const [seriesLoading, setSeriesLoading] = useState(true)

  const [pipeline, setPipeline] = useState<PipelineDonutData | null>(null)
  const [pipelineLoading, setPipelineLoading] = useState(true)

  const [responseTime, setResponseTime] = useState<ResponseTimeSummary | null>(null)
  const [responseTimeLoading, setResponseTimeLoading] = useState(true)

  const [activity, setActivity] = useState<ActivityItem[] | null>(null)
  const [activityLoading, setActivityLoading] = useState(true)

  const [automationsRevenue, setAutomationsRevenue] = useState<AutomationRevenueRow[] | null>(null)
  const [automationsRevenueLoading, setAutomationsRevenueLoading] = useState(true)

  const loadAll = useCallback(() => {
    const db = createClient()

    // Kick everything off in parallel. Each block has its own
    // setState + finally so a slow query doesn't hold up faster
    // sections — each widget shows its own skeleton independently.
    void loadMetrics(db)
      .then((m) => setMetrics(m))
      .catch((err) => console.error('[dashboard] metrics failed:', err))
      .finally(() => setMetricsLoading(false))

    void loadConversationsSeries(db, 30)
      .then((s) => setSeries((prev) => ({ ...prev, 30: s })))
      .catch((err) => console.error('[dashboard] series failed:', err))
      .finally(() => setSeriesLoading(false))

    void loadPipelineDonut(db)
      .then((p) => setPipeline(p))
      .catch((err) => console.error('[dashboard] pipeline failed:', err))
      .finally(() => setPipelineLoading(false))

    void loadResponseTime(db)
      .then((r) => setResponseTime(r))
      .catch((err) => console.error('[dashboard] response time failed:', err))
      .finally(() => setResponseTimeLoading(false))

    // Fetch up to 50 so the biggest page-size option in the feed
    // (50 rows) is already in memory — switching sizes then becomes
    // a pure client-side slice with no extra round trip.
    void loadActivity(db, 50)
      .then((a) => setActivity(a))
      .catch((err) => console.error('[dashboard] activity failed:', err))
      .finally(() => setActivityLoading(false))

    void loadAutomationsRevenue(db)
      .then((ar) => setAutomationsRevenue(ar))
      .catch((err) => console.error('[dashboard] automations revenue failed:', err))
      .finally(() => setAutomationsRevenueLoading(false))
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Range switch handler — kept in an event callback (not an effect)
  // so the setState calls stay out of the react-hooks/set-state-in-effect
  // rule's way. The cached bucket check means switching back to a
  // previously-viewed range is instant and doesn't re-fetch.
  const handleRangeChange = useCallback(
    (r: RangeDays) => {
      setRange(r)
      if (series[r] !== null) return
      setSeriesLoading(true)
      const db = createClient()
      loadConversationsSeries(db, r)
        .then((s) => setSeries((prev) => ({ ...prev, [r]: s })))
        .catch((err) => console.error('[dashboard] series failed:', err))
        .finally(() => setSeriesLoading(false))
    },
    [series],
  )

  const currencyCode = t("common.currency")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsLoading || !metrics ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MetricCard
              title={t("dashboard.kpi.activeConversations")}
              value={metrics.activeConversations.current.toLocaleString()}
              icon={MessageSquare}
              delta={{
                sign: metrics.activeConversations.previous,
                label: deltaLabel(
                  metrics.activeConversations.previous,
                  t("dashboard.kpi.newToday"),
                  t("dashboard.kpi.noChange")
                ),
              }}
            />
            <MetricCard
              title={t("dashboard.kpi.newContactsToday")}
              value={metrics.newContactsToday.current.toLocaleString()}
              icon={UserPlus}
              delta={{
                sign:
                  metrics.newContactsToday.current - metrics.newContactsToday.previous,
                label: deltaLabel(
                  metrics.newContactsToday.current - metrics.newContactsToday.previous,
                  t("dashboard.kpi.vsYesterday"),
                  t("dashboard.kpi.noChange")
                ),
              }}
            />
            <MetricCard
              title={t("dashboard.kpi.openDealsValue")}
              value={formatCurrency(metrics.openDealsValue, currencyCode)}
              icon={DollarSign}
              subtitle={`${metrics.openDealsCount} ${
                metrics.openDealsCount === 1
                  ? t("dashboard.kpi.dealsCount")
                  : t("dashboard.kpi.dealsCountPlural")
              }`}
            />
            <MetricCard
              title={t("dashboard.kpi.messagesSentToday")}
              value={metrics.messagesSentToday.current.toLocaleString()}
              icon={Send}
              delta={{
                sign:
                  metrics.messagesSentToday.current - metrics.messagesSentToday.previous,
                label: deltaLabel(
                  metrics.messagesSentToday.current - metrics.messagesSentToday.previous,
                  t("dashboard.kpi.vsYesterday"),
                  t("dashboard.kpi.noChange")
                ),
              }}
            />
          </>
        )}
      </div>

      {/* E-commerce KPIs (WapiGrow Marketing KPIs) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metricsLoading || !metrics ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MetricCard
              title={t("dashboard.kpi.ecommerceRevenue")}
              value={formatCurrency(metrics.ecommerceRevenue, currencyCode)}
              icon={ShoppingBag}
            />
            <MetricCard
              title={t("dashboard.kpi.attributedOrders")}
              value={metrics.attributedOrders.toLocaleString()}
              icon={TrendingUp}
            />
            <MetricCard
              title={t("dashboard.kpi.averageOrderValue")}
              value={formatCurrency(metrics.averageOrderValue, currencyCode)}
              icon={Percent}
            />
          </>
        )}
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Welcome Series Funnel (Arab Region E-commerce Funnel Layout) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">
            {t("dashboard.funnel.title")}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-slate-800/40 p-4 text-center border border-slate-800/80">
            <span className="text-2xl font-bold text-[#86ccad]">SAR 236K</span>
            <p className="text-xs text-slate-400 mt-1">{t("dashboard.funnel.revenue")}</p>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-4 text-center border border-slate-800/80">
            <span className="text-2xl font-bold text-primary">12.9K</span>
            <p className="text-xs text-slate-400 mt-1">{t("dashboard.funnel.newClients")}</p>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-4 text-center border border-slate-800/80">
            <span className="text-2xl font-bold text-white">559.9K</span>
            <p className="text-xs text-slate-400 mt-1">{t("dashboard.funnel.views")}</p>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-4 text-center border border-slate-800/80">
            <span className="text-2xl font-bold text-amber-400">2.3%</span>
            <p className="text-xs text-slate-400 mt-1">{t("dashboard.funnel.conversionRate")}</p>
          </div>
        </div>

        {/* Dynamic Funnel Bars */}
        <div className="rounded-lg bg-slate-950 p-4 border border-slate-850">
          <span className="text-xs font-semibold text-slate-400 block mb-3">
            {t("dashboard.funnel.funnelHeader")}
          </span>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 w-24 text-right">
                {t("dashboard.funnel.views")}
              </span>
              <div className="flex-1 h-6 bg-slate-800 rounded-md overflow-hidden relative">
                <div className="h-full bg-primary/85 w-full flex items-center px-3 justify-start">
                  <span className="text-xs font-bold text-white">559,900</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 w-24 text-right">
                {t("dashboard.funnel.newClients")}
              </span>
              <div className="flex-1 h-6 bg-slate-800 rounded-md overflow-hidden relative">
                <div className="h-full bg-[#86ccad]/85 w-[75%] flex items-center px-3 justify-start">
                  <span className="text-xs font-bold text-white">12,900</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 w-24 text-right">
                {t("dashboard.funnel.revenue")}
              </span>
              <div className="flex-1 h-6 bg-slate-800 rounded-md overflow-hidden relative">
                <div className="h-full bg-amber-600/85 w-[25%] flex items-center px-3 justify-start">
                  <span className="text-xs font-bold text-white">SAR 236,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automations Revenue breakdown table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <h3 className="text-base font-semibold text-white">
          {t("dashboard.automationsTable.title")}
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-sm text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="px-4 py-3 text-slate-300 font-semibold">{t("dashboard.automationsTable.automation")}</th>
                <th className="px-4 py-3 text-slate-300 font-semibold text-right">{t("dashboard.automationsTable.revenue30d")}</th>
                <th className="px-4 py-3 text-slate-300 font-semibold text-right">{t("dashboard.automationsTable.revenuePrev")}</th>
                <th className="px-4 py-3 text-slate-300 font-semibold text-right">{t("dashboard.automationsTable.revenueAll")}</th>
                <th className="px-4 py-3 text-slate-300 font-semibold text-center">{t("dashboard.automationsTable.status")}</th>
                <th className="px-4 py-3 text-slate-300 font-semibold text-right">{t("dashboard.automationsTable.orders30d")}</th>
              </tr>
            </thead>
            <tbody>
              {automationsRevenueLoading || !automationsRevenue ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800 animate-pulse bg-slate-900/50">
                    <td className="px-4 py-4"><div className="h-4 bg-slate-800 rounded w-48"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-800 rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-800 rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-800 rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-slate-800 rounded-full w-12 mx-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-slate-800 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                automationsRevenue.map((row) => (
                  <tr key={row.type} className="border-b border-slate-800 hover:bg-slate-850/50 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-white">{row.name}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-[#86ccad]">
                      {formatCurrency(row.revenue30d, currencyCode)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400">
                      {formatCurrency(row.revenuePrev, currencyCode)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-white">
                      {formatCurrency(row.revenueAll, currencyCode)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                        row.active 
                          ? 'border-[#86ccad]/30 bg-[#86ccad]/10 text-[#86ccad]' 
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}>
                        {row.active ? t("common.active") : t("common.inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-white">{row.orders30d}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="h-full lg:col-span-3">
          <ConversationsChart
            series={series}
            loading={seriesLoading}
            range={range}
            onRangeChange={handleRangeChange}
          />
        </div>
        <div className="h-full lg:col-span-2">
          <PipelineDonut data={pipeline} loading={pipelineLoading} />
        </div>
      </div>

      {/* Response time */}
      <ResponseTimeChart data={responseTime} loading={responseTimeLoading} />

      {/* Activity feed */}
      <ActivityFeed items={activity} loading={activityLoading} />
    </div>
  )
}

// ------------------------------------------------------------

function formatCurrency(v: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v)
}

function deltaLabel(delta: number, suffix: string, noChangeLabel: string): string {
  if (delta === 0) return `${noChangeLabel} ${suffix}`
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta.toLocaleString()} ${suffix}`
}
