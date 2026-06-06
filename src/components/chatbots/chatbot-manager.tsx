'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Bot,
  MessageSquare,
  Clock,
  Save,
  Loader2,
  Plus,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ChatbotConfig {
  id: string;
  account_id: string;
  name: string;
  trigger_type: 'welcome' | 'faq' | 'office';
  reply_text: string;
  keywords: string[];
  is_active: boolean;
}

export function ChatbotManager() {
  const supabase = createClient();
  const { accountId, loading: authLoading, profileLoading } = useAuth();
  const { t, dir } = useLanguage();

  const [loading, setLoading] = useState(true);
  
  // Welcome Bot State
  const [welcomeId, setWelcomeId] = useState('');
  const [welcomeActive, setWelcomeActive] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const [savingWelcome, setSavingWelcome] = useState(false);

  // FAQ Bot State
  const [faqId, setFaqId] = useState('');
  const [faqActive, setFaqActive] = useState(false);
  const [faqText, setFaqText] = useState('');
  const [faqKeywords, setFaqKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [savingFaq, setSavingFaq] = useState(false);

  // Out of Office Bot State
  const [officeId, setOfficeId] = useState('');
  const [officeActive, setOfficeActive] = useState(false);
  const [officeText, setOfficeText] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [savingOffice, setSavingOffice] = useState(false);

  const loadConfigs = async (acctId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('account_id', acctId);

      if (error) {
        console.error('Error loading chatbot configs:', error);
        toast.error('Failed to load chatbot settings');
        return;
      }

      if (data) {
        // Map states
        const welcome = data.find((c: any) => c.trigger_type === 'welcome');
        if (welcome) {
          setWelcomeId(welcome.id);
          setWelcomeActive(welcome.is_active);
          setWelcomeText(welcome.reply_text);
        }

        const faq = data.find((c: any) => c.trigger_type === 'faq');
        if (faq) {
          setFaqId(faq.id);
          setFaqActive(faq.is_active);
          setFaqText(faq.reply_text);
          if (Array.isArray(faq.keywords)) {
            setFaqKeywords(faq.keywords.map(String));
          }
        }

        const office = data.find((c: any) => c.trigger_type === 'office');
        if (office) {
          setOfficeId(office.id);
          setOfficeActive(office.is_active);
          setOfficeText(office.reply_text);
          if (Array.isArray(office.keywords) && office.keywords.length >= 2) {
            setStartTime(String(office.keywords[0]));
            setEndTime(String(office.keywords[1]));
          }
        }
      }
    } catch (err) {
      console.error('Failed to parse chatbot rows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (accountId) {
      loadConfigs(accountId);
    }
  }, [authLoading, profileLoading, accountId]);

  const saveWelcomeBot = async () => {
    if (!accountId || !welcomeId) return;
    setSavingWelcome(true);
    try {
      const { error } = await supabase
        .from('chatbots')
        .update({
          is_active: welcomeActive,
          reply_text: welcomeText.trim(),
        })
        .eq('id', welcomeId);

      if (error) throw error;
      toast.success(t('common.saved'));
    } catch (err: any) {
      console.error('Welcome bot save error:', err);
      toast.error(err.message || 'Failed to save Welcome Bot configuration');
    } finally {
      setSavingWelcome(false);
    }
  };

  const saveFaqBot = async () => {
    if (!accountId || !faqId) return;
    setSavingFaq(true);
    try {
      const { error } = await supabase
        .from('chatbots')
        .update({
          is_active: faqActive,
          reply_text: faqText.trim(),
          keywords: faqKeywords,
        })
        .eq('id', faqId);

      if (error) throw error;
      toast.success(t('common.saved'));
    } catch (err: any) {
      console.error('FAQ bot save error:', err);
      toast.error(err.message || 'Failed to save FAQ Bot configuration');
    } finally {
      setSavingFaq(false);
    }
  };

  const saveOfficeBot = async () => {
    if (!accountId || !officeId) return;
    setSavingOffice(true);
    try {
      const { error } = await supabase
        .from('chatbots')
        .update({
          is_active: officeActive,
          reply_text: officeText.trim(),
          keywords: [startTime, endTime],
        })
        .eq('id', officeId);

      if (error) throw error;
      toast.success(t('common.saved'));
    } catch (err: any) {
      console.error('Office bot save error:', err);
      toast.error(err.message || 'Failed to save Out of Office Bot configuration');
    } finally {
      setSavingOffice(false);
    }
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newKeyword.trim().toLowerCase();
    if (clean && !faqKeywords.includes(clean)) {
      setFaqKeywords([...faqKeywords, clean]);
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setFaqKeywords(faqKeywords.filter((k) => k !== kw));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t('chatbots.title')}</h1>
        <p className="text-sm text-slate-400 mt-1">{t('chatbots.subtitle')}</p>
      </div>

      <Alert className="bg-slate-900 border-slate-700 max-w-4xl">
        <HelpCircle className="size-4 text-primary shrink-0" />
        <AlertTitle className="text-white">
          {dir === 'rtl' ? 'آلية تفعيل سريعة مباشرة' : 'Direct Fast-Path Activation'}
        </AlertTitle>
        <AlertDescription className="text-slate-400 text-sm">
          {dir === 'rtl'
            ? 'تعمل برامج الشات بوت هذه مباشرةً وبشكل فوري داخل معالج الرسائل الواردة لضمان استجابة سريعة جداً للمستخدمين متجاوزة أي محركات تدفق معقدة.'
            : 'These chatbots intercept and respond instantly inside the inbound message webhook, bypassing custom flow engines for ultra-fast reaction times.'}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 max-w-4xl">
        {/* Welcome Bot */}
        <Card className="bg-slate-900 border-slate-800 hover:border-slate-700/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="size-5" />
              </div>
              <div>
                <CardTitle className="text-white text-base">{t('chatbots.welcome.title')}</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-0.5">
                  {t('chatbots.welcome.desc')}
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={welcomeActive}
              onCheckedChange={setWelcomeActive}
              aria-label="Toggle Welcome Bot"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">{dir === 'rtl' ? 'رسالة الترحيب' : 'Welcome message'}</Label>
              <Textarea
                placeholder={t('chatbots.welcome.placeholder')}
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
                rows={4}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={saveWelcomeBot}
                disabled={savingWelcome}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {savingWelcome ? (
                  <Loader2 className="size-4 animate-spin shrink-0" />
                ) : (
                  <Save className="size-4 shrink-0" />
                )}
                {t('common.save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Bot */}
        <Card className="bg-slate-900 border-slate-800 hover:border-slate-700/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <CardTitle className="text-white text-base">{t('chatbots.faq.title')}</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-0.5">
                  {t('chatbots.faq.desc')}
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={faqActive}
              onCheckedChange={setFaqActive}
              aria-label="Toggle FAQ Bot"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">{dir === 'rtl' ? 'الرد التلقائي للأسئلة الشائعة' : 'FAQ Auto-Reply message'}</Label>
              <Textarea
                placeholder={t('chatbots.faq.placeholder')}
                value={faqText}
                onChange={(e) => setFaqText(e.target.value)}
                rows={4}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
              />
            </div>

            {/* Keyword tags */}
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">
                {t('chatbots.faq.keywordsLabel')}
              </Label>
              <form onSubmit={handleAddKeyword} className="flex gap-2">
                <Input
                  placeholder={t('chatbots.faq.keywordsPlaceholder')}
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
                />
                <Button type="submit" variant="outline" className="border-slate-800 text-white hover:bg-slate-800 shrink-0">
                  <Plus className="size-4" />
                  {dir === 'rtl' ? 'إضافة' : 'Add'}
                </Button>
              </form>

              {/* Tag display list */}
              <div className="flex flex-wrap gap-2 mt-2 pt-1">
                {faqKeywords.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    {dir === 'rtl' ? 'لا توجد كلمات مفتاحية مضافة حالياً.' : 'No keywords added yet.'}
                  </p>
                ) : (
                  faqKeywords.map((kw) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="bg-slate-800 border-slate-700 text-slate-200 pl-2 pr-1.5 py-1 flex items-center gap-1.5 hover:bg-slate-700"
                    >
                      <span className="text-xs">{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-400 hover:text-white shrink-0 rounded-full hover:bg-slate-600 p-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={saveFaqBot}
                disabled={savingFaq}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {savingFaq ? (
                  <Loader2 className="size-4 animate-spin shrink-0" />
                ) : (
                  <Save className="size-4 shrink-0" />
                )}
                {t('common.save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Out of Office Bot */}
        <Card className="bg-slate-900 border-slate-800 hover:border-slate-700/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <CardTitle className="text-white text-base">{t('chatbots.office.title')}</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-0.5">
                  {t('chatbots.office.desc')}
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={officeActive}
              onCheckedChange={setOfficeActive}
              aria-label="Toggle Out of Office Bot"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">{dir === 'rtl' ? 'رسالة الرد خارج أوقات العمل' : 'Away message'}</Label>
              <Textarea
                placeholder={t('chatbots.office.placeholder')}
                value={officeText}
                onChange={(e) => setOfficeText(e.target.value)}
                rows={4}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-primary"
              />
            </div>

            {/* Time Range Inputs */}
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">
                {t('chatbots.office.hoursLabel')}
              </Label>
              <div className="flex items-center gap-3 max-w-sm">
                <div className="flex-1 space-y-1">
                  <span className="text-xs text-slate-500">{dir === 'rtl' ? 'بداية العمل' : 'Start time'}</span>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white focus-visible:ring-primary"
                  />
                </div>
                <div className="text-slate-500 font-bold self-end pb-2.5">—</div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs text-slate-500">{dir === 'rtl' ? 'نهاية العمل' : 'End time'}</span>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white focus-visible:ring-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {dir === 'rtl' 
                  ? 'ملاحظة: سيتم تشغيل بوت خارج أوقات العمل للرد تلقائياً على أي رسالة تأتي خارج ساعات العمل المحددة، وذلك بالاعتماد على توقيت مدينة الرياض.'
                  : 'Note: The Out of Office Bot will reply during times that fall outside the configured range (checked in Asia/Riyadh timezone).'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={saveOfficeBot}
                disabled={savingOffice}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {savingOffice ? (
                  <Loader2 className="size-4 animate-spin shrink-0" />
                ) : (
                  <Save className="size-4 shrink-0" />
                )}
                {t('common.save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
