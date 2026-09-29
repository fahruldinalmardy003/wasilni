import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileText,
  Globe2,
  Grid2X2,
  HeartHandshake,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  MoreHorizontal,
  Palette,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";

type ViewKey = "dashboard" | "members" | "offices" | "activities" | "announcements" | "audit" | "settings";
type Status = "نشط" | "قيد المراجعة" | "موقوف" | "مسودة" | "منشور" | "مكتمل";

type SettingsState = {
  orgName: string;
  orgNameEn: string;
  shortName: string;
  tagline: string;
  description: string;
  vision: string;
  mission: string;
  goals: string;
  heroTitle: string;
  heroCta: string;
  primaryColor: string;
  accentColor: string;
  surfaceColor: string;
  location: string;
  phone: string;
  email: string;
  facebook: string;
  linkedin: string;
  logoDataUrl: string;
};

type Member = { id: number; name: string; code: string; office: string; specialty: string; joined: string; status: Status; initials: string };
type Office = { id: number; name: string; lead: string; members: number; activity: string; color: string };
type ActivityItem = { id: number; title: string; office: string; date: string; attendees: string; status: Status; color: string };
type Announcement = { id: number; title: string; type: string; date: string; audience: string; status: Status };
type Audit = { id: number; action: string; detail: string; actor: string; time: string; tone: string };

const defaultSettings: SettingsState = {
  orgName: "جمعية وصلني",
  orgNameEn: "Wasilni Association",
  shortName: "وصلني",
  tagline: "نبني أثرًا يصل إلى كل مكان",
  description: "منصة رقمية موحدة لإدارة الجمعية، تمكين أعضائها، وتحويل الأفكار إلى أثر مجتمعي مستدام.",
  vision: "مجتمع متصل، مبادر، وصانع للتغيير.",
  mission: "نمكن الشباب وننظم الجهود لنصنع أثرًا قابلًا للقياس.",
  goals: "تمكين الأعضاء\nتطوير المبادرات\nبناء الشراكات\nقياس الأثر",
  heroTitle: "معًا نصل إلى أثرٍ أبعد",
  heroCta: "انضم إلى مجتمعنا",
  primaryColor: "#0f766e",
  accentColor: "#f59e0b",
  surfaceColor: "#f6f8f7",
  location: "الخرطوم، السودان",
  phone: "+249 91 000 0000",
  email: "hello@wasilni.org",
  facebook: "https://facebook.com/wasilni",
  linkedin: "https://linkedin.com/company/wasilni",
  logoDataUrl: "",
};

const initialMembers: Member[] = [
  { id: 1, name: "أحمد محمد", code: "WS-00124", office: "المكتب الإعلامي", specialty: "إدارة أعمال", joined: "2024/02/18", status: "نشط", initials: "أم" },
  { id: 2, name: "سارة عبد الله", code: "WS-00125", office: "مكتب التطوير", specialty: "هندسة برمجيات", joined: "2024/03/03", status: "نشط", initials: "سع" },
  { id: 3, name: "محمد حسن", code: "WS-00126", office: "مكتب المبادرات", specialty: "اقتصاد", joined: "2024/03/19", status: "قيد المراجعة", initials: "مح" },
  { id: 4, name: "آمنة الطيب", code: "WS-00127", office: "مكتب العلاقات", specialty: "علاقات عامة", joined: "2024/04/01", status: "نشط", initials: "أط" },
  { id: 5, name: "مصطفى عمر", code: "WS-00128", office: "مكتب المتابعة", specialty: "محاسبة", joined: "2024/04/07", status: "موقوف", initials: "مع" },
];

const initialOffices: Office[] = [
  { id: 1, name: "المكتب الإعلامي", lead: "أحمد محمد", members: 18, activity: "92%", color: "#0f766e" },
  { id: 2, name: "مكتب المبادرات", lead: "سارة عبد الله", members: 24, activity: "84%", color: "#f59e0b" },
  { id: 3, name: "مكتب التطوير", lead: "محمد حسن", members: 12, activity: "76%", color: "#7567d6" },
  { id: 4, name: "مكتب العلاقات", lead: "آمنة الطيب", members: 9, activity: "68%", color: "#df6b52" },
];

const initialActivities: ActivityItem[] = [
  { id: 1, title: "ملتقى صناع الأثر", office: "مكتب المبادرات", date: "12 أكتوبر 2026", attendees: "48 / 60", status: "منشور", color: "#0f766e" },
  { id: 2, title: "ورشة القيادة المجتمعية", office: "مكتب التطوير", date: "18 أكتوبر 2026", attendees: "32 / 40", status: "منشور", color: "#7567d6" },
  { id: 3, title: "حملة وصلني للتطوع", office: "المكتب الإعلامي", date: "26 أكتوبر 2026", attendees: "12 / 100", status: "مسودة", color: "#f59e0b" },
];

const initialAnnouncements: Announcement[] = [
  { id: 1, title: "فتح باب التسجيل في ملتقى صناع الأثر", type: "خبر", date: "اليوم، 10:30 ص", audience: "كل الأعضاء", status: "منشور" },
  { id: 2, title: "تحديث لائحة العضوية والانتساب", type: "قرار", date: "أمس، 04:15 م", audience: "كل الأعضاء", status: "منشور" },
  { id: 3, title: "تذكير باجتماع المجلس التنفيذي", type: "تنبيه", date: "28 سبتمبر، 09:00 ص", audience: "المجلس التنفيذي", status: "مسودة" },
];

