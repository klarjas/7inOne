'use client';

import { useEffect, useState } from 'react';

export const SITE_LOCALE_STORAGE_KEY = '7inone:locale';
export type SiteLocale = 'km' | 'zh-CN' | 'en';
const SUPPORTED_LOCALES: readonly SiteLocale[] = ['km', 'zh-CN', 'en'];
function normalizeSiteLocale(value: string | null): SiteLocale {
  if (value === 'zh' || value?.toLowerCase() === 'zh-cn') return 'zh-CN';
  if (value?.toLowerCase().startsWith('en')) return 'en';
  if (value?.toLowerCase().startsWith('km')) return 'km';
  return 'km';
}
function readSiteLocale(): SiteLocale {
  try { const locale = normalizeSiteLocale(window.localStorage.getItem(SITE_LOCALE_STORAGE_KEY)); return SUPPORTED_LOCALES.includes(locale) ? locale : 'km'; }
  catch { return 'km'; }
}
export function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>('km');
  useEffect(() => {
    const sync = () => { const next = readSiteLocale(); setLocale(next); document.documentElement.lang = next; document.documentElement.dir = 'ltr'; };
    sync(); window.addEventListener('storage', sync); window.addEventListener('7inone:locale-change', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('7inone:locale-change', sync); };
  }, []);
  return locale;
}

