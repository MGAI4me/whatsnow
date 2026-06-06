'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  MessageSquare,
  Clock,
  Zap,
  Check,
  ArrowLeft,
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  HelpCircle,
  Users,
  Store,
  ArrowUpRight,
  Shield,
  MessageCircle,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Users,
      title: 'صندوق الوارد المشترك للمجموعات',
      desc: 'استقبل ورُد على محادثات عملائك من رقم واتساب رسمي واحد مع فريق عملك بالكامل. وزّع المحادثات تلقائياً وحسّن سرعة الاستجابة.',
    },
    {
      icon: Zap,
      title: 'حملات البث الذكية والترويجية',
      desc: 'أرسل آلاف الرسائل الإعلانية المخصصة بنقرة واحدة مع تتبع دقيق لحالة استلاف وقراءة الرسائل، مع حماية كاملة لرقمك من الحظر.',
    },
    {
      icon: Bot,
      title: 'روبوتات الدردشة التفاعلية (الشات بوت)',
      desc: 'وفر رداً تلقائياً وفورياً على مدار الساعة. تفعيل بوت ترحيبي، وبوت للرد على الأسئلة الشائعة، ورسائل الرد خارج أوقات العمل الرسمية.',
    },
    {
      icon: MessageSquare,
      title: 'مسارات المبيعات وإدارة الصفقات',
      desc: 'لوحة كانبان مرئية ومدمجة داخل الدردشة لإدارة صفقاتك وتتبع مراحل البيع مع عملائك بسهولة لضمان إغلاق المزيد من المبيعات.',
    },
  ];

  const integrations = [
    {
      name: 'سلة (Salla)',
      desc: 'اربط متجر سلة بضغطة زر لإرسال تنبيهات السلات المتروكة وتحديثات الشحن والطلبات تلقائياً.',
      logo: '🛒',
    },
    {
      name: 'زد (Zid)',
      desc: 'تكامل كامل مع منصة زد لإرسال فواتير الطلبات وحملات إعادة استهداف المشتريات للعملاء عبر الواتساب.',
      logo: '🏪',
    },
    {
      name: 'شوبيفاي (Shopify)',
      desc: 'أتمتة ذكية لاسترداد عربات التسوق المهجورة وتتبع القيمة الشرائية المنسوبة للواتساب.',
      logo: '👜',
    },
    {
      name: 'مكاني (Makane)',
      desc: 'مزامنة فورية لجهات الاتصال وأتمتة رسائل الترحيب والخصومات التسويقية مباشرة.',
      logo: '📦',
    },
  ];

  const pricing = [
    {
      name: 'الباقة التجريبية',
      price: '0',
      period: 'لمدة 7 أيام',
      desc: 'مثالية لتجربة المنصة واستكشاف الميزات الأساسية.',
      features: [
        'رقم واتساب رسمي واحد',
        'مستخدمين اثنين (2 Agents)',
        '100 محادثة نشطة شهرياً',
        'ردود تلقائية ترحيبية أساسية',
        'ربط متجر إلكتروني واحد',
      ],
      cta: 'ابدأ التجربة المجانية',
      popular: false,
    },
    {
      name: 'الباقة الأساسية (Growth)',
      price: '199',
      period: 'شهرياً',
      desc: 'الباقة الأكثر شعبية للمتاجر الصغيرة والمتوسطة لزيادة المبيعات.',
      features: [
        'رقم واتساب رسمي واحد',
        '5 مستخدمين للفريق',
        'محادثات غير محدودة للعملاء',
        'بوت ترحيبي + بوت الأسئلة الشائعة (FAQ)',
        'ربط غير محدود للمتاجر (سلة، زد، إلخ)',
        'تنبيهات تلقائية للسلات المتروكة',
        'دعم فني متكامل عبر الواتساب',
      ],
      cta: 'اشترك الآن',
      popular: true,
    },
    {
      name: 'الباقة الاحترافية (Pro)',
      price: '499',
      period: 'شهرياً',
      desc: 'باقة متقدمة للشركات الكبرى التي تتطلب أتمتة معقدة وعدد فريق كبير.',
      features: [
        'رقمين واتساب رسميين',
        'مستخدمين غير محدودين للفريق',
        'محادثات وحملات بث غير محدودة',
        'نظام شات بوت متكامل ومتقدم',
        'تكامل مخصص عبر الـ API والويب هوك',
        'مدير حساب خاص لمتابعة الأداء',
        'اتفاقية مستوى الخدمة (SLA) الرسمية',
      ],
      cta: 'تواصل معنا',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'ما هو WhatsNow وكيف يساعد متجري؟',
      a: 'WhatsNow هي منصة إدارة علاقات عملاء (CRM) متكاملة تتيح لك ربط رقم الواتساب الخاص بمتجرك بـ WhatsApp Business Cloud API الرسمي من Meta، مما يسمح لفريق العمل بالكامل بالرد على المحادثات من واجهة واحدة، وإرسال حملات البث التسويقية، وأتمتة الاستجابة للعملاء لزيادة مبيعات متجرك الإلكتروني.',
    },
    {
      q: 'هل يدعم التطبيق الربط مع المتاجر السعودية مثل سلة وزد؟',
      a: 'نعم، يدعم WhatsNow الربط الفوري والمباشر بضغطة زر واحدة مع متاجر سلة (Salla)، وزد (Zid)، وشوبيفاي (Shopify)، ومكاني (Makane). يتيح لك هذا الربط إرسال رسائل فواتير الطلبات الفورية، وتنبيهات الشحن، وحملات استرداد السلات المتروكة تلقائياً.',
    },
    {
      q: 'هل أحتاج لموافقة فيسبوك (Meta) لاستخدام الخدمة؟',
      a: 'نعم، الخدمة تعمل من خلال قنوات الربط الرسمية لشركة Meta. نحن نساعدك خطوة بخطوة في إنشاء حساب مطورين وربط رقم هاتفك بالـ Cloud API وتوثيقه بشكل رسمي لضمان سرعة التسليم وحماية رقمك من مخاطر الحظر.',
    },
    {
      q: 'كيف تعمل ميزة "خارج أوقات العمل الرسمية"؟',
      a: 'يمكنك تحديد ساعات العمل الخاصة بمتجرك (مثلاً من 9:00 صباحاً إلى 6:00 مساءً) في لوحة التحكم، وإذا أرسل لك أي عميل رسالة خارج هذه الأوقات، سيقوم الشات بوت بالرد عليه فوراً برسالة مخصصة تفيد بأن الفريق خارج العمل حالياً وسيتم التواصل معه فور العودة، وذلك اعتماداً على توقيت مدينة الرياض.',
    },
    {
      q: 'هل يمكنني تجربة المنصة قبل الاشتراك؟',
      a: 'بالتأكيد! نحن نوفر باقة تجريبية مجانية بالكامل لمدة 7 أيام تتيح لك اختبار المنصة، وإرسال الرسائل، وربط متجرك، واستكشاف كافة إعدادات الشات بوت والردود التلقائية لتتأكد من ملاءمتها لاحتياجاتك.',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[#FDFDFD] text-slate-900 antialiased font-sans select-none selection:bg-[#86ccad]/20 selection:text-[#1159af]">
      {/* Navigation Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-[#1159af] text-white p-2 rounded-xl shadow-md shadow-blue-600/10 flex items-center justify-center">
                <MessageCircle className="size-6 shrink-0" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Whats<span className="text-[#1159af]">Now</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-[#1159af] transition-colors">
                المميزات
              </a>
              <a href="#integrations" className="text-sm font-medium text-slate-600 hover:text-[#1159af] transition-colors">
                الربط الإلكتروني
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-[#1159af] transition-colors">
                الأسعار
              </a>
              <a href="#faqs" className="text-sm font-medium text-slate-600 hover:text-[#1159af] transition-colors">
                الأسئلة الشائعة
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-[#1159af] transition-colors px-4 py-2"
            >
              دخول
            </Link>
            <Link
              href="/signup"
              className="bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm hover:shadow"
            >
              ابدأ الآن مجاناً
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-5 space-y-4">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-slate-700 hover:text-[#1159af]"
            >
              المميزات
            </a>
            <a
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-slate-700 hover:text-[#1159af]"
            >
              الربط الإلكتروني
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-slate-700 hover:text-[#1159af]"
            >
              الأسعار
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-slate-700 hover:text-[#1159af]"
            >
              الأسئلة الشائعة
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-gradient-to-b from-[#1159af]/5 via-white to-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-[#86ccad]/10 border border-[#86ccad]/20 px-3.5 py-1.5 rounded-full text-[#1159af] text-xs font-semibold">
              <Shield className="size-3.5 text-[#1159af]" />
              منصة رسمية متكاملة عبر WhatsApp Cloud API
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight">
              ضاعف مبيعاتك وخدمة عملائك عبر <span className="text-[#1159af]">الواتساب</span>
            </h1>
            
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              المنصة المتكاملة لإدارة علاقات العملاء والأتمتة الذكية. رُد على استفسارات عملائك، وأطلق حملات بث تسويقية مخصصة، وشغّل روبوتات دردشة (شات بوت) ذكية على مدار الساعة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-[#1159af] hover:bg-[#0f4e99] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 transition-all text-center"
              >
                ابدأ تجربتك المجانية
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-2xl transition-all text-center flex items-center justify-center gap-2"
              >
                اكتشف الميزات
                <ArrowLeft className="size-4 shrink-0" />
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-black text-slate-900">+3x</div>
                <div className="text-xs text-slate-500 mt-1">زيادة في المبيعات</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">24/7</div>
                <div className="text-xs text-slate-500 mt-1">دعم وأتمتة فورية</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">99.9%</div>
                <div className="text-xs text-slate-500 mt-1">معدل تسليم الرسائل</div>
              </div>
            </div>
          </div>

          {/* Simulated Premium Dashboard Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1159af]/10 to-transparent blur-3xl rounded-3xl" />
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-w-lg mx-auto">
              {/* Mockup Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-yellow-400" />
                  <span className="size-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-semibold text-slate-400 font-mono">WhatsNow Shared Inbox</span>
                <span className="w-10" />
              </div>

              {/* Mockup Dashboard Content */}
              <div className="grid grid-cols-12 h-80 text-xs">
                {/* Conversations Sidebar */}
                <div className="col-span-4 border-l border-slate-200 bg-slate-50/50 p-2 space-y-2">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                    <span className="size-7 rounded-full bg-[#86ccad]/20 text-[#1159af] flex items-center justify-center font-bold">أ</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 truncate">أحمد محمد</div>
                      <div className="text-[10px] text-slate-400 truncate">مرحباً، أود تفاصيل الطلب...</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-slate-100/60 flex items-center gap-2 cursor-pointer">
                    <span className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">س</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-700 truncate">سارة خالد</div>
                      <div className="text-[10px] text-slate-400 truncate">هل يتوفر شحن مجاني؟</div>
                    </div>
                  </div>
                </div>

                {/* Main Chat Area */}
                <div className="col-span-8 flex flex-col justify-between p-3 bg-slate-50/20">
                  <div className="space-y-3 overflow-y-auto">
                    {/* Customer message */}
                    <div className="flex gap-2">
                      <span className="size-6 rounded-full bg-[#86ccad]/20 text-[#1159af] flex items-center justify-center font-bold shrink-0">أ</span>
                      <div className="bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tr-none text-slate-700 max-w-[80%] leading-relaxed shadow-sm">
                        مرحباً، أود الاستفسار عن باقات اشتراك متجر WhatsNow؟
                      </div>
                    </div>

                    {/* Bot autoreply */}
                    <div className="flex gap-2 justify-end">
                      <div className="bg-[#1159af] text-white p-2.5 rounded-2xl rounded-tl-none max-w-[80%] leading-relaxed shadow-sm shadow-blue-600/10">
                        أهلاً بك أحمد! باقات WhatsNow تبدأ من 199 ريال شهرياً. يمكنك ربط متجرك بضغطة زر وتفعيل الردود التلقائية 🚀
                      </div>
                      <span className="size-6 rounded-full bg-[#1159af] text-white flex items-center justify-center font-bold shrink-0">🤖</span>
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="border border-slate-200 bg-white rounded-xl p-2 flex items-center justify-between shadow-sm mt-2">
                    <span className="text-slate-400 px-1">اكتب الرد هنا...</span>
                    <button className="bg-[#1159af] text-white px-3 py-1 rounded-lg font-bold hover:bg-[#0f4e99] transition-colors">
                      إرسال
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-900">
              كل ما تحتاجه لإدارة محادثاتك ومبيعاتك في منصة واحدة
            </h2>
            <p className="text-slate-600 leading-relaxed">
              تخلص من المحادثات المشتتة. منصة WhatsNow تجمع لك كافة الخصائص الذكية لتسريع نمو أعمالك وخدمة عملائك بكفاءة عالية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-100 hover:border-[#1159af]/20 hover:bg-[#1159af]/5 p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="bg-[#86ccad]/15 text-[#1159af] p-3.5 rounded-xl inline-flex items-center justify-center mb-5 group-hover:bg-[#1159af] group-hover:text-white transition-colors">
                    <Icon className="size-6 shrink-0" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Store Integrations */}
      <section id="integrations" className="py-24 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-center lg:text-right">
            <div className="bg-[#86ccad]/10 text-[#1159af] border border-[#86ccad]/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
              <Store className="size-3.5" />
              تكامل فوري ودون أي أكواد
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-[1.3]">
              اربط متجرك الإلكتروني واستعد سلاتك المتروكة
            </h2>
            <p className="text-slate-600 leading-relaxed">
              اربط متجر سلة، زد، شوبيفاي، أو مكاني بضغطة زر. أتمتة كاملة لإرسال إشعارات السلات المتروكة، إرسال حالة تحديث الطلبات، وتأكيد عمليات الدفع لعملائك تلقائياً عبر الواتساب.
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {integrations.map((store, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-[#1159af]/30 transition-all flex items-start gap-4"
              >
                <span className="text-3xl bg-slate-50 p-2 rounded-xl shrink-0">
                  {store.logo}
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    {store.name}
                    <ArrowUpRight className="size-3.5 text-slate-400 shrink-0" />
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {store.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black text-slate-900">
              خطط تناسب جميع أحجام الأعمال والمتاجر
            </h2>
            <p className="text-slate-600 leading-relaxed">
              ابدأ تجربتك المجانية لمدة 7 أيام الآن. لا توجد رسوم خفية أو تكاليف إضافية، اختر الباقة التي تناسبك وقم بالترقية في أي وقت.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
            {pricing.map((card, index) => (
              <div
                key={index}
                className={`border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  card.popular
                    ? 'border-[#1159af] bg-[#1159af]/5 shadow-xl shadow-blue-600/5 lg:-translate-y-3'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {card.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1159af] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    الأكثر طلباً
                  </span>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{card.name}</h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{card.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900">{card.price}</span>
                    <span className="text-sm font-semibold text-slate-500">ريال سعودي</span>
                    <span className="text-xs text-slate-400">/ {card.period}</span>
                  </div>

                  <ul className="space-y-3.5 pt-4 border-t border-slate-100">
                    {card.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-600 text-sm">
                        <Check className="size-4 text-[#86ccad] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href="/signup"
                    className={`w-full block py-3 rounded-xl font-bold text-sm text-center transition-all ${
                      card.popular
                        ? 'bg-[#1159af] text-white hover:bg-[#0f4e99] shadow-md shadow-blue-600/10'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {card.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faqs" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <div className="bg-[#86ccad]/10 text-[#1159af] border border-[#86ccad]/20 px-3.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
              <HelpCircle className="size-3.5" />
              الأسئلة الشائعة
            </div>
            <h2 className="text-3xl font-black text-slate-900">لديك أي استفسارات؟ نحن هنا للإجابة</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-right font-bold text-slate-900 hover:text-[#1159af] transition-colors text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`size-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#1159af]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(134,204,173,0.1),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">
            هل أنت جاهز لتنمية مبيعات متجرك الإلكتروني؟
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto">
            انضم اليوم إلى آلاف المتاجر التي تستخدم WhatsNow لأتمتة تسويقها وزيادة جودة استجابتها لعملائها عبر الواتساب.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-[#1159af] hover:bg-[#0f4e99] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/10 transition-all text-center"
            >
              ابدأ الآن مجاناً
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition-all text-center"
            >
              دخول لوحة التحكم
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#1159af] text-white p-1.5 rounded-lg">
              <MessageCircle className="size-4 shrink-0" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Whats<span className="text-[#1159af]">Now</span>
            </span>
          </div>

          <p className="text-xs">
            &copy; {new Date().getFullYear()} WhatsNow. جميع الحقوق محفوظة.
          </p>

          <div className="flex items-center gap-6 text-xs">
            <a href="#features" className="hover:text-[#86ccad] transition-colors">المميزات</a>
            <a href="#pricing" className="hover:text-[#86ccad] transition-colors">الأسعار</a>
            <a href="#faqs" className="hover:text-[#86ccad] transition-colors">الأسئلة الشائعة</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