const initialAudits: Audit[] = [
  { id: 1, action: "تعديل إعدادات الهوية", detail: "تم تحديث اللون الأساسي للمنصة", actor: "مدير النظام", time: "منذ 12 دقيقة", tone: "teal" },
  { id: 2, action: "قبول طلب عضوية", detail: "تم قبول طلب العضو WS-00124", actor: "سارة عبد الله", time: "منذ ساعة", tone: "purple" },
  { id: 3, action: "إنشاء نشاط", detail: "تم إنشاء ملتقى صناع الأثر", actor: "أحمد محمد", time: "منذ 3 ساعات", tone: "amber" },
  { id: 4, action: "تحديث صلاحيات دور", detail: "تم تحديث صلاحيات مسؤول المكتب", actor: "مدير النظام", time: "أمس، 02:40 م", tone: "rose" },
];

const navItems: { key: ViewKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "نظرة عامة", icon: LayoutDashboard },
  { key: "members", label: "الأعضاء", icon: Users },
  { key: "offices", label: "المكاتب", icon: Building2 },
  { key: "activities", label: "الأنشطة والفعاليات", icon: CalendarDays },
  { key: "announcements", label: "الإعلانات", icon: Megaphone },
  { key: "audit", label: "سجل العمليات", icon: ShieldCheck },
];

const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

function LogoMark({ settings, size = "md" }: { settings: SettingsState; size?: "sm" | "md" | "lg" }) {
  if (settings.logoDataUrl) return <img className={`logo-image logo-${size}`} src={settings.logoDataUrl} alt={settings.orgName} />;
  return (
    <span className={`logo-mark logo-${size}`} style={{ background: settings.primaryColor }} aria-label={settings.orgName}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16" fill="none" stroke="white" strokeWidth="4" /><path d="M15 24h18M24 15v18" stroke="white" strokeWidth="4" strokeLinecap="round" /><circle cx="24" cy="24" r="4" fill={settings.accentColor} /></svg>
    </span>
  );
}

function StatusPill({ status }: { status: Status }) {
  const tone = status === "نشط" || status === "منشور" || status === "مكتمل" ? "success" : status === "موقوف" ? "danger" : "warning";
  return <span className={`status-pill ${tone}`}><span className="status-dot" />{status}</span>;
}

function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function StatCard({ label, value, delta, icon: Icon, color }: { label: string; value: string; delta: string; icon: typeof Users; color: string }) {
  return <div className="stat-card"><div className="stat-top"><span className="stat-label">{label}</span><span className="stat-icon" style={{ color, background: `${color}16` }}><Icon size={19} /></span></div><div className="stat-value">{value}</div><div className="stat-delta"><TrendingUp size={14} /> {delta}</div></div>;
}

