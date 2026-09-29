# خطة تنفيذ Wasilni Association Management System

## النطاق
نسخة MVP تشغيلية لـ Web Application + PWA باللغة العربية وRTL، تقدم لوحة إدارة Super Admin قابلة للتخصيص بالكامل، وواجهة مؤسسية تشمل dashboard والأعضاء والمكاتب والأنشطة والإعلانات والإعدادات وسجل التدقيق.

## البنية
- `client/src/App.tsx`: تطبيق React أحادي الصفحة مع مسارات داخلية بسيطة قابلة للتوسعة.
- `client/src/index.css`: نظام التصميم المتجاوب ومتغيرات العلامة التجارية.
- `client/public/manifest.webmanifest`: تعريف PWA.
- `client/public/sw.js`: service worker للتخزين المؤقت وإعادة تحميل الواجهة.
- `client/public/manus-routes.json`: manifest كامل للمسارات الحالية.
- `server/_core/index.ts`: خادم Express وhealth endpoint من القالب.
- `drizzle/`: قاعدة بيانات القالب الجاهزة للتوسعة بإضافة جداول الوحدات الفعلية.

## القرار المعماري
يُخدم frontend كـ SPA من Express/Vite، مع `/api/health` وtRPC جاهزين لإضافة الـ API. بيانات النسخة الحالية التجريبية وإعدادات Super Admin تُحفظ في localStorage للحفاظ على تجربة قابلة للتشغيل فورًا، مع طبقة بيانات منفصلة داخل App لتسهيل استبدالها بإجراءات tRPC وقاعدة البيانات دون إعادة بناء الواجهة.

## الاستضافة والأداء
- التطوير: `pnpm dev` على المنفذ 3000.
- الإنتاج: `pnpm build` ثم `pnpm start`، ويُستخدم Dockerfile الموجود.
- أصول الواجهة المجمعة في `dist/public`، والاستجابات الحساسة غير قابلة للتخزين المشترك.
- الـ SPA fallback يمر عبر Express، وملف route manifest ثابت في أصل الموقع.
- البيانات العامة والأصول المجمعة خفيفة، ودعم offline محصور في shell والأصول العامة لا في العمليات الحساسة.

## التحقق
- `pnpm check` لفحص TypeScript.
- `pnpm test` لاختبارات القالب.
- `pnpm build` لبناء الإنتاج.
- تشغيل الخدمة والتحقق من `/api/health` و`/manus-routes.json`.
- إنشاء ZIP نظيف يستبعد `node_modules` وملفات السجلات والـ build output.

## حدود النسخة
هذه حزمة MVP جاهزة للرفع على GitHub والاستضافة وتشمل واجهة كاملة ونماذج محلية. لتشغيل متعدد المستخدمين في بيئة إنتاجية، تُستبدل طبقة localStorage بخدمات المصادقة وtRPC وجداول Drizzle، مع إبقاء نظام الصلاحيات على الخادم وعدم الاكتفاء بإخفاء الأزرار.
