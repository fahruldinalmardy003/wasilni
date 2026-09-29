# نظام إدارة جمعية وصلني — Wasilni Association Management System

تطبيق Web/PWA عربي باتجاه RTL لإدارة الجمعية وأعضائها ومكاتبها وأنشطتها وإعلاناتها، مع لوحة تحكم حديثة ودعم تخصيص كامل للهوية من حساب **Super Admin**.

## ما الذي تم تنفيذه؟

النسخة الحالية MVP تشغيلية وتحتوي على واجهة عامة تعريفية، لوحة Super Admin، dashboard بالإحصائيات، إدارة الأعضاء مع البحث والتصفية والنماذج، إدارة المكاتب، الأنشطة والفعاليات، الإعلانات، سجل العمليات، وإعدادات ديناميكية للهوية والمحتوى والروابط والألوان والشعار. كما تتضمن manifest وservice worker للتثبيت كتطبيق PWA والتخزين المؤقت الجزئي لواجهة التطبيق.

الأسماء والنصوص والألوان والروابط والشعار ليست ثابتة في الواجهة؛ صفحة **الإعدادات ← الهوية البصرية / محتوى الموقع العام / التواصل والروابط** تحفظها في `localStorage` وتنعكس فورًا على لوحة الإدارة والصفحة العامة. بيانات الأعضاء والمكاتب والأنشطة والإعلانات التجريبية قابلة للتعديل من الواجهة أيضًا.

## المتطلبات

- Node.js 20 أو أحدث.
- pnpm 10.18.0 (محدد داخل `package.json`).

## التشغيل المحلي

```bash
pnpm install
pnpm dev
```

ثم افتح `http://localhost:3000`.

أوامر التحقق والبناء:

```bash
pnpm check       # فحص TypeScript
pnpm test        # اختبارات القالب
pnpm build       # بناء frontend + server للإنتاج
pnpm start       # تشغيل نسخة الإنتاج بعد build
```

## الرفع إلى GitHub

```bash
git init
git add .
git commit -m "Build Wasilni association management MVP"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/wasilni.git
git push -u origin main
```

لا ترفع `node_modules` أو `dist` أو ملفات السجلات؛ وهي مستبعدة من `.gitignore`. يمكن استخدام `Dockerfile` الموجود مع أي استضافة Node/Docker تدعم متغير `PORT`.

## النشر عبر Docker

```bash
docker build -t wasilni .
docker run --rm -p 3000:3000 -e PORT=3000 wasilni
```

## البنية

| المسار | المسؤولية |
| --- | --- |
| `client/src/App.tsx` | التطبيق، الصفحات، البيانات التجريبية، حالة Super Admin والنماذج |
| `client/src/index.css` | نظام التصميم، RTL، responsive، الوضع الداكن والصفحة العامة |
| `client/public/logo.svg` | الشعار الافتراضي القابل للاستبدال من الإعدادات |
| `client/public/manifest.webmanifest` | إعدادات التثبيت كـ PWA |
| `client/public/sw.js` | التخزين المؤقت الجزئي للواجهة |
| `client/public/manus-routes.json` | manifest لمسارات التطبيق |
| `server/_core/index.ts` | Express server و`/api/health` وtRPC |
| `drizzle/` | قاعدة البيانات والمهاجرات الجاهزة للتوسعة |

## الانتقال للإنتاج متعدد المستخدمين

النسخة الحالية تحفظ بيانات الـ MVP في `localStorage` لتكون قابلة للتشغيل مباشرة من GitHub Pages أو استضافة Node. عند ربطها ببيئة إنتاجية متعددة المستخدمين، يجب نقل `SettingsState` وبيانات الأعضاء والمكاتب والأنشطة إلى جداول Drizzle وإجراءات tRPC محمية، وربط تسجيل الدخول والأدوار بالـ backend. يجب تطبيق التحقق من `Role → Permissions` على الخادم، وليس عبر إخفاء أزرار الواجهة فقط.

## ملاحظة عن الهوية

يمكن تغيير اسم الجمعية، الاسم الإنجليزي، الاسم المختصر، السطر التعريفي، الشعار، الألوان، الرؤية، الرسالة، الأهداف، عنوان الصفحة العامة، بيانات الاتصال والروابط من لوحة Super Admin دون تعديل الكود.