function Dashboard({ settings, setView, members, activities, announcements }: { settings: SettingsState; setView: (view: ViewKey) => void; members: Member[]; activities: ActivityItem[]; announcements: Announcement[] }) {
  return <div className="page-content"><SectionHeader eyebrow="الأربعاء، 30 سبتمبر 2026" title={`صباح الخير، مدير النظام`} description="إليك ملخص ما يحدث في الجمعية اليوم." action={<button className="button primary" onClick={() => setView("activities")}><Plus size={17} /> إنشاء نشاط</button>} />
    <div className="stat-grid"><StatCard label="إجمالي الأعضاء" value="1,284" delta="8.2% من الشهر الماضي" icon={Users} color="#0f766e" /><StatCard label="الأنشطة القادمة" value="18" delta="4 أنشطة هذا الأسبوع" icon={CalendarDays} color="#7567d6" /><StatCard label="طلبات العضوية" value="36" delta="12 طلبًا جديدًا" icon={ClipboardCheck} color="#f59e0b" /><StatCard label="نسبة الحضور" value="84%" delta="تحسن 5.4%" icon={Activity} color="#df6b52" /></div>
    <div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h3>نمو الأعضاء</h3><p>عدد الأعضاء خلال آخر 6 أشهر</p></div><button className="icon-button"><MoreHorizontal size={19} /></button></div><div className="chart-summary"><strong>1,284</strong><span className="positive">+ 18.6%</span></div><div className="chart"><div className="chart-y"><span>1.4k</span><span>1k</span><span>600</span><span>200</span></div><div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 600 220" preserveAspectRatio="none" className="chart-svg"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={settings.primaryColor} stopOpacity=".25" /><stop offset="100%" stopColor={settings.primaryColor} stopOpacity=".01" /></linearGradient></defs><path d="M0,190 C50,176 60,156 108,162 C145,166 155,135 203,144 C247,151 272,111 307,122 C348,137 350,84 405,96 C450,107 482,52 516,68 C550,81 570,38 600,29 L600,220 L0,220 Z" fill="url(#area)" /><path d="M0,190 C50,176 60,156 108,162 C145,166 155,135 203,144 C247,151 272,111 307,122 C348,137 350,84 405,96 C450,107 482,52 516,68 C550,81 570,38 600,29" fill="none" stroke={settings.primaryColor} strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg><div className="chart-x"><span>أبريل</span><span>مايو</span><span>يونيو</span><span>يوليو</span><span>أغسطس</span><span>سبتمبر</span></div></div></div></div>
      <div className="panel activity-panel"><div className="panel-heading"><div><h3>آخر العمليات</h3><p>نشاط الفريق في المنصة</p></div><button className="text-button" onClick={() => setView("audit")}>عرض الكل <ArrowLeft size={15} /></button></div><div className="timeline"><div className="timeline-item"><span className="timeline-icon teal"><UserCheck size={15} /></span><div><strong>تم قبول طلب عضوية</strong><p>أحمد محمد أصبح عضوًا نشطًا</p><small>منذ 12 دقيقة</small></div></div><div className="timeline-item"><span className="timeline-icon purple"><CalendarDays size={15} /></span><div><strong>تم إنشاء نشاط جديد</strong><p>ملتقى صناع الأثر · 12 أكتوبر</p><small>منذ ساعة</small></div></div><div className="timeline-item"><span className="timeline-icon amber"><Megaphone size={15} /></span><div><strong>تم نشر إعلان</strong><p>فتح باب التسجيل في الملتقى</p><small>منذ 3 ساعات</small></div></div></div></div>
    </div>
    <div className="dashboard-grid bottom-grid"><div className="panel"><div className="panel-heading"><div><h3>الأنشطة القادمة</h3><p>تابع ما سيحدث في الجمعية</p></div><button className="text-button" onClick={() => setView("activities")}>إدارة الأنشطة <ArrowLeft size={15} /></button></div><div className="event-list">{activities.slice(0, 3).map((item) => <div className="event-row" key={item.id}><div className="event-date" style={{ background: `${item.color}12`, color: item.color }}><strong>{item.date.split(" ")[0]}</strong><span>{item.date.split(" ")[1] || "أكتوبر"}</span></div><div className="event-info"><strong>{item.title}</strong><span>{item.office} · {item.attendees} مقعدًا</span></div><StatusPill status={item.status} /></div>)}</div></div><div className="panel"><div className="panel-heading"><div><h3>طلبات تحتاج مراجعة</h3><p>أعضاء بانتظار قرارك</p></div><button className="text-button" onClick={() => setView("members")}>عرض الطلبات <ArrowLeft size={15} /></button></div><div className="request-list">{members.filter((m) => m.status === "قيد المراجعة").map((member) => <div className="request-row" key={member.id}><span className="avatar avatar-purple">{member.initials}</span><div><strong>{member.name}</strong><span>{member.specialty} · {member.code}</span></div><button className="icon-button" onClick={() => toast.success("تم فتح طلب العضوية")}><Eye size={17} /></button></div>)}{members.filter((m) => m.status === "قيد المراجعة").length === 0 && <EmptyState label="لا توجد طلبات معلقة" />}</div></div></div>
  </div>;
}

function MembersPage({ members, setMembers, settings }: { members: Member[]; setMembers: (value: Member[]) => void; settings: SettingsState }) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const filtered = members.filter((m) => `${m.name} ${m.code} ${m.office} ${m.specialty}`.includes(query));
  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (member: Member) => { setEditing(member); setShowForm(true); };
  const saveMember = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get("name") || "عضو جديد"); const status = String(form.get("status") || "نشط") as Status; const item: Member = { id: editing?.id ?? Date.now(), name, code: String(form.get("code") || `WS-${Date.now().toString().slice(-5)}`), office: String(form.get("office") || "المكتب العام"), specialty: String(form.get("specialty") || "تخصص عام"), joined: editing?.joined ?? new Date().toLocaleDateString("ar-EG"), status, initials: name.slice(0, 2) }; setMembers(editing ? members.map((m) => m.id === editing.id ? item : m) : [item, ...members]); setShowForm(false); toast.success(editing ? "تم تحديث بيانات العضو" : "تمت إضافة العضو"); };
  return <div className="page-content"><SectionHeader eyebrow="إدارة الأعضاء" title="الأعضاء" description="إدارة بيانات العضوية، المكاتب، والحالات من مكان واحد." action={<button className="button primary" onClick={openNew}><Plus size={17} /> إضافة عضو</button>} /><div className="mini-stat-row"><div><span>كل الأعضاء</span><strong>1,284</strong></div><div><span>نشطون</span><strong className="green-text">1,196</strong></div><div><span>طلبات جديدة</span><strong className="amber-text">36</strong></div><div><span>موقوفون</span><strong className="red-text">52</strong></div></div><div className="panel table-panel"><div className="table-toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالاسم أو الرقم أو المكتب..." /></div><button className="filter-button"><span>كل الحالات</span><ChevronDown size={15} /></button><button className="filter-button"><Download size={16} /> تصدير</button></div><div className="table-wrap"><table><thead><tr><th>العضو</th><th>رقم العضوية</th><th>المكتب</th><th>التخصص</th><th>تاريخ الانضمام</th><th>الحالة</th><th /></tr></thead><tbody>{filtered.map((member) => <tr key={member.id}><td><div className="person-cell"><span className="avatar" style={{ background: `${settings.primaryColor}18`, color: settings.primaryColor }}>{member.initials}</span><div><strong>{member.name}</strong><span>{member.code}</span></div></div></td><td>{member.code}</td><td>{member.office}</td><td>{member.specialty}</td><td>{member.joined}</td><td><StatusPill status={member.status} /></td><td><div className="row-actions"><button className="icon-button" title="تعديل" onClick={() => openEdit(member)}><Pencil size={16} /></button><button className="icon-button danger-hover" title="حذف" onClick={() => { setMembers(members.filter((m) => m.id !== member.id)); toast.success("تم حذف العضو"); }}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState label="لا توجد نتائج" />}</div></div>{showForm && <Modal title={editing ? "تعديل بيانات العضو" : "إضافة عضو جديد"} onClose={() => setShowForm(false)}><form className="form-grid" onSubmit={saveMember}><label>الاسم الكامل<input name="name" defaultValue={editing?.name} required /></label><label>رقم العضوية<input name="code" defaultValue={editing?.code} /></label><label>المكتب<input name="office" defaultValue={editing?.office} /></label><label>التخصص<input name="specialty" defaultValue={editing?.specialty} /></label><label>الحالة<select name="status" defaultValue={editing?.status || "نشط"}><option>نشط</option><option>قيد المراجعة</option><option>موقوف</option></select></label><div className="form-actions"><button type="button" className="button ghost" onClick={() => setShowForm(false)}>إلغاء</button><button type="submit" className="button primary"><Check size={17} /> حفظ البيانات</button></div></form></Modal>}</div>;
}