const dashboardCatalog: Record<string, [string, string, string]> = {
  "Overview": [
    "ទិដ្ឋភាពទូទៅ",
    "概览",
    "Overview"
  ],
  "Products": [
    "ផលិតផល",
    "商品",
    "Products"
  ],
  "Orders": [
    "ការបញ្ជាទិញ",
    "订单",
    "Orders"
  ],
  "Vendors": [
    "អ្នកលក់",
    "卖家",
    "Vendors"
  ],
  "Pending vendors": [
    "អ្នកលក់រង់ចាំអនុម័ត",
    "待审核卖家",
    "Pending vendors"
  ],
  "Pending products": [
    "ផលិតផលរង់ចាំអនុម័ត",
    "待审核商品",
    "Pending products"
  ],
  "Customers": [
    "អតិថិជន",
    "客户",
    "Customers"
  ],
  "Revenue": [
    "ចំណូល",
    "收入",
    "Revenue"
  ],
  "Supplier Products": [
    "ផលិតផលពីអ្នកផ្គត់ផ្គង់",
    "供应商商品",
    "Supplier Products"
  ],
  "Moderation": [
    "ការត្រួតពិនិត្យ",
    "审核管理",
    "Moderation"
  ],
  "Shop settings": [
    "ការកំណត់ហាង",
    "店铺设置",
    "Shop settings"
  ],
  "EcomStore Dashboard": [
    "ផ្ទាំងគ្រប់គ្រង EcomStore",
    "EcomStore 管理面板",
    "EcomStore Dashboard"
  ],
  "Processing…": [
    "កំពុងដំណើរការ…",
    "处理中…",
    "Processing…"
  ],
  "Welcome to your account": [
    "សូមស្វាគមន៍មកកាន់គណនីរបស់អ្នក",
    "欢迎使用您的账户",
    "Welcome to your account"
  ],
  "My orders": [
    "ការបញ្ជាទិញរបស់ខ្ញុំ",
    "我的订单",
    "My orders"
  ],
  "Manage products": [
    "គ្រប់គ្រងផលិតផល",
    "管理商品",
    "Manage products"
  ],
  "Open your store": [
    "បើកហាងរបស់អ្នក",
    "开设您的店铺",
    "Open your store"
  ],
  "Submit your seller application for admin review.": [
    "ដាក់ពាក្យជាអ្នកលក់ ដើម្បីឱ្យ Admin ពិនិត្យ",
    "提交卖家申请，等待管理员审核。",
    "Submit your seller application for admin review."
  ],
  "Apply to sell": [
    "ដាក់ពាក្យលក់",
    "申请成为卖家",
    "Apply to sell"
  ],
  "Seller application pending": [
    "ពាក្យស្នើសុំជាអ្នកលក់កំពុងរង់ចាំ",
    "卖家申请待审核",
    "Seller application pending"
  ],
  "Admin will review your store before product listing is enabled.": [
    "Admin នឹងពិនិត្យហាងរបស់អ្នក មុនពេលអនុញ្ញាតឱ្យបង្ហោះផលិតផល",
    "管理员审核店铺后，您才能上架商品。",
    "Admin will review your store before product listing is enabled."
  ],
  "Product photo album": [
    "អាល់ប៊ុមរូបភាពផលិតផល",
    "商品图片集",
    "Product photo album"
  ],
  "Upload up to 5 photos · First photo is your cover": [
    "អាចបង្ហោះរូបភាពបាន ៥ សន្លឹក · រូបទី១ ជារូបគម្រប",
    "最多上传 5 张图片 · 第一张将作为封面",
    "Upload up to 5 photos · First photo is your cover"
  ],
  "Add photos": [
    "បន្ថែមរូបភាព",
    "添加图片",
    "Add photos"
  ],
  "Choose images": [
    "ជ្រើសរើសរូបភាព",
    "选择图片",
    "Choose images"
  ],
  "Click a photo to preview · Hover to remove · JPG, PNG or WEBP": [
    "ចុចលើរូបដើម្បីមើល · ដាក់កណ្ដុរលើរូបដើម្បីលុប · JPG, PNG ឬ WEBP",
    "点击图片预览 · 悬停可删除 · JPG、PNG 或 WEBP",
    "Click a photo to preview · Hover to remove · JPG, PNG or WEBP"
  ],
  "Create product": [
    "បង្កើតផលិតផល",
    "创建商品",
    "Create product"
  ],
  "Apply to become a vendor from Overview before adding products.": [
    "សូមដាក់ពាក្យជាអ្នកលក់នៅទំព័រទិដ្ឋភាពទូទៅ មុនពេលបន្ថែមផលិតផល",
    "添加商品前，请先在概览页面申请成为卖家。",
    "Apply to become a vendor from Overview before adding products."
  ],
  "All statuses": [
    "គ្រប់ស្ថានភាព",
    "所有状态",
    "All statuses"
  ],
  "All categories": [
    "គ្រប់ប្រភេទ",
    "所有分类",
    "All categories"
  ],
  "Newest first": [
    "ថ្មីបំផុតមុន",
    "最新优先",
    "Newest first"
  ],
  "Name A–Z": [
    "ឈ្មោះ A–Z",
    "名称 A–Z",
    "Name A–Z"
  ],
  "Price: low to high": [
    "តម្លៃ៖ ទាបទៅខ្ពស់",
    "价格：从低到高",
    "Price: low to high"
  ],
  "Price: high to low": [
    "តម្លៃ៖ ខ្ពស់ទៅទាប",
    "价格：从高到低",
    "Price: high to low"
  ],
  "Stock: low to high": [
    "ស្តុក៖ តិចទៅច្រើន",
    "库存：从少到多",
    "Stock: low to high"
  ],
  "Stock: high to low": [
    "ស្តុក៖ ច្រើនទៅតិច",
    "库存：从多到少",
    "Stock: high to low"
  ],
  "Reset filters": [
    "កំណត់តម្រងឡើងវិញ",
    "重置筛选",
    "Reset filters"
  ],
  "Product": [
    "ផលិតផល",
    "商品",
    "Product"
  ],
  "Category": [
    "ប្រភេទ",
    "分类",
    "Category"
  ],
  "Price": [
    "តម្លៃ",
    "价格",
    "Price"
  ],
  "Stock": [
    "ស្តុក",
    "库存",
    "Stock"
  ],
  "Shop": [
    "ហាង",
    "店铺",
    "Shop"
  ],
  "Status": [
    "ស្ថានភាព",
    "状态",
    "Status"
  ],
  "Actions": [
    "សកម្មភាព",
    "操作",
    "Actions"
  ],
  "Approve": [
    "អនុម័ត",
    "通过",
    "Approve"
  ],
  "Reject": [
    "បដិសេធ",
    "拒绝",
    "Reject"
  ],
  "Edit stock": [
    "កែសម្រួលស្តុក",
    "编辑库存",
    "Edit stock"
  ],
  "Delete": [
    "លុប",
    "删除",
    "Delete"
  ],
  "No products match these filters.": [
    "មិនមានផលិតផលត្រូវនឹងតម្រងទាំងនេះទេ។",
    "没有符合这些筛选条件的商品。",
    "No products match these filters."
  ],
  "Previous": [
    "មុន",
    "上一页",
    "Previous"
  ],
  "Next": [
    "បន្ទាប់",
    "下一页",
    "Next"
  ],
  "SUPPLIER PRODUCT STUDIO": [
    "មជ្ឈមណ្ឌលគ្រប់គ្រងផលិតផលអ្នកផ្គត់ផ្គង់",
    "供应商商品管理中心",
    "SUPPLIER PRODUCT STUDIO"
  ],
  "គ្រប់គ្រងផលិតផល Supplier តម្លៃលក់ និង Storage Variants នៅទីនេះ។": [
    "គ្រប់គ្រងផលិតផល អ្នកផ្គត់ផ្គង់ តម្លៃលក់ និងជម្រើសទំហំផ្ទុកនៅទីនេះ។",
    "在此管理供应商商品、零售价和存储规格。",
    "Manage supplier products, retail prices and storage variants here."
  ],
  "Supplier products": [
    "ផលិតផលអ្នកផ្គត់ផ្គង់",
    "供应商商品",
    "Supplier products"
  ],
  "Active listings": [
    "ផលិតផលកំពុងដាក់លក់",
    "在售商品",
    "Active listings"
  ],
  "Storage variants": [
    "ជម្រើសទំហំផ្ទុក",
    "存储规格",
    "Storage variants"
  ],
  "Product Library": [
    "បណ្ណាល័យផលិតផល",
    "商品库",
    "Product Library"
  ],
  "No matching products.": [
    "មិនមានផលិតផលដែលត្រូវគ្នាទេ។",
    "没有匹配的商品。",
    "No matching products."
  ],
  "ជ្រើសរើសផលិតផលពី Product Library។": [
    "ជ្រើសរើសផលិតផលពីបណ្ណាល័យផលិតផល។",
    "请从商品库中选择商品。",
    "Select a product from the Product Library."
  ],
  "Admin-only Supplier Information": [
    "ព័ត៌មានអ្នកផ្គត់ផ្គង់សម្រាប់ Admin ប៉ុណ្ណោះ",
    "仅管理员可见的供应商信息",
    "Admin-only Supplier Information"
  ],
  "Supplier name, source link, product code និងតម្លៃដើម បង្ហាញតែ Admin ប៉ុណ្ណោះ។ មិនបង្ហាញដល់អតិថិជនទេ。": [
    "ឈ្មោះអ្នកផ្គត់ផ្គង់ តំណប្រភព លេខកូដផលិតផល និងតម្លៃដើម បង្ហាញតែ Admin ប៉ុណ្ណោះ។ អតិថិជនមិនអាចមើលឃើញទេ។",
    "供应商名称、来源链接、商品代码和成本仅管理员可见，客户不会看到。",
    "Supplier name, source link, product code and cost are visible to admins only, not customers."
  ],
  "Supplier": [
    "អ្នកផ្គត់ផ្គង់",
    "供应商",
    "Supplier"
  ],
  "Supplier code": [
    "លេខកូដអ្នកផ្គត់ផ្គង់",
    "供应商代码",
    "Supplier code"
  ],
  "Supplier cost": [
    "ថ្លៃដើមពីអ្នកផ្គត់ផ្គង់",
    "供应商成本",
    "Supplier cost"
  ],
  "Retail price": [
    "តម្លៃលក់រាយ",
    "零售价",
    "Retail price"
  ],
  "Edit Supplier & Pricing": [
    "កែព័ត៌មានអ្នកផ្គត់ផ្គង់ និងតម្លៃ",
    "编辑供应商和价格",
    "Edit Supplier & Pricing"
  ],
  "Open source ↗": [
    "បើកប្រភព ↗",
    "打开来源 ↗",
    "Open source ↗"
  ],
  "Storage Variants": [
    "ជម្រើសទំហំផ្ទុក",
    "存储规格",
    "Storage Variants"
  ],
  "RAM, SSD, Storage, SKU, retail price និង stock": [
    "RAM, SSD, ទំហំផ្ទុក, SKU, តម្លៃលក់រាយ និងស្តុក",
    "RAM、SSD、存储、SKU、零售价和库存",
    "RAM, SSD, storage, SKU, retail price and stock"
  ],
  "+ Add Variant": [
    "+ បន្ថែមជម្រើស",
    "+ 添加规格",
    "+ Add Variant"
  ],
  "Option": [
    "ជម្រើស",
    "选项",
    "Option"
  ],
  "SKU": [
    "SKU",
    "SKU",
    "SKU"
  ],
  "Action": [
    "សកម្មភាព",
    "操作",
    "Action"
  ],
  "Edit": [
    "កែសម្រួល",
    "编辑",
    "Edit"
  ],
  "មិនទាន់មាន Variant ទេ។": [
    "មិនទាន់មានជម្រើសទេ។",
    "暂无规格。",
    "No variants yet."
  ],
  "Vendor applications & shop history": [
    "ពាក្យស្នើសុំអ្នកលក់ និងប្រវត្តិហាង",
    "卖家申请与店铺历史",
    "Vendor applications & shop history"
  ],
  "Block": [
    "ទប់ស្កាត់",
    "封禁",
    "Block"
  ],
  "Name history": [
    "ប្រវត្តិឈ្មោះ",
    "名称历史",
    "Name history"
  ],
  "Previous shop names": [
    "ឈ្មោះហាងពីមុន",
    "以前的店铺名称",
    "Previous shop names"
  ],
  "No name changes recorded.": [
    "មិនមានកំណត់ត្រាប្តូរឈ្មោះទេ។",
    "没有名称变更记录。",
    "No name changes recorded."
  ],
  "Shop name": [
    "ឈ្មោះហាង",
    "店铺名称",
    "Shop name"
  ],
  "Shop description": [
    "ការពិពណ៌នាអំពីហាង",
    "店铺描述",
    "Shop description"
  ],
  "Save shop settings": [
    "រក្សាទុកការកំណត់ហាង",
    "保存店铺设置",
    "Save shop settings"
  ],
  "Changing your shop name will not erase previous names, orders, or buyer dispute records.": [
    "ការប្តូរឈ្មោះហាងមិនលុបឈ្មោះចាស់ ការបញ្ជាទិញ ឬកំណត់ត្រាវិវាទជាមួយអ្នកទិញទេ។",
    "更改店铺名称不会删除旧名称、订单或买家争议记录。",
    "Changing your shop name will not erase previous names, orders, or buyer dispute records."
  ],
  "View previous shop names": [
    "មើលឈ្មោះហាងពីមុន",
    "查看以前的店铺名称",
    "View previous shop names"
  ],
  "No previous shop names.": [
    "មិនមានឈ្មោះហាងពីមុនទេ។",
    "没有以前的店铺名称。",
    "No previous shop names."
  ],
  "Product moderation": [
    "ការត្រួតពិនិត្យផលិតផល",
    "商品审核",
    "Product moderation"
  ],
  "No products waiting for review.": [
    "មិនមានផលិតផលរង់ចាំការពិនិត្យទេ។",
    "没有待审核的商品。",
    "No products waiting for review."
  ],
  "Total:": [
    "សរុប៖",
    "总计：",
    "Total:"
  ],
  "Shipped": [
    "បានដឹកជញ្ជូន",
    "已发货",
    "Shipped"
  ],
  "Complete / Paid": [
    "បញ្ចប់ / បានបង់ប្រាក់",
    "完成 / 已付款",
    "Complete / Paid"
  ],
  "Accept / Processing": [
    "ទទួលយក / កំពុងដំណើរការ",
    "接受 / 处理中",
    "Accept / Processing"
  ],
  "Mark shipped": [
    "សម្គាល់ថាបានដឹកជញ្ជូន",
    "标记为已发货",
    "Mark shipped"
  ],
  "No orders found.": [
    "រកមិនឃើញការបញ្ជាទិញទេ។",
    "未找到订单。",
    "No orders found."
  ],
  "Close image preview": [
    "បិទការមើលរូបភាព",
    "关闭图片预览",
    "Close image preview"
  ],
  "Store name": [
    "ឈ្មោះហាង",
    "店铺名称",
    "Store name"
  ],
  "Describe your store": [
    "ពិពណ៌នាអំពីហាងរបស់អ្នក",
    "描述您的店铺",
    "Describe your store"
  ],
  "Product title": [
    "ចំណងជើងផលិតផល",
    "商品名称",
    "Product title"
  ],
  "Description": [
    "ការពិពណ៌នា",
    "描述",
    "Description"
  ],
  "Price USD": [
    "តម្លៃ (ដុល្លារ)",
    "价格（美元）",
    "Price USD"
  ],
  "Search product, supplier or code": [
    "ស្វែងរកផលិតផល អ្នកផ្គត់ផ្គង់ ឬលេខកូដ",
    "搜索商品、供应商或代码",
    "Search product, supplier or code"
  ],
  "លុបផលិតផលនេះមែនទេ?": [
    "តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនទេ?",
    "确定删除此商品吗？",
    "Are you sure you want to delete this product?"
  ],
  "Supplier name": [
    "ឈ្មោះអ្នកផ្គត់ផ្គង់",
    "供应商名称",
    "Supplier name"
  ],
  "Supplier cost (USD)": [
    "ថ្លៃដើមអ្នកផ្គត់ផ្គង់ (ដុល្លារ)",
    "供应商成本（美元）",
    "Supplier cost (USD)"
  ],
  "Supplier product code": [
    "លេខកូដផលិតផលអ្នកផ្គត់ផ្គង់",
    "供应商商品代码",
    "Supplier product code"
  ],
  "Supplier source URL": [
    "URL ប្រភពអ្នកផ្គត់ផ្គង់",
    "供应商来源网址",
    "Supplier source URL"
  ],
  "Retail price (USD)": [
    "តម្លៃលក់រាយ (ដុល្លារ)",
    "零售价（美元）",
    "Retail price (USD)"
  ],
  "Variant type": [
    "ប្រភេទជម្រើស",
    "规格类型",
    "Variant type"
  ],
  "Variant value (e.g. 16GB RAM / 1TB SSD)": [
    "តម្លៃជម្រើស (ឧ. RAM 16GB / SSD 1TB)",
    "规格值（例如 16GB RAM / 1TB SSD）",
    "Variant value (e.g. 16GB RAM / 1TB SSD)"
  ],
  "SKU (optional)": [
    "SKU (មិនបាច់បំពេញក៏បាន)",
    "SKU（选填）",
    "SKU (optional)"
  ],
  "Stock quantity": [
    "ចំនួនស្តុក",
    "库存数量",
    "Stock quantity"
  ],
  "New stock quantity": [
    "ចំនួនស្តុកថ្មី",
    "新的库存数量",
    "New stock quantity"
  ],
  "លុប Variant នេះមែនទេ?": [
    "តើអ្នកពិតជាចង់លុបជម្រើសនេះមែនទេ?",
    "确定删除此规格吗？",
    "Are you sure you want to delete this variant?"
  ],
  "Request failed": ["សំណើបានបរាជ័យ","请求失败","Request failed"],
  "Could not load dashboard": ["មិនអាចផ្ទុកផ្ទាំងគ្រប់គ្រងបានទេ","无法加载管理面板","Could not load dashboard"],
  "Application failed": ["ពាក្យស្នើសុំបានបរាជ័យ","申请失败","Application failed"],
  "Could not create product": ["មិនអាចបង្កើតផលិតផលបានទេ","无法创建商品","Could not create product"],
  "Update failed": ["ការធ្វើបច្ចុប្បន្នភាពបានបរាជ័យ","更新失败","Update failed"],
  "Delete failed": ["ការលុបបានបរាជ័យ","删除失败","Delete failed"],
  "Could not save supplier product": ["មិនអាចរក្សាទុកផលិតផលអ្នកផ្គត់ផ្គង់បានទេ","无法保存供应商商品","Could not save supplier product"],
  "Could not add variant": ["មិនអាចបន្ថែមជម្រើសបានទេ","无法添加规格","Could not add variant"],
  "Could not update variant": ["មិនអាចធ្វើបច្ចុប្បន្នភាពជម្រើសបានទេ","无法更新规格","Could not update variant"],
  "Could not delete variant": ["មិនអាចលុបជម្រើសបានទេ","无法删除规格","Could not delete variant"],
  "Supplier not set": ["មិនទាន់កំណត់អ្នកផ្គត់ផ្គង់","未设置供应商","Supplier not set"],
  "No code": ["គ្មានលេខកូដ","无代码","No code"],
  "No phone": ["គ្មានលេខទូរស័ព្ទ","无电话号码","No phone"],
  "Could not load shop history": ["មិនអាចផ្ទុកប្រវត្តិហាងបានទេ","无法加载店铺历史","Could not load shop history"],
  "Shop profile updated. Previous names are kept in history.": ["បានធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបហាង។ ឈ្មោះពីមុនត្រូវបានរក្សាទុកក្នុងប្រវត្តិ។","店铺资料已更新。以前的名称已保留在历史记录中。","Shop profile updated. Previous names are kept in history."],
  "Could not update shop": ["មិនអាចធ្វើបច្ចុប្បន្នភាពហាងបានទេ","无法更新店铺","Could not update shop"],
  "Search name, model, shop or ID…": ["ស្វែងរកឈ្មោះ ម៉ូដែល ហាង ឬ ID…","搜索名称、型号、店铺或 ID…","Search name, model, shop or ID…"],
  "Active": ["កំពុងដំណើរការ","启用中","Active"],
  "Pending": ["កំពុងរង់ចាំ","待处理","Pending"],
  "Rejected": ["បានបដិសេធ","已拒绝","Rejected"],
  "Archived": ["បានដាក់ក្នុងប័ណ្ណសារ","已归档","Archived"],
  "Sold": ["បានលក់","已售出","Sold"],
  "Inactive": ["មិនសកម្ម","未启用","Inactive"],
  "Disable": ["បិទ","禁用","Disable"],
  "Enable": ["បើក","启用","Enable"],
  "Not set": ["មិនទាន់កំណត់","未设置","Not set"],
  "Admin": ["អ្នកគ្រប់គ្រង","管理员","Admin"],
  "You can shop products or apply to become a seller.": ["អ្នកអាចទិញផលិតផល ឬដាក់ពាក្យដើម្បីក្លាយជាអ្នកលក់។","您可以购买商品或申请成为卖家。","You can shop products or apply to become a seller."],
  "All products": ["ផលិតផលទាំងអស់","所有商品","All products"],
  "My products": ["ផលិតផលរបស់ខ្ញុំ","我的商品","My products"],
  "Add product as Admin": ["បន្ថែមផលិតផលក្នុងនាម Admin","以管理员身份添加商品","Add product as Admin"],
  "Add a product": ["បន្ថែមផលិតផល","添加商品","Add a product"],
  "បានដាក់ពាក្យបើកហាងរួចរាល់។ រង់ចាំ Admin អនុម័ត។": ["បានដាក់ពាក្យបើកហាងរួចរាល់។ រង់ចាំ Admin អនុម័ត។", "已提交开店申请。请等待管理员审核。", "Shop application submitted. Waiting for Admin approval."],
  "ផលិតផលបានបង្កើត។ វានឹងបង្ហាញក្រោយ Admin អនុម័ត។": ["បានបង្កើតផលិតផលរួចរាល់។ វានឹងបង្ហាញក្រោយ Admin អនុម័ត។", "商品已创建。管理员批准后将会显示。", "Product created. It will appear after Admin approval."],
  "បានរក្សាទុកការផ្លាស់ប្ដូរ។": ["បានរក្សាទុកការផ្លាស់ប្ដូររួចរាល់។", "更改已保存。", "Changes saved."],
  "បានរក្សាទុក Supplier និងតម្លៃលក់។": ["បានរក្សាទុកព័ត៌មានអ្នកផ្គត់ផ្គង់ និងតម្លៃលក់រួចរាល់។", "供应商信息和售价已保存。", "Supplier details and retail price saved."],
  "បានបន្ថែម Storage Variant។": ["បានបន្ថែមជម្រើសទំហំផ្ទុករួចរាល់។", "存储规格已添加。", "Storage variant added."],
  "Supplier name, source link, product code និងតម្លៃដើម បង្ហាញតែ Admin ប៉ុណ្ណោះ។ មិនបង្ហាញដល់អតិថិជនទេ។": ["ឈ្មោះអ្នកផ្គត់ផ្គង់ តំណប្រភព លេខកូដផលិតផល និងថ្លៃដើម បង្ហាញតែ Admin ប៉ុណ្ណោះ មិនបង្ហាញដល់អតិថិជនទេ។", "供应商名称、来源链接、商品代码和成本仅管理员可见，不会向客户显示。", "Supplier name, source link, product code, and cost are visible to Admin only, not customers."],
};
export function dashboardText(locale: SiteLocale, source: string): string {
  const entry = dashboardCatalog[source];
  if (!entry) return source;
  return locale === 'km' ? entry[0] : locale === 'zh-CN' ? entry[1] : entry[2];
}