function OfficesPage({ offices, setOffices }: { offices: Office[]; setOffices: (value: Office[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const addOffice = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get("name") || "مكتب جديد"); setOffices([{ id: Date.now(), name, lead: String(form.get("lead") || "لم يحدد"), members: 0, activity: "0%", color: "#0f766e" }, ...offices]); setShowForm(false); toast.success("تم إنشاء المكتب"); };
  return <div className="page-content"><SectionHeader eyebrow="الهيكل التنظيمي" title="المكاتب" description="أنشئ المكاتب وأدر مسؤوليها واختصاصاتها دون تعديل الكود." action={<button className="button primary" onClick={() => setShowForm(true)}><Plus size={17} /> إضافة مكتب</button>} /><div className="office-grid">{offices.map((office) => <div className="office-card" key={office.id}><div className="office-card-top"><span className="office-icon" style={{ color: office.color, background: `${office.color}17` }}><Building2 size={22} /></span><button className="icon-button"><MoreHorizontal size={19} /></button></div><h3>{office.name}</h3><p>المسؤول: {office.lead}</p><div className="office-meta"><span><Users size={15} /> {office.members} عضو</span><span><BarChart3 size={15} /> {office.activity}</span></div><div className="progress"><span style={{ width: office.activity, background: office.color }} /></div><button className="office-link" onClick={() => toast.success(`تم فتح ${office.name}`)}>عرض التفاصيل <ArrowLeft size={15} /></button></div>)}</div>{showForm && <Modal title="إضافة مكتب جديد" onClose={() => setShowForm(false)}><form className="form-grid" onSubmit={addOffice}><label>اسم المكتب<input name="name" placeholder="مثال: مكتب التدريب" required /></label><label>رئيس المكتب<input name="lead" placeholder="اسم المسؤول" /></label><label className="full">اختصاصات المكتب<textarea placeholder="أدخل وصفًا مختصرًا للاختصاصات" rows={4} /></label><div className="form-actions"><button type="button" className="button ghost" onClick={() => setShowForm(false)}>إلغاء</button><button type="submit" className="button primary">إنشاء المكتب</button></div></form></Modal>}</div>;
}

function ActivitiesPage({ activities, setActivities }: { activities: ActivityItem[]; setActivities: (value: ActivityItem[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const addActivity = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); setActivities([{ id: Date.now(), title: String(form.get("title") || "نشاط جديد"), office: String(form.get("office") || "المكتب العام"), date: String(form.get("date") || "قريبًا"), attendees: "0 / 50", status: "مسودة", color: "#0f766e" }, ...activities]); setShowForm(false); toast.success("تم حفظ النشاط كمسودة"); };
  return <div className="page-content"><SectionHeader eyebrow="البرامج والفعاليات" title="الأنشطة والفعاليات" description="خطط للفعاليات، افتح التسجيل، وتابع المقاعد والمشاركة." action={<button className="button primary" onClick={() => setShowForm(true)}><Plus size={17} /> إنشاء نشاط</button>} /><div className="activity-cards">{activities.map((item) => <div className="activity-card" key={item.id}><div className="activity-banner" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)` }}><CalendarDays size={32} /><span>{item.status}</span></div><div className="activity-body"><div className="activity-tag">{item.office}</div><h3>{item.title}</h3><div className="activity-details"><span><Clock3 size={15} /> {item.date}</span><span><Users size={15} /> {item.attendees}</span></div><div className="progress"><span style={{ width: `${Math.min(100, Number(item.attendees.split("/")[0].trim()) / Number(item.attendees.split("/")[1]?.trim() || 1) * 100)}%`, background: item.color }} /></div><div className="activity-footer"><StatusPill status={item.status} /><button className="text-button" onClick={() => toast.success("تم فتح تفاصيل النشاط")}>التفاصيل <ArrowLeft size={15} /></button></div></div></div>)}</div>{showForm && <Modal title="إنشاء نشاط جديد" onClose={() => setShowForm(false)}><form className="form-grid" onSubmit={addActivity}><label>اسم النشاط<input name="title" placeholder="مثال: ورشة Flutter" required /></label><label>المكتب المنظم<input name="office" placeholder="المكتب" /></label><label>التاريخ<input name="date" placeholder="12 أكتوبر 2026" /></label><label>عدد المقاعد<input name="seats" type="number" placeholder="50" /></label><label className="full">الوصف<textarea rows={4} placeholder="اكتب وصف النشاط وأهدافه" /></label><div className="form-actions"><button type="button" className="button ghost" onClick={() => setShowForm(false)}>إلغاء</button><button type="submit" className="button primary">حفظ كمسودة</button></div></form></Modal>}</div>;
}

function AnnouncementsPage({ announcements, setAnnouncements }: { announcements: Announcement[]; setAnnouncements: (value: Announcement[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const add = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); setAnnouncements([{ id: Date.now(), title: String(form.get("title") || "إعلان جديد"), type: String(form.get("type") || "خبر"), date: "الآن", audience: String(form.get("audience") || "كل الأعضاء"), status: "مسودة" }, ...announcements]); setShowForm(false); toast.success("تم حفظ الإعلان كمسودة"); };
  return <div className="page-content"><SectionHeader eyebrow="التواصل المؤسسي" title="الإعلانات" description="أوصل الأخبار والقرارات والتنبيهات إلى الجمهور المناسب." action={<button className="button primary" onClick={() => setShowForm(true)}><Plus size={17} /> إنشاء إعلان</button>} /><div className="panel table-panel"><div className="table-toolbar"><div className="toolbar-title"><Megaphone size={18} /><strong>كل الإعلانات</strong><span className="count-badge">{announcements.length}</span></div><button className="filter-button"><Search size={16} /> بحث في الإعلانات</button></div><div className="announcement-list">{announcements.map((item) => <div className="announcement-row" key={item.id}><span className={`announcement-type ${item.type === "قرار" ? "purple" : item.type === "تنبيه" ? "amber" : "teal"}`}>{item.type}</span><div className="announcement-info"><strong>{item.title}</strong><span>{item.audience} · {item.date}</span></div><StatusPill status={item.status} /><button className="icon-button" onClick={() => { setAnnouncements(announcements.filter((a) => a.id !== item.id)); toast.success("تم حذف الإعلان"); }}><Trash2 size={16} /></button></div>)}</div></div>{showForm && <Modal title="إنشاء إعلان جديد" onClose={() => setShowForm(false)}><form className="form-grid" onSubmit={add}><label className="full">عنوان الإعلان<input name="title" placeholder="اكتب عنوانًا واضحًا" required /></label><label>نوع المحتوى<select name="type"><option>خبر</option><option>تنبيه</option><option>قرار</option></select></label><label>الفئة المستهدفة<select name="audience"><option>كل الأعضاء</option><option>المجلس التنفيذي</option><option>مسؤولو المكاتب</option></select></label><label className="full">المحتوى<textarea rows={5} placeholder="اكتب تفاصيل الإعلان هنا" /></label><div className="form-actions"><button type="button" className="button ghost" onClick={() => setShowForm(false)}>إلغاء</button><button type="submit" className="button primary">حفظ كمسودة</button></div></form></Modal>}</div>;
}

function AuditPage() {
  return <div className="page-content"><SectionHeader eyebrow="الحوكمة والشفافية" title="سجل العمليات" description="كل تغيير حساس موثق باسم المنفذ ووقته وتفاصيله." action={<button className="button ghost"><Download size={16} /> تصدير السجل</button>} /><div className="audit-summary"><div><ShieldCheck size={22} /><div><strong>سجل موثوق</strong><span>آخر مزامنة منذ دقيقتين</span></div></div><div><FileText size={22} /><div><strong>2,480 عملية</strong><span>خلال آخر 90 يومًا</span></div></div><div><Clock3 size={22} /><div><strong>احتفاظ 12 شهرًا</strong><span>سياسة الجمعية</span></div></div></div><div className="panel audit-panel"><div className="panel-heading"><div><h3>العمليات الأخيرة</h3><p>يمكن تصفية السجل حسب الوحدة والمنفذ والتاريخ.</p></div><button className="filter-button"><Search size={16} /> تصفية السجل</button></div><div className="audit-list">{initialAudits.map((item) => <div className="audit-row" key={item.id}><span className={`audit-icon ${item.tone}`}><ShieldCheck size={17} /></span><div className="audit-detail"><strong>{item.action}</strong><span>{item.detail}</span></div><div className="audit-actor"><strong>{item.actor}</strong><span>{item.time}</span></div><button className="icon-button"><MoreHorizontal size={18} /></button></div>)}</div></div></div>;
}

function SettingsPage({ settings, setSettings }: { settings: SettingsState; setSettings: (value: SettingsState) => void }) {
  const [draft, setDraft] = useState(settings);
  const [activeTab, setActiveTab] = useState<"identity" | "content" | "links">("identity");
  useEffect(() => setDraft(settings), [settings]);
  const update = (key: keyof SettingsState, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const save = (event: FormEvent) => { event.preventDefault(); setSettings(draft); toast.success("تم حفظ إعدادات الجمعية وتحديث الهوية"); };
  const reset = () => { setDraft(defaultSettings); setSettings(defaultSettings); toast.success("تمت استعادة الإعدادات الافتراضية"); };
  const uploadLogo = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => update("logoDataUrl", String(reader.result)); reader.readAsDataURL(file); };
  return <div className="page-content"><SectionHeader eyebrow="تحكم كامل بالهوية والمحتوى" title="إعدادات الجمعية" description="كل ما يظهر للأعضاء والزوار قابل للتعديل من هنا بواسطة Super Admin." action={<button className="button primary" onClick={() => setSettings(draft)}><Check size={17} /> حفظ التغييرات</button>} /><div className="settings-layout"><aside className="settings-nav"><div className="settings-nav-label">الإعدادات</div><button className={activeTab === "identity" ? "active" : ""} onClick={() => setActiveTab("identity")}><Palette size={17} /> الهوية البصرية</button><button className={activeTab === "content" ? "active" : ""} onClick={() => setActiveTab("content")}><FileText size={17} /> محتوى الموقع العام</button><button className={activeTab === "links" ? "active" : ""} onClick={() => setActiveTab("links")}><Globe2 size={17} /> التواصل والروابط</button><div className="settings-divider" /><button onClick={() => toast.info("إدارة الأدوار والصلاحيات قيد الإعداد في النسخة التالية")}><ShieldCheck size={17} /> الأدوار والصلاحيات <span className="soon">قريبًا</span></button><button onClick={() => toast.info("إعدادات الإشعارات قيد الإعداد") }><Bell size={17} /> الإشعارات <span className="soon">قريبًا</span></button></aside><form className="settings-form" onSubmit={save}>{activeTab === "identity" && <><div className="settings-card"><div className="card-title"><div><h3>هوية الجمعية</h3><p>هذه القيم تنعكس على الشريط الجانبي والصفحة العامة وPWA.</p></div><Sparkles size={21} /></div><div className="logo-upload"><div className="logo-preview"><LogoMark settings={draft} size="lg" /></div><div><strong>شعار الجمعية</strong><p>ارفع شعارًا بصيغة PNG أو SVG. سيظهر فورًا في كل أجزاء النظام.</p><label className="upload-button"><Upload size={16} /> اختيار ملف<input type="file" accept="image/*,.svg" onChange={uploadLogo} hidden /></label>{draft.logoDataUrl && <button type="button" className="remove-logo" onClick={() => update("logoDataUrl", "")}><X size={14} /> إزالة الشعار المخصص</button>}</div></div><div className="form-grid"><label>اسم الجمعية<input value={draft.orgName} onChange={(e) => update("orgName", e.target.value)} /></label><label>الاسم بالإنجليزية<input value={draft.orgNameEn} onChange={(e) => update("orgNameEn", e.target.value)} /></label><label>الاسم المختصر<input value={draft.shortName} onChange={(e) => update("shortName", e.target.value)} /></label><label>السطر التعريفي<input value={draft.tagline} onChange={(e) => update("tagline", e.target.value)} /></label></div></div><div className="settings-card"><div className="card-title"><div><h3>ألوان العلامة التجارية</h3><p>اختر ألوانًا مناسبة لهوية جمعيتك وستتغير الواجهة مباشرة.</p></div><Palette size={21} /></div><div className="color-settings"><label><span>اللون الأساسي</span><div className="color-input"><input type="color" value={draft.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} /><input value={draft.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} /></div></label><label><span>اللون المميز</span><div className="color-input"><input type="color" value={draft.accentColor} onChange={(e) => update("accentColor", e.target.value)} /><input value={draft.accentColor} onChange={(e) => update("accentColor", e.target.value)} /></div></label><label><span>خلفية التطبيق</span><div className="color-input"><input type="color" value={draft.surfaceColor} onChange={(e) => update("surfaceColor", e.target.value)} /><input value={draft.surfaceColor} onChange={(e) => update("surfaceColor", e.target.value)} /></div></label></div></div></>}{activeTab === "content" && <div className="settings-card"><div className="card-title"><div><h3>محتوى الصفحة العامة</h3><p>حرر الرسائل الأساسية التي يراها الزائر دون الحاجة للمطور.</p></div><Globe2 size={21} /></div><div className="form-grid"><label className="full">العنوان الرئيسي<input value={draft.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} /></label><label className="full">النص التعريفي<textarea value={draft.description} rows={4} onChange={(e) => update("description", e.target.value)} /></label><label>الرؤية<textarea value={draft.vision} rows={4} onChange={(e) => update("vision", e.target.value)} /></label><label>الرسالة<textarea value={draft.mission} rows={4} onChange={(e) => update("mission", e.target.value)} /></label><label className="full">الأهداف — هدف في كل سطر<textarea value={draft.goals} rows={5} onChange={(e) => update("goals", e.target.value)} /></label><label>نص زر الدعوة<input value={draft.heroCta} onChange={(e) => update("heroCta", e.target.value)} /></label></div></div>}{activeTab === "links" && <div className="settings-card"><div className="card-title"><div><h3>التواصل والروابط</h3><p>حدّث بيانات الوصول للجمعية لتظهر في الموقع العام.</p></div><Globe2 size={21} /></div><div className="form-grid"><label>الموقع<input value={draft.location} onChange={(e) => update("location", e.target.value)} /></label><label>رقم الهاتف<input value={draft.phone} onChange={(e) => update("phone", e.target.value)} /></label><label>البريد الإلكتروني<input value={draft.email} onChange={(e) => update("email", e.target.value)} /></label><label>Facebook<input value={draft.facebook} onChange={(e) => update("facebook", e.target.value)} /></label><label>LinkedIn<input value={draft.linkedin} onChange={(e) => update("linkedin", e.target.value)} /></label></div></div>}<div className="settings-footer"><button type="button" className="button ghost" onClick={reset}><RefreshCw size={15} /> استعادة الافتراضي</button><button type="submit" className="button primary"><Check size={17} /> حفظ جميع التغييرات</button></div></form></div></div>;
}

function PublicHome({ settings, onAdmin }: { settings: SettingsState; onAdmin: () => void }) {
  return <div className="public-home"><nav className="public-nav"><div className="brand-lockup"><LogoMark settings={settings} /><div><strong>{settings.orgName}</strong><span>{settings.orgNameEn}</span></div></div><div className="public-links"><a href="#about">عن الجمعية</a><a href="#vision">الرؤية والرسالة</a><a href="#activities">الأنشطة</a><a href="#contact">تواصل معنا</a></div><button className="button primary" onClick={onAdmin}>دخول الإدارة <ArrowLeft size={16} /></button></nav><section className="public-hero"><div className="hero-copy"><span className="hero-kicker"><Sparkles size={15} /> {settings.tagline}</span><h1>{settings.heroTitle}</h1><p>{settings.description}</p><div className="hero-actions"><button className="button primary large">{settings.heroCta} <ArrowLeft size={17} /></button><button className="button ghost large" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>اكتشف رسالتنا</button></div><div className="hero-trust"><div><strong>1,284+</strong><span>عضو فاعل</span></div><div><strong>18</strong><span>نشاطًا قادمًا</span></div><div><strong>12</strong><span>مكتبًا ومبادرة</span></div></div></div><div className="hero-art"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-center"><LogoMark settings={settings} size="lg" /><span>نصل معًا</span></div><span className="floating-tag tag-one"><HeartHandshake size={17} /> أثرٌ مستدام</span><span className="floating-tag tag-two"><Users size={17} /> مجتمع متصل</span></div></section><section className="public-section" id="about"><div className="section-intro"><span className="hero-kicker">من نحن</span><h2>نحوّل التعاون إلى أثر</h2><p>{settings.description}</p></div><div className="value-grid"><div className="value-card"><span className="value-number">01</span><h3>رؤيتنا</h3><p>{settings.vision}</p></div><div className="value-card active"><span className="value-number">02</span><h3>رسالتنا</h3><p>{settings.mission}</p></div><div className="value-card"><span className="value-number">03</span><h3>أهدافنا</h3><p>{settings.goals.split("\n").join(" · ")}</p></div></div></section><footer className="public-footer" id="contact"><div className="brand-lockup"><LogoMark settings={settings} /><div><strong>{settings.orgName}</strong><span>{settings.tagline}</span></div></div><div><span>{settings.location}</span><span>{settings.email}</span></div><button className="button ghost" onClick={onAdmin}>لوحة الإدارة <Settings size={16} /></button></footer></div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-header"><h3>{title}</h3><button className="icon-button" onClick={onClose}><X size={19} /></button></div>{children}</div></div>;
}

function EmptyState({ label }: { label: string }) { return <div className="empty-state"><CircleHelp size={22} /><span>{label}</span></div>; }

function App() {
  const [settings, setSettings] = useState<SettingsState>(() => storage.get("wasilni-settings", defaultSettings));
  const [members, setMembers] = useState<Member[]>(() => storage.get("wasilni-members", initialMembers));
  const [offices, setOffices] = useState<Office[]>(() => storage.get("wasilni-offices", initialOffices));
  const [activities, setActivities] = useState<ActivityItem[]>(() => storage.get("wasilni-activities", initialActivities));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => storage.get("wasilni-announcements", initialAnnouncements));
  const [view, setView] = useState<ViewKey>("dashboard");
  const [isPublic, setIsPublic] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => storage.set("wasilni-settings", settings), [settings]);
  useEffect(() => storage.set("wasilni-members", members), [members]);
  useEffect(() => storage.set("wasilni-offices", offices), [offices]);
  useEffect(() => storage.set("wasilni-activities", activities), [activities]);
  useEffect(() => storage.set("wasilni-announcements", announcements), [announcements]);
  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", settings.primaryColor);
    document.documentElement.style.setProperty("--brand-accent", settings.accentColor);
    document.documentElement.style.setProperty("--app-surface", settings.surfaceColor);
    document.documentElement.classList.toggle("dark", darkMode);
    document.title = settings.orgName;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    themeMeta?.setAttribute("content", settings.primaryColor);
    const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (manifestLink) {
      const manifest = { name: settings.orgName, short_name: settings.shortName, description: settings.description, start_url: "/", display: "standalone", dir: "rtl", lang: "ar", theme_color: settings.primaryColor, background_color: settings.surfaceColor, icons: [{ src: settings.logoDataUrl || "/logo.svg", sizes: "any", type: settings.logoDataUrl ? "image/png" : "image/svg+xml", purpose: "any maskable" }] };
      const blobUrl = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" }));
      manifestLink.href = blobUrl;
      return () => URL.revokeObjectURL(blobUrl);
    }
  }, [settings, darkMode]);
  useEffect(() => { if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined); }, []);

  const currentTitle = useMemo(() => navItems.find((item) => item.key === view)?.label ?? "الإعدادات", [view]);
  const renderView = () => {
    if (view === "dashboard") return <Dashboard settings={settings} setView={setView} members={members} activities={activities} announcements={announcements} />;
    if (view === "members") return <MembersPage members={members} setMembers={setMembers} settings={settings} />;
    if (view === "offices") return <OfficesPage offices={offices} setOffices={setOffices} />;
    if (view === "activities") return <ActivitiesPage activities={activities} setActivities={setActivities} />;
    if (view === "announcements") return <AnnouncementsPage announcements={announcements} setAnnouncements={setAnnouncements} />;
    if (view === "audit") return <AuditPage />;
    return <SettingsPage settings={settings} setSettings={setSettings} />;
  };

  if (isPublic) return <><PublicHome settings={settings} onAdmin={() => setIsPublic(false)} /><Toaster position="bottom-left" dir="rtl" /></>;
  return <div className="app-shell" style={{ "--brand-primary": settings.primaryColor, "--brand-accent": settings.accentColor } as CSSProperties}><aside className={`sidebar ${sidebarOpen ? "open" : ""}`}><div className="sidebar-brand"><div className="brand-lockup"><LogoMark settings={settings} /><div><strong>{settings.orgName}</strong><span>{settings.orgNameEn}</span></div></div><button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)}><X size={19} /></button></div><div className="workspace-switcher"><span className="workspace-avatar">س</span><div><strong>مساحة الجمعية</strong><span>Super Admin</span></div><ChevronDown size={15} /></div><nav className="side-nav"><div className="nav-label">الرئيسية</div>{navItems.slice(0, 1).map((item) => <NavButton key={item.key} item={item} view={view} setView={setView} close={() => setSidebarOpen(false)} />)}<div className="nav-label">إدارة الجمعية</div>{navItems.slice(1, 5).map((item) => <NavButton key={item.key} item={item} view={view} setView={setView} close={() => setSidebarOpen(false)} />)}<div className="nav-label">الحوكمة</div>{navItems.slice(5).map((item) => <NavButton key={item.key} item={item} view={view} setView={setView} close={() => setSidebarOpen(false)} />)}<div className="nav-label">النظام</div><NavButton item={{ key: "settings", label: "الإعدادات", icon: Settings }} view={view} setView={setView} close={() => setSidebarOpen(false)} /></nav><div className="sidebar-bottom"><button className="public-preview" onClick={() => setIsPublic(true)}><Globe2 size={17} /><span>معاينة الموقع العام</span><ArrowLeft size={15} /></button><div className="support-card"><div className="support-icon"><HeartHandshake size={17} /></div><strong>هل تحتاج مساعدة؟</strong><span>دليل استخدام المنصة متاح هنا</span><button onClick={() => toast.info("سيتم فتح مركز المساعدة قريبًا")}>مركز المساعدة <ArrowLeft size={14} /></button></div><div className="profile-row"><span className="avatar profile-avatar">م</span><div><strong>مدير النظام</strong><span>Super Admin</span></div><button className="icon-button" onClick={() => toast.info("تم تسجيل الدخول كمدير النظام")}><MoreHorizontal size={18} /></button></div></div></aside><main className="main-area"><header className="topbar"><div className="topbar-start"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button><div className="breadcrumb"><span>لوحة الإدارة</span><ArrowLeft size={14} /><strong>{currentTitle}</strong></div></div><div className="topbar-actions"><button className="icon-button public-shortcut" title="معاينة الموقع" onClick={() => setIsPublic(true)}><Globe2 size={18} /></button><button className="icon-button" title="الوضع الداكن" onClick={() => setDarkMode((value) => !value)}><Eye size={18} /></button><button className="notification-button" onClick={() => toast.info("لديك 3 إشعارات جديدة")}><Bell size={19} /><span /></button><div className="topbar-profile"><span className="avatar profile-avatar">م</span><div><strong>مدير النظام</strong><span>Super Admin</span></div><ChevronDown size={15} /></div></div></header>{renderView()}</main><Toaster position="bottom-left" dir="rtl" /></div>;
}

function NavButton({ item, view, setView, close }: { item: { key: ViewKey; label: string; icon: typeof LayoutDashboard }; view: ViewKey; setView: (view: ViewKey) => void; close: () => void }) { const Icon = item.icon; return <button className={`nav-button ${view === item.key ? "active" : ""}`} onClick={() => { setView(item.key); close(); }}><Icon size={18} /><span>{item.label}</span>{item.key === "members" && <span className="nav-count">36</span>}</button>; }

export default App;
