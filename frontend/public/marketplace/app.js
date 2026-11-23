// ==========================================================================
// 7inOne Production Frontend (Supabase Auth + Authenticated Server API)
// Cleaned, modularized, and formatted for maintainability
// ==========================================================================

'use strict';

/* --------------------------------------------------------------------------
   1. Constants & Icons
   -------------------------------------------------------------------------- */
const ICON_PATHS = {
  bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  cleaningBottle: '<path d="M10 3h4v3h-4zM9 6h6l1 3v12H8V9l1-3Z"/><path d="M14 3h3l2 2M11 12h2m-2 3h2"/>',
  mousePad: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M5 8h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  chev: '<path d="m7 10 5 5 5-5"/>',
  x: '<path d="m18 6-12 12M6 6l12 12"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.8L3 21l1.8-4.5A8.2 8.2 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  car: '<path d="m5 17-1 2v2h2v-2h12v2h2v-2l-1-2"/><path d="m4 17 1.5-6h13L20 17M7 11l1.5-4h7L17 11M7 17h.01M17 17h.01"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1Z"/>',
  shirt: '<path d="m16 4 5 3-3 4-2-1v10H8V10l-2 1-3-4 5-3 2 2h4z"/>',
  sofa: '<path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4M3 12a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v5H3zM5 17v3m14-3v3"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  camera: '<path d="M14 5 12.5 3h-5L6 5H3v14h18V5z"/><circle cx="12" cy="12" r="3.5"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.4"/>',
  store: '<path d="M3 10h18l-1 11H4L3 10Z"/><path d="m3 10 2-7h14l2 7M8 10v3m8-3v3"/>',
  wallet: '<path d="M4 6h15a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/><path d="M21 11h-5a2 2 0 0 0 0 4h5"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m4 4v7m6-7v7"/>',
  edit: '<path d="m16 4 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/>',
  checkcircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>',
  spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  refresh: '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
  package: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/>',
  mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v6m-6 0h12"/>',
  mouseWired: '<rect x="6" y="2" width="12" height="17" rx="6"/><path d="M12 2v6m-6 0h12M12 19v2m0 0 3 2"/>',
  mouseWireless: '<rect x="6" y="2" width="12" height="17" rx="6"/><path d="M12 2v6m-6 0h12M4 4a11 11 0 0 0 0 13m16-13a11 11 0 0 1 0 13"/>',
  keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M9 9h.01M12 9h.01M15 9h.01M18 9h.01M6 12h.01M9 12h.01M12 12h.01M15 12h.01M18 12h.01M8 15h8"/>',
  headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="13" width="5" height="8" rx="2"/><rect x="17" y="13" width="5" height="8" rx="2"/>',
  usb: '<path d="M12 2v15m0-15 3 3m-3-3-3 3m3 12 4 3m-4-3-4 3"/><circle cx="12" cy="19" r="1.5"/>',
  charger: '<path d="M8 2v5m8-5v5M6 7h12v5a6 6 0 0 1-12 0V7Zm6 11v4"/>',
  speaker: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="9" r="2"/><circle cx="12" cy="16" r="3"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  giftbag: '<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  truck: '<path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z"/><circle cx="7.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>',
  volumeOff: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/>',
  clipboard: '<path d="M9 4h6a2 2 0 0 1 2 2v1h3v14H4V7h3V6a2 2 0 0 1 2-2Z"/><path d="M9 4v3h6V4M8 12h8M8 16h8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2"/>',
  arrowUpRight: '<path d="M7 17 17 7M7 7h10v10"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  wrench: '<path d="m14.7 6.3 3 3M4 20l6.5-6.5m-1.2-1.2 4.8-4.8a4 4 0 0 0 5.3-5.3l-2.2 2.2-2.8-.7-.7-2.8L16 0.7a4 4 0 0 0-5.3 5.3L5.9 10.8a2.8 2.8 0 0 0 0 4L9.2 18a2.8 2.8 0 0 0 4 0l1.1-1.1"/>',
  flag: '<path d="M4 21V5"/><path d="M4 5c5-4 8 4 16 0v10c-8 4-11-4-16 0"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>'
};

const CATEGORIES = {
  computers: 'កុំព្យូទ័រ (Computers)',
  computer_accessories: 'គ្រឿងបន្លាស់កុំព្យូទ័រ (Accessories)',
  phones: 'ទូរស័ព្ទ & អេឡិចត្រូនិក',
  vehicles: 'រថយន្ត & ម៉ូតូ',
  property: 'អចលនទ្រព្យ',
  fashion: 'សម្លៀកបំពាក់',
  furniture: 'គ្រឿងសង្ហារិម'
};

const DEFAULT_MAINTENANCE_MSG = 'ប្រព័ន្ធកំពុងធ្វើការអភិវឌ្ឍន៍ និងបន្ថែមមុខងារថ្មីៗ សូមអធ្យាស្រ័យចំពោះការរំខាន!';
const PRODUCT_DESC_SEPARATOR = '\n<!--7INONE:MORE-->\n';


const MARKETPLACE_UI_MESSAGES = Object.freeze({
  "មុខងារនេះសម្រាប់ Admin ប៉ុណ្ណោះ។": { 'zh-CN': "此功能仅限管理员使用。", en: "This feature is for Admins only." },
  "មិនអាចចម្លង Product ID បានទេ។": { 'zh-CN': "无法复制商品 ID。", en: "Could not copy Product ID." },
  "សូមជ្រើសរើសរូបភាព Story។": { 'zh-CN': "请选择动态图片。", en: "Please select a Story image." },
  "សូមប្រើរូប JPG, PNG ឬ WEBP ដែលមានទំហំមិនលើស 8MB។": { 'zh-CN': "请使用不超过 8MB 的 JPG、PNG 或 WEBP 图片。", en: "Use a JPG, PNG, or WEBP image no larger than 8MB." },
  "បានផុស Story ជោគជ័យ! Story នឹងបាត់ក្រោយ 24 ម៉ោង។": { 'zh-CN': "动态发布成功！动态将在 24 小时后消失。", en: "Story posted successfully! It will disappear after 24 hours." },
  "សូមជ្រើសរើសរូបភាពជាមុនសិន។": { 'zh-CN': "请先选择图片。", en: "Please select an image first." },
  "បានផុសរូបភាពជោគជ័យ!": { 'zh-CN': "图片发布成功！", en: "Image posted successfully!" },
  "មិនមានលេខសម្គាល់ទំនិញទេ។": { 'zh-CN': "缺少商品 ID。", en: "Product ID is missing." },
  "Google Maps Link មិនត្រឹមត្រូវ។": { 'zh-CN': "Google Maps 链接无效。", en: "The Google Maps link is invalid." },
  "បានចម្លង Link រួចរាល់!": { 'zh-CN': "链接已复制！", en: "Link copied!" },
  "មិនអាចចម្លង Link បានទេ។": { 'zh-CN': "无法复制链接。", en: "Could not copy the link." },
  "បានរក្សាទុកប្រកាស!": { 'zh-CN': "帖子已保存！", en: "Post saved!" },
  "បានផ្ញើរបាយការណ៍ទៅ Admin រួចរាល់។": { 'zh-CN': "举报已发送给管理员。", en: "Report sent to Admin." },
  "បានផ្ញើការវាយតម្លៃរួចរាល់។": { 'zh-CN': "评价已提交。", en: "Review submitted." },
  "មិនមានព័ត៌មានហាងនេះទេ។": { 'zh-CN': "未找到该店铺信息。", en: "Shop information is unavailable." },
  "រកមិនឃើញផលិតផលនេះទេ។": { 'zh-CN': "未找到该商品。", en: "Product not found." },
  "រូបភាពសរុបមិនអាចលើស ១០ រូបទេ។": { 'zh-CN': "图片总数不能超过 10 张。", en: "You can upload no more than 10 images." },
  "សូមប្រើ JPG / PNG / WEBP មិនលើស ២០MB ក្នុងមួយរូប។": { 'zh-CN': "请使用 JPG、PNG 或 WEBP 图片，每张不超过 20MB。", en: "Use JPG, PNG, or WEBP images up to 20MB each." },
  "បានរក្សាទុកការកែប្រែផលិតផល។": { 'zh-CN': "商品修改已保存。", en: "Product changes saved." },
  "ហាងរបស់អ្នកបានផ្ទៀងផ្ទាត់រួចហើយ។": { 'zh-CN': "您的店铺已通过验证。", en: "Your shop is already verified." },
  "ហាងនេះត្រូវបានបិទដោយ Admin។": { 'zh-CN': "该店铺已被管理员停用。", en: "This shop has been disabled by Admin." },
  "សូមប្រើ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ។": { 'zh-CN': "仅支持 JPG、PNG 或 WEBP 格式。", en: "Only JPG, PNG, or WEBP files are allowed." },
  "រូបភាពនីមួយៗមិនអាចធំជាង 8MB បានទេ។": { 'zh-CN': "每张图片不能超过 8MB。", en: "Each image must be no larger than 8MB." },
  "អាចដាក់រូបភាពបានអតិបរមា ១០ រូប។": { 'zh-CN': "最多可上传 10 张图片。", en: "You can upload up to 10 images." },
  "បានដកទីតាំងលំនាំដើមចេញ។": { 'zh-CN': "默认位置已移除。", en: "Default location removed." },
  "សូមជ្រើសរើសទីតាំងដល់កម្រិតភូមិជាមុនសិន។": { 'zh-CN': "请先选择到村级的位置。", en: "Please select a location down to the village level first." },
  "បានរក្សាទុកទីតាំងលំនាំដើមជោគជ័យ!": { 'zh-CN': "默认位置保存成功！", en: "Default location saved successfully!" },
  "បានលុប Variant។": { 'zh-CN': "变体已删除。", en: "Variant deleted." },
  "បានរក្សាទុក Variant។": { 'zh-CN': "变体已保存。", en: "Variant saved." },
  "សូមបញ្ចូលឈ្មោះ Variant និងតម្លៃលក់។": { 'zh-CN': "请输入变体名称和售价。", en: "Enter the variant name and selling price." },
  "បានបន្ថែម Variant។": { 'zh-CN': "变体已添加。", en: "Variant added." },
  "បានរក្សាទុកព័ត៌មានផលិតផល AURORA។": { 'zh-CN': "AURORA 商品信息已保存。", en: "AURORA product information saved." },
  "មិនទាន់រកឃើញហាង AURORA Computer។": { 'zh-CN': "尚未找到 AURORA Computer 店铺。", en: "AURORA Computer shop was not found." },
  "បានរក្សាទុកព័ត៌មាន AURORA Computer។": { 'zh-CN': "AURORA Computer 信息已保存。", en: "AURORA Computer information saved." },
  "ទំនិញនេះអស់ស្តុកហើយ។": { 'zh-CN': "该商品已售罄。", en: "This product is out of stock." },
  "សូមចូលគណនី 7inOne ជាមុនសិន។": { 'zh-CN': "请先登录 7inOne 账户。", en: "Please sign in to your 7inOne account first." },
  "បានចាកចេញពីគណនីរួចរាល់។": { 'zh-CN': "已成功退出账户。", en: "Signed out successfully." },
  "បានចូលគណនីជោគជ័យ!": { 'zh-CN': "登录成功！", en: "Signed in successfully!" },
  "បានរក្សាទុកទំនិញជោគជ័យ!": { 'zh-CN': "商品保存成功！", en: "Product saved successfully!" },
  "បានលុបទំនិញរួចរាល់។": { 'zh-CN': "商品已删除。", en: "Product deleted." },
  "បានផ្ញើសំណើតម្លៃជោគជ័យ!": { 'zh-CN': "报价请求已发送！", en: "Price request sent successfully!" },
  "បានដាក់ពាក្យស្នើសុំអ្នកលក់ជោគជ័យ!": { 'zh-CN': "卖家申请已提交！", en: "Seller application submitted successfully!" },
  "បានរក្សាទុកព័ត៌មាន Profile ជោគជ័យ!": { 'zh-CN': "个人资料保存成功！", en: "Profile saved successfully!" },
  "បានប្ដូររូបភាព Profile ជោគជ័យ!": { 'zh-CN': "头像更换成功！", en: "Profile photo updated successfully!" },
  "ព័ត៌មានបន្ថែមមិនត្រឹមត្រូវទេ។": { 'zh-CN': "补充信息无效。", en: "Additional information is invalid." },
  "បានកែប្រែប្រកាសជោគជ័យ។": { 'zh-CN': "帖子更新成功。", en: "Post updated successfully." },
  "បានផ្ញើ OTP តាម Telegram។": { 'zh-CN': "验证码已通过 Telegram 发送。", en: "OTP sent via Telegram." },
  "បានប្ដូរ Password ជោគជ័យ!": { 'zh-CN': "密码修改成功！", en: "Password changed successfully!" },
  "បានសង្គ្រោះ Password ជោគជ័យ។ សូមចូលគណនីម្ដងទៀត។": { 'zh-CN': "密码重置成功。请重新登录。", en: "Password reset successfully. Please sign in again." },
  "បានធ្វើបច្ចុប្បន្នភាពសំណើតម្លៃ។": { 'zh-CN': "报价请求已更新。", en: "Price request updated." },
  "បានធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ។": { 'zh-CN': "订单已更新。", en: "Order updated." },
  "បានរក្សាទុកព័ត៌មានហាង។": { 'zh-CN': "店铺信息已保存。", en: "Shop information saved." },
  "បានរក្សាទុក Brand ជោគជ័យ!": { 'zh-CN': "品牌保存成功！", en: "Brand saved successfully!" },
  "បានអនុម័ត និង Upload រូបទៅ Telegram រួចរាល់។": { 'zh-CN': "已批准并将图片上传至 Telegram。", en: "Image approved and uploaded to Telegram." },
  "បានបដិសេធរូបភាព។": { 'zh-CN': "图片已拒绝。", en: "Image rejected." },
  "បានបញ្ចប់ Auto Sync។": { 'zh-CN': "自动同步已完成。", en: "Auto Sync completed." },
  "បានបង្កើតផលិតផល Supplier ជោគជ័យ។": { 'zh-CN': "供应商商品创建成功。", en: "Supplier product created successfully." },
  "បានធ្វើបច្ចុប្បន្នភាពពាក្យស្នើសុំ។": { 'zh-CN': "申请已更新。", en: "Application updated." },
  "មិនអាចភ្ជាប់ប្រព័ន្ធបានទេ៖ ": { 'zh-CN': "系统连接失败：", en: "Could not connect to the system: " },
  "មិនអាចទាញការកំណត់ប្រព័ន្ធបានទេ៖ ": { 'zh-CN': "无法加载系统设置：", en: "Could not load system settings: " },
  "មិនអាចផ្ទុក Dashboard៖ ": { 'zh-CN': "无法加载控制面板：", en: "Could not load dashboard: " },
  "មិនអាចផ្ទុក Admin៖ ": { 'zh-CN': "无法加载管理后台：", en: "Could not load Admin: " },
  "មិនអាចទាញយកការងារបានទេ៖ ": { 'zh-CN': "无法加载职位：", en: "Could not load jobs: " },
  "មិនអាចទាញយកប្រកាសបានទេ៖ ": { 'zh-CN': "无法加载帖子：", en: "Could not load posts: " },
  "បោះបង់": { 'zh-CN': "取消", en: "Cancel" },
  "មូលហេតុ": { 'zh-CN': "原因", en: "Reason" },
  "យល់ព្រម": { 'zh-CN': "确认", en: "Confirm" },
  "ផ្ញើរបាយការណ៍": { 'zh-CN': "提交举报", en: "Submit report" },
  "សរសេរមូលហេតុនៅទីនេះ...": { 'zh-CN': "请在此填写原因...", en: "Write the reason here..." },
  "បញ្ជាក់សកម្មភាព": { 'zh-CN': "确认操作", en: "Confirm action" },
  "បិទ": { 'zh-CN': "关闭", en: "Close" },
  "ទិញឥឡូវនេះ": { 'zh-CN': "立即购买", en: "Buy now" },
  "មិនបានបញ្ជាក់": { 'zh-CN': "未注明", en: "Not specified" },
  "រក្សាទុករូបភាព": { 'zh-CN': "保存图片", en: "Save image" },
  "ពង្រីករូបភាព": { 'zh-CN': "放大图片", en: "Zoom image" },
  "ចូលគណនី និងទិញទំនិញពីហាងនេះ ដើម្បីអាចវាយតម្លៃអ្នកលក់បាន។": { 'zh-CN': "请登录并购买该店铺的商品后，才能评价卖家。", en: "Sign in and purchase from this shop to review the seller." },
  "ចូលគណនី": { 'zh-CN': "登录", en: "Sign in" },
  "ការវាយតម្លៃផ្កាយ": { 'zh-CN': "星级评价", en: "Star rating" },
  "សរសេរអំពីគុណភាពទំនិញ និងសេវាកម្មរបស់ហាង...": { 'zh-CN': "请描述商品质量和店铺服务...", en: "Describe the product quality and shop service..." },
  "អ្នកបានវាយតម្លៃការបញ្ជាទិញដែលមានរួចហើយ។": { 'zh-CN': "您已评价过现有订单。", en: "You have already reviewed an existing order." },
  "អាចវាយតម្លៃបានក្រោយពេលការបញ្ជាទិញពីហាងនេះត្រូវបានបញ្ចប់។": { 'zh-CN': "该店铺订单完成后即可评价。", en: "You can review after an order from this shop is completed." },
  "ទំនិញ": { 'zh-CN': "商品", en: "Product" },
  "សំណើតថ្លៃ": { 'zh-CN': "议价请求", en: "Price offer" },
  "អ្នកលក់": { 'zh-CN': "卖家", en: "Seller" },
  "អ្នកលក់បានផ្ទៀងផ្ទាត់": { 'zh-CN': "已认证卖家", en: "Verified seller" },
  "ប្រភេទ": { 'zh-CN': "类别", en: "Category" },
  "ស្ថានភាព": { 'zh-CN': "状态", en: "Condition" },
  "កាលបរិច្ឆេទបង្ហោះ": { 'zh-CN': "发布日期", en: "Date posted" },
  "រូបភាពផលិតផល": { 'zh-CN': "商品图片", en: "Product image" },
  "ហាងអ្នកលក់": { 'zh-CN': "卖家店铺", en: "Seller shop" },
  "ទាំងអស់": { 'zh-CN': "全部", en: "All" },
  "គ្រប់ផ្នែករង": { 'zh-CN': "所有子类别", en: "All subcategories" },
  "ស្តុក ": { 'zh-CN': "库存 ", en: "In stock " },
  "អស់ស្តុក": { 'zh-CN': "缺货", en: "Out of stock" },
  "កែប្រែ": { 'zh-CN': "编辑", en: "Edit" },
  "រូបថ្មី Upload តាម Telegram ដើម។ រូបចាស់មិនត្រូវបានលុបដោយស្វ័យប្រវត្តិទេ។": { 'zh-CN': "新图片将通过原有 Telegram 流程上传。旧图片不会自动删除。", en: "New images use the existing Telegram upload flow. Old images are not automatically deleted." },
  "បង្ហាញផលិតផលនៅលើហាង": { 'zh-CN': "在店铺中显示商品", en: "Show product in shop" },
  "រក្សាទុក": { 'zh-CN': "保存", en: "Save" },
  "កំពុងផ្ទុកព័ត៌មានហាង": { 'zh-CN': "正在加载店铺信息", en: "Loading shop information" },
  "មិនទាន់មានពិន្ទុ": { 'zh-CN': "暂无评分", en: "Not rated yet" },
  "មុខទំនិញ": { 'zh-CN': "件商品", en: "products" },
  "ពិនិត្យ": { 'zh-CN': "条评价", en: "reviews" },
  "ស្វែងរកទំនិញក្នុងហាង": { 'zh-CN': "搜索店铺商品", en: "Search shop products" },
  "ស្វែងរកក្នុងហាងនេះ...": { 'zh-CN': "搜索此店铺...", en: "Search this shop..." },
  "មិនអាចផ្ទុកទំនិញបន្ថែមបានទេ។ សូមព្យាយាមម្តងទៀត។": { 'zh-CN': "无法加载更多商品。请重试。", en: "Could not load more products. Please try again." },
  "អ្នកមិនទាន់រក្សាទុកទំនិញណាមួយទេ។": { 'zh-CN': "您尚未收藏任何商品。", en: "You haven't saved any products yet." },
  "មិនទាន់មានការបញ្ជាទិញ។": { 'zh-CN': "暂无订单。", en: "No orders yet." },
  "មិនទាន់មានសំណើតម្លៃ។": { 'zh-CN': "暂无报价请求。", en: "No price offers yet." },
  "ស្វែងរកប្រកាស...": { 'zh-CN': "搜索帖子...", en: "Search posts..." },
  "មុខតំណែង / Job Title": { 'zh-CN': "职位名称", en: "Job title" },
  "ចំណងជើងអចលនទ្រព្យ": { 'zh-CN': "房产标题", en: "Property title" },
  "ចំនួនត្រូវជ្រើសរើស": { 'zh-CN': "招聘人数", en: "Number of vacancies" },
  "ប្រភេទការងារ": { 'zh-CN': "工作类型", en: "Employment type" },
  "ប្រាក់ខែចាប់ពី (USD)": { 'zh-CN': "最低薪资 (USD)", en: "Salary from (USD)" },
  "ប្រាក់ខែដល់ (USD)": { 'zh-CN': "最高薪资 (USD)", en: "Salary up to (USD)" },
  "ជំនាញ (បំបែកដោយក្បៀស)": { 'zh-CN': "技能（用逗号分隔）", en: "Skills (comma-separated)" },
  "ភាសា (បំបែកដោយក្បៀស)": { 'zh-CN': "语言（用逗号分隔）", en: "Languages (comma-separated)" },
  "អត្ថប្រយោជន៍ (បំបែកដោយក្បៀស)": { 'zh-CN': "福利（用逗号分隔）", en: "Benefits (comma-separated)" },
  "មិនទាន់មានរូបភាព": { 'zh-CN': "暂无图片", en: "No images yet" },
  "រក្សារូបនេះ": { 'zh-CN': "保留此图片", en: "Keep this image" },
  "ជ្រើសរើសរូបថ្មី (JPG / PNG / WEBP · 8MB)": { 'zh-CN': "选择新图片（JPG / PNG / WEBP · 8MB）", en: "Choose new image (JPG / PNG / WEBP · 8MB)" },
  "ប្រចាំថ្ងៃ": { 'zh-CN': "每日", en: "Daily" },
  "ប្រចាំឆ្នាំ": { 'zh-CN': "每年", en: "Yearly" },
  "ប្រភេទអចលនទ្រព្យលម្អិត": { 'zh-CN': "详细房产类型", en: "Detailed property type" },
  "កុំព្យូទ័រ (Computers)": { 'zh-CN': "电脑", en: "Computers" },
  "គ្រឿងបន្លាស់កុំព្យូទ័រ (Accessories)": { 'zh-CN': "电脑配件", en: "Computer accessories" },
  "ទូរស័ព្ទ & អេឡិចត្រូនិក": { 'zh-CN': "手机与电子产品", en: "Phones & electronics" },
  "រថយន្ត & ម៉ូតូ": { 'zh-CN': "汽车与摩托车", en: "Cars & motorbikes" },
  "អចលនទ្រព្យ": { 'zh-CN': "房地产", en: "Real estate" },
  "សម្លៀកបំពាក់": { 'zh-CN': "服装", en: "Fashion" },
  "គ្រឿងសង្ហារិម": { 'zh-CN': "家具", en: "Furniture" },
  "ភ្នំពេញ": { 'zh-CN': "金边", en: "Phnom Penh" },
  "សមាជិក 7inOne": { 'zh-CN': "7inOne 会员", en: "7inOne member" },
  "អ្នកគ្រប់គ្រង": { 'zh-CN': "管理员", en: "Administrator" },
  "អ្នកលក់ទូទៅ": { 'zh-CN': "普通卖家", en: "Regular seller" },
  "មើលស្ថានភាពហាង": { 'zh-CN': "查看店铺状态", en: "View shop status" },
  "បើកហាងលក់នៅ 7inOne": { 'zh-CN': "在 7inOne 开设店铺", en: "Open a shop on 7inOne" },
  "មិនទាន់មានសំណើតថ្លៃទេ": { 'zh-CN': "暂无议价请求", en: "No price offers yet" },
  "មិនទាន់មានការបញ្ជាទិញទេ": { 'zh-CN': "暂无订单", en: "No orders yet" },
  "ទទួលយក": { 'zh-CN': "接受", en: "Accept" },
  "បដិសេធ": { 'zh-CN': "拒绝", en: "Reject" },
  "ដឹកជញ្ជូន": { 'zh-CN': "发货", en: "Ship" },
  "បញ្ចប់": { 'zh-CN': "完成", en: "Complete" },
  "អ្នកទិញ": { 'zh-CN': "买家", en: "Buyer" },
  "ប្រវត្តិការបញ្ជាទិញ": { 'zh-CN': "订单历史", en: "Order history" },
  "ប្រវត្តិសំណើតថ្លៃ": { 'zh-CN': "报价请求历史", en: "Price offer history" },
  "មើលបន្ថែម": { 'zh-CN': "View more", en: "View more" },
  "ស្នើ": { 'zh-CN': "报价", en: "Offer" },
  "មុខ": { 'zh-CN': "件", en: "items" },
  "ការបញ្ជាទិញ": { 'zh-CN': "订单", en: "Orders" },
  "សំណើ": { 'zh-CN': "请求", en: "Offers" },
  "មើលស្ថានភាព": { 'zh-CN': "查看状态", en: "View status" },
  "កំពុងផ្ទុកព័ត៌មាន": { 'zh-CN': "正在加载信息", en: "Loading information" },
  "មិនទាន់មានទំនិញទេ": { 'zh-CN': "暂无商品", en: "No products yet" },
  "មិនមានទិន្នន័យទេ": { 'zh-CN': "暂无数据", en: "No data available" },
  "ព្យាយាមម្តងទៀត": { 'zh-CN': "请重试", en: "Try again" },
  "ផ្ទុកបន្ថែម": { 'zh-CN': "加载更多", en: "Load more" },
  "សូមជ្រើសរើសទីតាំងរហូតដល់កម្រិតភូមិ។": { 'zh-CN': "请选择到村级的位置。", en: "Please select a location down to the village level." },
  "សូមជ្រើសរើសទីតាំងដល់កម្រិតភូមិ។": { 'zh-CN': "请选择到村级的位置。", en: "Please select a location down to the village level." },
  "បានទាញ និងរក្សាទុករូប ": { 'zh-CN': "已下载并保存图片 ", en: "Downloaded and saved image " },
  "មិនអាចកំណត់ទំនិញសម្រាប់សំណើតម្លៃបានទេ។": { 'zh-CN': "无法为报价请求指定商品。", en: "Could not select a product for the price offer." },
  "សូមជ្រើសរើសឯកសាររូបភាព។": { 'zh-CN': "请选择图片文件。", en: "Please select an image file." },
  "បានបង្កើតគណនី។ សូមពិនិត្យ Email ឬ SMS ដើម្បីផ្ទៀងផ្ទាត់ មុនចូលប្រើ។": { 'zh-CN': "账户创建成功。请先检查电子邮件或短信并完成验证，然后再登录。", en: "Account created. Check your email or SMS and verify before signing in." },
  "បានចូលគណនី ប៉ុន្តែព័ត៌មាន Profile មិនទាន់អាចទាញបានទេ។": { 'zh-CN': "登录成功，但暂时无法加载个人资料。", en: "Signed in, but profile information could not be loaded yet." },
  "រូបភាពនីមួយៗមិនអាចធំជាង ២០MB បានទេ។": { 'zh-CN': "每张图片不能超过 20MB。", en: "Each image must not exceed 20MB." },
  "អាចដាក់រូបភាពបានអតិបរមា ១០ រូបប៉ុណ្ណោះ។": { 'zh-CN': "最多只能上传 10 张图片。", en: "You can upload a maximum of 10 images." },
  "សូមប្រើ JPG / PNG / WEBP ហើយរូបនីមួយៗមិនលើស ២០MB។": { 'zh-CN': "请使用 JPG、PNG 或 WEBP 格式，每张图片不超过 20MB。", en: "Use JPG, PNG, or WEBP images up to 20MB each." },
  "បានភ្ជាប់ Telegram Login ជាមួយគណនីនេះរួចរាល់។": { 'zh-CN': "Telegram 登录已成功关联到此账户。", en: "Telegram Login is now linked to this account." },
  "YouTube Video Link មិនត្រឹមត្រូវទេ។": { 'zh-CN': "YouTube 视频链接无效。", en: "The YouTube video link is invalid." },
  "បានបង្កើតតំណភ្ជាប់ Telegram។": { 'zh-CN': "Telegram 链接已创建。", en: "Telegram link created." },
  "បានស្នើសុំ OTP សង្គ្រោះតាម Telegram។": { 'zh-CN': "已通过 Telegram 请求恢复验证码。", en: "Recovery OTP requested via Telegram." },
  "កំពុងផ្ទុកទំនិញ...": { 'zh-CN': "正在加载商品...", en: "Loading products..." },
  "សូមចុះឈ្មោះបង្កើតហាងជាមុនសិន។": { 'zh-CN': "请先注册并创建店铺。", en: "Please register and create a shop first." },
  "មិនអាចផុស Story បានទេ។": { 'zh-CN': "无法发布动态。", en: "Could not post the Story." },
  "មិនអាចផុសរូបភាពបានទេ។": { 'zh-CN': "无法发布图片。", en: "Could not post the image." },
  "មិនអាច Like បានទេ។": { 'zh-CN': "无法点赞。", en: "Could not like this." },
  "មិនអាចផ្ទុកមតិយោបល់បានទេ។": { 'zh-CN': "无法加载评论。", en: "Could not load comments." },
  "មិនអាចផ្ញើមតិយោបល់បានទេ។": { 'zh-CN': "无法发送评论。", en: "Could not post the comment." },
  "មិនអាចបើកព័ត៌មានប្រកាសបានទេ។": { 'zh-CN': "无法打开帖子详情。", en: "Could not open listing details." },
  "បានរក្សាទុក": { 'zh-CN': "已收藏", en: "Saved" },
  "មិនអាចរក្សាទុកបានទេ។": { 'zh-CN': "无法收藏。", en: "Could not save." },
  "រាយការណ៍ប្រកាស": { 'zh-CN': "举报帖子", en: "Report post" },
  "សូមបញ្ជាក់មូលហេតុដែលអ្នកចង់រាយការណ៍ ដើម្បីឱ្យ Admin អាចពិនិត្យបានត្រឹមត្រូវ។": { 'zh-CN': "请说明举报原因，以便管理员准确审核。", en: "Explain why you are reporting this so Admin can review it properly." },
  "ឧ. ព័ត៌មានមិនត្រឹមត្រូវ ឬសង្ស័យថាបោកប្រាស់...": { 'zh-CN': "例如：信息不实或疑似诈骗...", en: "E.g. incorrect information or suspected fraud..." },
  "មិនអាចរាយការណ៍បានទេ។": { 'zh-CN': "无法提交举报。", en: "Could not submit the report." },
  "មិនអាចផ្ញើការវាយតម្លៃបានទេ។": { 'zh-CN': "无法提交评价。", en: "Could not submit the review." },
  "មិនអាចរក្សាទុកផលិតផលបានទេ។": { 'zh-CN': "无法保存商品。", en: "Could not save the product." },
  "មិនអាចដកទីតាំងលំនាំដើមបានទេ។": { 'zh-CN': "无法移除默认位置。", en: "Could not remove the default location." },
  "មិនអាចរក្សាទុកទីតាំងលំនាំដើមបានទេ។": { 'zh-CN': "无法保存默认位置。", en: "Could not save the default location." },
  "មិនអាចផ្ទុកទីតាំងកម្ពុជាបានទេ។": { 'zh-CN': "无法加载柬埔寨地区位置。", en: "Could not load Cambodia locations." },
  "បានបង្ហោះប្រកាសការងារជោគជ័យ!": { 'zh-CN': "职位发布成功！", en: "Job listing published successfully!" },
  "បានបង្ហោះអចលនទ្រព្យជោគជ័យ!": { 'zh-CN': "房产信息发布成功！", en: "Property listing published successfully!" },
  "មិនអាចបង្ហោះប្រកាសបានទេ។": { 'zh-CN': "无法发布帖子。", en: "Could not publish the listing." },
  "មិនអាចផ្ទុកផលិតផលបានទេ។": { 'zh-CN': "无法加载商品。", en: "Could not load products." },
  " រូបក្នុង Telegram។": { 'zh-CN': " 张图片已上传至 Telegram。", en: " images uploaded to Telegram." },
  "មិនអាចទាញរូបពី Supplier បានទេ។": { 'zh-CN': "无法从供应商获取图片。", en: "Could not fetch images from the supplier." },
  "ទាញរូបពី CC COMPUTER → Telegram": { 'zh-CN': "从 CC COMPUTER 获取图片 → Telegram", en: "Fetch images from CC COMPUTER → Telegram" },
  "មិនអាចលុប Variant បានទេ។": { 'zh-CN': "无法删除变体。", en: "Could not delete the variant." },
  "មិនអាចរក្សាទុក Variant បានទេ។": { 'zh-CN': "无法保存变体。", en: "Could not save the variant." },
  "មិនអាចបន្ថែម Variant បានទេ។": { 'zh-CN': "无法添加变体。", en: "Could not add the variant." },
  "រក្សាទុកផលិតផល": { 'zh-CN': "保存商品", en: "Save product" },
  "មិនអាចរក្សាទុកព័ត៌មានហាងបានទេ។": { 'zh-CN': "无法保存店铺信息。", en: "Could not save shop information." },
  "មិនអាចឆាតជាមួយអ្នកផុសបានទេ។": { 'zh-CN': "无法与发布者聊天。", en: "Could not chat with the poster." },
  "មិនអាចឆាតជាមួយហាងបានទេ។": { 'zh-CN': "无法与店铺聊天。", en: "Could not chat with the shop." },
  "បានទទួលការបញ្ជាទិញ។ ស្ថានភាពទូទាត់កំពុងរង់ចាំការផ្ទៀងផ្ទាត់។": { 'zh-CN': "订单已收到。付款状态正在等待确认。", en: "Order received. Payment status is pending verification." },
  "បានបញ្ជាទិញជោគជ័យ!": { 'zh-CN': "下单成功！", en: "Order placed successfully!" },
  "មិនអាចចូលតាម Telegram បានទេ។": { 'zh-CN': "无法通过 Telegram 登录。", en: "Could not sign in with Telegram." },
  "មិនអាចភ្ជាប់ Telegram បានទេ។": { 'zh-CN': "无法连接 Telegram。", en: "Could not connect to Telegram." },
  "មិនអាចចូលគណនីបានទេ។": { 'zh-CN': "无法登录账户。", en: "Could not sign in." },
  "មិនអាចរក្សាទុកទំនិញបានទេ។": { 'zh-CN': "无法保存商品。", en: "Could not save the item." },
  "លុបទំនិញ": { 'zh-CN': "删除商品", en: "Delete product" },
  "តើអ្នកពិតជាចង់លុបទំនិញនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។": { 'zh-CN': "确定要删除此商品吗？此操作无法撤销。", en: "Are you sure you want to delete this product? This action cannot be undone." },
  "មិនអាចផ្ញើសំណើតម្លៃបានទេ។": { 'zh-CN': "无法发送报价请求。", en: "Could not send the price offer." },
  "មិនអាចដាក់ពាក្យបានទេ។": { 'zh-CN': "无法提交申请。", en: "Could not submit the application." },
  "មិនអាចរក្សាទុក Profile បានទេ។": { 'zh-CN': "无法保存个人资料。", en: "Could not save the profile." },
  "មិនអាច Upload រូបភាពបានទេ។": { 'zh-CN': "无法上传图片。", en: "Could not upload the image." },
  "លុបប្រកាស": { 'zh-CN': "删除帖子", en: "Delete listing" },
  "បន្តសុពលភាពប្រកាស": { 'zh-CN': "续期帖子", en: "Renew listing" },
  "បញ្ចប់សុពលភាពប្រកាស": { 'zh-CN': "结束帖子有效期", en: "End listing" },
  "តើអ្នកចង់បន្តសកម្មភាពនេះមែនទេ?": { 'zh-CN': "确定要继续此操作吗？", en: "Do you want to continue this action?" },
  "បញ្ជាក់": { 'zh-CN': "确认", en: "Confirm" },
  "ប្រកាសនេះមានប្រវត្តិលក់ ដូច្នេះបានដាក់ Archive។": { 'zh-CN': "此帖子有销售记录，因此已归档。", en: "This listing has sales history, so it was archived." },
  "បានលុបប្រកាសរួចរាល់។": { 'zh-CN': "帖子已删除。", en: "Listing deleted." },
  "បាន Renew ប្រកាសជោគជ័យ។": { 'zh-CN': "帖子续期成功。", en: "Listing renewed successfully." },
  "បានបញ្ចប់សុពលភាពប្រកាស។": { 'zh-CN': "帖子有效期已结束。", en: "Listing has expired." },
  "មិនអាចធ្វើសកម្មភាពបានទេ។": { 'zh-CN': "无法执行此操作。", en: "Could not complete the action." },
  "មិនអាចកែប្រែប្រកាសបានទេ។": { 'zh-CN': "无法编辑帖子。", en: "Could not edit the listing." },
  "មិនអាចផ្ញើ OTP បានទេ។": { 'zh-CN': "无法发送验证码。", en: "Could not send the OTP." },
  "មិនអាចកែស្ថានភាពសំណើបានទេ។": { 'zh-CN': "无法更新请求状态。", en: "Could not update the request status." },
  "មិនអាចកែស្ថានភាពការបញ្ជាទិញបានទេ។": { 'zh-CN': "无法更新订单状态。", en: "Could not update the order status." },
  "ស្ថានភាពបច្ចុប្បន្ន៖ Maintenance": { 'zh-CN': "当前状态：维护中", en: "Current status: Maintenance" },
  "ស្ថានភាពបច្ចុប្បន្ន៖ កំពុងដំណើរការ": { 'zh-CN': "当前状态：运行中", en: "Current status: Operational" },
  "បានរក្សាទុក Maintenance Settings។": { 'zh-CN': "维护设置已保存。", en: "Maintenance settings saved." },
  "មិនអាចរក្សាទុក Maintenance Settings បានទេ។": { 'zh-CN': "无法保存维护设置。", en: "Could not save maintenance settings." },
  "មិនអាចនាំចូលផលិតផលបានទេ។": { 'zh-CN': "无法导入商品。", en: "Could not import products." },
  "មិនអាចស្វែងរករូបបានទេ។": { 'zh-CN': "无法搜索图片。", en: "Could not search for images." },
  "មិនអាចរក្សាទុកការសម្រេចបានទេ។": { 'zh-CN': "无法保存审核决定。", en: "Could not save the decision." },
  "Auto Sync បរាជ័យ។": { 'zh-CN': "自动同步失败。", en: "Auto Sync failed." },
  "បានអនុម័តការផ្លាស់ប្តូរ។": { 'zh-CN': "更改已获批准。", en: "Changes approved." },
  "បានបដិសេធការផ្លាស់ប្តូរ។": { 'zh-CN': "更改已被拒绝。", en: "Changes rejected." },
  "មិនអាចបង្កើតផលិតផលបានទេ។": { 'zh-CN': "无法创建商品。", en: "Could not create the product." },
  "ផលិតផលមានប្រវត្តិបញ្ជាទិញ ដូច្នេះបានលាក់ជំនួសការលុប។": { 'zh-CN': "该商品有订单记录，因此已隐藏而非删除。", en: "This product has order history, so it was hidden instead of deleted." },
  "បានលុបផលិតផលរួចរាល់។": { 'zh-CN': "商品已删除。", en: "Product deleted." },
  "មិនអាចលុបផលិតផលបានទេ។": { 'zh-CN': "无法删除商品。", en: "Could not delete the product." },
  "មិនអាចពិនិត្យពាក្យស្នើសុំបានទេ។": { 'zh-CN': "无法审核申请。", en: "Could not review the application." },
  "ទំនិញដែលបានរក្សាទុក": { 'zh-CN': "已收藏商品", en: "Saved items" },
  "តម្រងទំនិញ": { 'zh-CN': "商品筛选", en: "Product filters" },
  "ការងារទាំងអស់": { 'zh-CN': "所有职位", en: "All jobs" },
  "ការិយាល័យ និង រដ្ឋបាល": { 'zh-CN': "办公室与行政", en: "Office & Administration" },
  "លក់ និង ទីផ្សារ": { 'zh-CN': "销售与市场营销", en: "Sales & Marketing" },
  "ភោជនីយដ្ឋាន និង សណ្ឋាគារ": { 'zh-CN': "餐饮与酒店", en: "Restaurant & Hotel" },
  "សំណង់ និង វិស្វកម្ម": { 'zh-CN': "建筑与工程", en: "Construction & Engineering" },
  "អប់រំ": { 'zh-CN': "教育", en: "Education" },
  "សុខាភិបាល": { 'zh-CN': "医疗保健", en: "Healthcare" },
  "រោងចក្រ និង ផលិតកម្ម": { 'zh-CN': "工厂与制造", en: "Factory & Manufacturing" },
  "កសិកម្ម": { 'zh-CN': "农业", en: "Agriculture" },
  "សម្រស់ និង សេវាកម្ម": { 'zh-CN': "美容与服务", en: "Beauty & Services" },
  "ការងារផ្សេងៗ": { 'zh-CN': "其他职位", en: "Other jobs" },
  "ប្រភេទអចលនទ្រព្យ": { 'zh-CN': "房产类别", en: "Property types" },
  "អចលនទ្រព្យទាំងអស់": { 'zh-CN': "所有房产", en: "All properties" },
  "ផ្ទះលក់": { 'zh-CN': "待售房屋", en: "Houses for sale" },
  "ផ្ទះជួល": { 'zh-CN': "出租房屋", en: "Houses for rent" },
  "ខុនដូសម្រាប់លក់": { 'zh-CN': "待售公寓", en: "Condos for sale" },
  "អាផាតមិនសម្រាប់ជួល": { 'zh-CN': "出租公寓", en: "Apartments for rent" },
  "ដីលក់": { 'zh-CN': "待售土地", en: "Land for sale" },
  "ដីសម្រាប់ជួល": { 'zh-CN': "出租土地", en: "Land for rent" },
  "អចលនទ្រព្យពាណិជ្ជកម្មសម្រាប់លក់": { 'zh-CN': "待售商业地产", en: "Commercial property for sale" },
  "អចលនទ្រព្យពាណិជ្ជកម្មសម្រាប់ជួល": { 'zh-CN': "出租商业地产", en: "Commercial property for rent" },
  "បន្ទប់ជួល": { 'zh-CN': "出租房间", en: "Rooms for rent" },
  "ត្រូវការអចលនទ្រព្យ": { 'zh-CN': "求购房产", en: "Property wanted" },
  "សេវាកម្មភ្នាក់ងារ": { 'zh-CN': "中介服务", en: "Agent services" },
  "ផ្សេងទៀត": { 'zh-CN': "其他", en: "Other" },
  "មួយទឹក / ប្រើរួច": { 'zh-CN': "二手", en: "Used" },
  "ថ្មី": { 'zh-CN': "全新", en: "New" },
  "តម្រងលក្ខណៈបច្ចេកទេស": { 'zh-CN': "规格筛选", en: "Specification filters" },
  "តម្រៀបតម្លៃ": { 'zh-CN': "价格排序", en: "Sort by price" },
  "តម្លៃទាបទៅខ្ពស់": { 'zh-CN': "价格从低到高", en: "Price: low to high" },
  "តម្លៃខ្ពស់ទៅទាប": { 'zh-CN': "价格从高到低", en: "Price: high to low" },
  "បង្ហោះថ្មីៗ": { 'zh-CN': "最新发布", en: "Newest first" },
  "រកមិនឃើញទំនិញទេ": { 'zh-CN': "未找到商品", en: "No products found" },
  "សាកល្បងពាក្យស្វែងរក ឬប្រភេទផ្សេងទៀត។": { 'zh-CN': "请尝试其他搜索词或类别。", en: "Try another search term or category." },
  "បង្ហាញទំនិញទាំងអស់": { 'zh-CN': "显示所有商品", en: "Show all products" },
  "ស្វែងរកឱកាសការងារនៅកម្ពុជា": { 'zh-CN': "在柬埔寨寻找工作机会", en: "Find job opportunities in Cambodia" },
  "ស្វែងរកការងារ ឬក្រុមហ៊ុន...": { 'zh-CN': "搜索职位或公司...", en: "Search jobs or companies..." },
  "តម្រៀបការងារ": { 'zh-CN': "职位排序", en: "Sort jobs" },
  "មិនទាន់មានការងារបង្ហោះទេ": { 'zh-CN': "暂无职位发布", en: "No jobs posted yet" },
  "ការងារថ្មីៗនឹងបង្ហាញនៅទីនេះ នៅពេលនិយោជកចាប់ផ្តើមប្រកាសជ្រើសរើសបុគ្គលិក។": { 'zh-CN': "雇主开始招聘后，最新职位将在此显示。", en: "New jobs will appear here when employers start posting openings." },
  "ទំព័រដើម": { 'zh-CN': "首页", en: "Home" },
  "ព័ត៌មានលម្អិត": { 'zh-CN': "详情", en: "Details" },
  "ហាង": { 'zh-CN': "店铺", en: "Shop" },
  "កែរូប Cover": { 'zh-CN': "编辑封面图片", en: "Edit cover photo" },
  "គណនីអ្នកប្រើប្រាស់": { 'zh-CN': "用户账户", en: "User account" },
  "ចុះឈ្មោះក្លាយជាអ្នកលក់": { 'zh-CN': "注册成为卖家", en: "Register as a seller" },
  "ផលិតផលដែលអ្នកចាប់អារម្មណ៍": { 'zh-CN': "您感兴趣的商品", en: "Products you're interested in" },
  "ការទិញ និងសំណើតថ្លៃ": { 'zh-CN': "购买与议价请求", en: "Purchases & price offers" },
  "តាមដានប្រតិបត្តិការរបស់អ្នក": { 'zh-CN': "跟踪您的交易", en: "Track your transactions" },
  "ស្ថានភាពហាង": { 'zh-CN': "店铺状态", en: "Shop status" },
  "គ្រប់គ្រងការផ្ទៀងផ្ទាត់អ្នកលក់": { 'zh-CN': "管理卖家验证", en: "Manage seller verification" },
  "ការកំណត់គណនី": { 'zh-CN': "账户设置", en: "Account settings" },
  "ជ្រើសរើសផ្នែកដែលអ្នកចង់កែប្រែ។": { 'zh-CN': "选择您要编辑的部分。", en: "Choose the section you want to edit." },
  "ព័ត៌មានផ្ទាល់ខ្លួន": { 'zh-CN': "个人资料", en: "Personal information" },
  "កែឈ្មោះ លេខទូរស័ព្ទ ទីតាំង និងអំពីខ្ញុំ": { 'zh-CN': "编辑姓名、电话号码、位置和个人简介", en: "Edit name, phone, location and about me" },
  "សុវត្ថិភាពគណនី": { 'zh-CN': "账户安全", en: "Account security" },
  "ភ្ជាប់ Telegram, ទទួល OTP និងប្ដូរ Password": { 'zh-CN': "关联 Telegram、接收验证码并更改密码", en: "Connect Telegram, receive OTP and change password" },
  "កែប្រែបាន": { 'zh-CN': "可编辑", en: "Editable" },
  "ឈ្មោះពេញ": { 'zh-CN': "姓名", en: "Full name" },
  "លេខទូរស័ព្ទ": { 'zh-CN': "电话号码", en: "Phone number" },
  "PERSONAL INFORMATION": { 'zh-CN': "个人资料", en: "PERSONAL INFORMATION" },
  "ACCOUNT SECURITY": { 'zh-CN': "账户安全", en: "ACCOUNT SECURITY" },
  "ACCOUNT ACTIVITY": { 'zh-CN': "账户活动", en: "ACCOUNT ACTIVITY" },
  "SELLER CENTER": { 'zh-CN': "卖家中心", en: "SELLER CENTER" },
  "ADMIN CONTROL CENTER": { 'zh-CN': "管理控制中心", en: "ADMIN CONTROL CENTER" },
  "AURORA COMPUTER · PRODUCT MANAGEMENT": { 'zh-CN': "AURORA COMPUTER · 商品管理", en: "AURORA COMPUTER · PRODUCT MANAGEMENT" },
  "SMART PRODUCT GALLERY": { 'zh-CN': "智能商品图库", en: "SMART PRODUCT GALLERY" },
  "OFFICIAL SHOP MANAGEMENT": { 'zh-CN': "官方店铺管理", en: "OFFICIAL SHOP MANAGEMENT" },
  "SELLER REGISTRATION": { 'zh-CN': "卖家注册", en: "SELLER REGISTRATION" },
  "SELLER STUDIO": { 'zh-CN': "卖家工作室", en: "SELLER STUDIO" },
  "ភ្ជាប់ Telegram និងប្ដូរ Password": { 'zh-CN': "关联 Telegram 并更改密码", en: "Connect Telegram & change password" },
  "Telegram Login មិនទាន់ភ្ជាប់": { 'zh-CN': "Telegram 登录尚未关联", en: "Telegram Login not connected" },
  "ភ្ជាប់ Telegram ID ដើម្បីចូលគណនី 7inOne នៅពេលក្រោយ។": { 'zh-CN': "关联 Telegram ID，以便日后登录 7inOne 账户。", en: "Connect your Telegram ID to sign in to 7inOne later." },
  "Telegram Bot មិនទាន់ភ្ជាប់": { 'zh-CN': "Telegram 机器人尚未连接", en: "Telegram Bot not connected" },
  "ភ្ជាប់ Bot Chat ដើម្បីទទួល OTP និងសារសុវត្ថិភាព។": { 'zh-CN': "连接机器人聊天以接收验证码和安全通知。", en: "Connect the Bot chat to receive OTPs and security messages." },
  "បើក Telegram Bot ដើម្បីចុច Start": { 'zh-CN': "打开 Telegram Bot 并点击 Start", en: "Open the Telegram Bot and press Start" },
  "ពិនិត្យស្ថានភាពឡើងវិញ": { 'zh-CN': "重新检查状态", en: "Refresh status" },
  "ផ្ញើ OTP តាម Telegram": { 'zh-CN': "通过 Telegram 发送验证码", en: "Send OTP via Telegram" },
  "OTP ៦ ខ្ទង់": { 'zh-CN': "6 位验证码", en: "6-digit OTP" },
  "បញ្ចូលលេខកូដពី Telegram": { 'zh-CN': "输入 Telegram 中的验证码", en: "Enter the code from Telegram" },
  "Password ថ្មី": { 'zh-CN': "新密码", en: "New password" },
  "យ៉ាងតិច ៨ តួអក្សរ": { 'zh-CN': "至少 8 个字符", en: "At least 8 characters" },
  "ផ្ទៀងផ្ទាត់ និងប្ដូរ Password": { 'zh-CN': "验证并更改密码", en: "Verify & change password" },
  "សកម្មភាព និងការគ្រប់គ្រង": { 'zh-CN': "活动与管理", en: "Activity & management" },
  "ប្រវត្តិទិញ/តថ្លៃ": { 'zh-CN': "购买/议价记录", en: "Purchase/offer history" },
  "ប្រកាសរបស់ខ្ញុំ": { 'zh-CN': "我的帖子", en: "My listings" },
  "ហាងរបស់ខ្ញុំ": { 'zh-CN': "我的店铺", en: "My shop" },
  "គ្រប់គ្រងហាង & ទំនិញ": { 'zh-CN': "管理店铺和商品", en: "Manage shop & products" },
  "គ្រប់គ្រងការផ្សាយ និងតាមដានលទ្ធផលហាងរបស់អ្នក": { 'zh-CN': "管理商品发布并跟踪店铺表现", en: "Manage listings and track your shop performance" },
  "មើលផ្សារ": { 'zh-CN': "查看商城", en: "View marketplace" },
  "ហាងរបស់អ្នកមិនទាន់បានផ្ទៀងផ្ទាត់ទេ": { 'zh-CN': "您的店铺尚未通过验证", en: "Your shop is not verified yet" },
  "សូមដាក់ពាក្យស្នើសុំ ហើយរង់ចាំ Admin ពិនិត្យឯកសារ។": { 'zh-CN': "请提交申请并等待管理员审核文件。", en: "Please submit an application and wait for Admin to review your documents." },
  "ចុះឈ្មោះអ្នកលក់": { 'zh-CN': "注册卖家", en: "Register as seller" },
  "ហាងរបស់អ្នកមិនទាន់បានផ្ទៀងផ្ទាត់": { 'zh-CN': "您的店铺尚未验证", en: "Your shop is not verified" },
  "អ្នកអាចបន្តដាក់លក់បានធម្មតា។ ផ្ទៀងផ្ទាត់ដោយស្ម័គ្រចិត្ត ដើម្បីបង្កើនទំនុកចិត្ត។": { 'zh-CN': "您可以继续正常销售。自愿完成验证可提升买家信任。", en: "You can continue selling as usual. Voluntary verification can increase buyer trust." },
  "ស្នើសុំផ្ទៀងផ្ទាត់": { 'zh-CN': "申请验证", en: "Request verification" },
  "ទំនិញកំពុងលក់": { 'zh-CN': "在售商品", en: "Active listings" },
  "ចំនួនអ្នកមើល": { 'zh-CN': "浏览量", en: "Views" },
  "ពិន្ទុផ្កាយមធ្យម": { 'zh-CN': "平均星级", en: "Average rating" },
  "លក់បានជោគជ័យ": { 'zh-CN': "成功销售", en: "Successful sales" },
  "ផលិតផលរបស់ខ្ញុំ": { 'zh-CN': "我的商品", en: "My products" },
  "ព័ត៌មានហាង": { 'zh-CN': "店铺信息", en: "Shop information" },
  "ស្វែងរកតាមឈ្មោះទំនិញ...": { 'zh-CN': "按商品名称搜索...", en: "Search by product name..." },
  "កំពុងលក់": { 'zh-CN': "在售", en: "Active" },
  "ត្រូវការ Renew": { 'zh-CN': "需要续期", en: "Needs renewal" },
  "លក់រួច": { 'zh-CN': "已售出", en: "Sold" },
  "បន្ថែមទំនិញ": { 'zh-CN': "添加商品", en: "Add product" },
  "តម្លៃ": { 'zh-CN': "价格", en: "Price" },
  "ស្តុក & អ្នកមើល": { 'zh-CN': "库存和浏览量", en: "Stock & views" },
  "ស្ថានភាព & សុពលភាព": { 'zh-CN': "状态和有效期", en: "Status & validity" },
  "សកម្មភាព": { 'zh-CN': "操作", en: "Actions" },
  "ការបញ្ជាទិញ និងការដឹកជញ្ជូន": { 'zh-CN': "订单与配送", en: "Orders & delivery" },
  "សំណើតថ្លៃពីអ្នកទិញ": { 'zh-CN': "买家的议价请求", en: "Offers from buyers" },
  "រូប Cover ហាង": { 'zh-CN': "店铺封面", en: "Shop cover" },
  "រូប Cover ហាង (JPG / PNG / WEBP)": { 'zh-CN': "店铺封面图片（JPG / PNG / WEBP）", en: "Shop cover image (JPG / PNG / WEBP)" },
  "Logo ហាង (JPG / PNG / WEBP)": { 'zh-CN': "店铺 Logo（JPG / PNG / WEBP）", en: "Shop logo (JPG / PNG / WEBP)" },
  "ឈ្មោះហាង *": { 'zh-CN': "店铺名称 *", en: "Shop name *" },
  "ទីតាំងហាង": { 'zh-CN': "店铺位置", en: "Shop location" },
  "ឧ. បឹងកេងកង ភ្នំពេញ": { 'zh-CN': "例如：金边 BKK 区", en: "e.g. BKK, Phnom Penh" },
  "Bio ហាង / ណែនាំអំពីហាង": { 'zh-CN': "店铺简介 / 店铺介绍", en: "Shop bio / About the shop" },
  "សរសេរអំពីហាងរបស់អ្នក ទំនិញដែលមានលក់ សេវាកម្ម និងអ្វីដែលអតិថិជនគួរដឹង...": { 'zh-CN': "介绍您的店铺、在售商品、服务以及客户需要了解的信息...", en: "Describe your shop, products, services, and what customers should know..." },
  "Bio នេះនឹងបង្ហាញជាសាធារណៈនៅលើទំព័រហាងរបស់អ្នក (អតិបរមា 1,000 តួអក្សរ)។": { 'zh-CN': "此简介将公开显示在您的店铺页面（最多 1,000 个字符）。", en: "This bio will be public on your shop page (maximum 1,000 characters)." },
  "រក្សាទុកព័ត៌មានហាង": { 'zh-CN': "保存店铺信息", en: "Save shop information" },
  "ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ & អ្នកលក់": { 'zh-CN': "系统与卖家管理面板", en: "System & seller dashboard" },
  "សិទ្ធិអ្នកគ្រប់គ្រង": { 'zh-CN': "管理员权限", en: "Administrator access" },
  "ស្ថានភាពប្រព័ន្ធ (Maintenance Mode)": { 'zh-CN': "系统状态（维护模式）", en: "System status (Maintenance Mode)" },
  "បើកមុខងារកំពុងអភិវឌ្ឍន៍": { 'zh-CN': "启用维护模式", en: "Enable maintenance mode" },
  "ពេលបើក អ្នកទិញ និងអ្នកលក់មិនអាចប្រើ Marketplace បានទេ។": { 'zh-CN': "启用后，买家和卖家将无法使用 Marketplace。", en: "When enabled, buyers and sellers cannot use the Marketplace." },
  "សារជូនដំណឹង": { 'zh-CN': "通知消息", en: "Notice message" },
  "រក្សាទុកស្ថានភាព": { 'zh-CN': "保存状态", en: "Save status" },
  "ការកំណត់ Brand & Hero Banner": { 'zh-CN': "品牌与主视觉横幅设置", en: "Brand & Hero Banner settings" },
  "ផ្សារអនឡាញ": { 'zh-CN': "网上商城", en: "Online marketplace" },
  "ទិញលក់ងាយៗ នៅជិតអ្នក": { 'zh-CN': "轻松买卖，就在您身边", en: "Easy buying and selling near you" },
  "ស្វែងរកទំនិញ...": { 'zh-CN': "搜索商品...", en: "Find products..." },
  "Hero Images (1-3 រូប)": { 'zh-CN': "主视觉图片（1-3 张）", en: "Hero images (1–3 images)" },
  "ចំណងជើង Banner": { 'zh-CN': "横幅标题", en: "Banner title" },
  "អត្ថបទពិពណ៌នា Banner": { 'zh-CN': "横幅描述", en: "Banner description" },
  "លុបរូប Banner ចាស់ទាំងអស់": { 'zh-CN': "删除所有旧横幅图片", en: "Remove all previous banner images" },
  "គ្រប់គ្រង Poster ខាងស្ដាំ": { 'zh-CN': "管理右侧海报", en: "Manage right-side posters" },
  "Poster ផ្ដេក ១": { 'zh-CN': "横向海报 1", en: "Horizontal poster 1" },
  "Poster ផ្ដេក ២": { 'zh-CN': "横向海报 2", en: "Horizontal poster 2" },
  "Poster បញ្ឈរ": { 'zh-CN': "竖版海报", en: "Vertical poster" },
  "Link ពេលចុច https://...": { 'zh-CN': "点击时打开的链接 https://...", en: "Link to open when clicked https://..." },
  "បង្ហាញ Poster": { 'zh-CN': "显示海报", en: "Show poster" },
  "លុប Poster": { 'zh-CN': "删除海报", en: "Remove poster" },
  "រក្សាទុកការកំណត់ Brand & Banner": { 'zh-CN': "保存品牌和横幅设置", en: "Save brand & banner settings" },
  "ស្ថានភាព Telegram Bot": { 'zh-CN': "Telegram Bot 状态", en: "Telegram Bot status" },
  "ពិនិត្យ Bot, Channel និងសិទ្ធិផ្ទុករូបភាព។": { 'zh-CN': "检查 Bot、频道和图片上传权限。", en: "Check the Bot, channel, and image upload permissions." },
  "ពិនិត្យស្ថានភាព": { 'zh-CN': "检查状态", en: "Check status" },
  "ចុច «ពិនិត្យស្ថានភាព» ដើម្បីពិនិត្យការភ្ជាប់ Telegram។": { 'zh-CN': "点击“检查状态”以检查 Telegram 连接。", en: "Click “Check status” to test the Telegram connection." },
  "គ្រប់គ្រងផលិតផល AURORA Computer": { 'zh-CN': "管理 AURORA Computer 商品", en: "Manage AURORA Computer products" },
  "បញ្ជីផលិតផល ASUS ទាំងអស់រៀបជា List។ ចុចលើផលិតផលដើម្បីបើក Popup កែប្រែ។ ព័ត៌មាន Supplier បង្ហាញតែ Admin។": { 'zh-CN': "所有 ASUS 商品以列表显示。点击商品打开编辑弹窗。供应商信息仅管理员可见。", en: "All ASUS products are listed. Select a product to open the edit popup. Supplier details are Admin-only." },
  "ផ្ទុកឡើងវិញ": { 'zh-CN': "刷新", en: "Refresh" },
  "នាំចូលផលិតផលពី Supplier តាម URL": { 'zh-CN': "通过 URL 从供应商导入商品", en: "Import products from supplier URL" },
  "ស្កេនផលិតផល": { 'zh-CN': "扫描商品", en: "Scan products" },
  "ស្កេនឥឡូវនេះ": { 'zh-CN': "立即扫描", en: "Scan now" },
  "ការផ្លាស់ប្តូរដែលត្រូវការ Admin ពិនិត្យ": { 'zh-CN': "需要管理员审核的变更", en: "Changes requiring Admin review" },
  "កំពុងផ្ទុក...": { 'zh-CN': "加载中...", en: "Loading..." },
  "＋ បន្ថែមផលិតផលថ្មី": { 'zh-CN': "＋ 添加新商品", en: "＋ Add new product" },
  "បង្កើតផលិតផលថ្មី": { 'zh-CN': "创建新商品", en: "Create new product" },
  "ឈ្មោះផលិតផល *": { 'zh-CN': "商品名称 *", en: "Product name *" },
  "តម្លៃលក់ដំបូង ($) *": { 'zh-CN': "初始售价 ($) *", en: "Initial sale price ($) *" },
  "ស្តុកដំបូង": { 'zh-CN': "初始库存", en: "Initial stock" },
  "ពិពណ៌នា": { 'zh-CN': "描述", en: "Description" },
  "ឈ្មោះ Supplier": { 'zh-CN': "供应商名称", en: "Supplier name" },
  "បង្កើតផលិតផល": { 'zh-CN': "创建商品", en: "Create product" },
  "ស្វែងរកផលិតផល": { 'zh-CN': "搜索商品", en: "Search products" },
  "ស្វែងរកតាមឈ្មោះ ឬ Category...": { 'zh-CN': "按名称或类别搜索...", en: "Search by name or category..." },
  "ស្វែងរករូបផលិតផលបន្ថែម": { 'zh-CN': "搜索更多商品图片", en: "Find more product images" },
  "ស្វែងរកតាមឈ្មោះផលិតផល រួចពិនិត្យម៉ូដែល និងរូបភាពមុនអនុម័ត។ រូបដែលអនុម័តនឹង Upload ទៅ Telegram មុនបង្ហាញក្នុង Gallery។": { 'zh-CN': "按商品名称搜索，然后在批准前核对型号和图片。获批图片会先上传到 Telegram，再显示在图库中。", en: "Search by product name, then verify the model and image before approval. Approved images are uploaded to Telegram before appearing in the gallery." },
  "ស្វែងរកឈ្មោះផលិតផល...": { 'zh-CN': "搜索商品名称...", en: "Search product name..." },
  "វាយឈ្មោះផលិតផលដើម្បីចាប់ផ្តើម។": { 'zh-CN': "输入商品名称以开始。", en: "Enter a product name to begin." },
  "រូបភាពរង់ចាំ Admin អនុម័ត": { 'zh-CN': "等待管理员批准的图片", en: "Images awaiting Admin approval" },
  "គ្រប់គ្រងហាងផ្លូវការ": { 'zh-CN': "管理官方店铺", en: "Manage official shop" },
  "គ្រប់គ្រង AURORA Computer ដាច់ដោយឡែកពីហាងអ្នកលក់ធម្មតា។": { 'zh-CN': "将 AURORA Computer 与普通卖家店铺分开管理。", en: "Manage AURORA Computer separately from regular seller shops." },
  "មើលទំព័រហាង": { 'zh-CN': "查看店铺页面", en: "View shop page" },
  "កំពុងផ្ទុកព័ត៌មានហាង...": { 'zh-CN': "正在加载店铺信息...", en: "Loading shop information..." },
  "ការពិពណ៌នាហាង": { 'zh-CN': "店铺描述", en: "Shop description" },
  "មិនទាន់មាន Logo": { 'zh-CN': "尚无 Logo", en: "No logo yet" },
  "មិនទាន់មាន Cover": { 'zh-CN': "尚无封面", en: "No cover yet" },
  "កំពុងរង់ចាំ": { 'zh-CN': "待处理", en: "Pending" },
  "បានអនុម័ត": { 'zh-CN': "已批准", en: "Approved" },
  "បានបដិសេធ": { 'zh-CN': "已拒绝", en: "Rejected" },
  "ពាក្យស្នើសុំអ្នកលក់": { 'zh-CN': "卖家申请", en: "Seller applications" },
  "សូមស្វាគមន៍មកកាន់ 7inOne": { 'zh-CN': "欢迎来到 7inOne", en: "Welcome to 7inOne" },
  "បង្កើតគណនី": { 'zh-CN': "创建账户", en: "Create account" },
  "ឈ្មោះរបស់អ្នក": { 'zh-CN': "您的姓名", en: "Your name" },
  "លេខទូរស័ព្ទ ឬ អ៊ីមែល": { 'zh-CN': "电话号码或电子邮件", en: "Phone number or email" },
  "ពាក្យសម្ងាត់": { 'zh-CN': "密码", en: "Password" },
  "បញ្ចូលពាក្យសម្ងាត់": { 'zh-CN': "输入密码", en: "Enter password" },
  "លេខកូដផ្ទៀងផ្ទាត់ SMS": { 'zh-CN': "短信验证码", en: "SMS verification code" },
  "បញ្ចូលលេខកូដ SMS": { 'zh-CN': "输入短信验证码", en: "Enter SMS code" },
  "ឬ ចូលគណនីតាម Telegram": { 'zh-CN': "或使用 Telegram 登录", en: "Or sign in with Telegram" },
  "ប្រើលេខទូរស័ព្ទ ឬអ៊ីមែលដែលភ្ជាប់ជាមួយគណនី 7inOne របស់អ្នក។": { 'zh-CN': "使用与您的 7inOne 账户关联的电话号码或电子邮件。", en: "Use the phone number or email linked to your 7inOne account." },
  "ភ្លេច Password? សង្គ្រោះតាម Telegram": { 'zh-CN': "忘记密码？通过 Telegram 找回", en: "Forgot password? Recover via Telegram" },
  "Email គណនី 7inOne": { 'zh-CN': "7inOne 账户邮箱", en: "7inOne account email" },
  "Admin មិនទាន់ភ្ជាប់ Telegram?": { 'zh-CN': "管理员尚未连接 Telegram？", en: "Admin Telegram not connected yet?" },
  "Admin Recovery Key": { 'zh-CN': "管理员恢复密钥", en: "Admin recovery key" },
  "ភ្ជាប់ Telegram ទៅ Admin": { 'zh-CN': "将 Telegram 连接到管理员", en: "Connect Telegram to Admin" },
  "បើក Telegram Bot ហើយចុច Start": { 'zh-CN': "打开 Telegram Bot 并点击 Start", en: "Open Telegram Bot and press Start" },
  "ផ្ញើ OTP ទៅ Telegram": { 'zh-CN': "将验证码发送到 Telegram", en: "Send OTP to Telegram" },
  "បញ្ចូលលេខកូដ Telegram": { 'zh-CN': "输入 Telegram 验证码", en: "Enter Telegram code" },
  "ផ្ទៀងផ្ទាត់ និងសង្គ្រោះគណនី": { 'zh-CN': "验证并恢复账户", en: "Verify & recover account" },
  "ត្រឡប់ទៅចូលគណនី": { 'zh-CN': "返回登录", en: "Back to sign in" },
  "លេខទូរស័ព្ទ / Telegram *": { 'zh-CN': "电话号码 / Telegram *", en: "Phone number / Telegram *" },
  "អាសយដ្ឋានហាង *": { 'zh-CN': "店铺地址 *", en: "Shop address *" },
  "ឯកសារផ្ទៀងផ្ទាត់ (ជាជម្រើសសម្រាប់អ្នកចុះឈ្មោះថ្មី)": { 'zh-CN': "验证文件（新注册用户可选）", en: "Verification document (optional for new sellers)" },
  "ចុចដើម្បី Upload ឯកសារ": { 'zh-CN': "点击上传文件", en: "Click to upload document" },
  "បង្កើតហាង / ដាក់ស្នើផ្ទៀងផ្ទាត់": { 'zh-CN': "创建店铺 / 提交验证", en: "Create shop / submit verification" },
  "បន្ថែមទំនិញថ្មី": { 'zh-CN': "添加新商品", en: "Add new product" },
  "ឈ្មោះទំនិញ *": { 'zh-CN': "商品名称 *", en: "Product name *" },
  "តម្លៃ (USD) *": { 'zh-CN': "价格 (USD) *", en: "Price (USD) *" },
  "ប្រភេទ *": { 'zh-CN': "类别 *", en: "Category *" },
  "ជ្រើសរើសប្រភេទ": { 'zh-CN': "选择类别", en: "Select category" },
  "ផ្នែករង / Subcategory": { 'zh-CN': "子类别 / Subcategory", en: "Subcategory" },
  "ជ្រើសរើសផ្នែករង": { 'zh-CN': "选择子类别", en: "Select subcategory" },
  "ប្រភេទលម្អិត / Detailed Type": { 'zh-CN': "详细类型 / Detailed Type", en: "Detailed type" },
  "ជ្រើសរើសប្រភេទលម្អិត": { 'zh-CN': "选择详细类型", en: "Select detailed type" },
  "ទីតាំងផលិតផល * (ជ្រើសរើសដល់កម្រិតភូមិ)": { 'zh-CN': "商品位置 *（请选择到村级）", en: "Product location * (select down to village level)" },
  "ជ្រើសរើសរាជធានី/ខេត្ត": { 'zh-CN': "选择首都/省", en: "Select province" },
  "ជ្រើសរើសស្រុក/ខណ្ឌ": { 'zh-CN': "选择县/区", en: "Select district" },
  "ជ្រើសរើសឃុំ/សង្កាត់": { 'zh-CN': "选择乡/分区", en: "Select commune" },
  "ជ្រើសរើសភូមិ": { 'zh-CN': "选择村", en: "Select village" },
  "កំណត់ទីតាំងនេះជាលំនាំដើម": { 'zh-CN': "将此位置设为默认位置", en: "Set this as the default location" },
  "Google Maps Link (មិនបាច់បំពេញក៏បាន)": { 'zh-CN': "Google Maps 链接（选填）", en: "Google Maps link (optional)" },
  "YouTube Video Link (មិនបាច់បំពេញក៏បាន)": { 'zh-CN': "YouTube 视频链接（选填）", en: "YouTube video link (optional)" },
  "ភ្ជាប់វីដេអូ ១ ក្នុង Gallery · គាំទ្រ YouTube Video និង Shorts": { 'zh-CN': "在图库中添加 1 个视频 · 支持 YouTube 视频和 Shorts", en: "Add 1 video to the gallery · YouTube videos and Shorts supported" },
  "ប្រើរួចស្អាត": { 'zh-CN': "二手，状态良好", en: "Used, in good condition" },
  "ថ្មី ១០០%": { 'zh-CN': "全新 100%", en: "Brand new" },
  "ល្អដូចថ្មី": { 'zh-CN': "近乎全新", en: "Like new" },
  "ការពិពណ៌នាសង្ខេប (បង្ហាញលើកាតទំនិញ) *": { 'zh-CN': "简短描述（显示在商品卡片上）*", en: "Short description (shown on product card) *" },
  "សរសេរមួយបន្ទាត់ម្តងៗ (អតិបរមា ៣ បន្ទាត់)...": { 'zh-CN': "每行填写一条（最多 3 行）...", en: "Write one item per line (maximum 3 lines)..." },
  "ការពិពណ៌នាលម្អិត": { 'zh-CN': "详细描述", en: "Detailed description" },
  "សរសេរព័ត៌មានលម្អិតពេញលេញអំពីទំនិញ...": { 'zh-CN': "填写商品的完整详细信息...", en: "Write full details about the product..." },
  "រូបភាពទំនិញ (អតិបរមា ១០ រូប)": { 'zh-CN': "商品图片（最多 10 张）", en: "Product images (up to 10)" },
  "ជ្រើសរើសរូបភាពផលិតផល": { 'zh-CN': "选择商品图片", en: "Choose product images" },
  "JPG / PNG / WEBP · រូបនីមួយៗមិនលើស ២០MB": { 'zh-CN': "JPG / PNG / WEBP · 每张图片不超过 20MB", en: "JPG / PNG / WEBP · Each image up to 20MB" },
  "បន្ថែមរូប": { 'zh-CN': "添加图片", en: "Add image" },
  "កំពុង Upload រូបភាព...": { 'zh-CN': "正在上传图片...", en: "Uploading images..." },
  "ចុច «កំណត់ជារូបមេ» លើរូបដែលអ្នកចង់ឲ្យបង្ហាញមុនគេ។ អាចដាក់បានអតិបរមា ១០ រូប។": { 'zh-CN': "点击“设为主图”以选择首先显示的图片。最多可上传 10 张。", en: "Click “Set as main image” to choose the first image shown. Up to 10 images allowed." },
  "រក្សាទុកទំនិញ": { 'zh-CN': "保存商品", en: "Save product" },
  "តើអ្នកចង់បង្ហោះអ្វី?": { 'zh-CN': "您想发布什么？", en: "What would you like to post?" },
  "ជ្រើសរើសប្រភេទប្រកាស ដើម្បីបន្ត": { 'zh-CN': "选择帖子类型以继续", en: "Choose a listing type to continue" },
  "ផលិតផល": { 'zh-CN': "商品", en: "Product" },
  "ទំនិញថ្មី និងមួយទឹក": { 'zh-CN': "全新和二手商品", en: "New and used items" },
  "ការងារ": { 'zh-CN': "职位", en: "Jobs" },
  "ជ្រើសរើសបុគ្គលិក និងប្រកាសការងារ": { 'zh-CN': "招聘员工和发布职位", en: "Recruitment and job listings" },
  "ផ្ទះ ដី ខុនដូ និងអចលនទ្រព្យផ្សេងៗ": { 'zh-CN': "房屋、土地、公寓及其他房产", en: "Houses, land, condos and other properties" },
  "បង្ហោះប្រកាសការងារ": { 'zh-CN': "发布招聘信息", en: "Post a job" },
  "បំពេញព័ត៌មានការងារ និងលក្ខខណ្ឌជ្រើសរើស": { 'zh-CN': "填写职位信息和招聘要求", en: "Enter job details and requirements" },
  "មុខតំណែង / Job Title *": { 'zh-CN': "职位名称 / Job Title *", en: "Job title *" },
  "ក្រុមហ៊ុន / អ្នកជ្រើសរើស": { 'zh-CN': "公司 / 招聘方", en: "Company / Recruiter" },
  "ឈ្មោះក្រុមហ៊ុន": { 'zh-CN': "公司名称", en: "Company name" },
  "ទីតាំងការងារ * (ជ្រើសរើសដល់កម្រិតភូមិ)": { 'zh-CN': "工作地点 *（请选择到村级）", en: "Job location * (select down to village level)" },
  "ផ្នែករង": { 'zh-CN': "子类别", en: "Subcategory" },
  "ជ្រើសរើសមុខតំណែង": { 'zh-CN': "选择职位", en: "Select position" },
  "ពេញម៉ោង": { 'zh-CN': "全职", en: "Full-time" },
  "ក្រៅម៉ោង": { 'zh-CN': "兼职", en: "Part-time" },
  "កិច្ចសន្យា": { 'zh-CN': "合同制", en: "Contract" },
  "ហាត់ការ": { 'zh-CN': "实习", en: "Internship" },
  "ម៉ោងធ្វើការ": { 'zh-CN': "工作时间", en: "Work schedule" },
  "ឧ. 8:00 ព្រឹក - 5:00 ល្ងាច": { 'zh-CN': "例如：上午 8:00 - 下午 5:00", en: "e.g. 8:00 AM - 5:00 PM" },
  "ប្រាក់ខែអប្បបរមា (USD)": { 'zh-CN': "最低薪资 (USD)", en: "Minimum salary (USD)" },
  "ប្រាក់ខែអតិបរមា (USD)": { 'zh-CN': "最高薪资 (USD)", en: "Maximum salary (USD)" },
  "របៀបបង្ហាញប្រាក់ខែ": { 'zh-CN': "薪资周期", en: "Salary period" },
  "ប្រចាំខែ": { 'zh-CN': "每月", en: "Monthly" },
  "ប្រចាំម៉ោង": { 'zh-CN': "每小时", en: "Hourly" },
  "ចរចា": { 'zh-CN': "面议", en: "Negotiable" },
  "បទពិសោធន៍": { 'zh-CN': "工作经验", en: "Experience" },
  "កម្រិតសិក្សា": { 'zh-CN': "学历要求", en: "Education level" },
  "ឧ. 1-2 ឆ្នាំ / មិនទាមទារ": { 'zh-CN': "例如：1-2 年 / 不限", en: "e.g. 1–2 years / Not required" },
  "ឧ. បរិញ្ញាបត្រ / មិនកំណត់": { 'zh-CN': "例如：学士 / 不限", en: "e.g. Bachelor's degree / Not specified" },
  "ភ្ជាប់វីដេអូណែនាំការងារ (16:9)": { 'zh-CN': "添加职位介绍视频 (16:9)", en: "Attach a job introduction video (16:9)" },
  "ព័ត៌មានលម្អិត និងតួនាទីការងារ *": { 'zh-CN': "职位详情和工作职责 *", en: "Job details and responsibilities *" },
  "ពិពណ៌នាអំពីតួនាទី ភារកិច្ច និងលក្ខខណ្ឌ...": { 'zh-CN': "描述职位、职责和要求...", en: "Describe the role, responsibilities and requirements..." },
  "ជំនាញដែលត្រូវការ (បំបែកដោយសញ្ញាក្បៀស)": { 'zh-CN': "所需技能（用逗号分隔）", en: "Required skills (comma-separated)" },
  "អត្ថប្រយោជន៍ (បំបែកដោយសញ្ញាក្បៀស)": { 'zh-CN': "福利待遇（用逗号分隔）", en: "Benefits (comma-separated)" },
  "រូបភាពការងារ / Logo (JPG/PNG/WEBP · អតិបរមា ១០ រូប · 8MB/រូប)": { 'zh-CN': "职位图片 / Logo（JPG/PNG/WEBP · 最多 10 张 · 每张 8MB）", en: "Job images / Logo (JPG/PNG/WEBP · up to 10 · 8MB each)" },
  "ជ្រើសរើសរូបភាពច្រើន": { 'zh-CN': "选择多张图片", en: "Select multiple images" },
  "0 / ១០ រូបបានជ្រើសរើស": { 'zh-CN': "已选择 0 / 10 张图片", en: "0 / 10 images selected" },
  "មិនទាន់មានរូបភាពទេ": { 'zh-CN': "暂无图片", en: "No images yet" },
  "ជ្រើសរើសរូបភាពរហូតដល់ ១០ រូប": { 'zh-CN': "最多选择 10 张图片", en: "Select up to 10 images" },
  "រូបទី១ ជារូបមេ · អាចប្តូររូបមេ លុបរូប និងរៀបលំដាប់បាន": { 'zh-CN': "第 1 张为主图 · 可更换主图、删除图片和调整顺序", en: "Image 1 is the main image · Change the main image, delete and reorder images" },
  "បង្ហោះការងារ": { 'zh-CN': "发布职位", en: "Post job" },
  "បង្ហោះអចលនទ្រព្យ": { 'zh-CN': "发布房产", en: "Post property" },
  "ព័ត៌មានលក់ ជួល និងលក្ខណៈសម្បត្តិអចលនទ្រព្យ": { 'zh-CN': "填写出售、出租和房产属性信息", en: "Sale, rental and property details" },
  "ប្រភេទអចលនទ្រព្យ *": { 'zh-CN': "房产类别 *", en: "Property type *" },
  "ចំណងជើងប្រកាស *": { 'zh-CN': "帖子标题 *", en: "Listing title *" },
  "តម្លៃ (USD)": { 'zh-CN': "价格 (USD)", en: "Price (USD)" },
  "រយៈពេល / ប្រភេទតម្លៃ": { 'zh-CN': "价格周期 / 类型", en: "Price period / type" },
  "តម្លៃសរុប": { 'zh-CN': "总价", en: "Total price" },
  "ទំហំ (m²)": { 'zh-CN': "面积 (m²)", en: "Area (m²)" },
  "បន្ទប់គេង": { 'zh-CN': "卧室", en: "Bedrooms" },
  "បន្ទប់ទឹក": { 'zh-CN': "浴室", en: "Bathrooms" },
  "ទីតាំងអចលនទ្រព្យ * (ជ្រើសរើសដល់កម្រិតភូមិ)": { 'zh-CN': "房产位置 *（请选择到村级）", en: "Property location * (select down to village level)" },
  "បង្ហាញត្រឹមភូមិ": { 'zh-CN': "显示到村级", en: "Shown down to village level" },
  "ភ្ជាប់វីដេអូណែនាំអចលនទ្រព្យ (16:9)": { 'zh-CN': "添加房产介绍视频 (16:9)", en: "Attach a property introduction video (16:9)" },
  "ការពិពណ៌នាលម្អិត *": { 'zh-CN': "详细描述 *", en: "Detailed description *" },
  "ពិពណ៌នាព័ត៌មានលម្អិត...": { 'zh-CN': "填写详细信息...", en: "Describe the details..." },
  "រូបភាពអចលនទ្រព្យ (JPG/PNG/WEBP · អតិបរមា ១០ រូប · 8MB/រូប)": { 'zh-CN': "房产图片（JPG/PNG/WEBP · 最多 10 张 · 每张 8MB）", en: "Property images (JPG/PNG/WEBP · up to 10 · 8MB each)" },
  "ស្នើសុំតម្លៃរបស់អ្នក": { 'zh-CN': "提交您的报价", en: "Make your offer" },
  "តម្លៃដែលអ្នកចង់ទិញ (USD)": { 'zh-CN': "您的购买报价 (USD)", en: "Your offer price (USD)" },
  "សារជូនអ្នកលក់": { 'zh-CN': "给卖家的留言", en: "Message to seller" },
  "សួស្តី ខ្ញុំចាប់អារម្មណ៍លើទំនិញនេះ...": { 'zh-CN': "您好，我对这件商品感兴趣...", en: "Hello, I'm interested in this item..." },
  "ផ្ញើសំណើតម្លៃ": { 'zh-CN': "发送报价", en: "Send offer" },
  "ឆាតអ្នកទិញ និងអ្នកលក់": { 'zh-CN': "买家与卖家聊天", en: "Buyer & seller chat" },
  "សន្ទនាផ្ទាល់ជាមួយអ្នកលក់ និងអ្នកទិញ": { 'zh-CN': "与卖家和买家直接对话", en: "Chat directly with sellers and buyers" },
  "ត្រឡប់ទៅឆាតទាំងអស់": { 'zh-CN': "返回所有聊天", en: "Back to all chats" },
  "បិទសំឡេង": { 'zh-CN': "静音", en: "Mute" },
  "បង្រួមឆាត": { 'zh-CN': "收起聊天", en: "Minimize chat" },
  "ប្រអប់សារ": { 'zh-CN': "收件箱", en: "Inbox" },
  "ធ្វើបច្ចុប្បន្នភាព": { 'zh-CN': "刷新", en: "Refresh" },
  "កំពុងផ្ទុកសារ": { 'zh-CN': "正在加载消息", en: "Loading messages" },
  "ត្រឡប់ទៅប្រអប់សារ": { 'zh-CN': "返回收件箱", en: "Back to inbox" },
  "ជ្រើសរើសសន្ទនា": { 'zh-CN': "选择对话", en: "Select a conversation" },
  "ព័ត៌មានផលិតផលនឹងបង្ហាញនៅទីនេះ": { 'zh-CN': "商品信息将在此显示", en: "Product information will appear here" },
  "ជ្រើសរើសសន្ទនាមួយ ដើម្បីចាប់ផ្ដើម។": { 'zh-CN': "选择一个对话以开始。", en: "Select a conversation to start." },
  "ផ្ញើរូបភាព": { 'zh-CN': "发送图片", en: "Send image" },
  "សរសេរសារ…": { 'zh-CN': "输入消息...", en: "Write a message..." },
  "ផ្ញើសារ": { 'zh-CN': "发送消息", en: "Send message" },
  "មើលវីដេអូ YouTube": { 'zh-CN': "观看 YouTube 视频", en: "Watch YouTube video" },
  "វីដេអូប្រកាស": { 'zh-CN': "帖子视频", en: "Listing video" },
  "បិទវីដេអូ": { 'zh-CN': "关闭视频", en: "Close video" },
  "បិទរូបភាព": { 'zh-CN': "关闭图片", en: "Close image" },
  "រូបមុន": { 'zh-CN': "上一张", en: "Previous image" },
  "រូបបន្ទាប់": { 'zh-CN': "下一张", en: "Next image" },
  "រូបភាពទំនិញពង្រីក": { 'zh-CN': "放大的商品图片", en: "Enlarged product image" },
  "ប្រព័ន្ធកំពុងអភិវឌ្ឍន៍": { 'zh-CN': "系统正在维护", en: "System under maintenance" },
  "ទម្រង់អភិវឌ្ឍន៍ (Admin Preview)": { 'zh-CN': "维护模式（管理员预览）", en: "Maintenance mode (Admin preview)" },
  "ម៉ាក / Brand": { 'zh-CN': "品牌", en: "Brand" },
  "ពណ៌": { 'zh-CN': "颜色", en: "Color" },
  "ម៉ូដែល / Model": { 'zh-CN': "型号", en: "Model" },
  "ផ្ទះល្វែង": { 'zh-CN': "公寓", en: "Apartment" },
  "ផ្ទះអាជីវកម្ម": { 'zh-CN': "商业房屋", en: "Commercial property" },
  "ដីពាណិជ្ជកម្ម": { 'zh-CN': "商业用地", en: "Commercial land" },
  "ចំនួនជាន់": { 'zh-CN': "楼层数", en: "Number of floors" },
  "ចរចាប្រាក់ខែ": { 'zh-CN': "薪资面议", en: "Salary negotiable" },
  "ការិយាល័យ": { 'zh-CN': "办公室", en: "Office" },
  "ឃ្លាំង": { 'zh-CN': "仓库", en: "Warehouse" },
  "វីឡា": { 'zh-CN': "别墅", en: "Villa" },
  "ជំនាញបច្ចេកទេស": { 'zh-CN': "技术技能", en: "Technical skills" },
  "ភាសា": { 'zh-CN': "语言", en: "Language" },
  "វេនការងារ": { 'zh-CN': "工作班次", en: "Work shift" },
  "ប្លង់កម្មសិទ្ធិ": { 'zh-CN': "产权证", en: "Ownership title" },
  "ប្រាក់កក់": { 'zh-CN': "押金", en: "Deposit" },
  "ជាន់ទី": { 'zh-CN': "楼层", en: "Floor" },
  "ទាក់ទងសួរតម្លៃ": { 'zh-CN': "请联系询价", en: "Contact for price" },
  "មិនទាមទារ": { 'zh-CN': "不要求", en: "Not required" },
  "មិនទាមទារបទពិសោធន៍": { 'zh-CN': "无需经验", en: "No experience required" },
  "ប្រភេទរង": { 'zh-CN': "子类别", en: "Subcategory" },
  "ទំហំ": { 'zh-CN': "尺寸", en: "Size" },
  "មិនទាន់មានការពិពណ៌នាលម្អិតទេ។": { 'zh-CN': "暂无详细说明。", en: "No detailed description yet." },
  "ចម្លង Product ID": { 'zh-CN': "复制商品 ID", en: "Copy Product ID" },
  "ផ្សេងៗ": { 'zh-CN': "其他", en: "Other" },
  "កំពុងរក្សាទុក...": { 'zh-CN': "正在保存...", en: "Saving..." },
  "ផ្ទះ": { 'zh-CN': "房屋", en: "House" },
  "ដី": { 'zh-CN': "土地", en: "Land" },
  "ខុនដូ": { 'zh-CN': "公寓楼", en: "Condominium" },
  "ទំហំដី (m²)": { 'zh-CN': "土地面积 (m²)", en: "Land area (m²)" },
  "ទំហំសំណង់ (m²)": { 'zh-CN': "建筑面积 (m²)", en: "Building area (m²)" },
  "ប្រភេទប្លង់": { 'zh-CN': "产权类型", en: "Title type" },
  "សម្ភារៈ": { 'zh-CN': "家具", en: "Furnishing" },
  "ដីកសិកម្ម": { 'zh-CN': "农业用地", en: "Agricultural land" },
  "ដីឧស្សាហកម្ម": { 'zh-CN': "工业用地", en: "Industrial land" },
  "ដីចម្ការ": { 'zh-CN': "种植园土地", en: "Plantation land" },
  "វិញ្ញាបនបត្រ": { 'zh-CN': "证书", en: "Certificate" },
  "ប្រភេទផ្ទះ": { 'zh-CN': "房屋类型", en: "House type" },
  "ចំណតរថយន្ត": { 'zh-CN': "停车位", en: "Parking space" },
  "ទំហំមុខដី": { 'zh-CN': "土地临街宽度", en: "Land frontage" },
  "ទំហំបណ្តោយ": { 'zh-CN': "土地长度", en: "Land length" },
  "ផ្លូវចូល": { 'zh-CN': "通道", en: "Access road" },
  "ប្រភេទអាជីវកម្ម": { 'zh-CN': "业务类型", en: "Business type" },
  "ទំហំសំណង់": { 'zh-CN': "建筑面积", en: "Building size" },
  "ចំណត": { 'zh-CN': "停车位", en: "Parking" },
  "មិនអាចបើកសន្ទនាបានទេ។": { 'zh-CN': "无法打开聊天。", en: "Could not open the chat." },
  "ផលិតផលស្រដៀង": { 'zh-CN': "相似商品", en: "Similar products" },
  "ការតភ្ជាប់ Upload ត្រូវបានផ្អាក។": { 'zh-CN': "上传连接已暂停。", en: "The upload connection has been paused." },
  "ការបញ្ចូលរូបភាពត្រូវបានបោះបង់។": { 'zh-CN': "图片上传已取消。", en: "Image upload was cancelled." },
  "Cover របស់គណនី": { 'zh-CN': "账户封面", en: "Account cover" },
  "អ្នកលក់ផ្ទៀងផ្ទាត់": { 'zh-CN': "已认证卖家", en: "Verified seller" },
  "អ្នកលក់ទូទៅ · អាចផ្ទៀងផ្ទាត់ដោយស្ម័គ្រចិត្ត": { 'zh-CN': "普通卖家 · 可自愿申请认证", en: "Regular seller · Verification is optional" },
  "មិនទាន់មានការផុសទេ។ ចាប់ផ្ដើមចែករំលែកមុនគេ!": { 'zh-CN': "还没有帖子。来分享第一条吧！", en: "No posts yet. Be the first to share!" },
  "រូបភាពដែលបានផុស": { 'zh-CN': "已发布的图片", en: "Posted images" },
  "ផុស Story": { 'zh-CN': "发布动态", en: "Post a Story" },
  "ផុសរូបភាព": { 'zh-CN': "发布图片", en: "Post an image" },
  "ប្រើរួច": { 'zh-CN': "二手", en: "Used" },
  "ប្រកាសថ្មីៗទាំងអស់": { 'zh-CN': "所有最新帖子", en: "All recent posts" },
});
// Register the full Marketplace runtime dictionary with the shared locale gate.
// This ensures setLanguage() cannot switch to a partially translated locale.
(function registerMarketplaceRuntimeCatalogs() {
  const catalogs = { km: Object.create(null), 'zh-CN': Object.create(null), en: Object.create(null) };
  Object.entries(MARKETPLACE_UI_MESSAGES).forEach(([source, translations]) => {
    catalogs.km[source] = source;
    catalogs['zh-CN'][source] = translations['zh-CN'] || '';
    catalogs.en[source] = translations.en || '';
  });
  if (window.SiteI18n) {
    Object.entries(catalogs).forEach(([locale, catalog]) => window.SiteI18n.registerCatalog(locale, catalog));
    window.SiteI18n.registerRequiredKeys(Object.keys(MARKETPLACE_UI_MESSAGES));
  }
})();

function marketplaceUiText(value) {
  const source = String(value ?? '');
  const locale = window.SiteI18n?.locale || 'km';
  if (locale === 'km') return source;
  if (MARKETPLACE_UI_MESSAGES[source]?.[locale]) return MARKETPLACE_UI_MESSAGES[source][locale];
  const prefix = Object.keys(MARKETPLACE_UI_MESSAGES).find(key => key.endsWith('： ') && source.startsWith(key));
  return prefix ? MARKETPLACE_UI_MESSAGES[prefix][locale] + source.slice(prefix.length) : source;
}

/* --------------------------------------------------------------------------
   2. Application State
   -------------------------------------------------------------------------- */
const state = {
  supabase: null,
  session: null,
  sessionRefreshPromise: null,
  authRevision: 0,
  me: null,
  routeAccessReady: false,
  routeSyncGuardKey: '',
  routeSyncGuardTimer: null,
  routeSyncNavigationId: 0,
  scrollSaveTimer: null,

  // Marketplace
  products: [],
  productsRequestId: 0,
  jobs: [],
  jobsRequestId: 0,
  activeJobCategory: 'all',
  activeJobSubcategory: 'all',
  jobsSort: 'newest',
  savedIds: new Set(),
  favoritePending: new Set(),
  activeCategory: 'all',
  activeListingType: 'all',
  activePropertyType: 'all',
  activeCondition: 'all',
  marketplaceSort: 'newest',
  searchTerm: '',
  currentProduct: null,
  currentVendor: null,
  detailRequestId: 0,
  detailHydratedKey: null,
  currentVariantId: null,
  activeSpecFilters: {},
  activeSubcategory: 'all',
  activeDetailType: 'all',
  specPriceMin: '',
  specPriceMax: '',
  currentMarketplaceListing: null,
  productGalleryIndex: 0,
  productGalleryVideoActive: false,
  productLightboxOpen: false,
  productLightboxZoom: 1,

  // Storefront
  currentStoreId: null,
  currentStoreData: null,
  currentStoreProducts: [],
  currentStoreCategoryData: [],
  currentStoreCategory: 'all',
  currentStoreSubcategory: 'all',
  currentStoreSearch: '',
  currentStorePage: 1,
  currentStoreLimit: 50,
  currentStoreTotal: 0,
  currentStoreLoading: false,
  currentStoreSkeletonVisible: false,
  currentStoreLoadError: false,
  currentStoreMoreLoading: false,
  currentStoreMoreError: false,

  // Profile & Auth
  profileTab: 'saved',
  authMode: 'login',
  pendingPhone: null,
  telegramBotUsername: '',
  telegramLoginWidgetMounted: false,
  telegramProfileWidgetMounted: false,
  telegramAuthPending: false,
  myOrders: [],
  myPosts: [],
  myPostEditing: null,

  // Seller
  sellerProductCache: [],
  sellerActiveFilter: 'all',
  sellerActiveTab: 'products',
  currentOfferProduct: null,
  selectedProductImages: [],
  sellerDocPreviewUrl: null,

  // Branding & Maintenance
  maintenanceMode: false,
  maintenanceMessage: DEFAULT_MAINTENANCE_MSG,
  faviconUrl: '',
  siteBranding: {
    siteTitle: '7inOne',
    siteSubtitle: 'ផ្សារទិញលក់កម្ពុជា',
    heroBadge: 'ផ្សារអនឡាញសម្រាប់អ្នកទាំងអស់គ្នា',
    heroTitle: 'ទិញលក់ងាយៗ នៅជិតអ្នក',
    heroSubtitle: 'ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ឬដាក់លក់របស់ដែលអ្នកមិនប្រើ។ ភ្ជាប់អ្នកទិញ និងអ្នកលក់នៅទូទាំងប្រទេសកម្ពុជា។',
    siteLogoUrl: '',
    faviconUrl: '',
    heroImages: []
  },
  brandingLogoPreviewUrl: null,
  brandingFaviconPreviewUrl: null,
  brandingHeroPreviewUrls: [],
  siteBrandingRefreshTimer: null,

  // Presence & Realtime
  sitePresenceStarted: false,
  homeVendorMediaTimer: null,
  sitePresenceTimer: null,
  sitePresenceVisitorId: '',
  vendorPresenceIds: new Set(),
  vendorPresenceAnnouncedId: null,
  vendorPresencePollTimer: null,
  vendorPresenceHeartbeatTimer: null,
  vendorPresenceStarted: false,
  vendorPresenceTabId: (() => {
    try { return crypto.randomUUID(); }
    catch { return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2); }
  })(),
  productRealtimeChannel: null,
  productRealtimeRefreshTimer: null,
  productRealtimeFallbackTimer: null,
  productRealtimePendingRefresh: false,

  // Unified Chat
  chatChannel: null,
  chatPollTimer: null,
  chatInboxPollTimer: null,
  sellerInboxPollTimer: null,
  chatConversationId: null,
  chatMode: 'buyer',
  chatInbox: [],
  chatMuted: false,
  chatLastMessageId: null,
  chatInboxUnreadSnapshot: {},
  chatInboxInitialized: false,
  chatInboxUserId: null,
  chatLoadedMessages: [],
  chatPendingMedia: [],
  chatDraftProduct: null,
  chatConversation: null
};

/* --------------------------------------------------------------------------
   3. DOM & Formatting Utilities
   -------------------------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

const ic = (name, size = 17, extra = '') =>
  `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${extra}">${ICON_PATHS[name] || ICON_PATHS.spark}</svg>`;

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

const renderTelegramDiagnostics = (payload) => {
  const data = payload && typeof payload === 'object' ? payload : {};
  const readPath = (source, path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, source);
  const findValue = (paths) => {
    for (const path of paths) {
      const value = readPath(data, path);
      if (value !== undefined && value !== null) return value;
    }
    return undefined;
  };
  const statusInfo = (value) => {
    if (typeof value === 'boolean') return { ok: value, text: value ? 'ភ្ជាប់រួចរាល់' : 'មិនទាន់ភ្ជាប់' };
    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      const ok = /^(ok|success|connected|active|ready|available|running|healthy|true)$/i.test(value) || /connected|ready|active|success|running|ដំណើរការ|រួចរាល់/.test(normalized);
      const failed = /^(error|failed|disconnected|inactive|false|unavailable)$/i.test(value) || /error|fail|disconnect|inactive|unavailable|មិនដំណើរការ|បរាជ័យ/.test(normalized);
      return { ok: failed ? false : ok ? true : null, text: value };
    }
    if (value && typeof value === 'object') {
      const flag = value.ok ?? value.success ?? value.connected ?? value.available ?? value.active ?? value.running;
      const detail = value.status ?? value.message ?? value.name ?? value.title;
      if (typeof flag === 'boolean') return { ok: flag, text: detail ? String(detail) : flag ? 'ភ្ជាប់រួចរាល់' : 'មិនទាន់ភ្ជាប់' };
      if (typeof detail === 'string') return statusInfo(detail);
    }
    return { ok: null, text: 'មិនមានព័ត៌មាន' };
  };
  const rows = [
    { label: 'Bot Status', value: findValue(['bot.status','botStatus','bot_status','bot_connected','botConnected','bot']) },
    { label: 'Channel', value: findValue(['channel.status','channelStatus','channel_status','channel_accessible','channelAccessible','channel']) },
    { label: 'សិទ្ធិផ្ញើរូបភាព', value: findValue(['photoUpload','photo_upload','canSendPhotos','can_send_photos','permissions.can_send_photos','permissions.photos']) }
  ];
  const availableRows = rows.map((row) => ({ ...row, status: statusInfo(row.value) }));
  const details = findValue(['message','detail','description']);
  return '<div class="admin-telegram-diagnostics-list">' +
    availableRows.map((row) => {
      const status = row.status;
      const icon = status.ok === true ? '✓' : status.ok === false ? '✕' : '•';
      const stateClass = status.ok === true ? 'is-success' : status.ok === false ? 'is-error' : 'is-neutral';
      return '<div class="admin-telegram-diagnostics-row ' + stateClass + '"><span class="admin-telegram-diagnostics-label">' + esc(row.label) + '</span><strong><span class="admin-telegram-diagnostics-icon" aria-hidden="true">' + icon + '</span>' + esc(status.text) + '</strong></div>';
    }).join('') +
    (details ? '<p class="admin-telegram-diagnostics-note">' + esc(details) + '</p>' : '') +
    '</div>';
};

const money = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const fmtDate = (v) => v ? new Date(v).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

function timeAgoKm(dateStr) {
  if (!dateStr) return 'ថ្មីៗ';
  const timestamp = new Date(dateStr).getTime();
  if (!Number.isFinite(timestamp)) return 'ថ្មីៗ';
  const diff = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (diff < 60) return `${diff} នាទីមុន`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs} ម៉ោងមុន`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ថ្ងៃមុន`;
  return `${Math.floor(days / 7)} សប្តាហ៍មុន`;
}

function formatViews(value) {
  const num = Number(value || 0);
  return num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(num);
}


// Translate exact UI-owned text and accessible labels after dynamic views render.
// User-entered product, shop, profile, and chat content is intentionally excluded.
// Preserve each UI node's original source so locale changes can move in both directions.
const marketplaceOriginalText = new WeakMap();
const marketplaceOriginalAttributes = new WeakMap();
const MARKETPLACE_USER_CONTENT_SELECTOR = '[data-user-content], [contenteditable="true"], .product-title, .product-description, .storefront-title, .profile-display-name, .chat-message, .post-user-content, .user-generated';

function applyMarketplaceDynamicTranslations(root = document) {
  const locale = window.SiteI18n?.locale || 'km';
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement?.closest(MARKETPLACE_USER_CONTENT_SELECTOR)) return;
    if (!marketplaceOriginalText.has(node)) marketplaceOriginalText.set(node, node.nodeValue || '');
    const original = marketplaceOriginalText.get(node);
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = locale === 'km' ? trimmed : marketplaceUiTextForLocale(trimmed, locale);
    node.nodeValue = original.replace(trimmed, translated);
  });

  const attributeSelector = '[placeholder], [title], [aria-label]';
  const elements = [];
  if (root.nodeType === Node.ELEMENT_NODE && root.matches(attributeSelector)) elements.push(root);
  root.querySelectorAll?.(attributeSelector).forEach(el => elements.push(el));
  elements.forEach(el => {
    if (el.closest(MARKETPLACE_USER_CONTENT_SELECTOR)) return;
    let originals = marketplaceOriginalAttributes.get(el);
    if (!originals) {
      originals = Object.create(null);
      marketplaceOriginalAttributes.set(el, originals);
    }
    ['placeholder', 'title', 'aria-label'].forEach(attr => {
      const current = el.getAttribute(attr);
      if (current === null) return;
      if (!Object.prototype.hasOwnProperty.call(originals, attr)) originals[attr] = current;
      const original = originals[attr];
      const translated = locale === 'km' ? original : marketplaceUiTextForLocale(original, locale);
      if (translated !== current) el.setAttribute(attr, translated);
    });
  });
}

function marketplaceUiTextForLocale(value, locale) {
  const source = String(value ?? '');
  if (MARKETPLACE_UI_MESSAGES[source]?.[locale]) return MARKETPLACE_UI_MESSAGES[source][locale];
  const prefix = Object.keys(MARKETPLACE_UI_MESSAGES).find(key => key.endsWith('៖ ') && source.startsWith(key));
  return prefix ? MARKETPLACE_UI_MESSAGES[prefix][locale] + source.slice(prefix.length) : source;
}

function installMarketplaceDynamicTranslations() {
  const run = () => {
    applyMarketplaceDynamicTranslations(document.body);
    if (window.__7inoneLocaleObserver) window.__7inoneLocaleObserver.disconnect();
    window.__7inoneLocaleObserver = new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) applyMarketplaceDynamicTranslations(node);
          else if (node.nodeType === Node.TEXT_NODE && !node.parentElement?.closest('[data-user-content], [contenteditable="true"], .product-title, .product-description, .storefront-title, .profile-display-name, .chat-message, .post-user-content, .user-generated')) {
            if (!marketplaceOriginalText.has(node)) marketplaceOriginalText.set(node, node.nodeValue || '');
            const original = marketplaceOriginalText.get(node);
            const trimmed = original.trim();
            const locale = window.SiteI18n?.locale || 'km';
            const translated = locale === 'km' ? trimmed : marketplaceUiTextForLocale(trimmed, locale);
            if (trimmed) node.nodeValue = original.replace(trimmed, translated);
          }
        });
      });
    });
    window.__7inoneLocaleObserver.observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) run();
  else document.addEventListener('DOMContentLoaded', run, { once: true });
}
window.addEventListener('7inone:locale-change', () => applyMarketplaceDynamicTranslations(document.body));
installMarketplaceDynamicTranslations();

function toast(message, type = 'success') {
  message = marketplaceUiText(message);
  const area = $('toastArea');
  if (!area) return;
  area.innerHTML = '';
  const el = document.createElement('div');
  const styleClass = type === 'error'
    ? 'border-rose-200 bg-rose-50 text-rose-700'
    : type === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : 'border-slate-800 bg-slate-900 text-white';

  el.className = `toast pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-[11px] font-semibold ${styleClass}`;
  el.innerHTML = `<span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10">${ic(type === 'error' ? 'x' : 'check', 15)}</span><span class="flex-1">${esc(message)}</span><button aria-label="${esc(marketplaceUiText('បិទ'))}">${ic('x', 14)}</button>`;
  el.querySelector('button').onclick = () => el.remove();
  area.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function syncBodyScrollLock() {
  const shouldLock = Boolean(document.querySelector(
    '.modal.open, .admin-aurora-modal, .aurora-edit-overlay, ' +
    'dialog[open]:not(#homeShortsPopup), .product-lightbox.open, .seller-chat-image-preview'
  ));
  document.body.classList.toggle('overflow-hidden', shouldLock);
}

function openModal(id) {
  closeDropdowns();
  const modal = $(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  syncBodyScrollLock();
}

function closeModal(id) {
  const el = $(id);
  if (!el) return;
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  syncBodyScrollLock();
}

function appDialog({ mode = 'confirm', title = 'បញ្ជាក់សកម្មភាព', message = '', placeholder = 'សរសេរមូលហេតុនៅទីនេះ...', confirmLabel, danger = false } = {}) {
  title = marketplaceUiText(title);
  message = marketplaceUiText(message);
  placeholder = marketplaceUiText(placeholder);
  confirmLabel = confirmLabel ? marketplaceUiText(confirmLabel) : confirmLabel;
  return new Promise(resolve => {
    const id = 'appDialogModal';
    const previous = $(id);
    if (previous) previous.remove();
    const wrap = document.createElement('div');
    wrap.id = id;
    wrap.className = 'modal app-dialog-modal';
    wrap.setAttribute('aria-hidden', 'true');
    const isPrompt = mode === 'prompt';
    const field = isPrompt
      ? `<label class="app-dialog-field"><span>${esc(marketplaceUiText('មូលហេតុ'))}</span><textarea id="appDialogInput" class="field" rows="4" maxlength="1200" placeholder="${esc(placeholder)}"></textarea></label>`
      : '';
    wrap.innerHTML = `<section class="modal-box app-dialog-box" role="dialog" aria-modal="true" aria-labelledby="appDialogTitle" aria-describedby="appDialogMessage">
      <div class="app-dialog-heading"><span class="app-dialog-icon">${ic(isPrompt ? 'flag' : 'alert', 19)}</span><div><h2 id="appDialogTitle">${esc(title)}</h2><p id="appDialogMessage">${esc(message)}</p></div></div>
      <form id="appDialogForm" class="app-dialog-form" novalidate>${field}
        <div class="app-dialog-actions">
          <button type="button" class="app-dialog-cancel" id="appDialogCancel">${esc(marketplaceUiText('បោះបង់'))}</button>
          <button type="submit" class="app-dialog-submit ${danger ? 'is-danger' : ''}">${esc(confirmLabel || marketplaceUiText(isPrompt ? 'ផ្ញើរបាយការណ៍' : 'យល់ព្រម'))}</button>
        </div>
      </form>
    </section>`;
    document.body.appendChild(wrap);
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      closeModal(id);
      wrap.remove();
      document.removeEventListener('keydown', onKeyDown);
      resolve(value);
    };
    const onKeyDown = event => {
      if (event.key === 'Escape') finish(isPrompt ? null : false);
    };
    $('appDialogCancel').addEventListener('click', () => finish(isPrompt ? null : false));
    $('appDialogForm').addEventListener('submit', event => {
      event.preventDefault();
      const value = isPrompt ? $('appDialogInput').value.trim() : true;
      if (isPrompt && value.length < 3) { $('appDialogInput').setAttribute('aria-invalid','true'); $('appDialogInput').focus(); return; }
      finish(value);
    });
    wrap.addEventListener('click', event => {
      if (event.target === wrap) finish(isPrompt ? null : false);
    });
    document.addEventListener('keydown', onKeyDown);
    openModal(id);
    if (isPrompt) $('appDialogInput')?.focus();
  });
}

function closeDropdowns() {
  document.querySelectorAll('.dropdown').forEach((x) => x.classList.remove('open'));
}

function toggleDrop(id) {
  const el = $(id);
  if (!el) return;
  const open = el.classList.contains('open');
  closeDropdowns();
  if (!open) el.classList.add('open');
}

/* --------------------------------------------------------------------------
   4. API & Authentication Helpers
   -------------------------------------------------------------------------- */
async function api(path, options = {}) {
  const { authToken, ...fetchOptions } = options;
  const sessionAtRequest = state.session;
  const headers = new Headers(fetchOptions.headers || {});
  const requestToken = authToken !== undefined ? authToken : sessionAtRequest?.access_token;
  if (requestToken) headers.set('Authorization', 'Bearer ' + requestToken);
  else headers.delete('Authorization');

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const requestOptions = { ...fetchOptions, headers, cache: 'no-store' };
  let response = await fetch(path, requestOptions);
  let payload = {};
  try { payload = await response.json(); } catch {}

  if (response.status === 401 && sessionAtRequest?.refresh_token && state.supabase &&
      state.session?.user?.id === sessionAtRequest.user?.id &&
      (authToken === undefined || authToken === sessionAtRequest.access_token)) {
    try {
      if (!state.sessionRefreshPromise) {
        state.sessionRefreshPromise = state.supabase.auth.refreshSession()
          .then(({ data, error }) => {
            if (error) throw error;
            if (!data.session?.access_token) throw new Error('Invalid refreshed session');
            state.session = data.session;
            return state.session;
          })
          .finally(() => { state.sessionRefreshPromise = null; });
      }
      const refreshed = await state.sessionRefreshPromise;
      headers.set('Authorization', 'Bearer ' + refreshed.access_token);
      response = await fetch(path, requestOptions);
      payload = {};
      try { payload = await response.json(); } catch {}
    } catch (err) {
      console.warn('Session refresh failed:', err.message);
    }
  }

  if (!response.ok) throw new Error(payload.error || `សំណើមិនជោគជ័យ (${response.status})`);
  return payload;
}

async function apiUploadWithProgress(path, formData, onProgress, allowRefresh = true) {
  const send = () => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    if (state.session?.access_token) xhr.setRequestHeader('Authorization', 'Bearer ' + state.session.access_token);
    xhr.upload.addEventListener('progress', event => { if (event.lengthComputable && typeof onProgress === 'function') onProgress(Math.min(100, Math.round(event.loaded / event.total * 100))); });
    xhr.onload = () => { let payload = {}; try { payload = JSON.parse(xhr.responseText || '{}'); } catch {} resolve({ status: xhr.status, payload }); };
    xhr.onerror = () => reject(new Error('ការតភ្ជាប់ Upload ត្រូវបានផ្អាក។'));
    xhr.onabort = () => reject(new Error('ការបញ្ចូលរូបភាពត្រូវបានបោះបង់។'));
    xhr.send(formData);
  });
  let response = await send();
  if (response.status === 401 && allowRefresh && state.session?.refresh_token && state.supabase) {
    try { const { data, error } = await state.supabase.auth.refreshSession(); if (!error && data.session?.access_token) { state.session = data.session; response = await send(); } }
    catch (error) { console.warn('Upload session refresh failed:', error.message); }
  }
  if (response.status < 200 || response.status >= 300) throw new Error(response.payload.error || `Upload មិនជោគជ័យ (${response.status})`);
  return response.payload;
}

const isAdmin = () => Boolean(state.me?.isAdmin);
const isSellerAccount = () => Boolean(state.me?.vendor && state.me.vendor.status !== 'blocked');
const isVerifiedSeller = () => state.me?.vendor?.status === 'approved';
const isInternalAuthEmail = (email) => /@auth\.7inone\.invalid$/i.test(String(email || '').trim());
const profileName = () => state.me?.profile?.display_name || state.session?.user?.user_metadata?.display_name || (isInternalAuthEmail(state.session?.user?.email) ? '' : state.session?.user?.email?.split('@')[0]) || 'គណនីអ្នកប្រើប្រាស់';

function requireLogin() {
  if (state.session) return true;
  openAuth();
  return false;
}

async function loadIdentity(sessionSnapshot = state.session, revision = state.authRevision) {
  if (!sessionSnapshot?.access_token) {
    if (revision === state.authRevision) state.me = null;
    return null;
  }

  const res = await api('/api/me', { authToken: sessionSnapshot.access_token });
  // Ignore a delayed profile response after the user switches accounts or signs out.
  if (revision !== state.authRevision ||
      state.session?.user?.id !== sessionSnapshot.user?.id) return null;

  state.me = res.data;
  return res.data;
}

async function refreshSession() {
  if (!state.supabase) {
    state.session = null;
    state.me = null;
    syncHeader();
    applyMaintenanceUI();
    return false;
  }

  try {
    const { data, error } = await state.supabase.auth.getSession();
    if (error) throw error;
    state.session = data.session || null;
  } catch (error) {
    console.warn('Could not restore Supabase session:', error.message);
    state.session = null;
  }

  const revision = ++state.authRevision;
  const sessionSnapshot = state.session;

  if (sessionSnapshot) {
    try {
      await loadIdentity(sessionSnapshot, revision);
    } catch (error) {
      // A profile/API hiccup must not invalidate a valid Supabase login or block the storefront.
      if (revision === state.authRevision &&
          state.session?.user?.id === sessionSnapshot.user?.id) {
        console.warn('Could not load account profile:', error.message);
        state.me = {
          user: {
            id: sessionSnapshot.user?.id,
            email: sessionSnapshot.user?.email || null,
            phone: sessionSnapshot.user?.phone || null
          },
          profile: {
            display_name: sessionSnapshot.user?.user_metadata?.display_name
              || (isInternalAuthEmail(sessionSnapshot.user?.email) ? '' : sessionSnapshot.user?.email?.split('@')[0])
              || 'គណនីអ្នកប្រើប្រាស់'
          },
          vendor: null,
          isAdmin: false
        };
      }
    }
  } else {
    state.me = null;
  }

  syncHeader();
  applyMaintenanceUI();
  if (state.session) void syncVendorPresence();
  return Boolean(state.session);
}

/* --------------------------------------------------------------------------
   5. Navigation & Routing
   -------------------------------------------------------------------------- */
function showView(name, options = {}) {
  const allowed = ['home', 'profile', 'seller', 'admin', 'product', 'store'];
  if (!allowed.includes(name)) name = 'home';

  if (!options.optimistic) {
    if (['profile', 'seller'].includes(name) && !state.session) {
      openAuth();
      return Promise.resolve(false);
    }
    if (name === 'admin' && !isAdmin()) {
      if (options.fromHistory) name = 'home';
      else { toast('មុខងារនេះសម្រាប់ Admin ប៉ុណ្ណោះ។', 'error'); return Promise.resolve(false); }
    }
    if (name === 'seller' && !isSellerAccount()) {
      if (options.fromHistory) name = 'home';
      else {
        toast(state.me?.vendor?.status === 'blocked' ? 'ហាងនេះត្រូវបានបិទដោយ Admin។' : 'សូមចុះឈ្មោះបង្កើតហាងជាមុនសិន។', 'warning');
        if (!state.me?.vendor) openSellerModal();
        return Promise.resolve(false);
      }
    }
  }

  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  $('view-' + name)?.classList.add('active');
  document.querySelectorAll('#mobileMarketNav [data-view]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });
  document.querySelectorAll('#headerPrimaryNav [data-view]').forEach((btn) => {
    if (btn.dataset.view === name) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });

  document.documentElement.dataset.initialView = name;
  const routeHash = name === 'product'
    ? (state.currentProduct?.listing_type && ['job', 'real_estate'].includes(state.currentProduct.listing_type)
      ? 'product/' + encodeURIComponent(state.currentProduct.listing_type) + '/' + encodeURIComponent(state.currentProduct.id)
      : (state.currentProduct?.id ? 'product/' + encodeURIComponent(state.currentProduct.id) : (options.optimistic ? String(window.location.hash || '#product').replace(/^#/, '') : 'product')))
    : name === 'store'
      ? (state.currentStoreId ? 'store/' + encodeURIComponent(state.currentStoreId) : (options.optimistic ? String(window.location.hash || '#store').replace(/^#/, '') : 'store'))
      : name;

  try {
    sessionStorage.setItem('ecomstore.activeView', name);
    if (name === 'product' && state.currentProduct?.id) sessionStorage.setItem('ecomstore.currentProductId', String(state.currentProduct.id));
    if (name === 'store' && state.currentStoreId) sessionStorage.setItem('ecomstore.currentStoreId', String(state.currentStoreId));
  } catch {}

  if (!options.fromHistory && window.location.hash !== '#' + routeHash) {
    try { window.location.hash = '#' + routeHash; } catch {}
  }

  closeDropdowns();
  if (!options.preserveScroll) window.scrollTo({ top: 0, behavior: 'smooth' });

  const tasks = [];
  if (!options.deferLoad) {
    if (name === 'profile') tasks.push(renderProfile());
    if (name === 'seller') tasks.push(renderSeller());
    if (name === 'admin') tasks.push(renderAdmin());
    if (name === 'product') tasks.push(Promise.resolve().then(() => renderProductDetail()));
    if (name === 'store') tasks.push(Promise.resolve().then(() => renderStorefront()));
  }
  return Promise.all(tasks).then(() => true);
}

/* --------------------------------------------------------------------------
   6. Header, Branding & Maintenance UI
   -------------------------------------------------------------------------- */
function avatarFallbackMarkup(name = '') {
  const initial = Array.from(String(name || '').trim())[0] || '7';
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="emeraldAvatarGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#064E3B"/><stop offset="1" stop-color="#10B981"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(#emeraldAvatarGradient)"/><circle cx="50" cy="36" r="17" fill="#D1FAE5"/><path d="M16 94c3-21 16-32 34-32s31 11 34 32" fill="#A7F3D0"/><text x="50" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FFFFFF">${esc(initial)}</text></svg>`;
}

function setAvatar(target, url, name = '') {
  if (!target) return;
  const fallback = () => {
    target.classList.remove('shimmer-scan', 'is-loaded');
    target.classList.add('is-failed');
    target.innerHTML = avatarFallbackMarkup(name);
  };
  if (!url) { fallback(); return; }
  target.classList.add('img-scan-wrap', 'shimmer-scan');
  target.classList.remove('is-loaded', 'is-failed');
  target.innerHTML = `<img src="${esc(url)}" alt="" class="h-full w-full object-cover">`;
  const img = target.querySelector('img');
  if (img) {
    img.addEventListener('load', () => {
      target.classList.remove('shimmer-scan');
      target.classList.add('is-loaded');
    }, { once: true });
    img.addEventListener('error', fallback, { once: true });
    if (img.complete && img.naturalWidth > 0) {
      target.classList.remove('shimmer-scan');
      target.classList.add('is-loaded');
    }
  }
}

function setProfileCover(target, url = '') {
  if (!target) return;
  const current = target.querySelector(':scope > .profile-cover-image');
  if (!url) {
    current?.remove();
    target.style.backgroundImage = '';
    target.style.backgroundSize = '';
    target.style.backgroundPosition = '';
    target.style.backgroundRepeat = '';
    target.classList.remove('has-profile-cover');
    return;
  }
  target.style.backgroundImage = 'none';
  target.classList.add('has-profile-cover');
  const img = document.createElement('img');
  img.className = 'profile-cover-image';
  img.alt = 'Cover របស់គណនី';
  img.decoding = 'async';
  img.loading = 'eager';
  img.src = String(url);
  img.addEventListener('load', () => target.classList.add('has-profile-cover'), { once: true });
  img.addEventListener('error', () => {
    img.remove();
    target.style.backgroundImage = '';
    target.classList.remove('has-profile-cover');
    console.warn('Profile cover image failed to load:', String(url).slice(0, 180));
  }, { once: true });
  if (current) current.replaceWith(img);
  else target.insertBefore(img, target.firstChild);
}

function syncHeader() {
  const logged = Boolean(state.session);
  const seller = isSellerAccount();
  const verified = isVerifiedSeller();
  const admin = isAdmin();

  $('supportChatLauncher')?.classList.toggle('hidden', !logged);
  $('navName').textContent = logged ? profileName() : 'ភ្ញៀវ';
  $('menuUserName').textContent = logged ? profileName() : 'សួស្តី!';
  $('menuUserStatus').textContent = admin ? 'អ្នកគ្រប់គ្រង' : verified ? 'អ្នកលក់ផ្ទៀងផ្ទាត់' : seller ? 'អ្នកលក់ទូទៅ · អាចផ្ទៀងផ្ទាត់ដោយស្ម័គ្រចិត្ត' : logged ? 'អ្នកទិញ' : 'មិនទាន់ចូលគណនី';
  $('navRole').textContent = admin ? 'Admin' : seller ? 'Seller' : logged ? 'Buyer' : 'Guest';
  setAvatar($('navAvatar'), state.me?.profile?.avatar_url, profileName());

  $('postAdBtn').classList.toggle('hidden', !logged);
  $('mobilePostBtn').classList.toggle('hidden', !logged);

  const menu = $('profileMenu');
  menu.querySelector('[data-action="seller-dashboard"]').classList.toggle('hidden', !seller);
  menu.querySelector('[data-action="admin"]').classList.toggle('hidden', !admin);
  menu.querySelector('[data-action="profile"]').classList.toggle('hidden', !logged);
  menu.querySelector('[data-action="saved"]').classList.toggle('hidden', !logged);

  const accountAction = menu.querySelector('[data-action="login"],[data-action="logout"]');
  if (accountAction) {
    accountAction.textContent = logged ? 'ចាកចេញ' : 'ចូលគណនី';
    accountAction.dataset.action = logged ? 'logout' : 'login';
  }
}

function applyMaintenanceUI() {
  const adminPreview = state.maintenanceMode && isAdmin();
  const blocked = state.maintenanceMode && !isAdmin();
  document.body.classList.toggle('maintenance-active', blocked);
  $('maintenanceOverlay').classList.toggle('hidden', !blocked);
  $('maintenanceOverlay').setAttribute('aria-hidden', String(!blocked));
  $('maintenanceOverlayMessage').textContent = state.maintenanceMessage;
  $('maintenanceAdminPill').classList.toggle('hidden', !adminPreview);
  document.body.classList.add('maintenance-ready');
}

const DEFAULT_FAVICON_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232B74B8'/%3E%3Ctext x='32' y='47' font-family='Arial,sans-serif' font-size='44' font-weight='700' text-anchor='middle' fill='%23fff'%3E7%3C/text%3E%3C/svg%3E";

function applyFavicon(url) {
  let link = document.querySelector('link[data-site-favicon]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.dataset.siteFavicon = 'true';
    document.head.appendChild(link);
  }

  // Keep an immediate local fallback while the Admin-configured icon loads.
  if (!url) {
    link.type = 'image/svg+xml';
    link.href = DEFAULT_FAVICON_URL;
    return;
  }

  state.faviconUrl = url;
  link.onerror = () => {
    if (link.href !== DEFAULT_FAVICON_URL) {
      link.type = 'image/svg+xml';
      link.href = DEFAULT_FAVICON_URL;
    }
  };
  link.removeAttribute('type');
  link.href = url;
}

function applySiteBranding(data = {}) {
  state.siteBranding = { ...state.siteBranding, ...data };
  const b = state.siteBranding;
  const title = String(b.siteTitle || '7inOne');
  const subtitle = String(b.siteSubtitle || 'ផ្សារទិញលក់កម្ពុជា');

  document.title = `${title} · ${subtitle}`;
  if ($('siteTitle')) $('siteTitle').textContent = title;
  if ($('siteSubtitle')) $('siteSubtitle').textContent = subtitle;
  if ($('footerSiteTitle')) $('footerSiteTitle').textContent = title;
  if ($('footerSiteSubtitle')) $('footerSiteSubtitle').textContent = subtitle;

  const mark = $('siteLogoMark');
  if (mark) {
    if (b.siteLogoUrl) {
      mark.innerHTML = `<img src="${esc(b.siteLogoUrl)}" alt="" class="h-full w-full object-contain bg-white p-1">`;
      mark.querySelector('img')?.addEventListener('error', () => { mark.innerHTML = ic('bag', 20); }, { once: true });
    } else {
      mark.innerHTML = ic('bag', 20);
    }
  }

  const footerMark = $('footerLogoMark');
  if (footerMark) {
    footerMark.innerHTML = b.siteLogoUrl ? `<img src="${esc(b.siteLogoUrl)}" alt="" class="h-full w-full object-contain rounded-lg bg-white p-1">` : '7';
  }

  if (b.faviconUrl) applyFavicon(b.faviconUrl);

  renderHomeSidePosters();

}

function renderHomeSidePosters() {
  const rail = $('homeJobsRail');
  const target = rail?.querySelector('[data-promo-slot="tall"]');
  if (!target) return;

  const item = state.siteBranding.sidePosters?.tall;
  if (!item?.url || item.enabled === false) {
    target.hidden = true;
    target.replaceChildren();
    return;
  }

  const content = `<img src="${esc(item.url)}" alt="${esc(item.alt || '7inOne promotion')}" loading="lazy" />`;
  target.innerHTML = item.link
    ? `<a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">${content}</a>`
    : content;
  target.hidden = false;
  target.querySelector('img')?.addEventListener('error', () => {
    target.hidden = true;
  }, { once: true });
}

/* --------------------------------------------------------------------------
   7. Marketplace & Product Cards
   -------------------------------------------------------------------------- */
function productImage(p) {
  return (p.product_images || []).slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).find((x) => x.image_url)?.image_url || '';
}

function productCardShortCaption(product = {}) {
  let caption = productDescriptionParts(product).short;
  const title = String(product.title || '').trim();
  if (!caption || !title) return caption;

  const normalize = value => String(value || '').normalize('NFKC').toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, ' ').trim();
  const normalizedTitle = normalize(title);
  const leadingText = caption.slice(0, title.length);
  const afterTitle = caption.slice(title.length);

  if (normalize(leadingText) === normalizedTitle && (!afterTitle || /^[\s\-–—:|•]/u.test(afterTitle))) {
    caption = afterTitle.replace(/^\s*(?:[-–—:|•]\s*)?/, '').trim();
  }

  return caption.split(/\r?\n/)
    .filter(line => normalize(line) !== normalizedTitle)
    .join('\n').trim();
}

function productDescriptionParts(product = {}) {
  const raw = String(product.description || '');
  if (raw.includes(PRODUCT_DESC_SEPARATOR)) {
    const idx = raw.indexOf(PRODUCT_DESC_SEPARATOR);
    return {
      short: String(product.short_description || raw.slice(0, idx)).trim(),
      full: raw.slice(idx + PRODUCT_DESC_SEPARATOR.length).trim()
    };
  }
  const legacyMarker = '\n<!--MORE-->\n';
  if (raw.includes(legacyMarker)) {
    const idx = raw.indexOf(legacyMarker);
    return {
      short: String(product.short_description || raw.slice(0, idx)).trim(),
      full: raw.slice(idx + legacyMarker.length).trim()
    };
  }
  const legacyShort = String(product.short_description || raw.split(/\r?\n/).slice(0, 3).join('\n')).trim();
  return { short: Array.from(legacyShort).slice(0, 140).join(''), full: raw };
}

function normalizedProductSpecs(product = {}) {
  const listingSpecs = product.listing_details?.specifications && typeof product.listing_details.specifications === 'object'
    ? product.listing_details.specifications : {};
  const productSpecs = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};
  const specs = { ...listingSpecs, ...productSpecs };
  const detailType = String(product.detail_type || product.listing_details?.detail_type || '');
  const legacyKeys = detailType === 'Laptop'
    ? { cpu_model:'spec_0', ram_type_capacity:'spec_1', gpu_model_vram:'spec_2', storage_type_capacity:'spec_3', screen_size:'spec_4', battery_health:'spec_5' }
    : detailType === 'Desktop PC'
      ? { cpu_model:'spec_0', ram_type_capacity:'spec_1', gpu_model_vram:'spec_2', storage_type_capacity:'spec_3' }
      : {};
  for (const [key, legacy] of Object.entries(legacyKeys)) if (specs[key] == null && specs[legacy] != null) specs[key] = specs[legacy];
  return specs;
}
function supplierCaptionSpecs(product = {}) {
  const caption = productCardShortCaption(product);
  const aliases = {
    brand:'brand',manufacturer:'brand',make:'brand',model:'model',productmodel:'model',series:'series',
    cpu:'cpu',processor:'cpu',cpumodel:'cpu',processormodel:'cpu',
    ram:'ram',memory:'ram',memoryram:'ram',ramtypecapacity:'ram',
    ssd:'storage',storage:'storage',harddrive:'storage',hdd:'storage',storagetypecapacity:'storage',
    display:'display',displaysize:'display',screen:'display',screensize:'display',
    resolution:'resolution',displayresolution:'resolution',
    gpu:'gpu',graphics:'gpu',graphicscard:'gpu',graphicsprocessor:'gpu',gpumodelvram:'gpu',
    color:'color',colour:'color',battery:'battery',batterycapacity:'battery',
    batterylife:'battery_life',batteryhealth:'battery_health',weight:'weight',dimensions:'dimensions',size:'size',
    os:'os',operatingsystem:'os',warranty:'warranty',connectivity:'connectivity',
    capacity:'capacity',power:'power',material:'material',condition:'condition',
    voltage:'voltage',frequency:'frequency',speed:'speed',torque:'torque',mileage:'mileage',
    fueltype:'fuel_type',transmission:'transmission',engine:'engine',year:'year',
    gender:'gender',style:'style',fit:'fit',fabric:'material',
    storagecapacity:'storage_capacity',camera:'camera',cameras:'camera',
    waterresistance:'water_resistance',compatibility:'compatibility',warrantyperiod:'warranty'
  };
  const parsed = {};
  const add = (rawLabel, rawValue) => {
    const key = String(rawLabel || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const canonical = aliases[key];
    const value = String(rawValue || '').replace(/^[\s:：=-]+|[\s,;]+$/g, '').trim();
    if (canonical && value && !parsed[canonical]) parsed[canonical] = value;
  };
  for (const rawLine of caption.split(/\r?\n/)) {
    const line = rawLine.replace(/^\s*[-•*]\s*/, '').trim();
    if (!line) continue;
    for (const part of line.split(/\s*[|｜]\s*/)) {
      const match = part.match(/^([^:：=]+)\s*[:：=]\s*(.+)$/);
      if (match) add(match[1], match[2]);
    }
  }
  return parsed;
}

function renderProductUpgradePanel(product = {}) {
  // Upgrade information is displayed only when explicitly supplied in structured data.
  // Never infer RAM slots, maximum capacity, soldered memory, or replaceability from a product name.
  const sources = [
    product.listing_details?.specifications,
    product.specifications,
    product.listing_details?.upgradeability,
    product.upgradeability
  ].filter(source => source && typeof source === 'object' && !Array.isArray(source));
  const values = new Map();
  const aliases = {
    ramtype:'ram_type', memorytype:'ram_type', ddrtype:'ram_type',
    ramonboard:'ram_onboard', onboardram:'ram_onboard', solderedram:'ram_onboard',
    ramslots:'ram_slots', memoryslots:'ram_slots',
    ramslotsused:'ram_slots_used', ramslotsfree:'ram_slots_free', freeramslots:'ram_slots_free',
    maxram:'ram_max', maximumram:'ram_max', maxmemory:'ram_max', maximummemory:'ram_max',
    ramupgrade:'ram_upgrade', memoryupgrade:'ram_upgrade',
    m2slots:'ssd_slots', m2slotcount:'ssd_slots', storageslots:'ssd_slots', ssdslots:'ssd_slots',
    freem2slots:'ssd_slots_free', storageslotsfree:'ssd_slots_free', ssdslotsfree:'ssd_slots_free',
    storageupgrade:'ssd_upgrade', ssdupgrade:'ssd_upgrade', maxstorage:'ssd_max',
    pcieversion:'pcie_version', satabay:'sata_bay',
    cpuupgrade:'cpu_upgrade', cpusocket:'cpu_socket',
    gpuupgrade:'gpu_upgrade', gputype:'gpu_type',
    wificard:'wifi_card', wifiupgrade:'wifi_upgrade',
    batteryreplaceable:'battery_replaceable', batteryupgrade:'battery_replaceable',
    coolingsystem:'cooling', coolingupgrade:'cooling_upgrade', fancount:'fan_count',
    ports:'ports', expansionports:'ports'
  };
  const clean = key => String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const canonical = aliases[clean(key)];
      if (canonical && value != null && String(value).trim()) values.set(canonical, String(value).trim());
    }
  }
  const groups = [
    { key:'ram', title:'RAM Upgrade', icon:'package', fields:[['ram_type','ប្រភេទ RAM'],['ram_onboard','RAM ជាប់ Board'],['ram_slots','ចំនួន RAM Slot'],['ram_slots_used','Slot កំពុងប្រើ'],['ram_slots_free','Slot ទំនេរ'],['ram_max','RAM អតិបរមា'],['ram_upgrade','លទ្ធភាព Upgrade']] },
    { key:'ssd', title:'SSD / Storage Upgrade', icon:'hard-drive', fields:[['ssd_slots','ចំនួន M.2 Slot'],['ssd_slots_free','Slot ទំនេរ'],['pcie_version','PCIe Version'],['sata_bay','SATA Bay'],['ssd_max','Storage អតិបរមា'],['ssd_upgrade','លទ្ធភាព Upgrade']] },
    { key:'cpu', title:'CPU Upgrade', icon:'cpu', fields:[['cpu_socket','CPU Socket'],['cpu_upgrade','លទ្ធភាព Upgrade']] },
    { key:'gpu', title:'GPU / Graphics', icon:'monitor', fields:[['gpu_type','ប្រភេទ GPU'],['gpu_upgrade','លទ្ធភាព Upgrade']] },
    { key:'wireless', title:'Wi-Fi Card', icon:'wifi', fields:[['wifi_card','Wi-Fi Card'],['wifi_upgrade','លទ្ធភាពប្តូរ']] },
    { key:'battery', title:'Battery', icon:'battery-charging', fields:[['battery_replaceable','អាចប្តូរថ្មបានឬទេ']] },
    { key:'cooling', title:'Cooling System', icon:'fan', fields:[['cooling','ប្រព័ន្ធ Cooling'],['fan_count','ចំនួន Fan'],['cooling_upgrade','ការថែទាំ / Upgrade']] },
    { key:'ports', title:'Ports & Expansion', icon:'plug', fields:[['ports','រន្ធភ្ជាប់ / Expansion']] }
  ];
  const cards = groups.map(group => {
    const present = group.fields.filter(([key]) => values.has(key));
    if (!present.length) return '';
    const explicitStatus = values.get(group.key === 'ram' ? 'ram_upgrade' : group.key === 'ssd' ? 'ssd_upgrade' : group.key === 'cpu' ? 'cpu_upgrade' : group.key === 'gpu' ? 'gpu_upgrade' : group.key === 'wireless' ? 'wifi_upgrade' : group.key === 'battery' ? 'battery_replaceable' : group.key === 'cooling' ? 'cooling_upgrade' : '');
    const status = explicitStatus ? `<span class="upgrade-status">${esc(explicitStatus)}</span>` : '';
    return `<article class="upgrade-detail-card"><header><span class="upgrade-detail-icon">${ic(group.icon,17)}</span><b>${esc(group.title)}</b>${status}</header><dl>${present.map(([key,label])=>`<div><dt>${esc(label)}</dt><dd>${esc(values.get(key))}</dd></div>`).join('')}</dl></article>`;
  }).filter(Boolean).join('');
  return `<aside class="product-upgrade-panel"><div class="product-upgrade-heading"><span>${ic('wrench',18)}</span><div><h3>Upgrade & Expandability</h3><p>ព័ត៌មានអំពីការបន្ថែម និងការប្តូរគ្រឿងបន្លាស់</p></div></div>${cards || '<div class="upgrade-data-empty"><b>មិនទាន់មានព័ត៌មាន Upgrade ដែលបានផ្ទៀងផ្ទាត់</b><p>ត្រូវការលេខម៉ូដែលពេញលេញ និងឯកសារបច្ចេកទេសរបស់ក្រុមហ៊ុន ដើម្បីបញ្ជាក់ RAM ជាប់ Board, Slot, SSD និងគ្រឿងបន្លាស់ដែលអាច Upgrade បាន។</p></div>'}<p class="upgrade-data-note">${ic('shield',13)} បង្ហាញតែព័ត៌មានដែលមានក្នុងទិន្នន័យបច្ចេកទេសដែលបានបញ្ជាក់ប៉ុណ្ណោះ។</p></aside>`;
}

function productDetailSpecEntries(product = {}) {
  // Technical specifications must come from explicit structured fields only.
  // Do not infer specs from the narrative description or supplier marketing copy.
  const raw = {
    ...normalizedProductSpecs(product),
    ...(product.listing_details?.specifications || {}),
    ...(product.specifications || {})
  };
  const aliases = {
    condition:'condition', brand:'brand', manufacturer:'brand', make:'brand',
    model:'model', productmodel:'model', series:'series',
    cpu:'cpu', processor:'cpu', cpumodel:'cpu', processormodel:'cpu',
    ram:'ram', memory:'ram', memoryram:'ram', ramtypecapacity:'ram',
    storage:'storage', ssd:'storage', hdd:'storage', harddrive:'storage',
    storagetypecapacity:'storage', storagecapacity:'storage',
    display:'display', screen:'display', screensize:'display', displaysize:'display',
    resolution:'resolution', displayresolution:'resolution',
    gpu:'gpu', graphics:'gpu', graphicscard:'gpu', graphicsprocessor:'gpu',
    gpumodel:'gpu', gpumodelvram:'gpu',
    battery:'battery', batterycapacity:'battery', batterylife:'battery_life',
    batteryhealth:'battery_health', weight:'weight', color:'color', colour:'color',
    os:'os', operatingsystem:'os', warranty:'warranty', warrantyperiod:'warranty',
    dimensions:'dimensions', size:'dimensions', connectivity:'connectivity',
    camera:'camera', cameras:'camera', material:'material', waterresistance:'water_resistance'
  };
  const cleanKey = key => String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const values = new Map();
  for (const [key, value] of Object.entries(raw)) {
    if (value == null || typeof value === 'object' ||
        ['fullspecs','fullspecification','specificationsfull','description'].includes(cleanKey(key))) continue;
    const canonical = aliases[cleanKey(key)];
    if (!canonical) continue;
    const parts = String(value).split(/\s*[|｜]\s*/);
    let parsedPair = false;
    for (const part of parts) {
      const pair = part.match(/^([^:：=]+)\s*[:：=]\s*(.+)$/);
      const pairKey = pair ? aliases[cleanKey(pair[1])] : '';
      const text = String(pair?.[2] ?? '').trim().replace(/^[:：=\-\s]+|[,;\s]+$/g, '');
      if (pairKey && text && !/^(?:n\/a|none|null|undefined|មិនបានបញ្ជាក់|not specified)$/i.test(text) && !values.has(pairKey)) {
        values.set(pairKey, text);
        parsedPair = true;
      }
    }
    const text = String(value).trim().replace(/^[:：=\-\s]+|[,;\s]+$/g, '');
    if (!parsedPair && text && !/^(?:n\/a|none|null|undefined|មិនបានបញ្ជាក់|not specified)$/i.test(text) && !values.has(canonical)) {
      values.set(canonical, text);
    }
  }
  const labels = {
    condition:'ស្ថានភាព', brand:'ម៉ាក', model:'ម៉ូដែល', series:'ស៊េរី',
    cpu:'CPU', ram:'RAM', storage:'SSD', display:'អេក្រង់',
    resolution:'កម្រិតបង្ហាញ', gpu:'ក្រាហ្វិក (GPU)', battery:'ថ្ម',
    battery_health:'សុខភាពថ្ម', battery_life:'អាយុកាលថ្ម', weight:'ទម្ងន់',
    color:'ពណ៌', os:'ប្រព័ន្ធប្រតិបត្តិការ', connectivity:'ការតភ្ជាប់',
    camera:'កាមេរ៉ា', water_resistance:'ធន់នឹងទឹក', material:'សម្ភារៈ',
    warranty:'ការធានា', dimensions:'វិមាត្រ'
  };
  const order = [
    'condition','brand','model','series','cpu','ram','storage','display',
    'resolution','gpu','battery','battery_health','battery_life','weight',
    'color','os','connectivity','camera','water_resistance','material',
    'dimensions'
  ];
  const seen = new Set();
  return order.filter(key => {
    const value = values.get(key);
    if (!value || seen.has(value.toLowerCase())) return false;
    seen.add(value.toLowerCase());
    return true;
  }).map(key => [labels[key], values.get(key)]);
}

function productDetailContentParts(description = '') {
  const narrative = [];
  const promotions = [];
  const freeGifts = [];
  const warranty = [];
  const lines = String(description || '').replace(/\r/g, '').split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { narrative.push(''); continue; }
    const clean = line.replace(/^[-•*]\s*/, '').replace(/^\*\*(.*?)\*\*\s*/, '$1 ').trim();
    const freeMatch = clean.match(/^(?:free|free gift|gift|កាដូ|អំណោយ|ឈុតពិសេសក្នុងប្រអប់|របស់មានក្នុងប្រអប់|included in (?:the )?box)\s*[:：-]\s*(.+)$/i);
    const promotionMatch = clean.match(/^(?:promotion|offer|upgrade|ប្រូម៉ូសិន|ការផ្តល់ជូន|ការដំឡើងបន្ថែម)\s*[:：-]\s*(.+)$/i);
    const warrantyMatch = clean.match(/^(?:warranty|ការធានា|រយៈពេលធានា)\s*[:：-]\s*(.+)$/i);
    if (freeMatch) freeGifts.push(freeMatch[1].trim());
    else if (promotionMatch) promotions.push(promotionMatch[1].trim());
    else if (warrantyMatch) warranty.push(warrantyMatch[1].trim());
    else narrative.push(rawLine);
  }
  return {
    narrative: narrative.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    promotions: [...new Set(promotions.filter(Boolean))],
    freeGifts: [...new Set(freeGifts.filter(Boolean))],
    warranty: [...new Set(warranty.filter(Boolean))]
  };
}

function productGiftIcon(giftName = '') {
  const value = String(giftName || '').toLowerCase();
  if (/mouse\s*pad|mousepad|ម៉ៅស៍\s*ផេត|បន្ទះ\s*(?:ម៉ៅស៍|កណ្ដុរ)/.test(value)) return 'mousePad';
  if (/cleaning\s*kit|cleaner|cleaning|សម្អាត|ដប/.test(value)) return 'cleaningBottle';
  const wireless = /wireless|bluetooth|2\.?4\s*(?:ghz|g)|ឥតខ្សែ|គ្មានខ្សែ/.test(value);
  const wired = /\bwired\b|usb[- ]?cable|with cable|មានខ្សែ|ខ្សែភ្ជាប់/.test(value);
  if (/mouse|ម៉ៅស៍|កណ្ដុរ/.test(value)) return wireless === wired ? 'mouse' : wireless ? 'mouseWireless' : 'mouseWired';
  if (/keyboard|ក្ដារចុច/.test(value)) return 'keyboard';
  if (/headset|headphone|earphone|កាស/.test(value)) return 'headphones';
  if (/usb|flash drive|memory stick|ថាសចល័ត/.test(value)) return 'usb';
  if (/charger|adapter|ឆ្នាំងសាក/.test(value)) return 'charger';
  if (/speaker|បំពងសំឡេង/.test(value)) return 'speaker';
  if (/monitor|screen|អេក្រង់/.test(value)) return 'monitor';
  if (/bag|backpack|កាបូប/.test(value)) return 'bag';
  return 'package';
}

function renderProductGiftCard(gifts = []) {
  if (!Array.isArray(gifts) || !gifts.length) return '';
  const expandedGifts = gifts.flatMap(gift => {
    const value = String(gift || '').trim();
    if (!value) return [];
    const combo = value.match(/^(.*?)\b(Keyboard)\s*&\s*(Mouse)$/i);
    if (combo) {
      const sharedPrefix = combo[1];
      return [sharedPrefix + combo[2], sharedPrefix + combo[3]];
    }
    return value
      .split(/[,;|\n]+/)
      .flatMap(part => part.trim().split(/(?=Cleaning\s*Kit\b|Mouse\s*Pad\b)/i))
      .map(part => part.trim())
      .filter(Boolean);
  });
  const items = expandedGifts.map((gift, index) => {
    const item = '<span class="product-gift-entry">' +
      '<span class="product-gift-name">' + esc(gift) + '</span></span>';
    const plus = index < expandedGifts.length - 1
      ? '<span class="product-gift-plus" aria-hidden="true">' + ic('plus', 13) + '</span>'
      : '';
    return item + plus;
  }).join('');
  const animatedGiftBox = '<svg class="product-gift-heading-icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">' +
    '<path class="gift-box-body" d="M4.5 12.2h19v12h-19zM3.5 9h21v4h-21z" />' +
    '<path class="gift-box-ribbon" d="M14 9v15M14 8.8C10.2 8.8 7.8 7.5 7.8 5.5c0-1.4 1.1-2.3 2.5-2.3 2.2 0 3.7 2.4 3.7 5.6ZM14 8.8c3.8 0 6.2-1.3 6.2-3.3 0-1.4-1.1-2.3-2.5-2.3-2.2 0-3.7 2.4-3.7 5.6Z" />' +
    '<path class="gift-box-lid" d="M3.5 8.8 6 5.8l8 2.8 8-2.8 2.5 3" />' +
    '</svg>';
  return '<section class="product-short-gift-card" aria-label="ថែមកាដូសម្រាប់អ្នក"><h3>' +
    animatedGiftBox + ' ថែមកាដូសម្រាប់អ្នក</h3><div class="product-gift-flow">' + items + '</div></section>';
}
function renderProductDescriptionHtml(value = '') {
  const lines = String(value || '').replace(/\r/g, '').split('\n');
  const renderInline = text => esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const blocks = [];
  let paragraph = [];
  let bullets = [];
  const flushParagraph = () => {
    if (paragraph.length) blocks.push('<p>' + paragraph.map(renderInline).join('<br>') + '</p>');
    paragraph = [];
  };
  const flushBullets = () => {
    if (bullets.length) blocks.push('<ul>' + bullets.map(item => '<li>' + renderInline(item) + '</li>').join('') + '</ul>');
    bullets = [];
  };
  for (const line of lines) {
    const trimmed = line.trim();
    const bullet = trimmed.match(/^[-•]\s+(.+)$/);
    if (!trimmed) { flushParagraph(); flushBullets(); continue; }
    if (bullet) { flushParagraph(); bullets.push(bullet[1]); }
    else { flushBullets(); paragraph.push(trimmed); }
  }
  flushParagraph();
  flushBullets();
  return blocks.join('');
}

function productCardSpecs(product = {}) {
  const specs = { ...supplierCaptionSpecs(product), ...normalizedProductSpecs(product) };
  const entries = Object.entries(specs).filter(([key, value]) => {
    const normalizedKey = String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
    return value !== undefined && value !== null && typeof value !== 'object' && String(value).trim() &&
      !['googlemapurl','url','imageurl','videourl'].includes(normalizedKey) &&
      !/^spec[0-9]+$/.test(normalizedKey);
  });
  const normalized = Object.fromEntries(entries.map(([key, value]) => [String(key).toLowerCase().replace(/[^a-z0-9]/g, ''), String(value).trim()]));
  const find = keys => {
    for (const key of keys) {
      const value = normalized[key.replace(/[^a-z0-9]/gi, '').toLowerCase()];
      if (value) return value;
    }
    return '';
  };
  const detailType = String(product.detail_type || product.listing_details?.detail_type || '').toLowerCase();
  const isComputer = /laptop|desktop|computer|pc/.test(detailType) ||
    String(product.category || '').toLowerCase() === 'computers';
  if (isComputer) {
    const cpu = find(['cpu_model','processor_model','cpu','processor']);
    const ram = find(['ram_type_capacity','memory_ram','ram','memory']);
    const storage = find(['storage_type_capacity','hard_drive','storage','ssd','hdd']);
    const display = find(['display_size','screen_size','display','screen']);
    const gpu = find(['gpu_model_vram','graphics_card','graphics_processor','gpu','graphics']);
    const ramLine = [ram, storage ? 'SSD: ' + storage : ''].filter(Boolean).join(' | ');
    return [
      ['CPU', cpu],
      [ram ? 'RAM' : (storage ? 'SSD' : ''), ramLine],
      ['Display', display],
      ['GPU', gpu]
    ].filter(([, value]) => value).slice(0, 4);
  }
  const labels = {
    brand:'Brand', manufacturer:'Brand', model:'Model', color:'Color', colour:'Color',
    cpu:'CPU', processor:'CPU', cpumodel:'CPU', processormodel:'CPU',
    ram:'RAM', memory:'RAM', memoryram:'RAM', ramtypecapacity:'RAM',
    storage:'Storage', ssd:'SSD', hdd:'HDD', harddrive:'Storage', storagetypecapacity:'Storage',
    display:'Display', displaysize:'Display', screen:'Display', screensize:'Display',
    gpu:'GPU', graphics:'Graphics', graphicscard:'Graphics', graphicsprocessor:'Graphics', gpumodelvram:'GPU',
    battery:'Battery', batterycapacity:'Battery', batterylife:'Battery Life', batteryhealth:'Battery Health',
    weight:'Weight', dimensions:'Dimensions', material:'Material', size:'Size',
    resolution:'Resolution', displayresolution:'Resolution', operatingsystem:'OS', os:'OS',
    warranty:'Warranty', connectivity:'Connectivity', capacity:'Capacity', power:'Power'
  };
  return entries.map(([key, value]) => {
    const normalizedKey = String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
    const label = labels[normalizedKey] || String(key).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, char => char.toUpperCase());
    return [label, String(value).trim()];
  }).filter(([label, value]) => label && value).slice(0, 4);
}
function specFilterValue(product, keys) {
  const specs = normalizedProductSpecs(product);
  const normalized = Object.fromEntries(Object.entries(specs).map(([key, value]) => [String(key).toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
  for (const key of keys) {
    const value = normalized[key.replace(/[^a-z0-9]/gi, '').toLowerCase()];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return '';
}
function renderCategorySpecFilters() {
  const root = $('specificationFilters');
  const group = $('specificationFilterGroup');
  if (!root || !group) return;
  const definitions = [
    ['brand','ម៉ាក',['brand','manufacturer']],['cpu','CPU',['cpu','processor','cpu_model','processor_model']],
    ['ram','RAM',['ram','memory','memory_ram','ram_type_capacity']],['storage','Storage',['storage','ssd','hard_drive','capacity','storage_type_capacity']],
    ['display','Display Size',['display','display_size','screen','screen_size']],['gpu','GPU',['gpu','graphics','graphics_card','graphics_processor','gpu_model_vram']],
    ['color','Color',['color','colour']],['resolution','Resolution',['resolution','display_resolution']],['os','Operating System',['operating_system','os']]
  ];
  const products = state.products.filter(item => item.listing_type === 'product');
  const subcategories = [...new Set(products.map(item => String(item.subcategory || '').trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  const subcategoryProducts = state.activeSubcategory === 'all' ? products : products.filter(item => String(item.subcategory || '') === state.activeSubcategory);
  const detailTypes = [...new Set(subcategoryProducts.map(item => String(item.detail_type || '').trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b));
  const scopedProducts = state.activeDetailType === 'all' ? subcategoryProducts : subcategoryProducts.filter(item => String(item.detail_type || '') === state.activeDetailType);
  const sections = definitions.map(([key,label,aliases]) => {
    const values = [...new Set(scopedProducts.map(item => specFilterValue(item,aliases)).filter(Boolean))].sort((a,b) => a.localeCompare(b));
    if (!values.length) return '';
    const selected = new Set(state.activeSpecFilters[key] || []);
    return `<div class="spec-filter-field"><b>${label}</b><div>${values.map(value => `<label><input type="checkbox" data-spec-filter="${key}" value="${esc(value)}" ${selected.has(value) ? 'checked' : ''}><span>${esc(value)}</span></label>`).join('')}</div></div>`;
  }).join('');
  const hasPrice = scopedProducts.some(item => Number.isFinite(Number(item.display_price ?? item.price)) && Number(item.display_price ?? item.price) > 0);
  const subcategorySelect = subcategories.length ? '<div class="spec-filter-field"><b>ផ្នែករង / Subcategory</b><div><select data-subcategory-filter><option value="all">ទាំងអស់</option>' + subcategories.map(value => '<option value="' + esc(value) + '"' + (state.activeSubcategory === value ? ' selected' : '') + '>' + esc(value) + '</option>').join('') + '</select></div></div>' : '';
  const detailTypeSelect = detailTypes.length ? '<div class="spec-filter-field"><b>ប្រភេទលម្អិត / Detailed Type</b><div><select data-detail-type-filter><option value="all">ទាំងអស់</option>' + detailTypes.map(value => '<option value="' + esc(value) + '"' + (state.activeDetailType === value ? ' selected' : '') + '>' + esc(value) + '</option>').join('') + '</select></div></div>' : '';
  group.hidden = !sections && !hasPrice && !subcategorySelect && !detailTypeSelect;
  root.innerHTML = subcategorySelect + detailTypeSelect + (sections || '') + (hasPrice ? '<div class="spec-filter-field spec-price-filter"><b>Price Range ($)</b><div><input type="number" min="0" step="1" data-price-filter="min" placeholder="Min" value="' + esc(state.specPriceMin) + '"><input type="number" min="0" step="1" data-price-filter="max" placeholder="Max" value="' + esc(state.specPriceMax) + '"></div></div>' : '');
}
function verifiedStoreBadge(vendorId, showKhmerLabel = false) {
  const id = String(vendorId || '');
  const onlineClass = id && state.vendorPresenceIds.has(id) ? ' is-online' : '';
  const label = showKhmerLabel ? '<span class="verified-store-label">បានផ្ទៀងផ្ទាត់</span>' : '';
  const points = Array.from({ length: 24 }, (_, idx) => {
    const angle = (-90 + idx * 15) * Math.PI / 180;
    const radius = idx % 2 === 0 ? 10.7 : 9.45;
    return `${idx === 0 ? 'M' : 'L'}${(12 + Math.cos(angle) * radius).toFixed(2)} ${(12 + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(' ') + ' Z';

  return `<span class="verified-store-badge${onlineClass}" data-vendor-id="${esc(id)}"><span class="badge-container" tabindex="0" aria-label="បានផ្ទៀងផ្ទាត់"><svg class="verified-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${points}" fill="currentColor" stroke="currentColor" stroke-width=".45" stroke-linejoin="round"/><path d="m7.8 12.2 2.7 2.7 5.8-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="badge-tooltip" role="tooltip">បានផ្ទៀងផ្ទាត់</span></span></span>${label}`;
}

function displayProductCode(product = {}) {
  const savedCode=String(product.product_code||'').trim();
  if(savedCode)return savedCode;
  const compact=String(product.id||'').replace(/-/g,'').toUpperCase();
  return compact ? 'P-'+compact.slice(0,12) : 'P-UNKNOWN';
}
async function copyProductCode(button) {
  const code=String(button?.dataset.copyProductCode||'').trim();
  if(!code)return;
  try{
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(code);
    else{
      const field=document.createElement('textarea');field.value=code;field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();
      const copied=document.execCommand('copy');field.remove();if(!copied)throw new Error('Copy unavailable');
    }
    const original=button.innerHTML;
    const originalLabel=button.getAttribute('aria-label');
    const originalTitle=button.getAttribute('title');
    button.innerHTML=ic('check',13);
    button.setAttribute('aria-label','បានចម្លង Product ID');
    button.setAttribute('title','បានចម្លង');
    button.classList.add('is-copied');
    setTimeout(()=>{
      if(!button.isConnected)return;
      button.innerHTML=original;
      if(originalLabel===null)button.removeAttribute('aria-label');else button.setAttribute('aria-label',originalLabel);
      if(originalTitle===null)button.removeAttribute('title');else button.setAttribute('title',originalTitle);
      button.classList.remove('is-copied');
    },1200);
  }catch{toast('មិនអាចចម្លង Product ID បានទេ។','error')}
}

// Handle marketplace card image states without inline HTML event attributes.
document.addEventListener('load', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.cd-main, .cd-secondary')) return;
  image.parentElement?.classList.add('is-loaded');
}, true);

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.cd-main, .cd-secondary')) return;
  if (image.dataset.retryAttempted !== '1') {
    image.dataset.retryAttempted = '1';
    setTimeout(() => {
      if (!image.isConnected) return;
      image.src = image.src + (image.src.includes('?') ? '&r=1' : '?r=1');
    }, 1500);
    return;
  }
  image.parentElement?.classList.add('is-failed', 'image-failed');
  image.style.display = 'none';
}, true);

function productCard(p, index) {
  const images = (p.product_images || []).filter((item) => item.image_url).sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  const image = images[0]?.image_url || '';
  const secondImage = images[1]?.image_url || '';
  const saved = state.savedIds.has(p.id);
  const vendorName = p.vendors?.store_name || 'ហាងអ្នកលក់';
  const vendorLogo = p.vendors?.store_logo_url || '';
  const verified = p.vendors?.status === 'approved';
  const cardSpecs = productCardSpecs(p);
  const description = productCardShortCaption(p) || cardSpecs.map(([label, value]) => `${label}: ${value}`).join('\n');
  const cardPrice = p.display_price ?? p.price;

  const location = p.location || 'ភ្នំពេញ';
  return `
  <article class="cd" style="animation-delay:${Math.min(index, 12) * 30}ms">
    <div class="ph im">
      <button class="absolute inset-0 z-[1] h-full w-full" type="button" data-action="view" data-id="${esc(p.id)}" aria-label="មើល ${esc(p.title)}"></button>
      ${image
        ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-main-wrap"><img src="${esc(image)}" alt="${esc(p.title)}" loading="lazy" decoding="async" class="cd-main"></span>${secondImage ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-secondary-wrap"><img src="${esc(secondImage)}" alt="" loading="lazy" decoding="async" class="cd-secondary"></span>` : ''}`
        : ic('image', 36)}
      <button class="hv heart ${saved ? 'saved' : ''}" type="button" data-action="save" data-id="${esc(p.id)}" aria-label="រក្សាទុក" aria-pressed="${saved ? 'true' : 'false'}">
        ${ic('bookmark', 17)}
      </button>
    </div>
    <div class="cb">
      <h3 class="cursor-pointer hover:text-emerald-800" data-action="view" data-id="${esc(p.id)}">${esc(p.title)}</h3>
      <p class="pr"><span>${money(cardPrice)}</span></p>
      ${description ? `<p class="cd-description">${esc(description)}</p>` : ''}
      <div class="sh">
        <span class="sp" role="img" aria-label="រូប Logo ហាង">
          <span class="sp-fallback">${ic('user', 15)}</span>
          ${vendorLogo ? `<img src="${esc(vendorLogo)}" alt="${esc(vendorName)}" loading="lazy" decoding="async">` : ''}
        </span>
        <button type="button" class="sn text-left hover:underline" data-action="store" data-vendor-id="${esc(p.vendor_id)}">${esc(vendorName)}</button>
        ${verified ? verifiedStoreBadge(p.vendor_id) : ''}
      </div>
      <p class="mt">
        <span class="cd-time-meta">${timeAgoKm(p.created_at)}</span>
        <span class="cd-location-meta">${ic('pin', 11)}<span>${esc(location)}</span></span>
        <span class="vw" title="ចំនួនអ្នកមើល">${ic('eye', 13)}${formatViews(p.view_count)}</span>
      </p>
    </div>
  </article>`;
}


function marketplaceCard(item, index) {
  if (item.listing_type === 'product') return productCard(item, index);
  const labels = { job: 'ការងារ', real_estate: 'អចលនទ្រព្យ' };
  const image = item.image_url || '';
  const period = item.listing_type === 'job'
    ? ({hourly:' / ម៉ោង',daily:' / ថ្ងៃ',monthly:' / ខែ',negotiable:''}[item.salary_period] || '')
    : item.real_estate_type?.endsWith('_rent')
      ? ({daily:' / ថ្ងៃ',monthly:' / ខែ',yearly:' / ឆ្នាំ'}[item.rent_period] || '') : '';
  const price = item.listing_type === 'job'
    ? (item.price_label === 'ចរចា' ? 'ចរចាប្រាក់ខែ' : '$' + String(item.price_label).replace(' - ', ' - $') + period)
    : item.listing_type === 'real_estate' && item.price_label == null ? 'ទាក់ទងសួរតម្លៃ' : money(item.price_label) + period;
  const description = String(item.short_description || item.description || '').trim().split(/\s+/).slice(0, 28).join(' ');
  return `
  <article class="cd marketplace-extra-card" style="animation-delay:${Math.min(index, 12) * 30}ms">
    <div class="ph im">
      <button class="absolute inset-0 z-[1] h-full w-full" type="button" data-action="view-listing" data-id="${esc(item.id)}" data-type="${esc(item.listing_type)}" aria-label="មើល ${esc(item.title)}"></button>
      ${image ? `<span class="img-scan-wrap shimmer-scan cd-image-wrap cd-main-wrap"><img src="${esc(image)}" alt="${esc(item.title)}" loading="lazy" decoding="async" class="cd-main"></span>` : ic('image', 36)}
      <span class="marketplace-type-badge">${labels[item.listing_type] || 'ផ្សារ'}</span>
    </div>
    <div class="cb">
      <h3 class="cursor-pointer hover:text-emerald-800" data-action="view-listing" data-id="${esc(item.id)}" data-type="${esc(item.listing_type)}">${esc(item.title)}</h3>
      <p class="pr"><span>${esc(price)}</span></p>
      ${description ? `<p class="cd-description">${esc(description)}</p>` : ''}
      <div class="sh listing-poster-row">
        <span class="listing-poster-avatar">${item.poster?.avatar_url ? `<img src="${esc(item.poster.avatar_url)}" alt="">` : esc(Array.from(item.poster?.display_name || '7')[0])}</span>
        <span class="listing-poster-name">${esc(item.poster?.display_name || 'អ្នកប្រើប្រាស់')}</span>
        <span class="listing-poster-kind">${esc(item.listing_subtitle || labels[item.listing_type] || '7inOne')}</span>
      </div>
      <p class="mt"><span class="cd-time-meta">${timeAgoKm(item.created_at)}</span><span class="cd-location-meta">${ic('pin', 11)}<span>${esc(item.location || 'កម្ពុជា')}</span></span></p>
    </div>
  </article>`;
}

function renderProducts() {
  const list = state.products.filter((item) => {
    if (item.listing_type === 'product' && state.activeCondition !== 'all') {
      const condition = String(item.condition || '').toLowerCase();
      const isNew = condition.includes('new') || condition.includes('ថ្មី');
      const isUsed = condition.includes('used') || condition.includes('second') || condition.includes('មួយទឹក') || condition.includes('ប្រើរួច');
      if (!(state.activeCondition === 'new' ? isNew : isUsed)) return false;
    }
    if (item.listing_type === 'product') {
      if (state.activeSubcategory !== 'all' && String(item.subcategory || '') !== state.activeSubcategory) return false;
      if (state.activeDetailType !== 'all' && String(item.detail_type || '') !== state.activeDetailType) return false;
      for (const [key, selected] of Object.entries(state.activeSpecFilters || {})) {
        if (!selected?.length) continue;
        const aliases = {
          brand:['brand','manufacturer'],cpu:['cpu','processor','cpu_model','processor_model'],
          ram:['ram','memory','memory_ram'],storage:['storage','ssd','hard_drive','capacity'],
          display:['display','display_size','screen','screen_size'],gpu:['gpu','graphics','graphics_card','graphics_processor'],
          color:['color','colour'],resolution:['resolution','display_resolution'],os:['operating_system','os']
        }[key] || [key];
        if (!selected.includes(specFilterValue(item,aliases))) return false;
      }
      const price = Number(item.display_price ?? item.price);
      if (state.specPriceMin !== '' && price < Number(state.specPriceMin)) return false;
      if (state.specPriceMax !== '' && price > Number(state.specPriceMax)) return false;
    }
    return true;
  });
  const getSortPrice = (item) => {
    const rawPrice = item.price_label ?? item.display_price ?? item.price ?? '';
    const match = String(rawPrice).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
  };
  list.sort((a, b) => {
    if (state.marketplaceSort === 'low' || state.marketplaceSort === 'high') {
      const priceA = getSortPrice(a);
      const priceB = getSortPrice(b);
      const hasPriceA = Number.isFinite(priceA);
      const hasPriceB = Number.isFinite(priceB);
      if (hasPriceA !== hasPriceB) return hasPriceA ? -1 : 1;
      if (!hasPriceA) return 0;
      return state.marketplaceSort === 'low' ? priceA - priceB : priceB - priceA;
    }
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });
  $('productGrid').innerHTML = list.map(marketplaceCard).join('');
  renderCategorySpecFilters();
  $('emptyHome').classList.toggle('hidden', list.length > 0);
  $('productGrid').classList.toggle('hidden', list.length === 0);

  $('skeletonGrid').classList.add('hidden');
  
}

function setSelectedMarketplaceCard(type, id) {
  const grid = $('productGrid');
  if (!grid) return;
  const targetId = String(id ?? '');
  const targetType = String(type || 'product');
  grid.querySelectorAll('.cd').forEach(card => {
    const action = card.querySelector('[data-action="view"],[data-action="view-listing"]');
    const matches = action &&
      String(action.dataset.id || '') === targetId &&
      (targetType === 'product'
        ? action.dataset.action === 'view'
        : action.dataset.action === 'view-listing' && String(action.dataset.type || '') === targetType);
    card.classList.toggle('is-selected', Boolean(matches));
  });
}

function mountProductDetailPage() {
  const mount = $('productDetailPageMount');
  const detail = $('productDetail');
  if (mount && detail && detail.parentElement !== mount) mount.appendChild(detail);
}

async function loadProducts() {
  const requestId = ++state.productsRequestId;
  const grid = $('productGrid');
  grid.setAttribute('aria-busy', 'true');
  grid.classList.add('hidden');
  $('emptyHome').classList.add('hidden');
  $('skeletonGrid').classList.remove('hidden');

  // Load verified-seller Shorts independently of marketplace listing/banner loading.
  

  const params = new URLSearchParams({ limit: '50', type: state.activeListingType || 'all' });
  if (state.searchTerm) params.set('q', state.searchTerm);
  if (state.activeListingType === 'product' && state.activeCategory !== 'all') params.set('category', state.activeCategory);
  if (state.activeListingType === 'real_estate') params.set('property_type', state.activePropertyType || 'all');

  try {
    const res = await api('/api/marketplace/listings?' + params.toString());
    if (requestId !== state.productsRequestId) return;
    state.products = Array.isArray(res.data) ? res.data : [];
    renderProducts();
    syncHomeHeroImagesFromProducts();
  } catch (error) {
    if (requestId !== state.productsRequestId) return;
    renderProducts();
    toast('មិនអាចទាញយកប្រកាសបានទេ៖ ' + error.message, 'error');
  } finally {
    if (requestId === state.productsRequestId) {
      $('skeletonGrid').classList.add('hidden');
      grid.classList.toggle('hidden', state.products.length === 0);
      grid.setAttribute('aria-busy', 'false');
    }
  }
}

function syncHomeHeroImagesFromProducts() {
  const configured = Array.isArray(state.siteBranding.heroImages) && state.siteBranding.heroImages.some((item) => item?.url || item?.image_url);
  if (configured) return;
  const candidates = state.products.filter((p) => p.product_images?.some((img) => img.image_url)).slice(0, 3);
  for (let i = 1; i <= 3; i++) {
    const target = $('heroImage' + i);
    const placeholder = target?.parentElement?.querySelector('.hero-placeholder');
    const product = candidates[i - 1];
    const image = product?.product_images?.find((item) => item.image_url);
    if (!target) continue;
    if (!image) {
      target.removeAttribute('src');
      target.classList.add('hidden');
      placeholder?.classList.remove('hidden');
      continue;
    }
    target.src = image.image_url;
    target.classList.remove('hidden');
    placeholder?.classList.add('hidden');
  }
}

function updateMarketplaceCategoryHeading() {
  const titles = {
    all: 'ប្រភេទទាំងអស់',
    product: 'ប្រភេទផលិតផល',
    job: 'ប្រភេទការងារ',
    real_estate: 'ប្រភេទអចលនទ្រព្យ'
  };
  const heading = $('marketplaceCategoryHeading');
  if (heading) heading.textContent = titles[state.activeListingType] || titles.all;
  document.querySelectorAll('[data-marketplace-category-group]').forEach((group) => {
    group.hidden = state.activeListingType === 'all' || group.dataset.marketplaceCategoryGroup !== state.activeListingType;
  });
}

function setCategory(category) {
  state.activeSpecFilters = {};
  state.activeSubcategory = 'all';
  state.activeDetailType = 'all';
  state.specPriceMin = '';
  state.specPriceMax = '';
  state.activeCategory = category;
  if (category !== 'all') state.activeListingType = 'product';
  updateMarketplaceCategoryHeading();
  $('searchCategory').value = category;
  document.querySelectorAll('[data-category]').forEach((b) => b.classList.toggle('active', b.dataset.category === category));
  document.querySelectorAll('[data-listing-type]').forEach((b) => b.classList.toggle('active', b.dataset.listingType === state.activeListingType));
  void loadProducts();
}

function setListingType(type) {
  state.activeSpecFilters = {};
  state.activeSubcategory = 'all';
  state.activeDetailType = 'all';
  state.specPriceMin = '';
  state.specPriceMax = '';
  state.activeListingType = ['all','product','job','real_estate'].includes(type) ? type : 'all';
  state.activeCategory = 'all';
  state.activePropertyType = 'all';
  updateMarketplaceCategoryHeading();
  $('searchCategory').value = 'all';
  document.querySelectorAll('[data-category]').forEach((b) => b.classList.toggle('active', b.dataset.category === 'all'));
  document.querySelectorAll('[data-listing-type]').forEach((b) => b.classList.toggle('active', b.dataset.listingType === state.activeListingType));
  document.querySelectorAll('[data-property-type]').forEach((b) => b.classList.toggle('active', b.dataset.propertyType === state.activePropertyType));
  void loadProducts();
}

function setPropertyType(type) {
  state.activePropertyType = ['all','house_sale','house_rent','condo_sale','apartment_rent','land','land_rent','commercial_sale','commercial_rent','room_rent','properties_wanted','agent_services','others_properties'].includes(type) ? type : 'all';
  document.querySelectorAll('[data-property-type]').forEach((b) => b.classList.toggle('active', b.dataset.propertyType === state.activePropertyType));
  void loadProducts();
}

function renderProductDetailMarkup(root, markup, options = {}) {
  if (!root) return;
  const isHydration = options.isBackgroundHydration === true;
  const previousImage = isHydration ? root.querySelector('#productMainImage, .product-listing-main-image') : null;
  const previousSrc = previousImage?.getAttribute('src') || '';
  const scrollContainer = root;
  const previousScrollTop = isHydration ? scrollContainer.scrollTop : 0;
  const template = document.createElement('template');
  template.innerHTML = markup;
  if (previousImage && previousSrc) {
    const nextImage = template.content.querySelector('#productMainImage, .product-listing-main-image');
    const nextSrc = nextImage?.getAttribute('src') || '';
    let sameImage = nextSrc === previousSrc;
    if (!sameImage && nextSrc) {
      try { sameImage = new URL(nextSrc, document.baseURI).href === new URL(previousSrc, document.baseURI).href; } catch {}
    }
    if (nextImage && sameImage) nextImage.replaceWith(previousImage);
  }
  root.replaceChildren(template.content);
  if (isHydration) scrollContainer.scrollTop = previousScrollTop;
}

function renderProductDetailSkeleton() {
  const root = $('productDetail');
  if (!root) return;
  const bar = (className = '') => `<div class="skeleton ${className}"></div>`;
  root.innerHTML = `
    <div class="product-detail-page product-detail-skeleton-page" aria-busy="true" aria-label="កំពុងផ្ទុកព័ត៌មានលម្អិត">
      <section class="product-hero-grid product-detail-skeleton-hero">
        <div class="product-detail-gallery product-detail-skeleton-gallery">
          <div class="product-gallery-thumbs product-detail-skeleton-thumbs">
            ${Array.from({ length: 4 }, () => bar('sk-thumb')).join('')}
          </div>
          <div class="product-gallery-stage skeleton sk-main-image"></div>
        </div>
        <div class="product-detail-info product-detail-skeleton-info">
          <div class="product-top-meta">${bar('sk-meta')} ${bar('sk-meta short')}</div>
          <div class="product-heading-block">
            ${bar('sk-title')}${bar('sk-title medium')}
            <div class="product-price-stock-row">${bar('sk-price')} ${bar('sk-stock')}</div>
            ${bar('sk-summary')}${bar('sk-summary short')}
          </div>
          <div class="product-detail-skeleton-actions">${bar('sk-action')}${bar('sk-action secondary')}</div>
          <div class="product-detail-skeleton-seller">
            ${bar('sk-avatar')}
            <div class="sk-seller-copy">${bar('sk-line')}${bar('sk-line short')}</div>
            ${bar('sk-store-button')}
          </div>
          <section class="product-detail-skeleton-panel">
            ${bar('sk-section-title')}
            <div class="sk-spec-grid">${Array.from({ length: 6 }, () => `<div>${bar('sk-line short')}${bar('sk-line')}</div>`).join('')}</div>
          </section>
          <section class="product-detail-skeleton-panel">
            ${bar('sk-section-title')}${bar('sk-paragraph')}${bar('sk-paragraph')}${bar('sk-paragraph short')}
          </section>
        </div>
      </section>
      <section class="product-trust-reviews-grid product-detail-skeleton-lower">
        <div class="product-detail-skeleton-panel">
          ${bar('sk-section-title')}
          <div class="sk-review-layout">${bar('sk-rating')}${bar('sk-review-lines')}</div>
        </div>
        <div class="product-detail-skeleton-panel">
          ${bar('sk-section-title')}${bar('sk-paragraph')}${bar('sk-paragraph')}${bar('sk-paragraph')}
        </div>
      </section>
      <section class="product-detail-skeleton-related">
        ${bar('sk-section-title')}
        <div class="sk-related-grid">${Array.from({ length: 4 }, () => `<div>${bar('sk-related-image')}${bar('sk-line')}${bar('sk-line short')}</div>`).join('')}</div>
      </section>
    </div>`;
}

async function openMarketplaceListing(type, id, options = {}) {
  if (!id || !['job', 'real_estate'].includes(type)) return false;
  const listingId = String(id);
  setSelectedMarketplaceCard(type, listingId);
  const detailKey = type + ':' + listingId;
  const requestId = ++state.detailRequestId;
  const isCurrent = () => requestId === state.detailRequestId &&
    (options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId) &&
    String(state.currentProduct?.id || '') === listingId &&
    state.currentProduct?.listing_type === type;
  const cachedItem = state.products.find(row => row.listing_type === type && String(row.id) === listingId)
    || state.jobs.find(row => row.listing_type === type && String(row.id) === listingId);

  state.detailHydratedKey = null;
  state.currentMarketplaceListing = cachedItem ? { ...cachedItem, listing_type: type } : null;
  state.currentProduct = cachedItem ? { ...cachedItem, listing_type: type } : { id: listingId, listing_type: type };
  state.currentVendor = null;
  state.productGalleryIndex = 0;
  state.productGalleryVideoActive = false;

  mountProductDetailPage();
  await showView('product', { preserveScroll: Boolean(options.preserveScroll), deferLoad: true });
  if (!isCurrent()) return false;
  if (!cachedItem) renderProductDetailSkeleton();
  else renderProductDetail();
  if (!isCurrent()) return false;

  try {
    sessionStorage.setItem('ecomstore.activeView', 'product');
    sessionStorage.setItem('ecomstore.currentProductId', listingId);
    sessionStorage.setItem('ecomstore.currentListingType', type);
    sessionStorage.setItem('ecomstore.currentListingId', listingId);
  } catch {}

  try {
    const result = await api('/api/marketplace/listings?limit=100&type=' + encodeURIComponent(type));
    if (!isCurrent()) return false;
    const freshItem = (result.data || []).find(row => String(row.id) === listingId);
    if (!freshItem && !cachedItem) throw new Error('មិនមានព័ត៌មានប្រកាសនេះទេ។');
    const current = state.currentProduct || cachedItem || {};
    const fresh = freshItem || cachedItem || {};
    const merged = { ...current, ...fresh, listing_type: type };
    const oldImages = Array.isArray(current.image_urls) ? current.image_urls : (current.image_url ? [current.image_url] : []);
    const newImages = Array.isArray(fresh.image_urls) ? fresh.image_urls : (fresh.image_url ? [fresh.image_url] : []);
    if (oldImages.length && oldImages.length === newImages.length && oldImages.every((url, index) => url === newImages[index])) {
      merged.image_urls = current.image_urls;
      merged.image_url = current.image_url || fresh.image_url;
    }
    if (!isCurrent()) return false;
    state.currentMarketplaceListing = merged;
    state.currentProduct = merged;
    state.detailHydratedKey = detailKey;
    renderProductDetail({ isBackgroundHydration: true });
    return true;
  } catch (error) {
    if (!isCurrent()) return false;
    if (!cachedItem) {
      toast(error.message || 'មិនអាចបើកព័ត៌មានប្រកាសបានទេ។', 'error');
      void showView('home');
      return false;
    }
    return true;
  }
}

async function openProduct(id, options = {}) {
  if (!id) { toast('មិនមានលេខសម្គាល់ទំនិញទេ។', 'warning'); return false; }
  const productId = String(id);
  setSelectedMarketplaceCard('product', productId);
  const detailKey = 'product:' + productId;
  const requestId = ++state.detailRequestId;
  const isCurrent = () => requestId === state.detailRequestId &&
    (options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId) &&
    String(state.currentProduct?.id || '') === productId &&
    state.currentProduct?.listing_type === 'product';
  const cachedItem = state.products.find(row => row.listing_type === 'product' && String(row.id) === productId) || null;

  // Never render cached/incomplete product data as the final detail page.
  // Keep the detail view in skeleton state until every required request finishes.
  state.detailHydratedKey = null;
  state.currentProduct = { id: productId, listing_type: 'product' };
  state.currentVendor = null;
  state.currentMarketplaceListing = null;
  state.currentVariantId = null;
  state.productGalleryIndex = 0;
  state.productGalleryVideoActive = false;

  mountProductDetailPage();
  await showView('product', { preserveScroll: Boolean(options.preserveScroll), deferLoad: true });
  if (!isCurrent()) return false;
  renderProductDetailSkeleton();
  if (!isCurrent()) return false;

  try {
    sessionStorage.setItem('ecomstore.currentProductId', productId);
    sessionStorage.setItem('ecomstore.activeView', 'product');
  } catch {}

  try {
    // Fetch the authoritative product record and buyer order history together.
    const [productResult] = await Promise.all([
      api('/api/products/' + encodeURIComponent(productId)),
      state.session ? loadOrders() : Promise.resolve()
    ]);
    if (!isCurrent()) return false;

    const fetched = productResult?.data;
    if (!fetched) throw new Error('មិនមានព័ត៌មានទំនិញនេះទេ។');
    fetched.poster = cachedItem?.poster || fetched.poster || null;

    // Resolve the vendor from the fresh product response, not from a possibly stale card.
    const vendorId = fetched.vendor_id || fetched.vendors?.id || null;
    let trust = null;
    if (vendorId) {
      trust = await api('/api/vendors/' + encodeURIComponent(vendorId) + '/ratings');
      if (!isCurrent()) return false;
    }

    const merged = { ...(cachedItem || {}), ...fetched, listing_type: 'product' };
    state.currentProduct = merged;
    state.currentVendor = {
      ...(cachedItem?.vendors || {}),
      ...(fetched.vendors || {}),
      ...(trust?.data || {}),
      id: vendorId || fetched.vendors?.id || cachedItem?.vendor_id || null,
      reviews: trust?.data?.reviews || fetched.vendors?.reviews || []
    };
    state.currentVariantId = fetched.variants?.[0]?.id || null;
    state.detailHydratedKey = detailKey;

    if (!isCurrent()) return false;
    renderProductDetail();
    return true;
  } catch (error) {
    if (!isCurrent()) return false;
    console.error('Could not load complete product detail:', error);
    toast(error.message || 'មិនអាចផ្ទុកព័ត៌មានទំនិញបានទេ។', 'error');
    state.detailHydratedKey = null;
    state.currentProduct = null;
    state.currentVendor = null;
    void showView('home');
    return false;
  }
}

function extractGoogleMapEmbedUrl(rawUrl, fallbackLocation = '') {
  const raw = String(rawUrl || '').trim();
  const fallback = String(fallbackLocation || '').trim();
  let query = fallback;
  if (raw) {
    try {
      const url = new URL(raw);
      const host = url.hostname.toLowerCase();
      if (!['google.com','www.google.com','maps.google.com','maps.app.goo.gl','goo.gl'].includes(host) &&
          !host.endsWith('.google.com')) return '';
      const coordinateMatch = url.href.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
      if (coordinateMatch) query = coordinateMatch[1] + ',' + coordinateMatch[2];
      else {
        const placeMatch = url.pathname.match(/\/place\/([^/]+)/i);
        const q = url.searchParams.get('q') || url.searchParams.get('query');
        if (q) query = q;
        else if (placeMatch) query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        else if (!/maps\.app\.goo\.gl|goo\.gl/.test(host)) query = url.pathname.replace(/^\/(maps\/)?/,'').replace(/\//g,' ').trim() || fallback;
      }
    } catch { return ''; }
  }
  if (!query) return '';
  return 'https://maps.google.com/maps?q=' + encodeURIComponent(query) + '&z=16&output=embed';
}
function renderDetailMapSection(item) {
  const specs = item.specifications && typeof item.specifications === 'object' ? item.specifications : {};
  const rawUrl = specs.google_map_url || item.google_map_url || '';
  const location = [item.location, item.address].filter(Boolean).join(' · ');
  if (!rawUrl) return location ? `<div class="detail-location"><div class="detail-location-heading">${ic('pin',17)} <b>ទីតាំង</b></div><p>${esc(item.location || 'កម្ពុជា')}</p>${item.address ? `<small>${esc(item.address)}</small>` : ''}</div>` : '';
  const embedUrl = extractGoogleMapEmbedUrl(rawUrl, location || 'Cambodia');
  return `<section class="detail-map-section"><div class="detail-location-heading">${ic('pin',17)} <b>ទីតាំង</b></div><p>${esc(item.location || 'កម្ពុជា')}</p>${item.address ? `<small>${esc(item.address)}</small>` : ''}<div class="detail-map-frame">${embedUrl ? `<iframe src="${esc(embedUrl)}" title="Google Maps location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen style="background:#16202D"></iframe>` : ''}<button type="button" class="detail-map-open" data-detail-action="map" data-map-url="${esc(rawUrl)}">បង្ហាញទីតាំងនៅលើផែនទី</button></div></section>`;
}
function renderProductDetailLocation(item) {
  const specs = item.specifications && typeof item.specifications === 'object' ? item.specifications : {};
  const rawUrl = specs.google_map_url || item.google_map_url || '';
  const location = [item.location, item.address].filter(Boolean).join(' · ');
  if (!location && !rawUrl) return '';
  const embedUrl = extractGoogleMapEmbedUrl(rawUrl, location || 'Cambodia');
  return `<section class="detail-location-layout">
    <div class="detail-location-main">
      <div class="detail-location-copy">
        <div class="detail-location-heading">${ic('pin',17)} <b>ទីតាំង</b></div>
        <p>${esc(item.location || 'កម្ពុជា')}</p>
        ${item.address ? `<small>${esc(item.address)}</small>` : ''}
      </div>
      <div class="detail-map-frame">
        ${embedUrl ? `<iframe src="${esc(embedUrl)}" title="ផែនទីទីតាំងផលិតផល" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen style="background:#16202D"></iframe>` : ''}
        ${embedUrl && rawUrl ? `<button type="button" class="detail-map-open" data-detail-action="map" data-map-url="${esc(rawUrl)}">មើលផែនទី</button>` : ''}
      </div>
    </div>
    <aside class="buyer-safety-card" aria-label="ការណែនាំសុវត្ថិភាពអ្នកទិញ">
      <h3>${ic('shield',17)} ការណែនាំសុវត្ថិភាពអ្នកទិញ</h3>
      <ul>
        <li>${ic('checkcircle',14)} <span>ពិនិត្យទំនិញដោយផ្ទាល់ មុនពេលទូទាត់ប្រាក់</span></li>
        <li>${ic('checkcircle',14)} <span>ស្នើសុំរូបភាព ឬព័ត៌មានបន្ថែម ប្រសិនបើមិនច្បាស់</span></li>
        <li>${ic('alert',14)} <span>កុំផ្ញើប្រាក់ជាមុន ទៅគណនីដែលមិនអាចផ្ទៀងផ្ទាត់បាន</span></li>
      </ul>
    </aside>
  </section>`;
}
function bindListingDetailActions(root, item) {
  root.querySelectorAll('[data-detail-action]').forEach(button => button.addEventListener('click', async () => {
    const action = button.dataset.detailAction;
    if (action === 'map') {
      const url = button.dataset.mapUrl || '';
      try { const parsed = new URL(url); if (parsed.protocol === 'https:' && (parsed.hostname.endsWith('google.com') || parsed.hostname.endsWith('goo.gl'))) window.open(url, '_blank', 'noopener,noreferrer'); else toast('Google Maps Link មិនត្រឹមត្រូវ។','warning'); } catch { toast('Google Maps Link មិនត្រឹមត្រូវ។','warning'); }
      return;
    }
    if (action === 'share') {
      const route = item.listing_type === 'product' ? '#product/' + encodeURIComponent(item.id) : '#product/' + encodeURIComponent(item.listing_type) + '/' + encodeURIComponent(item.id);
      try { await navigator.clipboard.writeText(location.origin + location.pathname + route); toast('បានចម្លង Link រួចរាល់!'); }
      catch { toast('មិនអាចចម្លង Link បានទេ។','error'); }
      return;
    }
    if (!requireLogin()) return;
    if (action === 'save') {
      const saveButtons = [...root.querySelectorAll('[data-detail-action="save"]')];
      saveButtons.forEach(node => { node.disabled = true; });
      try {
        const result = await api('/api/listing-saves', {method:'POST',body:JSON.stringify({listing_type:item.listing_type,id:item.id})});
        if (typeof result.data?.saved === 'boolean') {
          saveButtons.forEach(node => {
            node.classList.toggle('is-saved', result.data.saved);
            node.setAttribute('aria-pressed', String(result.data.saved));
            const label = node.querySelector('span');
            if (label) label.textContent = result.data.saved ? 'បានរក្សាទុក' : 'រក្សាទុក';
          });
          toast(result.data.saved ? 'បានរក្សាទុកប្រកាស!' : 'បានដកចេញពីប្រកាសដែលបានរក្សាទុក។');
        }
      } catch (error) { toast(error.message || 'មិនអាចរក្សាទុកបានទេ។','error'); }
      finally { saveButtons.forEach(node => { node.disabled = false; }); }
      return;
    }
    if (action === 'report') {
      const reason = await appDialog({ mode:'prompt', title:'រាយការណ៍ប្រកាស', message:'សូមបញ្ជាក់មូលហេតុដែលអ្នកចង់រាយការណ៍ ដើម្បីឱ្យ Admin អាចពិនិត្យបានត្រឹមត្រូវ។', placeholder:'ឧ. ព័ត៌មានមិនត្រឹមត្រូវ ឬសង្ស័យថាបោកប្រាស់...' });
      if (!reason || !reason.trim()) return;
      button.disabled = true;
      try { await api('/api/listing-reports',{method:'POST',body:JSON.stringify({listing_type:item.listing_type,id:item.id,reason:reason.trim()})}); toast('បានផ្ញើរបាយការណ៍ទៅ Admin រួចរាល់។'); }
      catch(error){ toast(error.message || 'មិនអាចរាយការណ៍បានទេ។','error'); }
      finally { button.disabled = false; }
    }
  }));
}
function detailBottomActions(item) {
  return `<div class="detail-bottom-actions"><button type="button" data-detail-action="save">${ic('bookmark',16)} <span>រក្សាទុក</span></button><button type="button" data-detail-action="report">${ic('flag',16)} <span>រាយការណ៍</span></button><button type="button" data-detail-action="share">${ic('share',16)} <span>ចែករំលែក</span></button></div>`;
}

function populateDetailsPopover(root) {
  // Product details now stay inside the right-side workspace; no floating popup.
  if (!root) return;
  closeDetailsPopover();
  root.querySelectorAll('[data-open-details-popover]').forEach(button => button.remove());
}
function syncDetailsPopoverTriggers(isOpen) {
  document.querySelectorAll('[data-open-details-popover]').forEach(button => {
    button.classList.toggle('is-active', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  });
}
function openDetailsPopover() {
  const modal = $('detailsPopoverModal'), body = $('detailsPopoverBody');
  if (!modal || !body?.childElementCount) return;
  modal.classList.remove('hidden');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  syncDetailsPopoverTriggers(true);
}
function closeDetailsPopover() {
  const modal = $('detailsPopoverModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  syncDetailsPopoverTriggers(false);
}

function renderMarketplaceListingInProductDetail(item, options = {}) {
  const root = $('productDetail');
  if (!root) return;
  const type = item.listing_type;
  const isJob = type === 'job';
  const label = isJob ? 'ការងារ' : 'អចលនទ្រព្យ';
  const gallery = Array.isArray(item.image_urls) && item.image_urls.length
    ? item.image_urls.filter(Boolean)
    : (item.image_url ? [item.image_url] : []);
  const price = isJob
    ? (item.price_label === 'ចរចា' ? 'ចរចាប្រាក់ខែ' : (item.price_label ? '$' + String(item.price_label).replace(' - ', ' - $') : 'ទាក់ទងសួរប្រាក់ខែ') + ({hourly:' / ម៉ោង',daily:' / ថ្ងៃ',monthly:' / ខែ',negotiable:''}[item.salary_period] || ''))
    : (item.price_label == null ? 'ទាក់ទងសួរតម្លៃ' : money(item.price_label) + (item.real_estate_type?.endsWith('_rent') ? ({daily:' / ថ្ងៃ',monthly:' / ខែ',yearly:' / ឆ្នាំ'}[item.rent_period] || '') : ''));
  const displayJobValue = (key, value) => {
    if (value === null || value === undefined || String(value).trim() === '') return '';
    const raw = String(value).trim();
    const maps = {
      employment_type: { full_time: 'ពេញម៉ោង', part_time: 'ក្រៅម៉ោង', contract: 'តាមកិច្ចសន្យា', internship: 'កម្មសិក្សា', temporary: 'បណ្តោះអាសន្ន', freelance: 'ឯករាជ្យ' },
      salary_period: { hourly: 'តាមម៉ោង', daily: 'តាមថ្ងៃ', monthly: 'ប្រចាំខែ', yearly: 'ប្រចាំឆ្នាំ', negotiable: 'ចរចា' },
      work_schedule: { day: 'វេនថ្ងៃ', night: 'វេនយប់', rotating: 'ប្តូរវេន', flexible: 'បត់បែន' },
      education: { none: 'មិនទាមទារ', primary: 'បឋមសិក្សា', secondary: 'មធ្យមសិក្សា', high_school: 'វិទ្យាល័យ', bachelor: 'បរិញ្ញាបត្រ', master: 'អនុបណ្ឌិត', phd: 'បណ្ឌិត' },
      experience: { none: 'មិនទាមទារ', entry: 'មិនទាមទារបទពិសោធន៍', junior: 'កម្រិតដំបូង', mid: 'មធ្យម', senior: 'ជាន់ខ្ពស់' }
    };
    if (maps[key]?.[raw]) return maps[key][raw];
    if (key === 'experience' && /^\\d+$/.test(raw)) return Number(raw) === 0 ? 'មិនទាមទារបទពិសោធន៍' : raw + ' ឆ្នាំ';
    if (key === 'education' && /^\\d+$/.test(raw)) return 'ថ្នាក់ទី' + raw;
    if (key === 'vacancies' && /^\\d+$/.test(raw)) return raw + ' នាក់';
    return raw.replace(/_/g, ' ');
  };
  const specs = item.specifications && typeof item.specifications === 'object' ? item.specifications : {};
  const facts = isJob
    ? [['ក្រុមហ៊ុន',item.company_name],['ប្រភេទការងារ',displayJobValue('employment_type',item.employment_type)],['ប្រភេទរង',item.subcategory],['ចំនួនបុគ្គលិក',displayJobValue('vacancies',item.vacancies)],['បទពិសោធន៍',displayJobValue('experience',item.experience)],['ការអប់រំ',displayJobValue('education',item.education)],['ម៉ោងធ្វើការ',displayJobValue('work_schedule',item.work_schedule)],['ប្រភេទប្រាក់ខែ',displayJobValue('salary_period',item.salary_period)],...Object.entries(specs).filter(([key,value])=>key!=='google_map_url'&&value!=null&&String(value).trim()!=='').map(([key,value])=>[key.replace(/_/g,' '),value])]
    : [['ប្រភេទអចលនទ្រព្យ',item.property_type || item.real_estate_type],['ប្រភេទរង',item.subcategory],['បន្ទប់គេង',item.bedrooms],['បន្ទប់ទឹក',item.bathrooms],['ទំហំ',item.area_sqm ? item.area_sqm + ' m²' : ''],['ប្រភេទដី',item.land_type],['ប្លង់',item.title_deed],['ផ្លូវចូល',item.road_access],['អាសយដ្ឋាន',item.address],...Object.entries(specs).filter(([key,value])=>key!=='google_map_url'&&value!=null&&String(value).trim()!=='').map(([key,value])=>[key.replace(/_/g,' '),value])];
  const imageHtml = gallery.length
    ? `<div class="product-gallery-stage"><img class="product-listing-main-image" src="${esc(gallery[0])}" alt="${esc(item.title)}"></div>${gallery.length > 1 ? `<div class="product-gallery-thumbs">${gallery.map((url,index)=>`<button type="button" class="product-gallery-thumb ${index===0?'active':''}" data-shared-listing-image="${index}"><img src="${esc(url)}" alt="រូបភាព ${index+1}" loading="lazy"></button>`).join('')}</div>` : ''}`
    : `<div class="product-gallery-stage">${ic('image',48)}</div>`;
  renderProductDetailMarkup(root, `
    <div class="product-detail-page marketplace-listing-detail-page">
      <section class="product-hero-grid marketplace-listing-detail-layout">
        <div class="product-detail-gallery marketplace-listing-detail-media">${imageHtml}${listingVideoButton(item)}</div>
        <div class="product-detail-info marketplace-listing-detail-info">
          <div class="product-top-meta">
            <span class="product-category-badge">${label}</span>
            <span class="product-meta-item">${ic('clock',14)} ${item.created_at ? timeAgoKm(item.created_at) : ''}</span>
          </div>
          <ul class="product-facts-list">
            <li><span>ចំណងជើង</span><h1 class="product-detail-title">${esc(item.title || label)}</h1></li>
            <li><span>${isJob ? 'ប្រាក់ខែ' : 'តម្លៃ'}</span><strong class="product-facts-price">${esc(price)}</strong></li>
            <li><span>ទីតាំង</span><strong>${ic('pin',14)} ${esc(item.location || 'កម្ពុជា')}</strong></li>
          </ul>
          <section class="listing-poster-detail">
            <div class="listing-poster-detail-avatar">${item.poster?.avatar_url ? `<img src="${esc(item.poster.avatar_url)}" alt="">` : esc(Array.from(item.poster?.display_name || '7')[0])}</div>
            <div class="listing-poster-detail-copy"><small>អ្នកផុសប្រកាសនេះ</small><b>${esc(item.poster?.display_name || 'អ្នកប្រើប្រាស់')}</b><time>${item.created_at ? timeAgoKm(item.created_at) : ''}</time></div>
            <button type="button" class="listing-poster-chat" data-listing-chat>${ic('chat',16)} ឆាតជាមួយអ្នកផុស</button>
          </section>
          <section class="product-detail-description">
            <h2>${ic('file',18)} ការពិពណ៌នា</h2>
            <div class="product-spec-grid detail-spec-grid">${facts.filter(([,value])=>value!==null&&value!==undefined&&String(value).trim()!=='').map(([key,value])=>`<div><small>${esc(key)}</small><b>${esc(value)}</b></div>`).join('')}</div>
            <p class="product-full-description">${esc(item.description || item.short_description || 'មិនទាន់មានការពិពណ៌នាលម្អិតទេ។')}</p>
            ${renderDetailMapSection(item)}
          </section>
          ${detailBottomActions(item)}
          <p class="product-meta-item">${esc(item.contact_phone || item.phone || '')}</p>
        </div>
      </section>
      <div class="product-mobile-actions listing-mobile-actions" aria-label="សកម្មភាពប្រកាស">
        <button type="button" class="listing-mobile-chat" data-listing-chat>${ic('chat',16)}<span>ឆាត</span></button>
        <button type="button" class="listing-mobile-save" data-detail-action="save">${ic('bookmark',16)}<span>រក្សាទុក</span></button>
      </div>
    </div>`, options);
  bindListingDetailActions(root, item);
  root.querySelectorAll('[data-listing-chat]').forEach(button => button.addEventListener('click', () => { void startListingPosterChat(item); }));
  root.querySelectorAll('[data-shared-listing-image]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.sharedListingImage);
    if (!gallery[index]) return;
    const main = root.querySelector('.product-listing-main-image');
    if (main) main.src = gallery[index];
    root.querySelectorAll('[data-shared-listing-image]').forEach(node => node.classList.toggle('active', node === button));
  }));
  populateDetailsPopover(root, options);
}

function renderProductDetail(options = {}) {
  const root = $('productDetail');
  const p = state.currentProduct;
  const vendorRecord = state.currentVendor || p?.vendors || p?.vendor || {};
  if (!p) return;
  if (p.listing_type === 'job' || p.listing_type === 'real_estate') {
    renderMarketplaceListingInProductDetail(p, options);
    return;
  }
  const v = {
    id: vendorRecord.id || p.vendor_id || null,
    store_name: vendorRecord.store_name || p.store_name || 'ហាងអ្នកលក់',
    store_logo_url: vendorRecord.store_logo_url || vendorRecord.logo_url || p.store_logo_url || null,
    status: vendorRecord.status || p.vendor_status || 'pending',
    active_listings: Number(vendorRecord.active_listings || 0),
    total_views: Number(vendorRecord.total_views || 0),
    review_count: Number(vendorRecord.review_count || 0),
    rating: Number(vendorRecord.rating || 0),
    reviews: Array.isArray(vendorRecord.reviews) ? vendorRecord.reviews : []
  };

  const descriptions = productDescriptionParts(p);
  const shortCaptionContent = productDetailContentParts(descriptions.short);
  const detailContent = productDetailContentParts(descriptions.full || descriptions.short);
  detailContent.promotions = [...new Set([...shortCaptionContent.promotions, ...detailContent.promotions])];
  detailContent.freeGifts = [...new Set([...shortCaptionContent.freeGifts, ...detailContent.freeGifts])];
  const images = (p.product_images || []).filter((i) => i.image_url);
  const videoId = youtubeVideoId(p.youtube_video_url);
  const hasVideo = Boolean(videoId);
  const galleryCount = images.length + (hasVideo ? 1 : 0);
  if (!images.length && hasVideo) state.productGalleryVideoActive = true;
  const activeImage = images[state.productGalleryIndex] || images[0];
  const saved = state.savedIds.has(p.id);
  const selectedVariant = (p.variants || []).find(item => String(item.id) === String(state.currentVariantId)) || (p.variants || [])[0] || null;
  if (selectedVariant && !state.currentVariantId) state.currentVariantId = selectedVariant.id;
  const effectivePrice = selectedVariant ? Number(selectedVariant.price) : Number(p.price);
  const effectiveStock = selectedVariant ? Number(selectedVariant.stock) : Number(p.stock || 0);
  const stockKnown = selectedVariant ? selectedVariant.stock !== undefined && selectedVariant.stock !== null : p.stock !== undefined && p.stock !== null;
  const stockLabel = stockKnown ? (effectiveStock > 0 ? 'មានទំនិញក្នុងស្តុក' : 'អស់ពីស្តុក') : 'អាចសាកសួរបាន';
  const related = state.products.filter((item) => String(item.id) !== String(p.id) && (item.category === p.category || String(item.vendor_id) === String(p.vendor_id))).slice(0, 6);

  const galleryHtml = galleryCount
    ? `<div class="product-gallery-stage ${state.productGalleryVideoActive && hasVideo ? 'is-video' : ''}">${activeImage ? `<img id="productMainImage" src="${esc(activeImage.image_url)}" alt="${esc(p.title)}" data-gallery-zoom>` : ic('image', 48)}<span class="product-gallery-condition">${esc(p.condition || 'មិនបានបញ្ជាក់')}</span><button type="button" class="product-gallery-save" data-product-action="save" aria-label="រក្សាទុករូបភាព" title="រក្សាទុក" aria-pressed="${saved}">${ic('bookmark', 18)}</button><button type="button" class="product-gallery-zoom" data-gallery-zoom-button aria-label="ពង្រីករូបភាព" title="ពង្រីករូបភាព">${ic('maximize', 17)}</button>${galleryCount > 1 ? `<button type="button" class="product-gallery-arrow prev" data-gallery-step="-1">${ic('arrow', 17)}</button><button type="button" class="product-gallery-arrow next" data-gallery-step="1">${ic('arrow', 17)}</button>` : ''}<span class="product-gallery-counter">${state.productGalleryVideoActive && hasVideo ? galleryCount : state.productGalleryIndex + 1} / ${galleryCount}</span></div><div class="product-gallery-thumbs" id="productGalleryThumbs">${images.map((im, i) => `<button type="button" class="product-gallery-thumb ${!state.productGalleryVideoActive && i === state.productGalleryIndex ? 'active' : ''}" data-image="${i}"><img src="${esc(im.image_url)}" alt=""></button>`).join('')}${hasVideo ? `<button type="button" class="product-gallery-thumb product-gallery-video-thumb ${state.productGalleryVideoActive ? 'active' : ''}" data-gallery-video aria-label="មើលវីដេអូ YouTube"><img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="YouTube video"><span>${ic('play',18)}</span></button>` : ''}</div>`
    : `<div class="product-gallery-stage">${ic('image', 48)}</div>`;

  const reviewItems = (v.reviews || []).slice(0, 5);
  const reviewTotal = Number(v.review_count || reviewItems.length || 0);
  const average = Number(v.rating || 0);
  const reviewedOrderIds = new Set((v.reviews || []).map(review => String(review.order_id || '')));
  const eligibleReviewOrders = state.session
    ? (state.myOrders || []).filter(order =>
        order.status === 'completed' &&
        !reviewedOrderIds.has(String(order.id)) &&
        (order.order_items || []).some(item => String(item.vendor_id) === String(v.id) && item.fulfillment_status === 'completed')
      )
    : [];
  const reviewFormHtml = !state.session
    ? `<div class="product-review-gate"><p>ចូលគណនី និងទិញទំនិញពីហាងនេះ ដើម្បីអាចវាយតម្លៃអ្នកលក់បាន។</p><button type="button" data-review-login>ចូលគណនី</button></div>`
    : eligibleReviewOrders.length
      ? `<form id="productReviewForm" class="product-review-form" data-rating="5">
          <h3>ចែករំលែកបទពិសោធន៍ទិញទំនិញ</h3>
          <p>ជ្រើសរើសផ្កាយ ១ ដល់ ៥ និងសរសេរមតិយោបល់របស់អ្នក។</p>
          <div class="product-review-star-picker" role="group" aria-label="ការវាយតម្លៃផ្កាយ">
            ${[1,2,3,4,5].map(value => `<button type="button" class="${value <= 5 ? 'active' : ''}" data-review-rating="${value}" aria-label="${value} ផ្កាយ" aria-pressed="${value === 5}">★</button>`).join('')}
          </div>
          <label><span>ការបញ្ជាទិញដែលបានបញ្ចប់</span><select name="order_id" class="field" required>${eligibleReviewOrders.map(order => `<option value="${esc(order.id)}">#${esc(String(order.id).slice(0,8))} · ${fmtDate(order.created_at)}</option>`).join('')}</select></label>
          <label><span>មតិយោបល់ (មិនចាំបាច់)</span><textarea name="comment" class="field" rows="3" maxlength="1200" placeholder="សរសេរអំពីគុណភាពទំនិញ និងសេវាកម្មរបស់ហាង..."></textarea></label>
          <button type="submit" class="product-review-submit">ផ្ញើការវាយតម្លៃ</button>
        </form>`
      : `<div class="product-review-gate"><p>${reviewedOrderIds.size ? 'អ្នកបានវាយតម្លៃការបញ្ជាទិញដែលមានរួចហើយ។' : 'អាចវាយតម្លៃបានក្រោយពេលការបញ្ជាទិញពីហាងនេះត្រូវបានបញ្ចប់។'}</p></div>`;

  renderProductDetailMarkup($('productDetail'), `
  <div class="product-detail-page">
    <section class="product-hero-grid">
      <div class="product-detail-gallery">${galleryHtml}</div>
      <div class="product-detail-info">
        <div class="product-top-meta">
          <span class="product-category-badge">${esc(CATEGORIES[p.category] || p.category || 'ទំនិញ')}</span>
          <span class="product-meta-item">${ic('clock', 14)} ${fmtDate(p.created_at)}</span>
          <span class="product-meta-item">${ic('eye', 14)} ${Number(p.view_count || 0).toLocaleString()} Views</span>
        </div>

        <div class="product-heading-block">
          <h1 class="product-detail-title">${esc(p.title)}</h1>
          <div class="product-detail-id" aria-label="Product ID">
            <span class="product-detail-id-icon" aria-hidden="true">${ic('tag', 14)}</span>
            <code>${esc(selectedVariant?.sku || displayProductCode(p))}</code>
            <button type="button" data-copy-product-code="${esc(selectedVariant?.sku || displayProductCode(p))}" aria-label="ចម្លង Product ID" title="ចម្លង Product ID">${ic('clipboard', 13)}</button>
          </div>
          <div class="product-price-stock-row">
            <strong class="product-facts-price">${money(effectivePrice)}</strong>
            <span class="product-stock-badge ${stockKnown && effectiveStock <= 0 ? 'is-out' : ''}">${ic(stockKnown && effectiveStock <= 0 ? 'x' : 'checkcircle', 14)} ${stockLabel}</span>
          </div>
          ${p.variants?.length ? `<section class="product-variant-picker"><b>ជ្រើសរើសជម្រើស</b><div class="product-variant-options">${p.variants.map(variant => `<button type="button" data-product-variant="${esc(variant.id)}" class="${String(selectedVariant?.id) === String(variant.id) ? 'is-selected' : ''}" aria-pressed="${String(selectedVariant?.id) === String(variant.id)}" ${Number(variant.stock) <= 0 ? 'disabled' : ''}><span>${esc(variant.option_value)}</span><small>${money(variant.price)}${Number(variant.stock) <= 0 ? ' · អស់ស្តុក' : ''}</small></button>`).join('')}</div>${selectedVariant?.sku ? `<small class="product-variant-sku">Product Code: ${esc(selectedVariant.sku)}</small>` : ''}</section>` : ''}
          ${shortCaptionContent.narrative ? `<p class="product-short-summary-text">${esc(shortCaptionContent.narrative)}</p>` : ''}
           ${renderProductGiftCard(detailContent.freeGifts)}
          ${detailContent.promotions.length ? `<div class="product-short-caption-offers" aria-label="ប្រូម៉ូសិន">
            ${detailContent.promotions.map(offer => `<div class="product-short-offer"><span class="product-short-offer-label">${ic('tag', 13)} ប្រូម៉ូសិន</span><span>${esc(offer)}</span></div>`).join('')}
          </div>` : ''}
        </div>

        <div>
          <div class="product-primary-actions">
            <button type="button" class="product-buy-primary" data-product-action="buy">${ic('bag', 18)} ទិញឥឡូវនេះ</button>
            <button type="button" class="product-chat-primary" data-product-action="chat">${ic('chat', 18)} ឆាតជាមួយអ្នកលក់</button>
          </div>
        </div>

        <section class="product-seller-card">
          <div class="product-seller-heading">
            <div class="product-seller-logo">${v.store_logo_url ? `<img src="${esc(v.store_logo_url)}" alt="${esc(v.store_name)}" loading="lazy" decoding="async">` : `<span class="product-seller-logo-fallback">${ic('store', 22)}</span>`}</div>
            <div class="product-seller-identity">
              <b>${esc(v.store_name || 'ហាងអ្នកលក់')}</b>
              <span class="product-seller-verified">${v.status === 'approved' ? ic('checkcircle', 13) + ' អ្នកលក់បានផ្ទៀងផ្ទាត់' : 'អ្នកលក់'}</span>
            </div>
            <button type="button" class="product-store-button" data-product-action="store">${ic('store', 15)} មើលហាង</button>
          </div>
          <div class="product-seller-metrics">
            <div><b>${Number(v.active_listings || 0)}</b><small>ទំនិញលក់</small></div>
            <div><b>${Number(v.total_views || 0).toLocaleString()}</b><small>អ្នកមើលហាង</small></div>
            <div><b>${reviewTotal}</b><small>ការវាយតម្លៃ</small></div>
          </div>
        </section>

        <article class="product-detail-description">
          <section class="product-spec-section">
            <h2>${ic('sliders', 18)} លក្ខណៈបច្ចេកទេស</h2>
            <div class="product-spec-layout">
              <div class="product-spec-primary">
                <h3>ព័ត៌មានបច្ចេកទេសសំខាន់ៗ</h3>
                <div class="product-spec-list">
                  ${productDetailSpecEntries(p).map(([key,value])=>`<p><strong>${esc(key)} :</strong> ${esc(value)}</p>`).join('') || '<p class="product-spec-empty">មិនទាន់មានទិន្នន័យបច្ចេកទេសដែលបានបញ្ជាក់ទេ។</p>'}
                </div>
              </div>
              ${renderProductUpgradePanel(p)}
            </div>
          </section>
          <section class="product-description-copy">
            <h2>${ic('file', 18)} ការពិពណ៌នា</h2>
            <div class="product-full-description product-narrative-description">${renderProductDescriptionHtml(detailContent.narrative || 'មិនទាន់មានការពិពណ៌នាលម្អិតទេ។')}</div>
          </section>

          ${detailContent.warranty.length ? `<section class="product-warranty-section">
            <h2>${ic('shield-check', 18)} ការធានា</h2>
            <p>${detailContent.warranty.map(esc).join(' · ')}</p>
          </section>` : ''}
          ${renderProductDetailLocation(p)}
          ${detailBottomActions({...p,listing_type:'product'})}
        </article>
      </div>
    </section>

    <div class="product-trust-reviews-grid">
      <section class="product-reviews">
      <div class="flex items-center justify-between">
        <h2>${ic('star', 18)} ការវាយតម្លៃពីអ្នកទិញ</h2>
        <span class="text-xs text-slate-500">${reviewTotal} Reviews</span>
      </div>
      <div class="product-reviews-layout">
        <div class="product-rating-summary">
          <strong>${average ? average.toFixed(1) : '—'}</strong>
          <p class="mt-1 text-xs text-slate-500">ផ្អែកលើ ${reviewTotal} នាក់</p>
        </div>
        <div>
          ${reviewItems.map((r) => `<article class="product-review"><div class="product-review-heading"><b>${esc(r.buyer_name || 'អ្នកទិញ')}</b><span class="text-amber-500">${'★'.repeat(Number(r.rating || 5))}</span></div><p class="mt-1 text-xs text-slate-600">${esc(r.comment || '')}</p><small class="text-[10px] text-slate-400">${fmtDate(r.created_at)}</small></article>`).join('') || '<p class="text-xs text-slate-400">មិនទាន់មានការវាយតម្លៃទេ។</p>'}
        </div>
      </div>
      ${reviewFormHtml}
      </section>

      <aside class="product-safety-note">
        <h2>${ic('shield', 18)} ការណែនាំសុវត្ថិភាពអ្នកទិញ</h2>
        <ul>
          <li>${ic('checkcircle', 15)}<span>ពិនិត្យទំនិញដោយផ្ទាល់ មុនពេលទូទាត់ប្រាក់</span></li>
          <li>${ic('checkcircle', 15)}<span>ស្នើសុំរូបភាព ឬព័ត៌មានបន្ថែម ប្រសិនបើមិនច្បាស់</span></li>
          <li>${ic('checkcircle', 15)}<span>កុំផ្ញើប្រាក់ជាមុន ទៅគណនីដែលមិនអាចផ្ទៀងផ្ទាត់បាន</span></li>
        </ul>
      </aside>
    </div>

    ${related.length ? `<section class="product-related-section"><h2>ទំនិញស្រដៀងគ្នា</h2><div class="product-related-grid">${related.map(productCard).join('')}</div></section>` : ''}

    <div class="product-mobile-actions">
      <button type="button" data-product-action="chat">${ic('chat', 16)}<span>ឆាត</span></button>
      <button type="button" class="brand-gradient" data-product-action="buy">${ic('bag', 16)}<span>ទិញឥឡូវនេះ</span></button>
    </div>
  </div>`, options);

  // Populate the adjacent details popup for product listings as well as jobs/properties.
  populateDetailsPopover(root, options);

  const copyProductIdButton = $('productDetail').querySelector('[data-copy-product-code]');
  copyProductIdButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    void copyProductCode(copyProductIdButton);
  });

  $('productDetail').querySelectorAll('[data-product-variant]').forEach(button => button.addEventListener('click', () => {
    const variant = (p.variants || []).find(item => String(item.id) === String(button.dataset.productVariant));
    if (!variant) return;
    state.currentVariantId = variant.id;
    renderProductDetail();
  }));
  bindListingDetailActions($('productDetail'), {...p,listing_type:'product'});
  $('productDetail').querySelector('[data-review-login]')?.addEventListener('click', () => openAuth('login'));
  const reviewForm = $('productReviewForm');
  if (reviewForm) {
    reviewForm.querySelectorAll('[data-review-rating]').forEach(star => star.addEventListener('click', () => {
      const rating = Number(star.dataset.reviewRating);
      reviewForm.dataset.rating = String(rating);
      reviewForm.querySelectorAll('[data-review-rating]').forEach(option => {
        const active = Number(option.dataset.reviewRating) <= rating;
        option.classList.toggle('active', active);
        option.setAttribute('aria-pressed', String(Number(option.dataset.reviewRating) === rating));
      });
    }));
    reviewForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!requireLogin()) return;
      const submit = reviewForm.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        await api('/api/vendors/' + encodeURIComponent(v.id) + '/reviews', {
          method:'POST',
          body:JSON.stringify({
            order_id:new FormData(reviewForm).get('order_id'),
            rating:Number(reviewForm.dataset.rating || 5),
            comment:new FormData(reviewForm).get('comment') || ''
          })
        });
        const refreshed = await api('/api/vendors/' + encodeURIComponent(v.id) + '/ratings');
        state.currentVendor = refreshed.data;
        renderProductDetail();
        toast('បានផ្ញើការវាយតម្លៃរួចរាល់។');
      } catch (error) {
        toast(error.message || 'មិនអាចផ្ញើការវាយតម្លៃបានទេ។','error');
        submit.disabled = false;
      }
    });
  }
  const updateGallery = (idx) => {
    if (!galleryCount) return;
    const nextIndex = (idx + galleryCount) % galleryCount;
    state.productGalleryVideoActive = Boolean(hasVideo && nextIndex === images.length);
    if (!state.productGalleryVideoActive) state.productGalleryIndex = nextIndex;
    const stage = $('productDetail').querySelector('.product-gallery-stage');
    stage?.classList.remove('is-video');
    const currentFrame = stage?.querySelector('[data-product-gallery-video]');
    const currentImage = stage?.querySelector('#productMainImage');
    if (currentFrame) {
      if (images[state.productGalleryIndex]) {
        const image = document.createElement('img');
        image.id = 'productMainImage';
        image.src = images[state.productGalleryIndex].image_url;
        image.alt = p.title || 'រូបភាពផលិតផល';
        image.dataset.galleryZoom = '';
        currentFrame.replaceWith(image);
      } else {
        currentFrame.remove();
      }
    } else if (!state.productGalleryVideoActive && currentImage) {
      currentImage.src = images[state.productGalleryIndex].image_url;
    }
    if (state.productGalleryVideoActive) {
      const popupVendor = p.vendors || p.vendor || {};
      openListingVideoPopup(p.youtube_video_url, p.title, {
        storeName: popupVendor.store_name || p.store_name || 'ហាងអ្នកលក់',
        storeAvatar: popupVendor.store_logo_url || popupVendor.logo_url || p.store_logo_url || '',
        listingId: p.id || '',
        vendorId: p.vendor_id || popupVendor.id || '',
        category: p.category || '',
        source: 'product-gallery',
        storeVerified: popupVendor.status === 'approved',
        productTitle: p.title || '',
        productPrice: p.price_label != null ? p.price_label : p.price,
        productImage: productImage(p) || (Array.isArray(p.image_urls) ? p.image_urls[0] : '') || p.image_url || p.cover_url || ''
      });
    }
    else closeListingVideoPopup();
    $('productGalleryThumbs')?.querySelectorAll('[data-image]').forEach((b) => b.classList.toggle('active', !state.productGalleryVideoActive && Number(b.dataset.image) === state.productGalleryIndex));
    $('productGalleryThumbs')?.querySelector('[data-gallery-video]')?.classList.toggle('active', state.productGalleryVideoActive);
    const counter = $('productDetail').querySelector('.product-gallery-counter');
    if (counter) counter.textContent = `${state.productGalleryVideoActive ? galleryCount : state.productGalleryIndex + 1} / ${galleryCount}`;
    const zoomImage = $('productDetail').querySelector('[data-gallery-zoom]');
    if (zoomImage) zoomImage.onclick = openProductLightbox;
    if (state.productLightboxOpen && !state.productGalleryVideoActive) updateProductLightbox();
    if (state.productGalleryVideoActive && state.productLightboxOpen) closeProductLightbox();
  };

  $('productDetail').querySelectorAll('[data-image]').forEach((b) => b.addEventListener('click', () => updateGallery(Number(b.dataset.image))));
  $('productDetail').querySelector('[data-gallery-video]')?.addEventListener('click', () => updateGallery(images.length));
  $('productDetail').querySelectorAll('[data-gallery-step]').forEach((b) => b.addEventListener('click', () => {
    const current = state.productGalleryVideoActive ? images.length : state.productGalleryIndex;
    updateGallery(current + Number(b.dataset.galleryStep));
  }));
  const initialZoomImage = $('productDetail').querySelector('[data-gallery-zoom]');
  if (initialZoomImage) initialZoomImage.onclick = openProductLightbox;
  $('productDetail').querySelector('[data-gallery-zoom-button]')?.addEventListener('click', openProductLightbox);

  $('productDetail').querySelectorAll('[data-product-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.productAction;
      if (kind === 'store' && v.id) void openStorefront(v.id);
      if (kind === 'buy') openCheckout(p);
      if (kind === 'save') Promise.resolve(saveAction(p.id, btn));
      if (kind === 'offer') {
        if (!requireLogin()) return;
        state.currentOfferProduct = {...p, price: effectivePrice, variant_id: selectedVariant?.id || null};
        $('offerProductName').textContent = `${p.title} · ${money(effectivePrice)}`;
        $('offerAmount').value = effectivePrice;
        openModal('offerModal');
      }
      if (kind === 'chat') void startBuyerSellerChat(p.id);
    });
  });

  $('productDetail').querySelector('.product-related-grid')?.addEventListener('click', (e) => {
    const save = e.target.closest('[data-action="save"]');
    if (save) { e.preventDefault(); e.stopPropagation(); Promise.resolve(saveAction(save.dataset.id, save)); return; }
    const view = e.target.closest('[data-action="view"]');
    if (view) { void openProduct(view.dataset.id); return; }
    const store = e.target.closest('[data-action="store"]');
    if (store) void openStorefront(store.dataset.vendorId);
  });
}

function updateProductLightbox() {
  const images = (state.currentProduct?.product_images || []).filter((item) => item.image_url);
  const image = images[state.productGalleryIndex];
  if (!image) return;
  $('productLightboxImage').src = image.image_url;
  $('productLightboxCount').textContent = `${state.productGalleryIndex + 1} / ${images.length}`;
  state.productLightboxZoom = 1;
  $('productLightboxImage').style.transform = 'scale(1)';
}

function openProductLightbox() {
  if (!(state.currentProduct?.product_images || []).some((item) => item.image_url)) return;
  state.productLightboxOpen = true;
  updateProductLightbox();
  $('productLightbox').classList.add('open');
  $('productLightbox').setAttribute('aria-hidden', 'false');
  syncBodyScrollLock();
}

function closeProductLightbox() {
  state.productLightboxOpen = false;
  $('productLightbox').classList.remove('open');
  $('productLightbox').setAttribute('aria-hidden', 'true');
  syncBodyScrollLock();
}

/* --------------------------------------------------------------------------
   9. Storefront View
   -------------------------------------------------------------------------- */
async function openStorefront(vendorId, options = {}) {
  if (!vendorId) { toast('មិនមានព័ត៌មានហាងនេះទេ។', 'warning'); return false; }
  const storeId = String(vendorId);
  const isCurrent = () => options.routeSyncNavigationId == null || options.routeSyncNavigationId === state.routeSyncNavigationId;
  Object.assign(state, {
    currentStoreId: storeId, currentStoreCategory: 'all', currentStoreSubcategory: 'all', currentStoreSearch: '',
    currentStoreProducts: [], currentStoreCategoryData: [], currentStorePage: 1, currentStoreLimit: 50,
    currentStoreTotal: 0, currentStoreLoading: true, currentStoreSkeletonVisible: false, currentStoreLoadError: false,
    currentStoreMoreLoading: false, currentStoreMoreError: false
  });
  try {
    sessionStorage.setItem('ecomstore.currentStoreId', storeId);
    sessionStorage.setItem('ecomstore.activeView', 'store');
    await showView('store', { preserveScroll: Boolean(options.preserveScroll) });
    if (!isCurrent()) return false;
    const cancelSkeleton = scheduleSkeleton(() => {
      if (!isCurrent() || !state.currentStoreLoading) return;
      state.currentStoreSkeletonVisible = true;
      renderStorefront();
    });
    const [result, catalogue, taxonomy] = await Promise.all([
      api('/api/vendors/' + encodeURIComponent(storeId) + '/ratings').catch(error => {
        console.warn('Could not load storefront ratings:', error.message);
        return { data: null };
      }),
      api('/api/products?page=1&limit=' + state.currentStoreLimit + '&vendor_id=' + encodeURIComponent(storeId) + '&include_out_of_stock=true'),
      api('/api/vendors/' + encodeURIComponent(storeId) + '/categories').catch(() => ({ data: [] }))
    ]);
    if (!isCurrent()) { cancelSkeleton(); return false; }
    cancelSkeleton();
    state.currentStoreSkeletonVisible = false;
    state.currentStoreData = result.data || null;
    state.currentStoreProducts = catalogue.data || [];
    state.currentStoreCategoryData = taxonomy.data || [];
    state.currentStorePage = Number(catalogue.page || 1);
    state.currentStoreTotal = Number(catalogue.total || 0);
    state.currentStoreLoading = false;
    state.currentStoreLoadError = false;
    renderStorefront();
    return true;
  } catch (error) {
    if (!isCurrent()) return false;
    state.currentStoreSkeletonVisible = false;
    state.currentStoreLoading = false;
    state.currentStoreLoadError = true;
    renderStorefront();
    console.warn('Could not load storefront:', error.message);
    return false;
  }
}

async function loadMoreStoreProducts() {
  if (!state.currentStoreId || state.currentStoreMoreLoading ||
      state.currentStorePage * state.currentStoreLimit >= state.currentStoreTotal) return;
  state.currentStoreMoreLoading = true;
  state.currentStoreMoreError = false;
  renderStorefront();
  const nextPage = state.currentStorePage + 1;
  try {
    const result = await api('/api/products?page=' + nextPage + '&limit=' +
      state.currentStoreLimit + '&vendor_id=' + encodeURIComponent(state.currentStoreId) + '&include_out_of_stock=true');
    const existing = new Set(state.currentStoreProducts.map(product => String(product.id)));
    state.currentStoreProducts = state.currentStoreProducts.concat(
      (result.data || []).filter(product => !existing.has(String(product.id)))
    );
    state.currentStorePage = Number(result.page || nextPage);
    state.currentStoreTotal = Number(result.total ?? state.currentStoreTotal);
  } catch (error) {
    state.currentStoreMoreError = true;
    console.warn('Could not load more store products:', error.message);
  } finally {
    state.currentStoreMoreLoading = false;
    renderStorefront();
  }
}


function isAuroraStorefront(data = state.currentStoreData) {
  return Boolean(data && (String(data.public_shop_id || '').toUpperCase() === 'A001' || String(data.shop_code || '').toUpperCase() === 'A001' || String(data.store_name || '').trim().toLowerCase() === 'aurora computer'));
}
function auroraProductGroup(product = {}) {
  const title=String(product.title||'').toLowerCase();
  if(title.includes('expertbook')) return 'ASUS ExpertBook';
  if(title.includes('vivobook')) return 'ASUS Vivobook';
  const type=String(product.detail_type||product.listing_details?.detail_type||'').trim();
  if(type==='Desktop PC') return 'Desktop PC';
  if(/accessor/i.test(type)) return 'Accessories';
  return type||'ផលិតផលផ្សេងៗ';
}
function auroraProductMatchesCategory(product,category) {
  const group=auroraProductGroup(product).toLowerCase();
  if(!category||category==='all') return true;
  if(category==='laptop') return group.includes('asus')||group==='laptop';
  if(category==='expertbook') return group.includes('expertbook');
  if(category==='vivobook') return group.includes('vivobook');
  if(category==='desktop') return group.includes('desktop');
  if(category==='accessories') return group.includes('accessor');
  return true;
}
const STORE_CATEGORY_LABELS = {
  computers: 'កុំព្យូទ័រ (Computers)',
  computer_accessories: 'គ្រឿងបន្លាស់កុំព្យូទ័រ (Accessories)',
  phones: 'ទូរស័ព្ទ & អេឡិចត្រូនិក',
  vehicles: 'រថយន្ត & ម៉ូតូ',
  property: 'អចលនទ្រព្យ',
  fashion: 'សម្លៀកបំពាក់',
  furniture: 'គ្រឿងសង្ហារិម'
};
function storeCategoryLabel(category) {
  const key = String(category || '').trim();
  return STORE_CATEGORY_LABELS[key] || key || 'ផ្សេងៗ';
}
function storePublicProducts(products = state.currentStoreProducts) {
  return (products || []).filter(product => product && Number(product.stock) > 0);
}
function storeCategoryOptions(products = state.currentStoreProducts) {
  const taxonomy = Array.isArray(state.currentStoreCategoryData) ? state.currentStoreCategoryData : [];
  const keys = taxonomy.length ? taxonomy.map(item => String(item.category || '').trim()).filter(Boolean) : [...new Set(storePublicProducts(products).map(product => String(product.category || '').trim()).filter(Boolean))].sort();
  return keys.map(key => [key, storeCategoryLabel(key)]);
}
function storeSubcategoryOptions(category = state.currentStoreCategory, products = state.currentStoreProducts) {
  if (category === 'all') return [];
  const taxonomy = Array.isArray(state.currentStoreCategoryData) ? state.currentStoreCategoryData : [];
  const entry = taxonomy.find(item => String(item.category || '') === category);
  if (entry) return (entry.subcategories || []).map(value => [String(value), String(value)]);
  const scoped = storePublicProducts(products).filter(product => category === 'all' || String(product.category || '') === category);
  return [...new Set(scoped.map(product => String(product.subcategory || '').trim()).filter(Boolean))].sort().map(value => [value, value]);
}
function storeProductMatchesFilters(product) {
  if (Number(product.stock) <= 0) return false;
  if (state.currentStoreCategory !== 'all' && String(product.category || '') !== state.currentStoreCategory) return false;
  if (state.currentStoreSubcategory !== 'all' && String(product.subcategory || '') !== state.currentStoreSubcategory) return false;
  const query = state.currentStoreSearch.trim().toLowerCase();
  return !query || (String(product.title || '') + ' ' + String(product.description || '')).toLowerCase().includes(query);
}
function renderStoreCategoryFilters() {
  const categories = storeCategoryOptions();
  const subcategories = storeSubcategoryOptions();
  const categoryMarkup = [['all','ទាំងអស់'], ...categories].map(([key,label]) =>
    '<button type="button" data-store-category="' + esc(key) + '" class="store-filter ' + (state.currentStoreCategory === key ? 'active' : '') + '">' + esc(label) + '</button>'
  ).join('');
  const subcategoryMarkup = subcategories.length ? '<div class="storefront-toolbar-chips storefront-subcategory-chips" id="storeSubcategoryFilters">' +
    [['all','គ្រប់ផ្នែករង'], ...subcategories].map(([key,label]) =>
      '<button type="button" data-store-subcategory="' + esc(key) + '" class="store-filter ' + (state.currentStoreSubcategory === key ? 'active' : '') + '">' + esc(label) + '</button>'
    ).join('') + '</div>' : '';
  return '<div class="storefront-toolbar-chips" id="storeCategoryFilters">' + categoryMarkup + '</div>' + subcategoryMarkup;
}
function renderAuroraProductList(products) {
  if(!products.length) return '<div id="auroraProductList"><div class="storefront-empty"><span>'+ic('package',30)+'</span><strong>មិនមានផលិតផលដែលត្រូវនឹងការស្វែងរកទេ</strong></div></div>';
  const groups=new Map();
  products.forEach(p=>{const key=storeCategoryLabel(p.category)+' · '+String(p.subcategory||p.detail_type||'ផ្សេងៗ');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);});
  return '<div id="auroraProductList">'+Array.from(groups.entries()).map(entry=>{
    const group=entry[0],items=entry[1];
    return '<section class="aurora-list-group"><h3>'+esc(group)+' <span>'+items.length+' មុខ</span></h3><div class="aurora-list-items">'+items.map(p=>{
      const img=(p.product_images||[]).filter(x=>x.image_url).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0))[0]?.image_url||'';
      const specs=productCardSpecs(p).map(x=>'<span><b>'+esc(x[0])+':</b> '+esc(x[1])+'</span>').join('');
      const stock=Number(p.stock||0);
      return '<article class="aurora-product-row" '+(isAdmin()?'data-aurora-edit="'+esc(p.id)+'"':'data-action="view" data-id="'+esc(p.id)+'"')+' tabindex="0" role="button"><div class="aurora-product-thumb">'+(img?'<img src="'+esc(img)+'" alt="">':ic('image',24))+'</div><div class="aurora-product-info"><strong>'+esc(p.title||'')+'</strong><div class="aurora-product-specs">'+specs+'</div></div><div class="aurora-product-side"><strong>'+money(p.display_price??p.price)+'</strong><span class="'+(stock?'is-in-stock':'is-out-stock')+'">'+(stock?'ស្តុក '+stock:'អស់ស្តុក')+'</span>'+(isAdmin()?'<button type="button" class="aurora-edit-button" data-aurora-edit="'+esc(p.id)+'">'+ic('pencil',14)+' កែប្រែ</button>':'')+'</div></article>';
    }).join('')+'</div></section>';
  }).join('')+'</div>';
}
function closeAuroraProductEditor(){const modal=$('auroraProductEditModal');if(modal)modal.remove();syncBodyScrollLock();}
function openAuroraProductEditor(productId){
  if(!isAdmin())return;
  const p=state.currentStoreProducts.find(x=>String(x.id)===String(productId));
  if(!p){toast('រកមិនឃើញផលិតផលនេះទេ។','error');return;}
  closeAuroraProductEditor();
  const specs=normalizedProductSpecs(p),desc=productDescriptionParts(p);
  const imgs=(p.product_images||[]).filter(x=>x.image_url);
  const modal=document.createElement('div');modal.id='auroraProductEditModal';modal.className='aurora-edit-overlay';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  modal.innerHTML='<div class="aurora-edit-panel"><header><div><small>AURORA COMPUTER · PRODUCT MANAGER</small><h2>កែប្រែផលិតផល</h2></div><button type="button" data-aurora-close aria-label="បិទ">×</button></header><form id="auroraProductEditForm" data-product-id="'+esc(p.id)+'">'+
  '<label>ឈ្មោះផលិតផល<input class="field" name="title" required value="'+esc(p.title||'')+'"></label>'+
  '<div class="aurora-edit-grid"><label>តម្លៃលក់ ($)<input class="field" name="price" type="number" min="0" step="0.01" required value="'+esc(p.display_price??p.price??0)+'"></label><label>ស្តុក<input class="field" name="stock" type="number" min="0" step="1" required value="'+esc(p.stock??0)+'"></label></div>'+
  '<label>ប្រភេទ<input class="field" name="category" value="'+esc(p.category||'computers')+'"></label>'+
  '<label>ការពិពណ៌នា<textarea class="field" name="description" rows="3">'+esc(desc.full||desc.short||'')+'</textarea></label>'+
  '<div class="aurora-edit-section"><strong>លក្ខណៈបច្ចេកទេស</strong><div class="aurora-edit-grid">'+
  '<label>CPU<input class="field" name="cpu_model" value="'+esc(specs.cpu_model||specs.processor||'')+'"></label><label>RAM<input class="field" name="ram_type_capacity" value="'+esc(specs.ram_type_capacity||specs.ram||'')+'"></label>'+
  '<label>Storage<input class="field" name="storage_type_capacity" value="'+esc(specs.storage_type_capacity||specs.storage||specs.ssd||'')+'"></label><label>Display<input class="field" name="screen_size" value="'+esc(specs.screen_size||specs.display||'')+'"></label><label>GPU<input class="field" name="gpu_model_vram" value="'+esc(specs.gpu_model_vram||specs.gpu||'')+'"></label></div></div>'+
  '<div class="aurora-edit-section"><strong>រូបភាពផលិតផល</strong><div class="aurora-edit-images">'+imgs.map(x=>'<img src="'+esc(x.image_url)+'" alt="">').join('')+'</div><input class="field" type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple><small>រូបថ្មី Upload តាម Telegram ដើម។ រូបចាស់មិនត្រូវបានលុបដោយស្វ័យប្រវត្តិទេ។</small></div>'+
  '<label class="aurora-edit-status"><input type="checkbox" name="active" '+(p.status==='active'?'checked':'')+'> បង្ហាញផលិតផលនៅលើហាង</label><footer><button type="button" data-aurora-close>បោះបង់</button><button type="submit" class="aurora-edit-save">រក្សាទុក</button></footer></form></div>';
  modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-aurora-close]'))closeAuroraProductEditor();});
  modal.addEventListener('submit',async e=>{
    if(e.target.id!=='auroraProductEditForm')return;e.preventDefault();
    const form=e.target,data=new FormData(form),btn=form.querySelector('[type=submit]'),files=Array.from(form.elements.images.files||[]);
    if(imgs.length+files.length>10){toast('រូបភាពសរុបមិនអាចលើស ១០ រូបទេ។','error');return;}
    if(files.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>20*1024*1024)){toast('សូមប្រើ JPG / PNG / WEBP មិនលើស ២០MB ក្នុងមួយរូប។','error');return;}
    btn.disabled=true;btn.textContent='កំពុងរក្សាទុក...';
    try{
      const payload={title:String(data.get('title')||'').trim(),price:Number(data.get('price')),stock:Number(data.get('stock')),category:String(data.get('category')||'').trim(),description:String(data.get('description')||'').trim(),location:p.location||'កម្ពុជា',condition:p.condition||'ថ្មី'};
      await api('/api/products/'+encodeURIComponent(p.id),{method:'PATCH',body:JSON.stringify(payload)});
      const next={...specs};['cpu_model','ram_type_capacity','storage_type_capacity','screen_size','gpu_model_vram'].forEach(k=>{const v=String(data.get(k)||'').trim();if(v)next[k]=v;else delete next[k];});
      await api('/api/products/'+encodeURIComponent(p.id)+'/listing-details',{method:'PUT',body:JSON.stringify({category:payload.category,subcategory:p.subcategory||p.listing_details?.subcategory||'',detail_type:p.detail_type||p.listing_details?.detail_type||'Laptop',specifications:next})});
      if(files.length){const fd=new FormData();files.forEach(f=>fd.append('images',f));await apiUploadWithProgress('/api/products/'+encodeURIComponent(p.id)+'/images',fd,n=>{btn.textContent='Upload '+n+'%';});}
      if(Boolean(data.get('active'))!==(p.status==='active'))await api('/api/admin/products/'+encodeURIComponent(p.id),{method:'PATCH',body:JSON.stringify({status:data.get('active')?'active':'archived'})});
      toast('បានរក្សាទុកការកែប្រែផលិតផល។');closeAuroraProductEditor();await openStorefront(state.currentStoreId,{preserveScroll:true});
    }catch(err){toast(err.message||'មិនអាចរក្សាទុកផលិតផលបានទេ។','error');btn.disabled=false;btn.textContent='រក្សាទុក';}
  });
  document.body.appendChild(modal);syncBodyScrollLock();
}

function renderStorefront() {
  const root = $('storefrontContent');
  if (!root) return;
  root.onclick = handleStorefrontAction;
  if (state.currentStoreLoading && !state.currentStoreSkeletonVisible) return;
  if (state.currentStoreLoading) {
    const bar = (width, height, extra = '') => `<span class="skeleton store-sk-bar ${extra}" style="width:${width};height:${height}px" aria-hidden="true"></span>`;
    root.innerHTML = `<div class="storefront-skeleton" role="status" aria-label="កំពុងផ្ទុកព័ត៌មានហាង">
      <section class="storefront-public store-sk-shell">
        <div class="skeleton store-sk-cover"></div>
        <div class="store-sk-profile"><span class="skeleton store-sk-avatar"></span><div class="store-sk-identity">
          ${bar('42%',18)}${bar('64%',8)}${bar('82%',8)}
        </div></div>
        <div class="store-sk-stats">${Array.from({length:4},()=>`<div>${bar('48%',15)}${bar('72%',7)}</div>`).join('')}</div>
      </section>
      <div class="store-sk-toolbar">${bar('32%',34)}${bar('44%',30)}${bar('14%',10)}</div>
      <section class="storefront-products-section"><div class="storefront-section-heading"><h2>ទំនិញក្នុងហាង</h2></div>
        <div class="storefront-skeleton-grid">${Array.from({length:8},()=>`<div class="storefront-skeleton-card"><span class="skeleton"></span>${bar('82%',10)}${bar('48%',9)}${bar('36%',8)}</div>`).join('')}</div>
      </section>
      <section class="storefront-reviews"><div class="storefront-section-heading"><h2>មតិយោបល់ពីអ្នកទិញ</h2></div>
        <div class="store-sk-review-list">${Array.from({length:2},()=>`<div>${bar('26%',9)}${bar('18%',8)}${bar('84%',8)}${bar('62%',8)}</div>`).join('')}</div>
      </section>
    </div>`;
    return;
  }
  if (state.currentStoreLoadError || !state.currentStoreData) {
    root.innerHTML = `<div class="storefront-error"><span>${ic('alert', 28)}</span>
      <h2>មិនអាចផ្ទុកព័ត៌មានហាងបានទេ</h2>
      <p>សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត។</p>
      <button type="button" class="storefront-retry" data-store-retry>ព្យាយាមម្តងទៀត</button>
    </div>`;
    return;
  }

  const data = state.currentStoreData;
  const query = state.currentStoreSearch.trim().toLowerCase();
  const aurora = isAuroraStorefront(data);
  const visible = state.currentStoreProducts.filter(storeProductMatchesFilters);
  const rating = Number(data.rating || 0);
  const ratingLabel = rating ? rating.toFixed(1) : '—';
  const reviewCount = Number(data.review_count || 0);
  const memberSince = data.created_at
    ? new Date(data.created_at).toLocaleDateString('km-KH', { year: 'numeric', month: 'short' }) : '—';
  const categoryFiltersMarkup = renderStoreCategoryFilters();
  const hasMore = state.currentStorePage * state.currentStoreLimit < state.currentStoreTotal;
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];

  root.innerHTML = `
    <section class="storefront-public">
      <div class="storefront-cover">${data.store_cover_url ? `<img src="${esc(data.store_cover_url)}" alt="" onerror="this.remove()">` : ''}</div>
      <div class="storefront-profile">
        <div class="storefront-avatar"><div class="storefront-avatar-ring">
          ${data.store_logo_url
            ? `<img src="${esc(data.store_logo_url)}" alt="${esc(data.store_name || 'ហាងអ្នកលក់')}" loading="lazy" onerror="this.remove()">`
            : avatarFallbackMarkup(data.store_name || 'ហាងអ្នកលក់')}
        </div></div>
        <div class="storefront-identity">
          <div class="storefront-title-line"><h1>${esc(data.store_name || 'ហាងអ្នកលក់')}</h1>${data.verified ? verifiedStoreBadge(data.id, true) : ''}<button type="button" class="storefront-chat-button" data-store-chat>${ic('chat', 15)}<span>ឆាតជាមួយហាង</span></button></div>
          <p class="storefront-meta"><span>${esc(data.store_location || 'កម្ពុជា')}</span>
            <span>${Number(data.active_listings || 0)} មុខទំនិញ</span>
            <span>${rating ? '★ ' + esc(ratingLabel) : 'មិនទាន់មានពិន្ទុ'} (${reviewCount} ពិនិត្យ)</span>
          </p>
          <p class="storefront-shop-id"><span>Shop ID</span> <code>${esc(data.public_shop_id || '—')}</code></p>
          ${data.description ? `<div class="storefront-bio"><span class="storefront-bio-label">Bio ហាង</span><p class="storefront-description">${esc(data.description)}</p></div>` : ''}
        </div>
      </div>
      <div class="storefront-stats">
        <div><strong>${rating ? esc(ratingLabel) : '—'}</strong><span>ការវាយតម្លៃ</span></div>
        <div><strong>${reviewCount}</strong><span>ការពិនិត្យ</span></div>
        <div><strong>${Number(data.total_views || 0).toLocaleString('km-KH')}</strong><span>ចំនួនមើល</span></div>
        <div><strong>${esc(memberSince)}</strong><span>សមាជិកតាំងពី</span></div>
      </div>
    </section>
    <section class="storefront-toolbar" aria-label="ស្វែងរកទំនិញក្នុងហាង">
      <input id="storeSearchInput" type="search" placeholder="ស្វែងរកក្នុងហាងនេះ..." value="${esc(state.currentStoreSearch)}" class="field">
      ${categoryFiltersMarkup}
      <span class="storefront-result-count" id="storeResultCount">${visible.length} / ${state.currentStoreTotal} មុខទំនិញ</span>
    </section>
    <section class="storefront-products-section">
      <div class="storefront-section-heading"><h2>ទំនិញក្នុងហាង</h2><span id="storeProductCount">${visible.length} មុខ</span></div>
      ${visible.length
        ? (aurora ? renderAuroraProductList(visible) : `<div id="storeProductGrid">${visible.map(productCard).join('')}</div>`)
        : `<div class="storefront-empty"><span>${ic('package', 30)}</span><strong>មិនមានទំនិញដែលត្រូវនឹងការស្វែងរកទេ</strong><p>សូមសាកល្បងពាក្យស្វែងរក ឬប្រភេទទំនិញផ្សេងទៀត។</p></div>`}
      ${state.currentStoreMoreError ? '<div class="storefront-more-error">មិនអាចផ្ទុកទំនិញបន្ថែមបានទេ។ សូមព្យាយាមម្តងទៀត។</div>' : ''}
      ${hasMore ? `<div class="storefront-load-more-wrap"><button type="button" class="storefront-load-more" data-store-load-more ${state.currentStoreMoreLoading ? 'disabled' : ''}>${state.currentStoreMoreLoading ? '<span class="loader" aria-hidden="true"></span>' : 'បង្ហាញបន្ថែម'}</button></div>` : ''}
    </section>
    ${reviews.length ? `
      <section class="storefront-reviews">
        <div class="storefront-section-heading"><h2>មតិយោបល់ពីអ្នកទិញ</h2><span>${reviewCount} ការពិនិត្យ</span></div>
        <div class="storefront-review-list">
          ${reviews.map(review => {
            const stars = Math.max(0, Math.min(5, Number(review.rating) || 0));
            const reviewDate = review.created_at ? new Date(review.created_at).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
            return `<article class="storefront-review">
              <div class="storefront-review-top"><strong>${esc(review.buyer_name || 'អ្នកទិញ')}</strong><time>${esc(reviewDate)}</time></div>
              <div class="storefront-review-stars" aria-label="${stars} ក្នុង 5 ផ្កាយ">${'★'.repeat(stars)}<span>${'★'.repeat(5-stars)}</span></div>
              ${review.comment ? `<p>${esc(review.comment)}</p>` : ''}
            </article>`;
          }).join('')}
        </div>
      </section>` : ''}
  `;

  $('storeSearchInput')?.addEventListener('input', event => {
    state.currentStoreSearch = event.target.value;
    updateStorefrontProductResults();
  });
  $('storeCategoryFilters')?.addEventListener('click', event => {
    const button = event.target.closest('[data-store-category]');
    if (button) { state.currentStoreCategory = button.dataset.storeCategory; state.currentStoreSubcategory = 'all'; renderStorefront(); }
  });
  $('storeSubcategoryFilters')?.addEventListener('click', event => {
    const button = event.target.closest('[data-store-subcategory]');
    if (button) { state.currentStoreSubcategory = button.dataset.storeSubcategory; renderStorefront(); }
  });
}

function updateStorefrontProductResults() {
  const root = $('storefrontContent');
  const section = root?.querySelector('.storefront-products-section');
  if (!section) return;
  const visible = state.currentStoreProducts.filter(storeProductMatchesFilters);
  const aurora = isAuroraStorefront();
  if (aurora) {
    const current = section.querySelector('#auroraProductList');
    const markup = renderAuroraProductList(visible);
    if (current) current.outerHTML = markup; else section.insertAdjacentHTML('beforeend', markup);
  } else {
    const current = section.querySelector('#storeProductGrid, .storefront-empty');
    if (visible.length) { const markup='<div id="storeProductGrid">'+visible.map(productCard).join('')+'</div>'; if(current?.id==='storeProductGrid')current.innerHTML=visible.map(productCard).join(''); else if(current)current.outerHTML=markup; else section.insertAdjacentHTML('beforeend',markup); }
    else { const markup='<div class="storefront-empty"><span>'+ic('package',30)+'</span><strong>មិនមានទំនិញដែលត្រូវនឹងការស្វែងរកទេ</strong></div>'; if(current)current.outerHTML=markup; else section.insertAdjacentHTML('beforeend',markup); }
  }
  const resultCount = $('storeResultCount');
  const productCount = $('storeProductCount');
  if (resultCount) resultCount.textContent = visible.length + ' / ' + state.currentStoreTotal + ' មុខទំនិញ';
  if (productCount) productCount.textContent = visible.length + ' មុខ';
}

function handleStorefrontAction(event) {
  if (event.target.closest('[data-store-retry]')) {
    void openStorefront(state.currentStoreId, { preserveScroll: true });
    return;
  }
  if (event.target.closest('[data-store-load-more]')) { void loadMoreStoreProducts(); return; }
  if (event.target.closest('[data-store-chat]')) { void startStoreChat(state.currentStoreId); return; }
  const auroraEdit=event.target.closest('[data-aurora-edit]');
  if(auroraEdit){event.preventDefault();event.stopPropagation();openAuroraProductEditor(auroraEdit.dataset.auroraEdit);return;}
  const heart = event.target.closest('[data-action="save"]');
  if (heart) { event.preventDefault(); event.stopPropagation(); Promise.resolve(saveAction(heart.dataset.id, heart)); return; }
  const view = event.target.closest('[data-action="view"]');
  if (view) void openProduct(view.dataset.id);
}

/* --------------------------------------------------------------------------
   10. Profile, Orders & Saved Items
   -------------------------------------------------------------------------- */

function syncProductDetailSaveButtons(productId, isSaved) {
  const root = $('productDetail');
  if (!root || String(state.currentProduct?.id || '') !== String(productId)) return;
  root.querySelectorAll('[data-product-action="save"]').forEach(node => {
    node.classList.toggle('is-saved', Boolean(isSaved));
    node.classList.toggle('saved', Boolean(isSaved));
    node.setAttribute('aria-pressed', String(Boolean(isSaved)));
    const label = node.querySelector('span');
    if (label) label.textContent = isSaved ? 'បានរក្សាទុក' : 'រក្សាទុក';
    if (node.classList.contains('product-gallery-save')) {
      node.setAttribute('aria-label', isSaved ? 'ដកចេញពីទំនិញដែលបានរក្សាទុក' : 'រក្សាទុករូបភាព');
      node.setAttribute('title', isSaved ? 'បានរក្សាទុក' : 'រក្សាទុក');
    }
  });
}

async function saveAction(productId, button) {
  const id = String(productId || '').trim();
  if (!id || !requireLogin()) return false;
  const wasSaved = [...state.savedIds].some(value => String(value) === id);
  const detailRoot = $('productDetail');
  const detailButtons = detailRoot && String(state.currentProduct?.id || '') === id
    ? [...detailRoot.querySelectorAll('[data-product-action="save"]')]
    : [];
  if (button) button.disabled = true;
  detailButtons.forEach(node => { node.disabled = true; });
  try {
    if (wasSaved) {
      await api('/api/saved/' + encodeURIComponent(id), { method: 'DELETE' });
      state.savedIds = new Set([...state.savedIds].filter(value => String(value) !== id));
      syncProductDetailSaveButtons(id, false);
      toast('បានដកចេញពីទំនិញដែលបានរក្សាទុក។');
      return false;
    }
    await api('/api/saved/' + encodeURIComponent(id), { method: 'POST' });
    state.savedIds.add(id);
    syncProductDetailSaveButtons(id, true);
    toast('បានរក្សាទុកទំនិញ!');
    return true;
  } catch (error) {
    toast(error.message || 'មិនអាចរក្សាទុកទំនិញបានទេ។', 'error');
    throw error;
  } finally {
    if (button) button.disabled = false;
    detailButtons.forEach(node => { node.disabled = false; });
  }
}
async function loadSaved() {
  const r = await api('/api/saved');
  state.savedIds = new Set((r.data || []).map((x) => x.products?.id).filter(Boolean));
  
  return r.data || [];
}

async function loadOrders() {
  const r = await api('/api/orders');
  state.myOrders = r.data || [];
  return state.myOrders;
}

async function loadOffers() {
  const r = await api('/api/offers');
  return r.data || [];
}

async function renderProfile() {
  if (!requireLogin()) return;
  await refreshSession();
  await renderTelegramSecurity();

  const p = state.me.profile || {};
  $('profileName').value = p.display_name || '';
  $('profilePhone').value = p.phone || state.session.user.phone || '';
  $('profileLocation').value = p.province || 'ភ្នំពេញ';
  $('profileBio').value = p.bio || '';
  setAvatar($('profileAvatar'), p.avatar_url, profileName());
  $('profileHeadingName').textContent = profileName();
  $('profileHeadingMeta').textContent = state.session.user.phone || (isInternalAuthEmail(state.session.user.email) ? '' : state.session.user.email) || 'សមាជិក 7inOne';

  const badges = [];
  if (isAdmin()) badges.push(`<span class="account-role-chip bg-violet-50 text-violet-700">${ic('shield', 12)} អ្នកគ្រប់គ្រង</span>`);
  if (isVerifiedSeller()) badges.push(`<span class="account-role-chip bg-sky-50 text-sky-700">${ic('checkcircle', 12)} អ្នកលក់បានផ្ទៀងផ្ទាត់</span>`);
  else if (isSellerAccount()) badges.push(`<span class="account-role-chip bg-amber-50 text-amber-700">${ic('store', 12)} អ្នកលក់ទូទៅ</span>`);
  $('profileSellerBadge').innerHTML = badges.join('');

  const cover = $('view-profile').querySelector('.cover');
  setProfileCover(cover, p.cover_url || '');
  $('profileApplyTop').textContent = state.me.vendor ? 'មើលស្ថានភាពហាង' : 'បើកហាងលក់នៅ 7inOne';
  await renderProfileTab();
}

function renderProfileTabSkeleton() {
  const root = $('profileTabContent');
  if (!root) return;
  const bar = (width, height) => `<span class="skeleton profile-sk-bar" style="width:${width};height:${height}px" aria-hidden="true"></span>`;
  root.innerHTML = `<div class="profile-sk-list" role="status" aria-label="កំពុងផ្ទុកព័ត៌មាន">
    ${Array.from({length:3},()=>`<div class="profile-sk-card"><span class="skeleton profile-sk-thumb"></span><div>${bar('76%',10)}${bar('54%',8)}${bar('38%',8)}</div></div>`).join('')}
  </div>`;
}
async function renderProfileTab() {
  if (!state.session) return;
  const cancelSkeleton = scheduleSkeleton(renderProfileTabSkeleton);
  try {
    if (state.profileTab === 'saved') {
      const saved = await loadSaved();
      $('profileActivityCount').textContent = `${saved.length} មុខ`;
      $('profileTabContent').innerHTML = saved.length
        ? `<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">${saved.map((row) => savedCard(row.products)).join('')}</div>`
        : '<div class="py-10 text-center text-xs text-slate-400">អ្នកមិនទាន់រក្សាទុកទំនិញណាមួយទេ។</div>';
    } else if (state.profileTab === 'history') {
      const [orders, offers] = await Promise.all([loadOrders(), loadOffers()]);
      $('profileActivityCount').textContent = `${orders.length} ការបញ្ជាទិញ · ${offers.length} សំណើ`;
      const orderHtml = orders.map((o) => `<div class="rounded-2xl border border-slate-100 p-3"><div class="flex justify-between"><b class="text-xs">Order #${esc(o.id.slice(0, 8))}</b><span class="text-[10px] font-bold text-emerald-700">${esc(o.status)}</span></div><p class="mt-1 text-[10px] text-slate-500">${fmtDate(o.created_at)} · ${money(o.total)}</p></div>`).join('');
      const offerHtml = offers.map((o) => `<div class="rounded-2xl border border-slate-100 p-3"><div class="flex justify-between"><b class="text-xs">${esc(o.products?.title || 'ទំនិញ')}</b><span class="text-[10px] font-bold text-amber-600">${esc(o.status)}</span></div><p class="mt-1 text-[10px] text-slate-500">ស្នើ ${money(o.offer_price)} · ${fmtDate(o.created_at)}</p></div>`).join('');
      $('profileTabContent').innerHTML = `<div class="space-y-3"><h4 class="text-xs font-bold">ប្រវត្តិការបញ្ជាទិញ</h4>${orderHtml || '<p class="text-[10px] text-slate-400">មិនទាន់មានការបញ្ជាទិញ។</p>'}<h4 class="pt-2 text-xs font-bold">ប្រវត្តិសំណើតថ្លៃ</h4>${offerHtml || '<p class="text-[10px] text-slate-400">មិនទាន់មានសំណើតម្លៃ។</p>'}</div>`;
    } else if (state.profileTab === 'my-posts') {
      await renderMyPosts();
    } else {
      const v = state.me.vendor;
      $('profileTabContent').innerHTML = v
        ? `<div class="rounded-2xl border border-slate-100 p-4"><b class="text-sm">${esc(v.store_name)}</b><p class="mt-1 text-xs text-slate-500">${esc(v.description || '')}<br>${esc(v.contact_phone || '')} · ${esc(v.address || '')}</p></div>`
        : `<div class="rounded-2xl bg-emerald-50 p-4"><b class="text-xs">ចុះឈ្មោះក្លាយជាអ្នកលក់</b><p class="mt-1 text-[11px] text-slate-600">បញ្ចូលព័ត៌មានហាង ដើម្បីចាប់ផ្តើមដាក់លក់។</p><button id="applySellerFromTab" class="mt-3 rounded-full brand-gradient px-5 py-2 text-[11px] font-bold text-white">ចុះឈ្មោះអ្នកលក់</button></div>`;
      $('applySellerFromTab')?.addEventListener('click', openSellerModal);
    }
  } catch (e) {
    $('profileTabContent').innerHTML = `<p class="text-xs text-rose-600">${esc(e.message)}</p>`;
  } finally {
    cancelSkeleton();
  }
}


async function renderMyPosts() {
  const result = await api('/api/my-posts');
  state.myPosts = result.data || [];
  state.myPostEditing = null;
  $('profileActivityCount').textContent = `${state.myPosts.length} ប្រកាស`;
  $('profileTabContent').innerHTML = `
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <input id="myPostsSearch" class="field min-w-[180px] flex-1" type="search" placeholder="ស្វែងរកប្រកាស..." />
        <select id="myPostsFilter" class="field w-auto min-w-[145px]">
          <option value="all">គ្រប់ប្រភេទ</option>
          <option value="product">ផលិតផល</option>
          <option value="job">ការងារ</option>
          <option value="property">អចលនទ្រព្យ</option>
          <option value="rental">ផ្ទះ/បន្ទប់ជួល</option>
          <option value="land">ដី</option>
          <option value="house_sale">ផ្ទះលក់</option>
          <option value="social_post">Community Post</option>
          <option value="story">Story</option>
        </select>
      </div>
      <div id="myPostsList" class="space-y-3"></div>
    </div>`;
  $('myPostsSearch')?.addEventListener('input', renderMyPostsList);
  $('myPostsFilter')?.addEventListener('change', renderMyPostsList);
  renderMyPostsList();
}

function renderMyPostSimpleEditForm(post) {
  return `
    <form data-my-post-edit-form data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3">
      ${post.type === 'social_post'
        ? `<label class="text-[10px] font-semibold">Caption<textarea name="caption" class="field mt-1" maxlength="500" rows="3">${esc(post.caption || '')}</textarea></label>`
        : `<label class="text-[10px] font-semibold">ចំណងជើង<input name="title" class="field mt-1" maxlength="160" required value="${esc(post.title || '')}"></label>
           <label class="text-[10px] font-semibold">ពិពណ៌នា<textarea name="description" class="field mt-1" rows="3" maxlength="5000">${esc(post.description || '')}</textarea></label>
           <label class="text-[10px] font-semibold">ទីតាំង<input name="location" class="field mt-1" maxlength="300" value="${esc(post.location || '')}"></label>
           <label class="text-[10px] font-semibold">YouTube Video Link<input name="youtube_video_url" class="field mt-1" type="url" maxlength="1000" value="${esc(post.youtube_video_url || '')}"></label>
           ${post.type === 'job'
             ? `<div class="grid grid-cols-2 gap-2"><label class="text-[10px]">ប្រាក់ខែចាប់ពី<input name="salary_min" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_min ?? '')}"></label><label class="text-[10px]">ប្រាក់ខែដល់<input name="salary_max" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_max ?? '')}"></label></div>`
             : post.type === 'product'
               ? `<div class="grid grid-cols-2 gap-2"><label class="text-[10px]">តម្លៃ<input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? 0)}"></label><label class="text-[10px]">ស្តុក<input name="stock" class="field mt-1" type="number" min="0" step="1" value="${esc(post.stock ?? 0)}"></label></div>`
               : `<label class="text-[10px]">តម្លៃ<input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? post.rent_amount ?? '')}"></label>`}`}
      <div class="flex justify-end gap-2"><button type="button" data-my-post-action="cancel" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-4 py-2 text-[10px] font-bold">បោះបង់</button><button type="submit" class="brand-gradient rounded-full px-4 py-2 text-[10px] font-bold text-white">រក្សាទុក</button></div>
    </form>`;
}

function renderMyPostFullEditForm(post) {
  const isJob = post.type === 'job';
  const categories = Object.entries(isJob ? LISTING_TAXONOMY.jobs : LISTING_TAXONOMY.properties);
  const hasCurrentCategory = categories.some(([key]) => key === String(post.category || ''));
  const currentCategoryOption = post.category && !hasCurrentCategory ? `<option value="${esc(post.category)}" selected>${esc(post.category)}</option>` : '';
  const categoryOptions = currentCategoryOption + categories.map(([key, item]) => `<option value="${esc(key)}" ${post.category === key ? 'selected' : ''}>${esc(item.label || item.name || key)}</option>`).join('');
  const images = Array.isArray(post.image_items) ? post.image_items : [];
  const specs = post.specifications && typeof post.specifications === 'object' ? { ...post.specifications } : {};
  const googleMapUrl = specs.google_map_url || '';
  delete specs.google_map_url;
  const imageMarkup = images.map((image, index) => `<label class="my-post-image-choice"><img src="${esc(image.image_url)}" alt="រូបភាព ${index + 1}" loading="lazy"><span><input type="checkbox" data-keep-listing-image value="${esc(image.key)}" checked> រក្សារូបនេះ</span></label>`).join('');
  return `
    <form data-my-post-edit-form data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="my-post-full-edit-form mt-3 grid gap-3 rounded-xl p-3">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="sm:col-span-2"><span class="label">${isJob ? 'មុខតំណែង / Job Title' : 'ចំណងជើងអចលនទ្រព្យ'} *</span><input name="title" class="field mt-1" maxlength="160" required value="${esc(post.title || '')}"></label>
        <label><span class="label">${isJob ? 'ប្រភេទការងារ' : 'ប្រភេទអចលនទ្រព្យ'} *</span><select name="category" class="field mt-1" required>${categoryOptions}</select></label>
        ${isJob ? `<label><span class="label">ក្រុមហ៊ុន / អ្នកជ្រើសរើស</span><input name="company_name" class="field mt-1" maxlength="160" value="${esc(post.company_name || '')}"></label>` : ''}
        <label><span class="label">ផ្នែករង</span><input name="subcategory" class="field mt-1" maxlength="120" value="${esc(post.subcategory || '')}"></label>
        <label><span class="label">ប្រភេទលម្អិត</span><input name="detail_type" class="field mt-1" maxlength="120" value="${esc(post.detail_type || '')}"></label>
        <label class="sm:col-span-2"><span class="label">ទីតាំង</span><input name="location" class="field mt-1" maxlength="120" value="${esc(post.location || '')}"></label>
        ${isJob
          ? `<label><span class="label">ចំនួនត្រូវជ្រើសរើស</span><input name="vacancies" class="field mt-1" type="number" min="1" max="999" value="${esc(post.vacancies ?? 1)}"></label>
             <label><span class="label">ប្រភេទការងារ</span><select name="employment_type" class="field mt-1"><option value="full_time" ${post.employment_type === 'full_time' ? 'selected' : ''}>ពេញម៉ោង</option><option value="part_time" ${post.employment_type === 'part_time' ? 'selected' : ''}>ក្រៅម៉ោង</option><option value="contract" ${post.employment_type === 'contract' ? 'selected' : ''}>កិច្ចសន្យា</option><option value="internship" ${post.employment_type === 'internship' ? 'selected' : ''}>ហាត់ការ</option><option value="freelance" ${post.employment_type === 'freelance' ? 'selected' : ''}>Freelance</option></select></label>
             <label><span class="label">ប្រាក់ខែចាប់ពី (USD)</span><input name="salary_min" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_min ?? '')}"></label>
             <label><span class="label">ប្រាក់ខែដល់ (USD)</span><input name="salary_max" class="field mt-1" type="number" min="0" step="any" value="${esc(post.salary_max ?? '')}"></label>
             <label><span class="label">របៀបបង្ហាញប្រាក់ខែ</span><select name="salary_period" class="field mt-1"><option value="monthly" ${post.salary_period === 'monthly' ? 'selected' : ''}>ប្រចាំខែ</option><option value="daily" ${post.salary_period === 'daily' ? 'selected' : ''}>ប្រចាំថ្ងៃ</option><option value="hourly" ${post.salary_period === 'hourly' ? 'selected' : ''}>ប្រចាំម៉ោង</option><option value="negotiable" ${post.salary_period === 'negotiable' ? 'selected' : ''}>ចរចា</option></select></label>
             <label><span class="label">ម៉ោងធ្វើការ</span><input name="work_schedule" class="field mt-1" value="${esc(post.work_schedule || '')}"></label>
             <label><span class="label">ថ្ងៃឈប់សម្រាក</span><input name="days_off" class="field mt-1" value="${esc(post.days_off || '')}"></label>
             <label><span class="label">បទពិសោធន៍</span><input name="experience" class="field mt-1" value="${esc(post.experience || '')}"></label>
             <label><span class="label">កម្រិតសិក្សា</span><input name="education" class="field mt-1" value="${esc(post.education || '')}"></label>
             <label class="sm:col-span-2"><span class="label">ជំនាញ (បំបែកដោយក្បៀស)</span><input name="skills_text" class="field mt-1" value="${esc(Array.isArray(post.skills) ? post.skills.join(', ') : '')}"></label>
             <label class="sm:col-span-2"><span class="label">ភាសា (បំបែកដោយក្បៀស)</span><input name="languages_text" class="field mt-1" value="${esc(Array.isArray(post.languages) ? post.languages.join(', ') : '')}"></label>
             <label class="sm:col-span-2"><span class="label">អត្ថប្រយោជន៍ (បំបែកដោយក្បៀស)</span><input name="benefits_text" class="field mt-1" value="${esc(Array.isArray(post.benefits) ? post.benefits.join(', ') : '')}"></label>`
          : `<label><span class="label">តម្លៃ (USD)</span><input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? '')}"></label>
             <label><span class="label">របៀបកំណត់តម្លៃ</span><select name="price_period" class="field mt-1"><option value="total" ${post.price_period === 'total' ? 'selected' : ''}>តម្លៃសរុប</option><option value="monthly" ${post.price_period === 'monthly' ? 'selected' : ''}>ប្រចាំខែ</option><option value="daily" ${post.price_period === 'daily' ? 'selected' : ''}>ប្រចាំថ្ងៃ</option><option value="yearly" ${post.price_period === 'yearly' ? 'selected' : ''}>ប្រចាំឆ្នាំ</option><option value="negotiable" ${post.price_period === 'negotiable' ? 'selected' : ''}>ចរចា</option></select></label>
             <label><span class="label">ទំហំ (m²)</span><input name="area_sqm" class="field mt-1" type="number" min="0" step="any" value="${esc(post.area_sqm ?? '')}"></label>
             <label><span class="label">បន្ទប់គេង</span><input name="bedrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bedrooms ?? '')}"></label>
             <label><span class="label">បន្ទប់ទឹក</span><input name="bathrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bathrooms ?? '')}"></label>
             <label><span class="label">អាសយដ្ឋានលម្អិត</span><input name="address" class="field mt-1" maxlength="300" value="${esc(post.address || '')}"></label>`}
        <label class="sm:col-span-2"><span class="label">YouTube Video Link</span><input name="youtube_video_url" class="field mt-1" type="url" maxlength="1000" value="${esc(post.youtube_video_url || '')}"></label>
        <label class="sm:col-span-2"><span class="label">Google Maps Link</span><input name="google_map_url" class="field mt-1" type="url" maxlength="1000" value="${esc(googleMapUrl)}"></label>
        <label class="sm:col-span-2"><span class="label">ការពិពណ៌នាសង្ខេប</span><textarea name="short_description" class="field mt-1" rows="2" maxlength="300">${esc(post.short_description || '')}</textarea></label>
        <label class="sm:col-span-2"><span class="label">ការពិពណ៌នាលម្អិត *</span><textarea name="description" class="field mt-1" rows="5" maxlength="5000" required>${esc(post.description || '')}</textarea></label>
        <input type="hidden" name="specifications" value="${esc(JSON.stringify(specs))}">
        <input type="hidden" name="keep_image_message_ids" value="[]">
      </div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label><span class="label">Province Code</span><input name="province_code" class="field mt-1" maxlength="2" value="${esc(post.province_code || '')}"></label>
        <label><span class="label">District Code</span><input name="district_code" class="field mt-1" maxlength="4" value="${esc(post.district_code || '')}"></label>
        <label><span class="label">Commune Code</span><input name="commune_code" class="field mt-1" maxlength="6" value="${esc(post.commune_code || '')}"></label>
        <label><span class="label">Village Code</span><input name="village_code" class="field mt-1" maxlength="8" value="${esc(post.village_code || '')}"></label>
      </div>
      <div class="grid gap-2">
        <span class="label">រូបភាពបច្ចុប្បន្ន · ដោះធីករូបដែលចង់លុប</span>
        <div class="my-post-image-grid">${imageMarkup || '<span class="text-[10px] text-slate-400">មិនទាន់មានរូបភាព</span>'}</div>
        <label><span class="label">បន្ថែមរូបភាព (JPG / PNG / WEBP · 8MB/រូប · អតិបរមា ១០ រូបសរុប)</span><input class="field mt-1" type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple></label>
      </div>
      <div class="flex justify-end gap-2"><button type="button" data-my-post-action="cancel" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-4 py-2 text-[10px] font-bold">បោះបង់</button><button type="submit" class="brand-gradient rounded-full px-4 py-2 text-[10px] font-bold text-white">រក្សាទុកព័ត៌មានទាំងអស់</button></div>
    </form>`;
}

function renderMyPostLegacyRealEstateEditForm(post) {
  const categories = Object.entries(LISTING_TAXONOMY.properties);
  const hasCurrentCategory = categories.some(([key]) => key === String(post.category || ''));
  const currentCategoryOption = post.category && !hasCurrentCategory ? `<option value="${esc(post.category)}" selected>${esc(post.category)}</option>` : '';
  const categoryOptions = currentCategoryOption + categories.map(([key, item]) => `<option value="${esc(key)}" ${post.category === key ? 'selected' : ''}>${esc(item.label || item.name || key)}</option>`).join('');
  const image = (post.image_items || [])[0];
  const isRental = post.type === 'rental';
  const isLand = post.type === 'land';
  return `
    <form data-my-post-edit-form data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="my-post-full-edit-form mt-3 grid gap-3 rounded-xl p-3">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="sm:col-span-2"><span class="label">ចំណងជើងប្រកាស *</span><input name="title" class="field mt-1" maxlength="160" required value="${esc(post.title || '')}"></label>
        <label><span class="label">ប្រភេទអចលនទ្រព្យ</span><select name="category" class="field mt-1">${categoryOptions}</select></label>
        <label><span class="label">ទីតាំង</span><input name="location" class="field mt-1" maxlength="120" value="${esc(post.location || '')}"></label>
        <label class="sm:col-span-2"><span class="label">អាសយដ្ឋានលម្អិត</span><input name="address" class="field mt-1" maxlength="300" value="${esc(post.address || '')}"></label>
        <label><span class="label">តម្លៃ (USD)</span><input name="price" class="field mt-1" type="number" min="0" step="any" value="${esc(post.price ?? post.rent_amount ?? '')}"></label>
        ${isRental ? `<label><span class="label">រយៈពេលជួល</span><select name="rent_period" class="field mt-1"><option value="monthly" ${post.rent_period === 'monthly' ? 'selected' : ''}>ប្រចាំខែ</option><option value="daily" ${post.rent_period === 'daily' ? 'selected' : ''}>ប្រចាំថ្ងៃ</option><option value="yearly" ${post.rent_period === 'yearly' ? 'selected' : ''}>ប្រចាំឆ្នាំ</option></select></label>` : ''}
        ${!isLand ? `<label><span class="label">ប្រភេទអចលនទ្រព្យលម្អិត</span><input name="property_type" class="field mt-1" value="${esc(post.property_type || '')}"></label>` : `<label><span class="label">ប្រភេទដី</span><input name="land_type" class="field mt-1" value="${esc(post.land_type || '')}"></label>`}
        <label><span class="label">ទំហំ (m²)</span><input name="area_sqm" class="field mt-1" type="number" min="0" step="any" value="${esc(post.area_sqm ?? '')}"></label>
        ${!isLand ? `<label><span class="label">បន្ទប់គេង</span><input name="bedrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bedrooms ?? '')}"></label><label><span class="label">បន្ទប់ទឹក</span><input name="bathrooms" class="field mt-1" type="number" min="0" step="1" value="${esc(post.bathrooms ?? '')}"></label><label><span class="label">គ្រឿងសង្ហារិម</span><input name="furnished" class="field mt-1" value="${esc(post.furnished || '')}"></label>` : `<label><span class="label">ប្លង់កម្មសិទ្ធិ</span><input name="title_deed" class="field mt-1" value="${esc(post.title_deed || '')}"></label><label><span class="label">ផ្លូវចូល</span><input name="road_access" class="field mt-1" value="${esc(post.road_access || '')}"></label>`}
        ${!isLand && !isRental ? `<label><span class="label">ប្លង់កម្មសិទ្ធិ</span><input name="title_deed" class="field mt-1" value="${esc(post.title_deed || '')}"></label>` : ''}
        <label class="sm:col-span-2"><span class="label">YouTube Video Link</span><input name="youtube_video_url" class="field mt-1" type="url" maxlength="1000" value="${esc(post.youtube_video_url || '')}"></label>
        <label class="sm:col-span-2"><span class="label">ការពិពណ៌នាលម្អិត *</span><textarea name="description" class="field mt-1" rows="5" maxlength="5000" required>${esc(post.description || '')}</textarea></label>
        <input type="hidden" name="keep_image_message_ids" value="[]">
      </div>
      <div class="grid gap-2">
        <span class="label">រូបភាពបច្ចុប្បន្ន · ដោះធីកដើម្បីលុប</span>
        <div class="my-post-image-grid">${image ? `<label class="my-post-image-choice"><img src="${esc(image.image_url)}" alt="រូបភាពបច្ចុប្បន្ន"><span><input type="checkbox" data-keep-listing-image value="${esc(image.key)}" checked> រក្សារូបនេះ</span></label>` : '<span class="text-[10px] text-slate-400">មិនទាន់មានរូបភាព</span>'}</div>
        <label><span class="label">ជ្រើសរើសរូបថ្មី (JPG / PNG / WEBP · 8MB)</span><input class="field mt-1" type="file" name="image" accept="image/jpeg,image/png,image/webp"></label>
      </div>
      <div class="flex justify-end gap-2"><button type="button" data-my-post-action="cancel" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-4 py-2 text-[10px] font-bold">បោះបង់</button><button type="submit" class="brand-gradient rounded-full px-4 py-2 text-[10px] font-bold text-white">រក្សាទុកព័ត៌មានទាំងអស់</button></div>
    </form>`;
}

function renderMyPostsList() {
  const target = $('myPostsList');
  if (!target) return;
  const term = String($('myPostsSearch')?.value || '').trim().toLowerCase();
  const filter = $('myPostsFilter')?.value || 'all';
  const rows = state.myPosts.filter(post =>
    (filter === 'all' || post.type === filter) &&
    (!term || String(post.title || post.caption || '').toLowerCase().includes(term) ||
      String(post.description || '').toLowerCase().includes(term))
  );
  target.innerHTML = rows.map(post => {
    const key = post.type + ':' + post.id;
    const editing = state.myPostEditing === key;
    const status = post.status === 'active' ? 'កំពុងផ្សាយ'
      : ['expired','archived'].includes(post.status) ? 'ផុតសុពលភាព'
      : post.status === 'sold' ? 'លក់រួច' : post.status === 'rented' ? 'ជួលរួច'
      : post.status === 'closed' ? 'បានបិទ' : post.status;
    const amount = post.price ?? post.rent_amount ?? post.salary_min;
    const image = post.image_url ? `<img src="${esc(post.image_url)}" alt="" class="h-16 w-16 shrink-0 rounded-xl object-cover">` : `<div class="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400">${ic('image',20)}</div>`;
    const editForm = editing ? (['job','property'].includes(post.type) ? renderMyPostFullEditForm(post) : ['rental','land','house_sale'].includes(post.type) ? renderMyPostLegacyRealEstateEditForm(post) : renderMyPostSimpleEditForm(post)) : '';
    return `
      <article class="rounded-2xl border border-slate-100 bg-white p-3" data-my-post-card="${esc(key)}">
        <div class="flex items-start gap-3">
          ${image}
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2"><span class="text-[9px] font-bold text-slate-500">${esc(post.type_label || post.type)}</span><span class="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600">${esc(status)}</span></div>
            <b class="mt-1 block truncate text-xs">${esc(post.title || post.caption || 'Story')}</b>
            <p class="mt-1 line-clamp-2 text-[10px] text-slate-500">${esc(post.description || post.caption || '')}</p>
            <div class="mt-1 text-[9px] text-slate-400">${post.created_at ? fmtDate(post.created_at) : ''}${amount != null ? ' · ' + money(amount) : ''}</div>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          ${post.editable ? `<button type="button" data-my-post-action="edit" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full border border-slate-200 px-3 py-2 text-[9px] font-bold text-slate-700">កែប្រែ</button>` : ''}
          ${post.renewable ? `<button type="button" data-my-post-action="renew" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full bg-emerald-50 px-3 py-2 text-[9px] font-bold text-emerald-700">Renew</button>` : ''}
          ${post.type !== 'social_post' && post.status === 'active' ? `<button type="button" data-my-post-action="expire" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full bg-amber-50 px-3 py-2 text-[9px] font-bold text-amber-700">Expire</button>` : ''}
          <button type="button" data-my-post-action="delete" data-type="${esc(post.type)}" data-id="${esc(post.id)}" class="rounded-full bg-rose-50 px-3 py-2 text-[9px] font-bold text-rose-700">លុប</button>
        </div>
        ${editForm}
      </article>`;
  }).join('') || '<div class="py-10 text-center text-xs text-slate-400">មិនទាន់មានប្រកាសក្នុងប្រភេទនេះទេ។</div>';
}

function savedCard(p) {
  if (!p) return '';
  return `<div data-saved-card="${esc(p.id)}" class="flex gap-3 rounded-2xl border border-slate-100 bg-white p-2.5">${productImage(p) ? `<img class="h-20 w-20 shrink-0 rounded-xl object-cover" src="${esc(productImage(p))}">` : `<div class="grid h-20 w-20 place-items-center rounded-xl bg-slate-100">${ic('image', 20)}</div>`}<div class="min-w-0 flex-1"><b class="block truncate text-xs">${esc(p.title)}</b><b class="mt-1 block text-sm text-emerald-700">${money(p.price)}</b><div class="mt-2 flex gap-3"><button data-open-product="${esc(p.id)}" class="text-[10px] font-bold text-emerald-700">មើលទំនិញ</button><button data-remove-saved="${esc(p.id)}" class="text-[10px] font-bold text-rose-600">ដកចេញ</button></div></div></div>`;
}

/* --------------------------------------------------------------------------
   11. Seller Center & Admin Panel
   -------------------------------------------------------------------------- */
function openSellerModal() {
  if (!requireLogin()) return;
  const vendor = state.me?.vendor;
  if (vendor?.status === 'approved') { toast('ហាងរបស់អ្នកបានផ្ទៀងផ្ទាត់រួចហើយ។'); return; }
  if (vendor?.status === 'blocked') { toast('ហាងនេះត្រូវបានបិទដោយ Admin។', 'error'); return; }
  $('sellerApplyForm').reset();
  $('shopName').value = vendor?.store_name || '';
  $('shopContact').value = vendor?.contact_phone || '';
  $('shopAddress').value = vendor?.address || '';
  $('sellerDocThumb').innerHTML = ic('file', 22);
  $('sellerDocPreview').classList.add('hidden');
  openModal('sellerModal');
}

function revokeProductImagePreviews() {
  (state.selectedProductImages || []).forEach((item) => {
    if (item.kind === 'new' && item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  });
}
function updateProductYoutubePreview() {
  const input = $('productYoutubeVideoUrl');
  const preview = $('productYoutubePreview');
  if (!input || !preview) return;
  const value = input.value.trim();
  const videoId = youtubeVideoId(value);
  if (!value) {
    preview.classList.add('hidden');
    preview.innerHTML = '';
    return;
  }
  preview.classList.remove('hidden');
  preview.innerHTML = videoId
    ? `<div class="product-youtube-preview-head"><span>${ic('play',15)} YouTube Preview</span><small>បង្ហាញជាមួយ Gallery ផលិតផល</small></div><div class="product-youtube-preview-frame">${productGalleryVideoFrameMarkup(videoId, $('productTitle')?.value || 'Product video', false)}</div>`
    : '<p class="product-youtube-preview-invalid">សូមបញ្ចូល YouTube Link ដែលមានទម្រង់ត្រឹមត្រូវ។</p>';
}

function renderProductImageAlbum() {
  const album = $('productImageAlbum');
  const images = state.selectedProductImages || [];
  if (!album) return;
  $('productImageName').textContent = images.length ? (images.length + ' / ១០ រូបបានជ្រើសរើស') : 'ជ្រើសរើសរូបភាពផលិតផល';
  album.innerHTML = images.length ? images.map((item, index) => {
    const src = item.kind === 'new' ? item.previewUrl : item.image_url;
    const main = index === 0;
    return '<div class="product-album-item ' + (main ? 'is-main' : '') + '">' +
      '<img src="' + esc(src) + '" alt="រូបភាពផលិតផល ' + (index + 1) + '">' +
      (main ? '<span class="product-album-main-badge">រូបមេ</span>' : '') +
      '<span class="product-album-index">' + (index + 1) + '</span>' +
      (main ? '<span class="product-album-main-label">រូបមេដែលបានជ្រើស</span>' : '<button type="button" class="product-album-set-main" data-product-image-main="' + index + '">កំណត់ជារូបមេ</button>') +
      '<button type="button" class="product-album-remove" data-product-image-remove="' + index + '" aria-label="លុបរូបភាព">' + ic('x', 14) + '</button></div>';
  }).join('') : '<div class="product-album-empty"><span>' + ic('images', 25) + '</span><b>មិនទាន់មានរូបភាពទេ</b><small>ជ្រើសរើសរូបភាពរហូតដល់ ១០ រូប</small></div>';
  document.querySelector('.product-album-picker')?.classList.toggle('is-full', images.length >= 10);
  $('productImage').disabled = images.length >= 10;
}

const listingImageAlbums = new WeakMap();
function listingAlbumRoot(kind) { return document.querySelector('[data-listing-image-album="'+kind+'"]'); }
function revokeListingAlbum(kind) {
  const root=listingAlbumRoot(kind); const items=root?listingImageAlbums.get(root)||[]:[];
  items.forEach(item=>{if(item.previewUrl)URL.revokeObjectURL(item.previewUrl);});
  if(root){listingImageAlbums.set(root,[]);renderListingAlbum(root);}
}
function renderListingAlbum(root) {
  if(!root)return;
  const items=listingImageAlbums.get(root)||[];
  const count=root.querySelector('[data-listing-image-count]');
  const grid=root.querySelector('[data-listing-image-grid]');
  const input=root.querySelector('[data-listing-image-input]');
  if(count)count.textContent=items.length+' / ១០ រូបបានជ្រើសរើស';
  if(grid)grid.innerHTML=items.length?items.map((item,index)=>'<div class="product-album-item '+(index===0?'is-main':'')+'"><img src="'+esc(item.previewUrl)+'" alt="រូបភាព '+(index+1)+'">'+(index===0?'<span class="product-album-main-badge">រូបមេ</span>':'<button type="button" class="product-album-set-main" data-listing-image-main="'+index+'">កំណត់ជារូបមេ</button>')+'<span class="product-album-index">'+(index+1)+'</span><button type="button" class="product-album-remove" data-listing-image-remove="'+index+'" aria-label="លុបរូបភាព">'+ic('x',14)+'</button></div>').join(''):'<div class="product-album-empty"><span>▧</span><b>មិនទាន់មានរូបភាពទេ</b><small>ជ្រើសរើសរូបភាពរហូតដល់ ១០ រូប</small></div>';
  root.querySelector('[data-listing-image-picker]')?.classList.toggle('is-full',items.length>=10);
  if(input)input.disabled=items.length>=10;
}
function bindListingImageAlbums() {
  document.querySelectorAll('[data-listing-image-album]').forEach(root=>{
    if(root.dataset.albumBound==='true')return;
    listingImageAlbums.set(root,[]);
    const input=root.querySelector('[data-listing-image-input]');
    input?.addEventListener('change',()=>{
      const items=listingImageAlbums.get(root)||[];
      const allowed=new Set(['image/jpeg','image/png','image/webp']);
      for(const file of Array.from(input.files||[])){
        if(!allowed.has(file.type)){toast('សូមប្រើ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ។','error');continue;}
        if(file.size>8*1024*1024){toast('រូបភាពនីមួយៗមិនអាចធំជាង 8MB បានទេ។','error');continue;}
        if(items.length>=10){toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូប។','error');break;}
        items.push({file,previewUrl:URL.createObjectURL(file)});
      }
      listingImageAlbums.set(root,items);renderListingAlbum(root);input.value='';
    });
    root.querySelector('[data-listing-image-grid]')?.addEventListener('click',event=>{
      const main=event.target.closest('[data-listing-image-main]');
      const remove=event.target.closest('[data-listing-image-remove]');
      const items=listingImageAlbums.get(root)||[];
      if(main){const index=Number(main.dataset.listingImageMain);if(items[index])items.unshift(items.splice(index,1)[0]);}
      if(remove){const index=Number(remove.dataset.listingImageRemove);const item=items[index];if(item?.previewUrl)URL.revokeObjectURL(item.previewUrl);items.splice(index,1);}
      listingImageAlbums.set(root,items);renderListingAlbum(root);
    });
    root.dataset.albumBound='true';renderListingAlbum(root);
  });
}

/* --------------------------------------------------------------------------
   Unified listing creation: jobs and real estate are isolated from products.
   Extend this registry as new marketplace categories are introduced.
   -------------------------------------------------------------------------- */

const PRODUCT_TAXONOMY = {
  computers: {
    subs: ['Laptop / កុំព្យូទ័រយួរដៃ','Desktop PC','All-in-One PC','Monitor','Computer Hardware'],
    details: ['Laptop','Desktop PC','All-in-One','Monitor','CPU','RAM','GPU / VGA','Motherboard','HDD','SATA SSD','NVMe / M.2 SSD','External SSD','USB Flash Drive','Power Supply']
  },
  computer_accessories: {
    subs: ['Laptop Bags','Keyboards','Computer Mouse','Chargers','Cables & Adapters','Webcams','Headphones & Speakers','Other Computer Accessories'],
    details: ['Computer Bag','Keyboard','Mouse','Charger','Cable / Adapter','Webcam','Headphones','Speaker','Computer Accessories']
  },
  phones: {
    subs: ['ស្មាតហ្វូន','Tablet & iPad','កុំព្យូទ័រ និង Laptop','Computer Hardware','គ្រឿងបន្លាស់ទូរស័ព្ទ','កាមេរ៉ា','សំឡេង និង Audio','Gaming','Network & Internet','Printer & Scanner','Software & License','ឧបករណ៍អេឡិចត្រូនិកផ្សេងៗ'],
    details: ['iPhone','Samsung Galaxy','Xiaomi / Redmi','OPPO','Vivo','Huawei','iPad','Android Tablet','Laptop','Desktop PC','CPU','RAM','GPU / VGA','Motherboard','HDD','SATA SSD','NVMe / M.2 SSD','External SSD','USB Flash Drive','Power Supply','Monitor','Keyboard','Mouse','Webcam','Router','Switch','Printer','Scanner','Headphones','Speaker','Camera Lens','Gaming Console','Software License']
  },
  vehicles: {
    subs: ['រថយន្ត','ម៉ូតូ','ម៉ូតូកង់បី','រថយន្តដឹកទំនិញ','កង់','គ្រឿងបន្លាស់ និង Accessories'],
    details: ['Sedan','SUV','Crossover','Pickup','Van','Luxury Car','Electric Car','Hybrid Car','Sport Motorcycle','Scooter','Underbone','Tuk Tuk','Truck','Bus','Bicycle','Engine Parts','Tires & Wheels','Battery','Accessories']
  },
  property: {
    subs: ['ផ្ទះ','ដី','ខុនដូ','អាផាតមិន','អគារពាណិជ្ជកម្ម'],
    details: ['ផ្ទះលក់','ផ្ទះជួល','ដីលក់','ដីជួល','ខុនដូលក់','អាផាតមិនជួល','ហាង','ការិយាល័យ','ឃ្លាំង']
  },
  fashion: {
    subs: ['សម្លៀកបំពាក់បុរស','សម្លៀកបំពាក់នារី','សម្លៀកបំពាក់កុមារ','ស្បែកជើង','កាបូប','នាឡិកា និងគ្រឿងអលង្ការ'],
    details: ['អាវ','ខោ','រ៉ូប','សំពត់','អាវក្រៅ','ស្បែកជើងកីឡា','ស្បែកជើងផ្លូវការ','កាបូបដៃ','កាបូបស្ពាយ','នាឡិកា','វ៉ែនតា','គ្រឿងអលង្ការ']
  },
  furniture: {
    subs: ['បន្ទប់គេង','បន្ទប់ទទួលភ្ញៀវ','ផ្ទះបាយ','ការិយាល័យ','គ្រឿងតុបតែងផ្ទះ'],
    details: ['គ្រែ','ពូក','ទូខោអាវ','សាឡុង','តុ','កៅអី','ទូដាក់ឥវ៉ាន់','តុបាយ','ទូរទស្សន៍','ភ្លើងបំភ្លឺ','វាំងនន','គ្រឿងតុបតែង']
  }
};
const PRODUCT_SPEC_FIELDS = {
  computers: ['ម៉ាក / Brand','ម៉ូដែល / Model','CPU','RAM','Storage','GPU','ទំហំអេក្រង់','Operating System','ពណ៌','ទម្ងន់','Battery'],
  computer_accessories: ['ម៉ាក / Brand','ម៉ូដែល / Model','ប្រភេទ Connection','ពណ៌','Compatibility','Warranty'],
  phones: ['ម៉ាក / Brand','ម៉ូដែល / Model','ទំហំ / Capacity','RAM','Storage','ពណ៌','ស្ថានភាពធានា'],
  vehicles: ['ម៉ាក / Brand','ម៉ូដែល / Model','ឆ្នាំផលិត','ចំណុះម៉ាស៊ីន (cc)','ប្រអប់លេខ','ប្រភេទប្រេង','ចម្ងាយបើកបរ (km)','ពណ៌','ឯកសារពន្ធ'],
  property: ['ទីតាំងលម្អិត','ទំហំដី (m²)','ទំហំសំណង់ (m²)','បន្ទប់គេង','បន្ទប់ទឹក','ប្រភេទប្លង់'],
  fashion: ['ម៉ាក / Brand','ទំហំ / Size','ពណ៌','សម្ភារៈ','សម្រាប់ភេទ / Gender'],
  furniture: ['ម៉ាក / Brand','សម្ភារៈ','ទំហំ (បណ្តោយ × ទទឹង × កម្ពស់)','ពណ៌','ស្ថានភាព']
};
const PRODUCT_DETAIL_SPEC_FIELDS = {
  'CPU': ['CPU Brand (Intel / AMD)','CPU Series & Model','Generation','Socket','Cores / Threads','Base / Boost Clock (GHz)'],
  'RAM': ['RAM Type (DDR3 / DDR4 / DDR5)','Capacity (4 / 8 / 16 / 32 / 64GB)','Form Factor (Desktop DIMM / Laptop SO-DIMM)','Speed (MHz)','Brand'],
  'GPU / VGA': ['GPU Brand (NVIDIA / AMD / Intel)','GPU Model (RTX / GTX / Radeon)','VRAM (4 / 6 / 8 / 12 / 16GB)','Memory Type (GDDR6 / GDDR6X)','Condition'],
  'HDD': ['Capacity (GB / TB)','RPM (5400 / 7200)','Interface (SATA / USB)','Form Factor (2.5 / 3.5 inch)'],
  'SATA SSD': ['Capacity (128 / 256 / 512GB / 1TB / 2TB)','Interface (SATA III)','Form Factor (2.5 inch / M.2 SATA)','Read / Write Speed'],
  'NVMe / M.2 SSD': ['Capacity (256 / 512GB / 1TB / 2TB)','Interface (NVMe PCIe 3.0 / 4.0 / 5.0)','Form Factor (M.2 2230 / 2242 / 2280)','Read / Write Speed'],
  'External SSD': ['Capacity (256 / 512GB / 1TB / 2TB)','Connection (USB-C / USB 3.0 / Thunderbolt)','Read / Write Speed'],
  'USB Flash Drive': ['Capacity (16 / 32 / 64 / 128 / 256GB)','USB Version (2.0 / 3.0 / 3.2 / Type-C)'],
  'Motherboard': ['Brand & Model','CPU Socket','Chipset','Form Factor (ATX / mATX / ITX)','RAM Type & Slots','M.2 / SATA Slots'],
  'Power Supply': ['Wattage (W)','80 PLUS Rating','Modular Type (Full / Semi / Non)','Connector Support'],
  'Monitor': ['Screen Size (inch)','Resolution (FHD / QHD / 4K)','Refresh Rate (Hz)','Panel (IPS / VA / OLED)','Ports (HDMI / DP / USB-C)'],
  'Laptop': ['Brand','CPU Model','RAM Type & Capacity','GPU Model & VRAM','Storage Type & Capacity','Screen Size','Resolution','Operating System','Color','Weight','Battery Health'],
  'Desktop PC': ['CPU Model','RAM Type & Capacity','GPU Model & VRAM','Storage Type & Capacity','Motherboard','Power Supply Wattage']
};
function renderProductTaxonomy(category) {
  const entry = PRODUCT_TAXONOMY[category];
  const setOptions = (select, placeholder, values) => {
    select.innerHTML = '<option value="">' + placeholder + '</option>' + (values || []).map(value => '<option value="' + esc(value) + '">' + esc(value) + '</option>').join('');
  };
  setOptions($('productSubcategory'), 'ជ្រើសរើសផ្នែករង', entry?.subs || []);
  setOptions($('productDetailType'), 'ជ្រើសរើសប្រភេទលម្អិត', entry?.details || []);
  renderProductSpecFields(category);
}
function renderProductSpecFields(category) {
  const detail = $('productDetailType')?.value || '';
  const fields = PRODUCT_DETAIL_SPEC_FIELDS[detail] || PRODUCT_SPEC_FIELDS[category] || [];
  const stableKeys = {
    'Brand':'brand','CPU Model':'cpu_model','RAM Type & Capacity':'ram_type_capacity',
    'GPU Model & VRAM':'gpu_model_vram','Storage Type & Capacity':'storage_type_capacity',
    'Screen Size':'screen_size','Resolution':'resolution','Operating System':'operating_system','Color':'color','Weight':'weight','Battery Health':'battery_health'
  };
  $('productSpecificationFields').innerHTML = fields.length
    ? '<h3 class="sm:col-span-2 text-xs font-bold text-slate-300">លក្ខណៈសម្បត្តិផលិតផល</h3>' + fields.map((label,index) =>
      '<label><span class="label">' + esc(label) + '</span><input class="field" data-listing-spec="' + esc(stableKeys[label] || 'spec_' + index) + '" placeholder="' + esc(label) + '"></label>'
    ).join('')
    : '';
}

const LISTING_TAXONOMY = {
  jobs: {
    it: { subs: ['Software & Development','IT Support & Networking','Design & Multimedia','Data & AI','Cybersecurity'], details: ['Frontend Developer','Backend Developer','Full Stack Developer','Mobile App Developer','UI/UX Designer','Graphic Designer','IT Support','Network Engineer','System Administrator','Data Analyst','AI Engineer','QA Tester','Cybersecurity Specialist'] },
    office: { subs: ['រដ្ឋបាល','គណនេយ្យ និងហិរញ្ញវត្ថុ','ធនធានមនុស្ស','សេវាអតិថិជន'], details: ['Admin Officer','Receptionist','Accountant','Cashier','HR Officer','Data Entry','Customer Service'] },
    sales: { subs: ['លក់រាយ','លក់ដុំ','ទីផ្សារឌីជីថល','អភិវឌ្ឍន៍អាជីវកម្ម'], details: ['Sales Representative','Sales Manager','Marketing Officer','Digital Marketing','Telemarketing','Business Development'] },
    transport: { subs: ['ដឹកជញ្ជូន','បើកបរ','ឃ្លាំង និងភស្តុភារ'], details: ['Delivery Rider','Driver','Truck Driver','Logistics Officer','Warehouse Staff'] },
    hospitality: { subs: ['ភោជនីយដ្ឋាន','សណ្ឋាគារ','ទេសចរណ៍'], details: ['Waiter / Waitress','Chef','Cook','Barista','Hotel Receptionist','Housekeeping','Tour Guide'] },
    construction: { subs: ['សំណង់','វិស្វកម្ម','ស្ថាបត្យកម្ម'], details: ['Civil Engineer','Site Supervisor','Architect','Electrician','Plumber','Construction Worker'] },
    education: { subs: ['បង្រៀន','គ្រប់គ្រងសាលា','បណ្តុះបណ្តាល'], details: ['English Teacher','Khmer Teacher','Math Teacher','School Administrator','Trainer'] },
    healthcare: { subs: ['ពេទ្យ','គិលានុបដ្ឋាក','ឱសថស្ថាន'], details: ['Doctor','Nurse','Pharmacist','Medical Assistant','Lab Technician'] },
    factory: { subs: ['ផលិតកម្ម','ត្រួតពិនិត្យគុណភាព','ថែទាំម៉ាស៊ីន'], details: ['Production Worker','Quality Control','Machine Operator','Factory Supervisor'] },
    agriculture: { subs: ['កសិកម្ម','ចិញ្ចឹមសត្វ','កែច្នៃផលិតផល'], details: ['Farm Worker','Agronomist','Livestock Technician','Agriculture Supervisor'] },
    services: { subs: ['សម្រស់','សម្អាត និងថែទាំ','សេវាកម្មទូទៅ'], details: ['Hair Stylist','Beautician','Nail Technician','Cleaner','Security Guard','Technician'] },
    other: { subs: ['ការងារផ្សេងៗ'], details: ['General Worker','Other Position'] }
  },
  properties: {
    house_sale: { subs: ['ផ្ទះល្វែង','ផ្ទះអាជីវកម្ម','វីឡា','ផ្ទះអាជីវកម្មលាយលំនៅដ្ឋាន'], details: ['ផ្ទះល្វែង','ផ្ទះអាជីវកម្ម','វីឡាកូនកាត់','វីឡាភ្លោះ','វីឡាទោល'] },
    house_rent: { subs: ['ផ្ទះល្វែង','វីឡា','ផ្ទះអាជីវកម្ម'], details: ['ផ្ទះល្វែង','វីឡា','ផ្ទះអាជីវកម្ម'] },
    condo_sale: { subs: ['Studio','1 Bedroom','2 Bedrooms','3+ Bedrooms'], details: ['Condo Studio','Condo 1BR','Condo 2BR','Condo 3BR+','Penthouse'] },
    apartment_rent: { subs: ['Studio','1 Bedroom','2 Bedrooms','3+ Bedrooms'], details: ['Apartment Studio','Apartment 1BR','Apartment 2BR','Apartment 3BR+'] },
    land: { subs: ['ដីលំនៅដ្ឋាន','ដីកសិកម្ម','ដីពាណិជ្ជកម្ម','ដីឧស្សាហកម្ម'], details: ['ដីក្នុងក្រុង','ដីជាយក្រុង','ដីចម្ការ','ដីផ្លូវធំ'] },
    land_rent: { subs: ['ដីកសិកម្ម','ដីពាណិជ្ជកម្ម','ដីឧស្សាហកម្ម'], details: ['ដីចម្ការ','ដីឃ្លាំង','ដីពាណិជ្ជកម្ម'] },
    commercial_sale: { subs: ['អគារការិយាល័យ','ហាង','ឃ្លាំង','ដីពាណិជ្ជកម្ម'], details: ['Office Building','Shop House','Warehouse','Commercial Building'] },
    commercial_rent: { subs: ['ការិយាល័យ','ហាង','ឃ្លាំង','ទីតាំងអាជីវកម្ម'], details: ['Office Space','Retail Shop','Warehouse','Commercial Space'] },
    room_rent: { subs: ['បន្ទប់ធម្មតា','បន្ទប់មានម៉ាស៊ីនត្រជាក់','បន្ទប់ស្ទូឌីយោ'], details: ['Single Room','Double Room','Studio Room','Shared Room'] },
    properties_wanted: { subs: ['ចង់ទិញ','ចង់ជួល','ដី','ផ្ទះ','ខុនដូ'], details: ['Buyer Request','Tenant Request','Land Wanted','House Wanted','Condo Wanted'] },
    agent_services: { subs: ['ភ្នាក់ងារលក់','ភ្នាក់ងារជួល','គ្រប់គ្រងអចលនទ្រព្យ'], details: ['Sales Agent','Rental Agent','Property Management'] },
    others_properties: { subs: ['អចលនទ្រព្យផ្សេងៗ'], details: ['Other Property'] }
  }
};

const LISTING_SPEC_FIELDS = {
  jobs: {
    it: ['ជំនាញបច្ចេកទេស','ភាសាកម្មវិធី','កម្រិតជំនាញ','Remote / On-site'],
    office: ['កម្មវិធីដែលប្រើ','ជំនាញការិយាល័យ','ភាសា','បទពិសោធន៍'],
    sales: ['ផលិតផល / សេវាកម្ម','គោលដៅលក់','ភាសា','បទពិសោធន៍'],
    transport: ['ប្រភេទបណ្ណបើកបរ','ប្រភេទយានយន្ត','តំបន់ដឹកជញ្ជូន','បទពិសោធន៍'],
    hospitality: ['ជំនាញ','ភាសា','វេនការងារ','បទពិសោធន៍'],
    construction: ['ជំនាញបច្ចេកទេស','វិញ្ញាបនបត្រ','គម្រោងធ្លាប់ធ្វើ','បទពិសោធន៍'],
    education: ['មុខវិជ្ជាបង្រៀន','កម្រិតសិក្សា','ភាសាបង្រៀន','វិញ្ញាបនបត្រ'],
    healthcare: ['ជំនាញឯកទេស','អាជ្ញាបណ្ណ','បទពិសោធន៍','វេនការងារ'],
    factory: ['ជំនាញម៉ាស៊ីន','វេនការងារ','បទពិសោធន៍','សុវត្ថិភាពការងារ'],
    agriculture: ['ប្រភេទដំណាំ / សត្វ','ជំនាញបច្ចេកទេស','ទីតាំងការងារ','បទពិសោធន៍'],
    services: ['ជំនាញសេវាកម្ម','ឧបករណ៍ប្រើប្រាស់','បទពិសោធន៍','ម៉ោងធ្វើការ'],
    other: ['ជំនាញដែលត្រូវការ','លក្ខខណ្ឌបន្ថែម']
  },
  properties: {
    house_sale: ['ប្រភេទផ្ទះ','ចំនួនជាន់','ទំហំដី (m²)','ទំហំសំណង់ (m²)','ប្លង់កម្មសិទ្ធិ','ចំណតរថយន្ត'],
    house_rent: ['ប្រភេទផ្ទះ','ចំនួនជាន់','គ្រឿងសង្ហារិម','ចំណតរថយន្ត','ប្រាក់កក់'],
    condo_sale: ['ជាន់ទី','ទំហំយូនីត (m²)','គ្រឿងសង្ហារិម','អគាររួមមាន','ប្លង់កម្មសិទ្ធិ'],
    apartment_rent: ['ជាន់ទី','ទំហំបន្ទប់ (m²)','គ្រឿងសង្ហារិម','សេវារួមមាន','ប្រាក់កក់'],
    land: ['ទំហំមុខដី','ទំហំបណ្តោយ','ប្រភេទប្លង់','ផ្លូវចូល','ប្រភេទដី'],
    land_rent: ['ទំហំមុខដី','ទំហំបណ្តោយ','ផ្លូវចូល','គោលបំណងជួល'],
    commercial_sale: ['ប្រភេទអាជីវកម្ម','ទំហំសំណង់','ចំនួនជាន់','ចំណត','ប្លង់កម្មសិទ្ធិ'],
    commercial_rent: ['ប្រភេទអាជីវកម្ម','ទំហំសំណង់','ចំនួនជាន់','ចំណត','ប្រាក់កក់'],
    room_rent: ['ទំហំបន្ទប់','ជាន់ទី','គ្រឿងសង្ហារិម','បន្ទប់ទឹកផ្ទាល់ខ្លួន','ច្បាប់ស្នាក់នៅ'],
    properties_wanted: ['ថវិកាអតិបរមា','តំបន់ដែលចង់បាន','ប្រភេទដែលត្រូវការ','ពេលវេលាត្រូវការ'],
    agent_services: ['ប្រភេទសេវាកម្ម','តំបន់បម្រើសេវា','កម្រៃជើងសារ','បទពិសោធន៍'],
    others_properties: ['ប្រភេទអចលនទ្រព្យ','ទំហំ','លក្ខណៈពិសេស']
  }
};
function renderListingSpecFields(kind, category) {
  const target = $(kind === 'job' ? 'jobSpecificationFields' : 'propertySpecificationFields');
  const fields = LISTING_SPEC_FIELDS[kind === 'job' ? 'jobs' : 'properties'][category] || [];
  target.innerHTML = fields.length
    ? '<h3 class="sm:col-span-2 text-xs font-bold text-slate-300">លក្ខណៈសម្បត្តិលម្អិត</h3>' + fields.map((label, index) =>
        '<label><span class="label">' + esc(label) + '</span><input class="field" data-listing-spec="' + esc('spec_' + index) + '" placeholder="' + esc(label) + '"></label>'
      ).join('')
    : '';
}

function fillTaxonomySelect(categorySelect, subSelect, detailSelect, registry) {
  const entry = registry[categorySelect.value];
  const setOptions = (select, placeholder, values) => {
    select.innerHTML = '<option value="">' + placeholder + '</option>' + (values || []).map(value => '<option value="' + esc(value) + '">' + esc(value) + '</option>').join('');
  };
  setOptions(subSelect, 'ជ្រើសរើសផ្នែករង', entry?.subs || []);
  setOptions(detailSelect, 'ជ្រើសរើសប្រភេទលម្អិត', entry?.details || []);
}
// Official Cambodia administrative geography (MEF DataEF / MLMUPC, 2025).
let cambodiaGeoPromise = null;
function extractCambodiaGeoRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of ['data','records','results','items','rows','content']) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const nested = extractCambodiaGeoRows(value);
      if (nested.length) return nested;
    }
  }
  return [];
}
async function loadCambodiaGeo() {
  if (!cambodiaGeoPromise) cambodiaGeoPromise = (async () => {
    const response = await fetch('/api/locations/cambodia', { headers: { Accept: 'application/json' } });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error || payload?.message || 'មិនអាចទាញយកបញ្ជីទីតាំងពី Telegram បានទេ។ សូមព្យាយាមម្ដងទៀត។');
    const rows = extractCambodiaGeoRows(payload?.data || payload);
    const normalized = rows.map(row => ({
      province_code: String(row.province_code || ''),
      province_kh: String(row.province_kh || '').trim(),
      province_en: String(row.province_en || '').trim(),
      district_code: String(row.district_code || ''),
      district_kh: String(row.district_kh || '').trim(),
      district_en: String(row.district_en || '').trim(),
      commune_code: String(row.commune_code || ''),
      commune_kh: String(row.commune_kh || '').trim(),
      commune_en: String(row.commune_en || '').trim(),
      village_code: String(row.village_code || ''),
      village_kh: String(row.village_kh || '').trim(),
      village_en: String(row.village_en || '').trim()
    })).filter(row => row.province_code && row.village_code && row.village_kh);
    if (!normalized.length) throw new Error('ទិន្នន័យទីតាំងទទេ ឬមានទម្រង់មិនត្រឹមត្រូវ។');
    return normalized;
  })().catch(error => { cambodiaGeoPromise = null; throw error; });
  return cambodiaGeoPromise;
}
function locationOptionLabel(kh, en) { return kh + (en ? ' · ' + en : ''); }
async function initCambodiaLocationPicker(root, legacyLocation = '') {
  if (!root) return;
  const levels = ['province','district','commune','village'];
  const selects = Object.fromEntries(levels.map(level => [level, root.querySelector('[data-location-level="' + level + '"]')]));
  const locationInput = root.querySelector('[data-location-value]') || root.querySelector('#productLocation');
  const codeInputs = Object.fromEntries(levels.map(level => [level, root.querySelector('[data-location-code="' + level + '"]') || root.querySelector('#product' + level[0].toUpperCase() + level.slice(1) + 'Code')]));
  const summary = root.querySelector('[data-location-summary]');
  const defaultCheckbox = root.querySelector('[data-location-default]');
  if (legacyLocation && locationInput && !locationInput.value) locationInput.value = legacyLocation;
  for (const select of Object.values(selects)) if (select) select.disabled = true;
  try {
    const rows = await loadCambodiaGeo();
    const unique = (items, codeKey, khKey, enKey) => {
      const map = new Map();
      items.forEach(row => { if (row[codeKey] && !map.has(row[codeKey])) map.set(row[codeKey], { code: row[codeKey], kh: row[khKey], en: row[enKey] }); });
      return [...map.values()].sort((a,b) => a.kh.localeCompare(b.kh, 'km'));
    };
    const fill = (select, label, items) => {
      if (!select) return;
      select.innerHTML = '<option value="">' + label + '</option>' + items.map(item => '<option value="' + esc(item.code) + '">' + esc(locationOptionLabel(item.kh,item.en)) + '</option>').join('');
      select.disabled = false;
    };
    const provinceItems = unique(rows,'province_code','province_kh','province_en');
    fill(selects.province, 'ជ្រើសរើសរាជធានី/ខេត្ត', provinceItems);
    const getSavedLocation = () => state.me?.profile?.default_location || null;
    const selectedRows = () => Object.fromEntries(levels.map(level => [
      level, rows.find(row => row[level + '_code'] === (selects[level]?.value || '')) || null
    ]));
    const updateLocation = () => {
      const selected = selectedRows();
      levels.forEach(level => {
        if (codeInputs[level]) codeInputs[level].value = selects[level]?.value || '';
      });
      if (selected.village && selected.commune && selected.district && selected.province) {
        const names = [selected.province.province_kh, selected.district.district_kh, selected.commune.commune_kh, selected.village.village_kh];
        if (locationInput) locationInput.value = names.join(' · ');
        if (summary) summary.textContent = 'ខេត្ត/ក្រុង៖ ' + selected.province.province_kh + ' · ស្រុក/ខណ្ឌ៖ ' + selected.district.district_kh + ' · ឃុំ/សង្កាត់៖ ' + selected.commune.commune_kh + ' · ភូមិ៖ ' + selected.village.village_kh + '  |  កូដភូមិ៖ ' + selected.village.village_code;
      } else {
        if (locationInput) locationInput.value = '';
        if (summary) summary.textContent = 'សូមជ្រើសរើសរាជធានី/ខេត្ត → ស្រុក/ខណ្ឌ → ឃុំ/សង្កាត់ → ភូមិ';
      }
      if (defaultCheckbox) {
        const savedLocation = getSavedLocation();
        defaultCheckbox.checked = Boolean(savedLocation && levels.every(level =>
          String(savedLocation[level + '_code'] || '') === String(selects[level]?.value || '')
        ) && levels.every(level => Boolean(selects[level]?.value)));
      }
    };
    const applySavedLocation = (saved) => {
      if (!saved || !levels.every(level => saved[level + '_code'])) return false;
      if (!provinceItems.some(item => item.code === String(saved.province_code))) return false;
      selects.province.value = String(saved.province_code);
      fill(selects.district, 'ជ្រើសរើសស្រុក/ខណ្ឌ', unique(rows.filter(r => r.province_code === selects.province.value),'district_code','district_kh','district_en'));
      if (!Array.from(selects.district.options).some(option => option.value === String(saved.district_code))) return false;
      selects.district.value = String(saved.district_code);
      fill(selects.commune, 'ជ្រើសរើសឃុំ/សង្កាត់', unique(rows.filter(r => r.district_code === selects.district.value),'commune_code','commune_kh','commune_en'));
      if (!Array.from(selects.commune.options).some(option => option.value === String(saved.commune_code))) return false;
      selects.commune.value = String(saved.commune_code);
      fill(selects.village, 'ជ្រើសរើសភូមិ', unique(rows.filter(r => r.commune_code === selects.commune.value),'village_code','village_kh','village_en'));
      if (!Array.from(selects.village.options).some(option => option.value === String(saved.village_code))) return false;
      selects.village.value = String(saved.village_code);
      updateLocation();
      return true;
    };
    if (root.dataset.locationBound !== 'true') {
      selects.province?.addEventListener('change', () => {
        fill(selects.district, 'ជ្រើសរើសស្រុក/ខណ្ឌ', unique(rows.filter(r => r.province_code === selects.province.value),'district_code','district_kh','district_en'));
        selects.commune.innerHTML = '<option value="">ជ្រើសរើសឃុំ/សង្កាត់</option>'; selects.commune.disabled = true;
        selects.village.innerHTML = '<option value="">ជ្រើសរើសភូមិ</option>'; selects.village.disabled = true; updateLocation();
      });
      selects.district?.addEventListener('change', () => {
        fill(selects.commune, 'ជ្រើសរើសឃុំ/សង្កាត់', unique(rows.filter(r => r.district_code === selects.district.value),'commune_code','commune_kh','commune_en'));
        selects.village.innerHTML = '<option value="">ជ្រើសរើសភូមិ</option>'; selects.village.disabled = true; updateLocation();
      });
      selects.commune?.addEventListener('change', () => {
        fill(selects.village, 'ជ្រើសរើសភូមិ', unique(rows.filter(r => r.commune_code === selects.commune.value),'village_code','village_kh','village_en'));
        updateLocation();
      });
      selects.village?.addEventListener('change', updateLocation);
      defaultCheckbox?.addEventListener('change', async () => {
        if (!defaultCheckbox.checked) {
          if (!state.session) return;
          try {
            await api('/api/me/default-location', { method: 'PATCH', body: JSON.stringify({ default_location: null }) });
            if (state.me) state.me.profile = { ...(state.me.profile || {}), default_location: null };
            toast('បានដកទីតាំងលំនាំដើមចេញ។');
          } catch (error) {
            defaultCheckbox.checked = true;
            toast(error.message || 'មិនអាចដកទីតាំងលំនាំដើមបានទេ។', 'error');
          }
          return;
        }
        if (!requireLogin()) { defaultCheckbox.checked = false; return; }
        const selected = selectedRows();
        if (!selected.village || !selected.commune || !selected.district || !selected.province) {
          defaultCheckbox.checked = false;
          toast('សូមជ្រើសរើសទីតាំងដល់កម្រិតភូមិជាមុនសិន។', 'error');
          return;
        }
        const nextDefault = {
          province_code: selects.province.value,
          district_code: selects.district.value,
          commune_code: selects.commune.value,
          village_code: selects.village.value,
          location: locationInput?.value || ''
        };
        try {
          await api('/api/me/default-location', { method: 'PATCH', body: JSON.stringify({ default_location: nextDefault }) });
          if (state.me) state.me.profile = { ...(state.me.profile || {}), default_location: nextDefault };
          defaultCheckbox.checked = true;
          toast('បានរក្សាទុកទីតាំងលំនាំដើមជោគជ័យ!');
        } catch (error) {
          defaultCheckbox.checked = false;
          toast(error.message || 'មិនអាចរក្សាទុកទីតាំងលំនាំដើមបានទេ។', 'error');
        }
      });
      root.dataset.locationBound = 'true';
    }
    if (!legacyLocation && !locationInput?.value) {
      if (!applySavedLocation(getSavedLocation())) updateLocation();
    } else if (!legacyLocation) {
      updateLocation();
    }
    root.dataset.locationReady = 'true';
  } catch (error) {
    if (summary) summary.textContent = error.message || 'មិនអាចផ្ទុកទីតាំងបានទេ។';
    toast(error.message || 'មិនអាចផ្ទុកទីតាំងកម្ពុជាបានទេ។', 'error');
  }
}
function openListingTypeChooser() { openModal('listingTypeModal'); }
function openJobListingForm() {
  revokeListingAlbum('job');
  $('jobListingForm').reset();
  fillTaxonomySelect($('jobCategory'), $('jobSubcategory'), $('jobDetailType'), LISTING_TAXONOMY.jobs);
  void initCambodiaLocationPicker($('jobListingForm').querySelector('[data-location-picker]'));
  $('jobSpecificationFields').innerHTML = '';
  openModal('jobFormModal');
}
function openPropertyListingForm() {
  revokeListingAlbum('property');
  $('propertyListingForm').reset();
  fillTaxonomySelect($('propertyCategory'), $('propertySubcategory'), $('propertyDetailType'), LISTING_TAXONOMY.properties);
  void initCambodiaLocationPicker($('propertyListingForm').querySelector('[data-location-picker]'));
  $('propertySpecificationFields').innerHTML = '';
  openModal('propertyFormModal');
}
function collectListingSpecs(form, extraFields) {
  const specs = {};
  for (const input of form.querySelectorAll('[data-listing-spec]')) {
    const value = String(input.value || '').trim();
    if (value) specs[input.dataset.listingSpec] = value;
  }
  return specs;
}
async function submitNewListing(form, endpoint, kind) {
  const submit = form.querySelector('button[type="submit"]');
  if (submit?.disabled) return;
  const original = submit?.textContent || '';
  const data = new FormData(form);
  const albumRoot = listingAlbumRoot(kind);
  const albumItems = albumRoot ? (listingImageAlbums.get(albumRoot) || []) : [];
  if (albumItems.length > 10) { toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូប។', 'error'); return; }
  albumItems.forEach(item => data.append('images', item.file));
  if (!String(data.get('location') || '').trim() || !String(data.get('village_code') || '').trim()) {
    toast('សូមជ្រើសរើសទីតាំងរហូតដល់កម្រិតភូមិ។', 'error');
    return;
  }
  const skills = String(data.get('skills_text') || '').split(',').map(v => v.trim()).filter(Boolean);
  const benefits = String(data.get('benefits_text') || '').split(',').map(v => v.trim()).filter(Boolean);
  data.delete('skills_text'); data.delete('benefits_text');
  const listingSpecifications = collectListingSpecs(form);
  const mapUrl = String(data.get('google_map_url') || '').trim();
  if (mapUrl) listingSpecifications.google_map_url = mapUrl;
  else delete listingSpecifications.google_map_url;
  data.delete('google_map_url');
  data.set('specifications', JSON.stringify(listingSpecifications));
  if (kind === 'job') {
    data.set('skills', JSON.stringify(skills));
    data.set('benefits', JSON.stringify(benefits));
  }
  if (kind === 'property' && ['properties_wanted','agent_services','others_properties'].includes(String(data.get('category')))) {
    if (!data.get('price')) data.set('price', '');
  }
  if (submit) { submit.disabled = true; submit.textContent = 'កំពុងបង្ហោះ...'; }
  try {
    const result = await api(endpoint, { method: 'POST', body: data });
    revokeListingAlbum(kind);
    closeModal(kind === 'job' ? 'jobFormModal' : 'propertyFormModal');
    toast(kind === 'job' ? 'បានបង្ហោះប្រកាសការងារជោគជ័យ!' : 'បានបង្ហោះអចលនទ្រព្យជោគជ័យ!');
    state.activeListingType = kind === 'job' ? 'job' : 'real_estate';
    state.activeCategory = 'all'; state.activePropertyType = 'all';
    updateMarketplaceCategoryHeading();
    document.querySelectorAll('[data-listing-type]').forEach((button) => button.classList.toggle('active', button.dataset.listingType === state.activeListingType));
    document.querySelectorAll('[data-property-type]').forEach((button) => button.classList.toggle('active', button.dataset.propertyType === 'all'));
    await loadProducts();
  } catch (error) {
    toast(error.message || 'មិនអាចបង្ហោះប្រកាសបានទេ។', 'error');
  } finally {
    if (submit) { submit.disabled = false; submit.textContent = original; }
  }
}

function renderProductForm(product = null) {
  if (!isSellerAccount()) { openSellerModal(); return; }
  revokeProductImagePreviews();
  state.selectedProductImages = [];
  $('productForm').reset();
  $('productLocation').value = '';
  ['Province','District','Commune','Village'].forEach(level => { const field = $('product' + level + 'Code'); if (field) field.value = ''; });
  $('productSubcategory').innerHTML = '<option value="">ជ្រើសរើសផ្នែករង</option>';
  $('productDetailType').innerHTML = '<option value="">ជ្រើសរើសប្រភេទលម្អិត</option>';
  $('productSpecificationFields').innerHTML = '';
  $('editProductId').value = product?.id || '';
  $('productFormTitle').textContent = product ? 'កែប្រែព័ត៌មានទំនិញ' : 'បន្ថែមទំនិញថ្មី';
  $('productImageThumb').innerHTML = ic('image', 21);
  if (product) {
    $('productTitle').value = product.title;
    $('productPrice').value = product.price;
    $('productCategory').value = product.category;
    $('productLocation').value = product.location || 'ភ្នំពេញ';
    $('productCondition').value = product.condition || 'ប្រើរួចស្អាត';
    $('productYoutubeVideoUrl').value = product.youtube_video_url || '';
    const mapField = $('productForm').elements.google_map_url;
    if (mapField) mapField.value = product.specifications?.google_map_url || '';
    const desc = productDescriptionParts(product);
    $('productShortDesc').value = desc.short;
    $('productDescription').value = desc.full;
    state.selectedProductImages = (product.product_images || []).filter((item) => item.image_url)
      .slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((item) => ({ kind: 'existing', id: item.id, image_url: item.image_url }));
  }
  renderProductTaxonomy($('productCategory').value);
  void initCambodiaLocationPicker($('productForm').querySelector('[data-location-picker]'), product?.location || '');
  renderProductImageAlbum();
  updateShortDescriptionCounter();
  updateProductYoutubePreview();
  openModal('productFormModal');
}

function shortDescriptionLineMaxWidth() {
  const cards = Array.from(document.querySelectorAll('.cd'));
  const card = cards.find((item) => item.getClientRects().length);
  if (card) {
    const body = card.querySelector('.cb');
    const description = card.querySelector('.cd-description');
    if (description?.clientWidth) return description.clientWidth;
    if (body?.clientWidth) {
      const style = getComputedStyle(body);
      return Math.max(80, body.clientWidth - parseFloat(style.paddingLeft || 0) - parseFloat(style.paddingRight || 0));
    }
  }
  // Fallback to the minimum desktop product-card width minus its content padding.
  return 150;
}

function shortDescriptionGraphemes(value) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter('km', { granularity: 'grapheme' }).segment(value), (part) => part.segment);
  }
  return Array.from(value);
}

function fitShortDescriptionLines(value, maxWidth) {
  const field = $('productShortDesc');
  const style = field ? getComputedStyle(field) : null;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const cardDescription = document.querySelector('.cd .cd-description');
  const cardStyle = cardDescription ? getComputedStyle(cardDescription) : null;
  context.font = cardStyle?.font || '11px "Kantumruy Pro", sans-serif';
  const lines = String(value || '').replace(/\r/g, '').split('\n').slice(0, 3);
  return lines.map((line) => {
    const parts = shortDescriptionGraphemes(line);
    let result = '';
    for (const part of parts) {
      if (context.measureText(result + part).width > maxWidth) break;
      result += part;
    }
    return result;
  }).join('\n');
}

function updateShortDescriptionCounter() {
  const field = $('productShortDesc');
  const counter = $('productShortDescCount');
  if (!field || !counter) return;
  const previous = field.value;
  const caret = field.selectionStart ?? previous.length;
  const fitted = fitShortDescriptionLines(previous, shortDescriptionLineMaxWidth());
  if (fitted !== previous) {
    field.value = fitted;
    const nextCaret = Math.min(caret, fitted.length);
    field.setSelectionRange(nextCaret, nextCaret);
  }
  const lines = field.value.split('\n');
  const graphemeCounts = lines.map((line) => shortDescriptionGraphemes(line).length);
  counter.textContent = `៣ បន្ទាត់ · ${graphemeCounts.map((count, index) => `បន្ទាត់ ${index + 1}: ${count}`).join(' / ')} · កំណត់តាមទំហំកាត`;
}

async function renderSeller() {
  const v = state.me?.vendor;
  if (!v || v.status === 'blocked') {
    $('sellerGate').classList.remove('hidden');
    $('sellerDashboardContent').classList.add('hidden');
    return;
  }
  $('sellerGate').classList.add('hidden');
  $('sellerDashboardContent').classList.remove('hidden');
  $('sellerVerificationNotice').classList.toggle('hidden', isVerifiedSeller());
  $('sellerVerificationNotice').classList.toggle('flex', !isVerifiedSeller());

  try {
    const [stats, productsRes, offers, ordersRes] = await Promise.all([
      api('/api/vendor/overview'),
      api('/api/vendor/products'),
      loadOffers(),
      api('/api/vendor/orders')
    ]);
    $('kpiListings').textContent = stats.data.activeListings;
    $('kpiViews').textContent = Number(stats.data.totalViews).toLocaleString();
    $('kpiRating').textContent = stats.data.averageRating ?? '—';
    $('kpiSales').textContent = stats.data.completedSales;

    state.sellerProductCache = productsRes.data || [];
    $('sellerProductsCount').textContent = String(state.sellerProductCache.length);
    const received = (offers || []).filter((o) => o.vendor_id === v.id);
    const sellerOrders = ordersRes.data || [];
    $('sellerOffersCount').textContent = String(received.length);
    $('sellerOrdersCount').textContent = String(sellerOrders.length);

    renderSellerProductList();
    renderSellerShopProfile(productsRes.vendor || v);

    $('sellerOffers').innerHTML = received.map((o) => `
      <article class="seller-transaction-row">
        <div><b>${esc(o.products?.title || 'ទំនិញ')}</b><small class="block text-slate-400">${esc(o.message || 'សំណើតថ្លៃ')}</small></div>
        <div class="text-xs text-slate-600">${esc(o.buyer_name || 'អ្នកទិញ')} · ${esc(o.buyer_phone || '')}</div>
        <div class="font-bold text-emerald-700">${money(o.offer_price)}</div>
        <div class="seller-transaction-actions">
          ${o.status === 'pending' ? `<button type="button" data-offer-action="accepted" data-id="${esc(o.id)}" class="seller-action-button is-complete">ទទួលយក</button><button type="button" data-offer-action="rejected" data-id="${esc(o.id)}" class="seller-action-button is-delete">បដិសេធ</button>` : `<span class="text-xs text-slate-500">${esc(o.status)}</span>`}
        </div>
      </article>`).join('') || '<div class="seller-empty-state">មិនទាន់មានសំណើតថ្លៃទេ</div>';

    $('sellerOrders').innerHTML = sellerOrders.map((row) => {
      const order = row.orders || {};
      const st = row.fulfillment_status || 'pending';
      return `<article class="seller-transaction-row">
        <div><b>${esc(row.products?.title || 'ទំនិញ')} × ${Number(row.quantity || 1)}</b><small class="block text-slate-400">Order #${esc(String(row.order_id || '').slice(0, 8))}</small></div>
        <div class="text-xs text-slate-600">${esc(order.customer_name || 'អ្នកទិញ')} · ${esc(order.customer_phone || '')}</div>
        <div class="font-bold text-emerald-700">${money(Number(row.unit_price || 0) * Number(row.quantity || 0))}</div>
        <div class="seller-transaction-actions">
          ${st === 'pending' ? `<button type="button" data-order-status="processing" data-order-id="${esc(row.order_id)}" class="seller-action-button is-complete">ទទួលយក</button>` : ''}
          ${st === 'processing' ? `<button type="button" data-order-status="shipped" data-order-id="${esc(row.order_id)}" class="seller-action-button is-renew">ដឹកជញ្ជូន</button>` : ''}
          ${st === 'shipped' ? `<button type="button" data-order-status="completed" data-order-id="${esc(row.order_id)}" class="seller-action-button is-complete">បញ្ចប់</button>` : ''}
        </div>
      </article>`;
    }).join('') || '<div class="seller-empty-state">មិនទាន់មានការបញ្ជាទិញទេ</div>';
  } catch (e) {
    toast('មិនអាចផ្ទុក Dashboard៖ ' + e.message, 'error');
  }
}


function renderSupplierImportResults(result, catalogUrl) {
  const target = $('adminSupplierImportResults');
  if (!target) return;
  const items = result.data || [];
  const summary = result.summary || {};
  const page = result.pagination || {};
  const importable = Number(summary.ready || 0) + Number(summary.update_existing || 0);
  const scan = result.scan || {};
  const scanSummary = scan.pages_scanned
    ? '<div class="mt-2 text-slate-500">ស្កេនបាន '+Number(scan.pages_scanned)+' ទំព័រ · រកឃើញ/ដាក់ជួរ '+Number(scan.pages_discovered||0)+' ទំព័រ · ផលិតផលសរុប '+Number(summary.total||0)+'</div>'
      + (scan.page_limit_reached || scan.time_limit_reached || scan.pages_remaining ? '<div class="mt-1 font-semibold text-amber-700">ការស្កេនមិនទាន់ចប់ទាំងស្រុងទេ។ នៅសល់ '+Number(scan.pages_remaining||0)+' ទំព័រ។ សូមស្កេនម្ដងទៀត ឬបន្តការស្កេន។</div>' : '')
      + (scan.failed_pages ? '<div class="mt-1 text-amber-700">ទំព័រដែលមិនអាចអានបាន '+Number(scan.failed_pages)+'</div>' : '')
    : '';
  target.innerHTML = '<div class="mb-3 rounded-xl bg-slate-100 p-3 text-[11px]">រកឃើញសរុប '+Number(summary.total||0)+' ម៉ូដែល · បង្ហាញ '+Number(summary.batch||items.length)+' ម៉ូដែល · អាចនាំចូល/បន្ថែម '+importable+' · ស្ទួន '+Number(summary.duplicate||0)+' · ត្រូវពិនិត្យ '+Number(summary.needs_review||0)+scanSummary+'</div>' +
    (items.length ? '<div class="space-y-2">'+items.map(item => {
      const statusLabels = {ready:'ផលិតផលថ្មី · អាចនាំចូល',update_existing:'មានផលិតផលមេរួច · អាចបន្ថែម Variant',duplicate:'ផលិតផល និង Variants មានរួចហើយ',needs_review:'ត្រូវឱ្យ Admin ពិនិត្យ'};
      const statusClasses = {ready:'text-emerald-700',update_existing:'text-blue-700',duplicate:'text-amber-700',needs_review:'text-rose-700'};
      const variants = item.variants || [item];
      const specs = item.specifications || {};
      const attrs = ['Category: '+(item.category || 'other'), item.subcategory ? 'Subcategory: '+item.subcategory : '', item.detail_type ? 'ប្រភេទលម្អិត: '+item.detail_type : '', specs.cpu_model ? 'CPU: '+specs.cpu_model : '', specs.gpu_model_vram ? 'GPU: '+specs.gpu_model_vram : '', specs.color ? 'ពណ៌: '+specs.color : '', specs.weight ? 'ទម្ងន់: '+specs.weight : '', specs.battery ? 'ថ្ម: '+specs.battery : ''].filter(Boolean).join(' · ');
      const importVariant = variants.find(variant => !variant.already_imported) || variants[0];
      const uniqueVariantCount = variants.filter(variant => !variant.duplicate_configuration).length;
      const variantRows = variants.map(variant => {
        const variantSpecs = variant.specifications || {};
        const label = [variantSpecs.ram_type_capacity,variantSpecs.storage_type_capacity].filter(Boolean).join(' · ') || variant.configuration_label || variant.option_value || 'ជម្រើសទូទៅ';
        return '<li class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 py-2"><span><b>'+esc(label)+'</b><small class="block text-slate-500">Code: '+esc(variant.supplier_product_code||'—')+' · '+(variant.availability==='out_of_stock'?'<span class="text-rose-600">Supplier អស់ស្តុក</span>':'<span class="text-emerald-700">Supplier មានលក់</span>')+(variant.duplicate_configuration?' · Configuration ស្ទួន':variant.already_imported?' · មានរួចហើយ':'')+'</small></span><span class="text-right"><b>'+money(variant.selling_price)+'</b><small class="block text-slate-500">Supplier '+money(variant.supplier_price)+'</small></span></li>';
      }).join('');
      const status = item.status || 'needs_review';
      return '<article class="rounded-xl border border-slate-200 p-3 text-[11px]"><div class="flex gap-3">'+
        (item.image_urls?.[0] ? '<img src="'+esc(item.image_urls[0])+'" alt="" class="h-16 w-16 rounded-lg object-cover">' : '<div class="grid h-16 w-16 place-items-center rounded-lg bg-slate-100">រូបភាព</div>')+
        '<div class="min-w-0 flex-1"><b class="block">'+esc(item.title||'មិនស្គាល់ឈ្មោះផលិតផល')+'</b>'+
        '<div class="mt-1 text-slate-600">'+esc(attrs)+'</div>'+
        '<div class="mt-1 font-semibold">ផលិតផលមេ ១ · '+variants.length+' Variants</div>'+
        '<div class="mt-1 '+(statusClasses[status]||'text-slate-600')+'">'+(statusLabels[status]||status)+'</div></div></div>'+
        '<ul class="mt-2">'+variantRows+'</ul>'+
        (((status==='ready'||status==='update_existing')||(status==='duplicate'&&item.existing_product_id))&&importVariant ? '<button type="button" class="mt-3 rounded-full bg-slate-900 px-4 py-2 font-bold text-white" data-supplier-import-code="'+esc(importVariant.supplier_product_code)+'" data-supplier-import-price="'+Number(importVariant.supplier_price)+'">'+(status==='duplicate'?'ធ្វើបច្ចុប្បន្នភាពស្ថានភាពស្តុក':status==='update_existing'?'បន្ថែម '+Number(item.new_variant_count||0)+' Variants ទៅផលិតផលមេ':'នាំចូលជាផលិតផលមេ ១ មាន '+uniqueVariantCount+' Variants')+'</button>' : '')+
      '</article>';
    }).join('')+'</div>' : '<p class="py-4 text-center text-slate-500">មិនបានរកឃើញផលិតផលក្នុងបាច់នេះទេ។</p>')+
    (page.has_more ? '<div class="pt-3 text-center"><button type="button" class="rounded-full border border-slate-300 px-5 py-2.5 text-[11px] font-bold" data-supplier-import-next="'+Number(page.next_offset||0)+'">បង្ហាញផលិតផល ១០ ម៉ូដែលបន្ទាប់</button></div>' : '');
  target.dataset.catalogUrl = catalogUrl;
}
async function renderAdminSupplierRegistry() {
  const target = $('adminSupplierRegistryList');
  if (!target || !isAdmin()) return;
  try {
    const result = await api('/api/admin/suppliers');
    const suppliers = result.data || [];
    target.innerHTML = suppliers.length ? suppliers.map(item => {
      const ready = item.adapter_ready === true;
      const status = !item.is_verified ? 'មិនទាន់ផ្ទៀងផ្ទាត់' : !ready ? 'Domain ផ្ទៀងផ្ទាត់រួច · Adapter មិនទាន់រួច' : item.is_active ? 'សកម្ម' : 'បានផ្ទៀងផ្ទាត់ · បិទ Scanner';
      const tone = item.is_active ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50';
      return '<article class="rounded-xl border border-slate-200 bg-white p-3">' +
        '<div class="flex flex-wrap items-start justify-between gap-2"><div class="min-w-0"><b class="block text-[11px]">' + esc(item.supplier_name) + '</b>' +
        '<p class="mt-1 break-all text-[10px] text-slate-500">' + esc(item.base_url) + '</p><p class="mt-1 text-[9px] text-slate-400">Adapter: ' + esc(item.parser_key) + ' · Domain: ' + esc((item.allowed_domains || []).join(', ')) + '</p></div>' +
        '<span class="rounded-full px-2 py-1 text-[9px] font-bold ' + tone + '">' + status + '</span></div>' +
        '<div class="mt-3 flex flex-wrap gap-2">' +
        '<button type="button" data-supplier-registry-verify="' + esc(item.id) + '" data-next="' + (!item.is_verified) + '" class="rounded-full border border-slate-300 px-3 py-1.5 text-[10px] font-bold">' + (item.is_verified ? 'ដកការផ្ទៀងផ្ទាត់' : 'ផ្ទៀងផ្ទាត់ Domain') + '</button>' +
        '<button type="button" data-supplier-registry-active="' + esc(item.id) + '" data-next="' + (!item.is_active) + '" ' + (!ready || !item.is_verified ? 'disabled' : '') + ' class="rounded-full border border-slate-300 px-3 py-1.5 text-[10px] font-bold disabled:cursor-not-allowed disabled:opacity-40">' + (item.is_active ? 'បិទ Scanner' : 'បើក Scanner') + '</button>' +
        '</div></article>';
    }).join('') : '<p class="text-[10px] text-slate-400">មិនទាន់មាន Supplier ទេ។</p>';
  } catch (error) {
    target.innerHTML = '<p class="text-[10px] text-rose-600">' + esc(error.message || 'មិនអាចផ្ទុក Supplier Registry បានទេ។') + '</p>';
  }
}
async function updateAdminSupplierRegistry(id, payload) {
  try {
    await api('/api/admin/suppliers/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify(payload) });
    toast('បានរក្សាទុក Supplier Registry។');
    await renderAdminSupplierRegistry();
  } catch (error) {
    toast(error.message || 'មិនអាចកែប្រែ Supplier បានទេ។', 'error');
  }
}
async function scanAuroraSupplierCatalog(url, offset = 0) {
  const target = $('adminSupplierImportResults');
  if (target) target.innerHTML = '<p class="py-5 text-center text-xs text-slate-500">កំពុងស្កេន និងផ្ទៀងផ្ទាត់ទិន្នន័យពី Supplier...</p>';
  try {
    const result = await api('/api/admin/supplier-import/scan', { method: 'POST', body: JSON.stringify({ url, offset }) });
    renderSupplierImportResults(result, url);
  } catch (error) {
    if (target) target.innerHTML = '<p class="py-4 text-center text-xs text-rose-600">'+esc(error.message||'មិនអាចស្កេនវេបសាយបានទេ។')+'</p>';
  }
}


async function renderAdminGalleryCandidates() {
  const target = $('adminGalleryCandidates');
  if (!target || !isAdmin()) return;
  try {
    const result = await api('/api/admin/product-gallery-candidates?status=pending');
    const items = result.data || [];
    if (!items.length) {
      target.innerHTML = '<p class="text-[10px] text-slate-400">មិនមានរូបភាពរង់ចាំអនុម័តទេ។</p>';
      return;
    }
    target.innerHTML = items.map(item => {
      const evidence = item.match_evidence || {};
      const matches = (evidence.matched_model_tokens || []).join(', ');
      const sourceDomain = evidence.source_domain || (() => { try { return new URL(item.source_url).hostname.replace(/^www\./, ''); } catch { return '—'; } })();
      const codeVerified = evidence.verification_level === 'code_verified';
      const verificationLabel = codeVerified ? 'Model + Code/SKU មានភស្តុតាង' : 'Model match ប៉ុណ្ណោះ · ត្រូវពិនិត្យបន្ថែម';
      const verificationClass = codeVerified ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50';
      return '<article class="rounded-xl border border-slate-200 bg-white p-3">' +
        '<div class="grid grid-cols-[88px_minmax(0,1fr)] gap-3">' +
          '<a href="' + esc(item.image_url) + '" target="_blank" rel="noopener noreferrer"><img src="' + esc(item.image_url) + '" alt="" loading="lazy" class="h-24 w-full rounded-lg object-contain bg-slate-50"></a>' +
          '<div class="min-w-0"><b class="block text-[11px]">' + esc(item.products?.title || item.source_title || 'ផលិតផល') + '</b>' +
            '<p class="mt-1 text-[10px] text-slate-500">Website: ' + esc(sourceDomain) + ' · Match score: ' + Number(item.match_score || 0) + '/100</p>' +
            '<p class="mt-1 text-[10px] text-slate-500">Model ដែលត្រូវគ្នា: ' + esc(matches || '—') + '</p>' +
            '<p class="mt-1 text-[10px] text-slate-500">Product Code/SKU: ' + esc(evidence.exact_product_code ? 'ត្រូវគ្នា' : (evidence.matched_skus || []).length ? 'SKU ត្រូវគ្នា' : 'មិនទាន់ផ្ទៀងផ្ទាត់') + '</p>' +
            '<span class="mt-1 inline-block rounded-full px-2 py-1 text-[9px] font-bold ' + verificationClass + '">' + verificationLabel + '</span>' +
            '<a class="mt-1 inline-block text-[10px] font-semibold text-violet-700 underline" href="' + esc(item.source_url) + '" target="_blank" rel="noopener noreferrer">មើល Website ប្រភព</a>' +
          '</div></div>' +
        '<p class="mt-2 text-[10px] text-slate-500">' + esc(evidence.review_note || 'Admin ត្រូវពិនិត្យរូបភាព និងម៉ូដែលជាក់ស្តែង មុនអនុម័ត។') + '</p>' +
        '<div class="mt-3 flex gap-2"><button type="button" class="rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white" data-gallery-approve="' + esc(item.id) + '">អនុម័ត និង Upload Telegram</button>' +
        '<button type="button" class="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-bold" data-gallery-reject="' + esc(item.id) + '">បដិសេធ</button></div></article>';
    }).join('');
  } catch (error) {
    target.innerHTML = '<p class="text-[10px] text-rose-500">' + esc(error.message || 'មិនអាចផ្ទុករូបភាពរង់ចាំអនុម័តបានទេ។') + '</p>';
  }
}

async function searchAdminGalleryProducts() {
  const target = $('adminGalleryProductResults');
  const term = String($('adminGalleryProductSearch')?.value || '').trim();
  if (!target) return;
  if (term.length < 2) {
    target.innerHTML = '<p class="text-[10px] text-rose-500">សូមបញ្ចូលឈ្មោះផលិតផលយ៉ាងតិច ២ តួអក្សរ។</p>';
    return;
  }
  target.innerHTML = '<p class="text-[10px] text-slate-400">កំពុងស្វែងរក...</p>';
  try {
    const result = await api('/api/admin/gallery-products?q=' + encodeURIComponent(term));
    const items = result.data || [];
    target.innerHTML = items.length ? items.map(item =>
      '<article class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 p-3">' +
        '<div class="min-w-0"><b class="block truncate text-[11px]">' + esc(item.title) + '</b><small class="text-[10px] text-slate-500">' + esc(item.category || '—') + ' · រូបបច្ចុប្បន្ន ' + Number(item.image_count || 0) + '/10</small></div>' +
        '<button type="button" class="rounded-full bg-violet-700 px-3 py-1.5 text-[10px] font-bold text-white" data-gallery-search-product="' + esc(item.id) + '" ' + (Number(item.image_count) >= 10 ? 'disabled' : '') + '>ស្វែងរករូបបន្ថែម</button>' +
      '</article>').join('') : '<p class="text-[10px] text-slate-400">រកមិនឃើញផលិតផលទេ។</p>';
  } catch (error) {
    target.innerHTML = '<p class="text-[10px] text-rose-500">' + esc(error.message || 'មិនអាចស្វែងរកផលិតផលបានទេ។') + '</p>';
  }
}

async function renderSupplierUpdateReviews() {
  const target = $('adminSupplierReviewList');
  if (!target || !isAdmin()) return;
  try {
    const result = await api('/api/admin/supplier-update-reviews?status=pending');
    const reviews = result.data || [];
    if (!reviews.length) {
      target.innerHTML = '<p class="text-[10px] text-slate-400">មិនមានការផ្លាស់ប្តូររង់ចាំពិនិត្យទេ។</p>';
      return;
    }
    target.innerHTML = reviews.map(item => {
      const product = (state.adminSupplierProducts || []).find(p => String(p.id) === String(item.product_id));
      const fieldLabel = item.field_name === 'price' ? 'តម្លៃលក់' : item.field_name === 'stock' ? 'ស្តុក' : item.field_name;
      const oldValue = item.field_name === 'price' ? money(item.old_value) : String(item.old_value ?? '—');
      const newValue = item.field_name === 'price' ? money(item.new_value) : String(item.new_value ?? '—');
      const verification = item.verification || {};
      const reasons = [];
      if (!verification.exact_product_code) reasons.push('Product Code មិនត្រូវគ្នា');
      if (!verification.model_and_specs?.ok) reasons.push('Model/Specs ត្រូវការពិនិត្យ');
      if (!verification.fresh_second_read?.same_price_and_stock) reasons.push('ការឆែកម្ដងទៀតមិនដូចគ្នា');
      return '<article class="rounded-xl border border-amber-200 bg-white p-3">'+
        '<div class="flex flex-wrap items-start justify-between gap-2"><div><b class="text-[11px]">'+esc(product?.title || item.product_id)+'</b><p class="mt-1 text-[10px] text-slate-500">'+esc(item.supplier_product_code)+' · '+esc(fieldLabel)+'</p></div><strong class="text-[11px]">'+esc(oldValue)+' → '+esc(newValue)+'</strong></div>'+
        (reasons.length?'<p class="mt-2 text-[10px] text-amber-700">'+esc(reasons.join(' · '))+'</p>':'')+
        '<div class="mt-3 flex gap-2"><button type="button" class="rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white" data-supplier-review-decision="approved" data-review-id="'+esc(item.id)+'">អនុម័ត</button><button type="button" class="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-bold" data-supplier-review-decision="rejected" data-review-id="'+esc(item.id)+'">បដិសេធ</button></div></article>';
    }).join('');
  } catch (error) {
    target.innerHTML = '<p class="text-[10px] text-rose-500">'+esc(error.message || 'មិនអាចផ្ទុកការពិនិត្យបានទេ។')+'</p>';
  }
}

let adminAuroraTab = 'published';
const adminAuroraPages = { published: 1, scanned: 1 };

async function renderAdminSupplierProducts() {
  const target = $('adminSupplierProductsList');
  if (!target || !isAdmin()) return;
  target.innerHTML = '<p class="py-6 text-center text-xs text-slate-400">កំពុងផ្ទុកផលិតផល AURORA...</p>';
  try {
    const result = await api('/api/admin/supplier-products');
    state.adminSupplierProducts = result.data || [];
    void renderSupplierUpdateReviews();
    void renderAdminGalleryCandidates();
    const term = String($('adminSupplierSearch')?.value || '').trim().toLowerCase();
    const allAurora = state.adminSupplierProducts.filter(p =>
      String(p.vendors?.store_name || '').trim().toLowerCase() === 'aurora computer'
    );
    const published = allAurora.filter(p => p.status === 'active');
    const scanned = allAurora.filter(p => p.status === 'pending');
    const source = adminAuroraTab === 'published' ? published : scanned;
    const filtered = source.filter(p => !term || [p.title,p.category,p.supplier_source?.supplier_name,p.supplier_source?.supplier_product_code].join(' ').toLowerCase().includes(term));
    const pageSize = 10;
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    adminAuroraPages[adminAuroraTab] = Math.min(Math.max(1, adminAuroraPages[adminAuroraTab] || 1), pageCount);
    const page = adminAuroraPages[adminAuroraTab];
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
    const labels={active:'បានផុស',pending:'រង់ចាំ Admin',rejected:'បដិសេធ',archived:'បានលាក់',sold:'លក់រួច'};
    const selectedIds = new Set();
    target.innerHTML =
      '<div class="admin-aurora-list-toolbar"><span>បង្ហាញ '+(filtered.length ? ((page-1)*pageSize+1)+'–'+Math.min(page*pageSize,filtered.length) : '0')+' ក្នុង '+filtered.length+' ផលិតផល</span>'+
      (adminAuroraTab === 'scanned' ? '<div class="admin-aurora-bulk-tools"><label><input type="checkbox" data-aurora-select-page> ជ្រើសរើសទាំង ១០</label><button type="button" class="admin-aurora-publish-link" data-aurora-publish-selected><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5M5 14v5h14v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> ផុសផលិតផលដែលបានជ្រើស</button></div>' : '')+
      '</div>'+
      (pageItems.length ? '<div class="admin-aurora-list">'+pageItems.map(p=>{
        const image=productImage(p);
        return '<article class="admin-aurora-row" data-admin-aurora-edit="'+esc(p.id)+'" tabindex="0" role="button">'+
          (adminAuroraTab === 'scanned' ? '<label class="admin-aurora-select" aria-label="ជ្រើសរើស '+esc(p.title||'ផលិតផល')+'"><input type="checkbox" data-aurora-product-select="'+esc(p.id)+'"></label>' : '')+
          '<div class="admin-aurora-thumb">'+(image?'<img src="'+esc(image)+'" alt="">':ic('image',24))+'</div>'+
          '<div class="admin-aurora-info"><strong>'+esc(p.title||'')+'</strong><span>'+esc(p.category==='computers'?'Computer':p.category||'Computer')+' · '+esc(p.listing_details?.detail_type||'Laptop')+' · '+esc(p.supplier_source?.supplier_product_code||'គ្មាន Product Code')+'</span></div>'+
          '<div class="admin-aurora-meta"><strong>'+money(p.price)+'</strong><span>'+(Number(p.stock)>0?'មានលក់':'អស់ស្តុក')+'</span><small class="admin-aurora-status is-'+esc(p.status||'pending')+'">'+esc(labels[p.status]||p.status||'—')+'</small></div>'+
          '<div class="admin-aurora-actions"><button type="button" class="admin-aurora-edit" data-admin-aurora-edit="'+esc(p.id)+'">'+ic('pencil',14)+' កែប្រែ</button><button type="button" class="admin-aurora-delete" data-admin-aurora-delete="'+esc(p.id)+'" aria-label="លុបផលិតផល">'+ic('trash-2',14)+' លុប</button></div></article>';
      }).join('')+'</div>' : '<div class="admin-aurora-empty">'+(adminAuroraTab==='published'?'មិនទាន់មានផលិតផលដែលបានផុសទេ។':'មិនមានផលិតផលទើបស្កេនរង់ចាំ Admin ទេ។')+'</div>')+
      (pageCount>1 ? '<nav class="admin-aurora-pagination" aria-label="ទំព័រផលិតផល"><span>ទំព័រ '+page+' / '+pageCount+'</span><div><button type="button" data-aurora-page="'+(page-1)+'" '+(page<=1?'disabled':'')+'>Previous</button><button type="button" data-aurora-page="'+(page+1)+'" '+(page>=pageCount?'disabled':'')+'>Next</button></div></nav>' : '');
    const count=$('adminAuroraScannedCount'); if(count) count.textContent=String(scanned.length);
    document.querySelectorAll('[data-aurora-tab]').forEach(button=>button.classList.toggle('is-active',button.dataset.auroraTab===adminAuroraTab));
  } catch(error) {
    target.innerHTML='<p class="py-6 text-center text-xs text-rose-500">មិនអាចផ្ទុកផលិតផល AURORA បានទេ។</p>';
    toast(error.message||'មិនអាចផ្ទុកផលិតផលបានទេ។','error');
  }
}

function closeAdminAuroraProductEditor() {
  const modal=$('adminAuroraProductEditModal');
  if(modal)modal.remove();
  syncBodyScrollLock();
}

function openAdminAuroraProductEditor(productId) {
  if(!isAdmin())return;
  const p=(state.adminSupplierProducts||[]).find(item=>String(item.id)===String(productId));
  if(!p)return toast('រកមិនឃើញផលិតផលនេះទេ។','error');
  closeAdminAuroraProductEditor();
  const source=p.supplier_source||{},details=p.listing_details||{},specs=details.specifications||{};
  const images=(p.product_images||[]).filter(item=>item.image_url),variants=p.product_variants||[];
  const modal=document.createElement('div');
  modal.id='adminAuroraProductEditModal';modal.className='admin-aurora-modal admin-aurora-drawer-overlay';
  modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  const statusOptions=['active','pending','rejected','archived','sold'].map(v=>'<option value="'+v+'" '+(p.status===v?'selected':'')+'>'+({active:'បង្ហាញលើហាង',pending:'រង់ចាំ',rejected:'បដិសេធ',archived:'លាក់ផលិតផល',sold:'លក់រួច'}[v])+'</option>').join('');
  const categoryOptions=[['computers','Computer'],['computer_accessories','Computer Accessories'],['mobile','Mobile'],['mobile_accessories','Mobile Accessories'],['audio','Audio'],['networking','Networking'],['storage','Storage'],['components','Components']].map(([value,label])=>'<option value="'+value+'" '+((p.category||'computers')===value?'selected':'')+'>'+label+'</option>').join('');
  const variantRows=variants.map(v=>{
    const vs=v.supplier_source||{};
    return '<div class="admin-aurora-variant" data-variant-id="'+esc(v.id)+'">'+
      '<label>ជម្រើស<input class="field" data-variant-field="option_value" value="'+esc(v.option_value||'')+'"></label>'+
      '<label>តម្លៃលក់ ($)<input class="field" data-variant-field="price" type="number" min="0" step="0.01" value="'+Number(v.price||0)+'"></label>'+
      '<label>ស្តុក<input class="field" data-variant-field="stock" type="number" min="0" step="1" value="'+Number(v.stock||0)+'"></label>'+
      '<label>ថ្លៃ Supplier ($)<input class="field" data-variant-field="supplier_price" type="number" min="0" step="0.01" value="'+Number(vs.supplier_price||0)+'"></label>'+
      '<label>Supplier Code<input class="field" data-variant-field="supplier_product_code" value="'+esc(vs.supplier_product_code||v.sku||'')+'"></label>'+
      '<label>Supplier URL<input class="field" data-variant-field="supplier_url" type="url" value="'+esc(vs.supplier_url||source.supplier_url||'')+'"></label>'+
      '<div class="admin-aurora-variant-actions"><button type="button" data-admin-variant-save="'+esc(v.id)+'">រក្សាទុក Variant</button><button type="button" class="is-danger" data-admin-variant-delete="'+esc(v.id)+'">លុប</button></div></div>';
  }).join('');
  modal.innerHTML='<div class="admin-aurora-dialog"><header class="admin-aurora-dialog-head"><div><small>AURORA COMPUTER · PRODUCT MANAGEMENT</small><h2>កែប្រែផលិតផល</h2><p>'+esc(p.title||'')+'</p></div><button type="button" data-admin-aurora-close aria-label="បិទ">×</button></header>'+
    '<form id="adminAuroraProductEditForm" data-product-id="'+esc(p.id)+'">'+
    '<section class="admin-aurora-form-section"><h3>ព័ត៌មានផលិតផល</h3><label>ឈ្មោះផលិតផល<input class="field" name="title" required maxlength="160" value="'+esc(p.title||'')+'"></label>'+
    '<div class="admin-aurora-form-grid"><label>តម្លៃលក់ ($)<input class="field" name="price" type="number" min="0" step="0.01" required value="'+Number(p.price||0)+'"></label><label>ស្តុក<input class="field" name="stock" type="number" min="0" step="1" required value="'+Number(p.stock||0)+'"></label>'+
    '<label>Category<select class="field" name="category">'+categoryOptions+'</select></label><label>Subcategory<input class="field" name="subcategory" value="'+esc(details.subcategory||'laptop')+'"></label><label>ប្រភេទលម្អិត<input class="field" name="detail_type" value="'+esc(details.detail_type||'Laptop')+'"></label></div>'+
    '<label>ការពិពណ៌នា<textarea class="field" name="description" rows="3">'+esc(p.description||'')+'</textarea></label><label>ស្ថានភាពលក់<select class="field" name="status">'+statusOptions+'</select></label></section>'+
    '<section class="admin-aurora-form-section"><h3>លក្ខណៈបច្ចេកទេស</h3><div class="admin-aurora-form-grid">'+
    '<label>CPU<input class="field" name="cpu_model" value="'+esc(specs.cpu_model||specs.processor||'')+'"></label><label>RAM<input class="field" name="ram_type_capacity" value="'+esc(specs.ram_type_capacity||specs.ram||'')+'"></label>'+
    '<label>Storage<input class="field" name="storage_type_capacity" value="'+esc(specs.storage_type_capacity||specs.storage||specs.ssd||'')+'"></label><label>Display<input class="field" name="screen_size" value="'+esc(specs.screen_size||specs.display||'')+'"></label><label>GPU<input class="field" name="gpu_model_vram" value="'+esc(specs.gpu_model_vram||specs.gpu||'')+'"></label></div></section>'+
    '<section class="admin-aurora-form-section"><h3>ព័ត៌មាន Supplier (Admin only)</h3><div class="admin-aurora-form-grid">'+
    '<label>Supplier<input class="field" name="supplier_name" value="'+esc(source.supplier_name||'CC COMPUTER')+'"></label><label>Supplier Price ($)<input class="field" name="supplier_price" type="number" min="0" step="0.01" value="'+Number(source.supplier_price||0)+'"></label>'+
    '<label>Supplier Product Code<input class="field" name="supplier_product_code" value="'+esc(source.supplier_product_code||'')+'"></label><label>Supplier URL<input class="field" name="supplier_url" type="url" value="'+esc(source.supplier_url||'')+'"></label></div></section>'+
    '<section class="admin-aurora-form-section"><h3>រូបភាពផលិតផល</h3><div class="admin-aurora-image-strip">'+(images.map(img=>'<img src="'+esc(img.image_url)+'" alt="">').join('')||'<span>មិនទាន់មានរូបភាព</span>')+'</div>'+
    (source.supplier_name==='CC COMPUTER'&&!images.length?'<button type="button" class="admin-aurora-sync-images" data-admin-sync-images>ទាញរូបពី CC COMPUTER → Telegram</button><small>ប្រព័ន្ធនឹងស្វែងរកតាម Product Code រួច Upload រូបទៅ Telegram channel ដើម។</small>':'')+
    '<input class="field" type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple><small>រូបថ្មី Upload តាម Telegram channel ដើម។ អាចមានរូបសរុបមិនលើស ១០។</small></section>'+
    '<section class="admin-aurora-form-section"><div class="admin-aurora-section-title"><h3>Variants / ជម្រើសផលិតផល</h3><span>'+variants.length+' ជម្រើស</span></div>'+
    '<div class="admin-aurora-variants">'+(variantRows||'<p class="admin-aurora-no-variants">មិនទាន់មាន Variant ទេ។</p>')+'</div>'+
    '<div class="admin-aurora-add-variant"><strong>បន្ថែម Variant ថ្មី</strong><div class="admin-aurora-form-grid">'+
    '<label>ជម្រើស<input class="field" name="new_variant_value" placeholder="512GB SSD"></label><label>តម្លៃលក់ ($)<input class="field" name="new_variant_price" type="number" min="0" step="0.01"></label>'+
    '<label>ស្តុក<input class="field" name="new_variant_stock" type="number" min="0" step="1" value="0"></label><label>ថ្លៃ Supplier ($)<input class="field" name="new_variant_supplier_price" type="number" min="0" step="0.01" value="0"></label>'+
    '<label>Supplier Code<input class="field" name="new_variant_supplier_code"></label><label>Supplier URL<input class="field" name="new_variant_supplier_url" type="url"></label></div><button type="button" data-admin-variant-add>បន្ថែម Variant</button></div></section>'+
    '<footer class="admin-aurora-form-footer"><button type="button" data-admin-aurora-close>បោះបង់</button><button type="submit" class="is-primary">រក្សាទុកផលិតផល</button></footer></form></div>';

  modal.addEventListener('click',async event=>{
    if(event.target===modal||event.target.closest('[data-admin-aurora-close]')){closeAdminAuroraProductEditor();return;}
    const syncButton=event.target.closest('[data-admin-sync-images]');
    if(syncButton){
      syncButton.disabled=true;syncButton.textContent='កំពុងទាញរូប និង Upload ទៅ Telegram...';
      try{
        const result=await api('/api/admin/supplier-products/'+encodeURIComponent(p.id)+'/sync-images',{method:'POST',body:JSON.stringify({})});
        toast('បានទាញ និងរក្សាទុករូប '+Number(result.count||0)+' រូបក្នុង Telegram។');
        closeAdminAuroraProductEditor();await renderAdminSupplierProducts();openAdminAuroraProductEditor(p.id);
      }catch(error){toast(error.message||'មិនអាចទាញរូបពី Supplier បានទេ។','error');syncButton.disabled=false;syncButton.textContent='ទាញរូបពី CC COMPUTER → Telegram';}
      return;
    }
    const remove=event.target.closest('[data-admin-variant-delete]');
    if(remove){
      const confirmed = await appDialog({ mode:'confirm', title:'លុប Variant', message:'តើអ្នកចង់លុប Variant នេះមែនទេ?', confirmLabel:'លុប Variant', danger:true });
      if(!confirmed)return;
      try{await api('/api/admin/supplier-products/'+encodeURIComponent(p.id)+'/variants/'+encodeURIComponent(remove.dataset.adminVariantDelete),{method:'DELETE'});toast('បានលុប Variant។');closeAdminAuroraProductEditor();await renderAdminSupplierProducts();openAdminAuroraProductEditor(p.id);}
      catch(error){toast(error.message||'មិនអាចលុប Variant បានទេ។','error');}return;
    }
    const save=event.target.closest('[data-admin-variant-save]');
    if(save){
      const row=save.closest('[data-variant-id]'),get=name=>row.querySelector('[data-variant-field="'+name+'"]')?.value||'';
      const base='/api/admin/supplier-products/'+encodeURIComponent(p.id)+'/variants/'+encodeURIComponent(save.dataset.adminVariantSave);
      save.disabled=true;
      try{await api(base,{method:'PATCH',body:JSON.stringify({option_value:get('option_value'),price:Number(get('price')),stock:Number(get('stock'))})});
        await api(base+'/source',{method:'PUT',body:JSON.stringify({supplier_price:Number(get('supplier_price')),supplier_product_code:get('supplier_product_code'),supplier_url:get('supplier_url')})});
        toast('បានរក្សាទុក Variant។');closeAdminAuroraProductEditor();await renderAdminSupplierProducts();openAdminAuroraProductEditor(p.id);
      }catch(error){toast(error.message||'មិនអាចរក្សាទុក Variant បានទេ។','error');}finally{save.disabled=false;}return;
    }
    if(event.target.closest('[data-admin-variant-add]')){
      const form=$('adminAuroraProductEditForm'),get=name=>form.elements[name]?.value||'',price=Number(get('new_variant_price'));
      if(!get('new_variant_value').trim()||!Number.isFinite(price)||price<0)return toast('សូមបញ្ចូលឈ្មោះ Variant និងតម្លៃលក់។','error');
      const button=event.target.closest('[data-admin-variant-add]');button.disabled=true;
      try{const base='/api/admin/supplier-products/'+encodeURIComponent(p.id)+'/variants';
        const created=await api(base,{method:'POST',body:JSON.stringify({option_name:'Storage',option_value:get('new_variant_value'),price,stock:Number(get('new_variant_stock')||0),sku:get('new_variant_supplier_code')})});
        const id=created.data?.id;if(!id)throw new Error('មិនទទួលបាន Variant ID');
        await api(base+'/'+encodeURIComponent(id)+'/source',{method:'PUT',body:JSON.stringify({supplier_price:Number(get('new_variant_supplier_price')||0),supplier_product_code:get('new_variant_supplier_code'),supplier_url:get('new_variant_supplier_url')})});
        toast('បានបន្ថែម Variant។');closeAdminAuroraProductEditor();await renderAdminSupplierProducts();openAdminAuroraProductEditor(p.id);
      }catch(error){toast(error.message||'មិនអាចបន្ថែម Variant បានទេ។','error');}finally{button.disabled=false;}
    }
  });
  modal.addEventListener('submit',async event=>{
    if(event.target.id!=='adminAuroraProductEditForm')return;
    event.preventDefault();
    const form=event.target,data=new FormData(form),button=form.querySelector('[type="submit"]'),files=Array.from(form.elements.images.files||[]);
    if(images.length+files.length>10)return toast('រូបភាពសរុបមិនអាចលើស ១០ រូបទេ។','error');
    if(files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>20*1024*1024))return toast('សូមប្រើ JPG / PNG / WEBP មិនលើស ២០MB ក្នុងមួយរូប។','error');
    const get=name=>String(data.get(name)||'').trim();
    button.disabled=true;button.textContent='កំពុងរក្សាទុក...';
    try{
      const payload={title:get('title'),price:Number(get('price')),stock:Number(get('stock')),category:get('category'),description:get('description')};
      await api('/api/products/'+encodeURIComponent(p.id),{method:'PATCH',body:JSON.stringify(payload)});
      const next={...specs};['cpu_model','ram_type_capacity','storage_type_capacity','screen_size','gpu_model_vram'].forEach(key=>{const value=get(key);if(value)next[key]=value;else delete next[key];});
      await api('/api/admin/supplier-products/'+encodeURIComponent(p.id)+'/details',{method:'PUT',body:JSON.stringify({category:payload.category,subcategory:get('subcategory')||'other',detail_type:get('detail_type')||'Laptop',specifications:next})});
      await api('/api/admin/supplier-products/'+encodeURIComponent(p.id)+'/source',{method:'PUT',body:JSON.stringify({supplier_name:get('supplier_name'),supplier_url:get('supplier_url'),supplier_price:Number(get('supplier_price')||0),supplier_product_code:get('supplier_product_code')})});
      if(get('status')!==p.status)await api('/api/admin/products/'+encodeURIComponent(p.id),{method:'PATCH',body:JSON.stringify({status:get('status')})});
      if(files.length){const upload=new FormData();files.forEach(file=>upload.append('images',file));await apiUploadWithProgress('/api/products/'+encodeURIComponent(p.id)+'/images',upload,progress=>{button.textContent='Upload '+progress+'%';});}
      toast('បានរក្សាទុកព័ត៌មានផលិតផល AURORA។');closeAdminAuroraProductEditor();await renderAdminSupplierProducts();
    }catch(error){toast(error.message||'មិនអាចរក្សាទុកផលិតផលបានទេ។','error');button.disabled=false;button.textContent='រក្សាទុកផលិតផល';}
  });
  document.body.appendChild(modal);syncBodyScrollLock();
}

function renderSellerProductList() {
  const target = $('sellerProducts');
  if (!target) return;
  const term = String($('sellerProductSearch')?.value || '').trim().toLowerCase();
  const filtered = state.sellerProductCache.filter((p) => {
    const matchesTerm = !term || String(p.title || '').toLowerCase().includes(term);
    const matchesFilter = state.sellerActiveFilter === 'all' || p.status === state.sellerActiveFilter;
    return matchesTerm && matchesFilter;
  });

  target.innerHTML = filtered.map((p) => `
    <article class="seller-product-row">
      <div class="seller-product-main">
        <div class="seller-product-thumb">${productImage(p) ? `<img src="${esc(productImage(p))}" alt="">` : ic('image', 20)}</div>
        <div class="seller-product-copy"><b>${esc(p.title)}</b><small>${esc(p.category || 'ទូទៅ')}</small></div>
      </div>
      <div class="seller-product-price">${money(p.price)}</div>
      <div class="seller-product-metrics"><span>${Number(p.stock || 0)} ស្តុក</span><span>${Number(p.view_count || 0)} Views</span></div>
      <div class="seller-product-validity"><span class="seller-status-badge is-active">${esc(p.status)}</span></div>
      <div class="seller-product-actions">
        <button type="button" data-seller-action="edit" data-id="${esc(p.id)}" class="seller-action-button">${ic('edit', 13)} កែប្រែ</button>
        <button type="button" data-seller-action="delete" data-id="${esc(p.id)}" class="seller-action-button is-delete">${ic('trash', 13)} លុប</button>
      </div>
    </article>`).join('') || '<div class="seller-empty-state">មិនមានទំនិញក្នុងបញ្ជីនេះទេ</div>';
}

function renderSellerShopProfile(vendor) {
  if (!vendor) return;
  $('sellerShopName').value = vendor.store_name || '';
  $('sellerShopLocation').value = vendor.store_location || vendor.address || '';
  $('sellerShopDescription').value = vendor.description || '';
  $('sellerShopLogoPreview').innerHTML = vendor.store_logo_url ? `<img src="${esc(vendor.store_logo_url)}">` : ic('store', 24);
  $('sellerShopCoverPreview').innerHTML = vendor.store_cover_url ? `<img src="${esc(vendor.store_cover_url)}">` : '<span>រូប Cover ហាង</span>';
}

async function renderAdminManagedShop(vendors = null) {
  const panel = $('adminManagedShopPanel');
  if (!panel || !isAdmin()) return;
  try {
    const list = vendors || (await api('/api/admin/vendors')).data || [];
    const shop = list.find(v => v.public_shop_id === 'A001' || v.shop_code === 'A001' || v.store_name === 'AURORA Computer');
    const status = $('adminManagedShopStatus');
    if (!shop) {
      if (status) status.textContent = 'រកមិនឃើញហាង AURORA Computer (A001)។';
      panel.dataset.vendorId = '';
      return;
    }
    panel.dataset.vendorId = shop.id;
    const form = $('adminManagedShopForm');
    form.elements.store_name.value = shop.store_name || '';
    form.elements.store_location.value = shop.store_location || shop.address || '';
    form.elements.description.value = shop.description || '';
    $('adminManagedShopId').value = shop.public_shop_id || shop.shop_code || '—';
    $('adminManagedShopLogoPreview').innerHTML = shop.store_logo_url ? '<img class="h-16 w-16 rounded-full object-cover" src="' + esc(shop.store_logo_url) + '" alt="Shop logo">' : 'មិនទាន់មាន Logo';
    $('adminManagedShopCoverPreview').innerHTML = shop.store_cover_url ? '<img class="h-20 w-full rounded-xl object-cover" src="' + esc(shop.store_cover_url) + '" alt="Shop cover">' : 'មិនទាន់មាន Cover';
    if (status) status.textContent = shop.store_name + ' · ' + (shop.public_shop_id || 'A001') + ' · ' + shop.status;
  } catch (error) {
    const status = $('adminManagedShopStatus');
    if (status) status.textContent = error.message || 'មិនអាចផ្ទុកព័ត៌មានហាងបានទេ។';
  }
}

async function renderAdmin() {
  if (!isAdmin()) return;
  const b = state.siteBranding;
  $('brandTitleInput').value = b.siteTitle || '7inOne';
  $('brandSubtitleInput').value = b.siteSubtitle || '';
  $('heroBadgeInput').value = b.heroBadge || '';
  $('heroTitleInput').value = b.heroTitle || '';
  $('heroSubtitleInput').value = b.heroSubtitle || '';
  $('maintenanceToggle').checked = state.maintenanceMode;
  $('maintenanceMessageInput').value = state.maintenanceMessage;

  const managedPanel = $('adminManagedShopPanel');
  const adminPopupPanels = ['siteBrandingPanel', 'adminManagedShopPanel', 'adminVendorApplicationsPanel']
    .map(id => $(id)).filter(Boolean);
  if (!document.body.dataset.adminPopupHandlersBound) {
    document.body.dataset.adminPopupHandlersBound = 'true';
    const closeAdminPopup = panel => {
      if (!panel) return;
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('admin-management-popup-open');
    };
    document.querySelectorAll('[data-admin-popup-open]').forEach(button => {
      button.addEventListener('click', () => {
        const panel = $(button.dataset.adminPopupOpen);
        if (!panel) return;
        adminPopupPanels.forEach(item => closeAdminPopup(item));
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        document.body.classList.add('admin-management-popup-open');
        panel.querySelector('input:not([type="file"]),button,select,textarea')?.focus({ preventScroll: true });
      });
    });
    adminPopupPanels.forEach(panel => {
      panel.setAttribute('aria-hidden', 'true');
      panel.addEventListener('click', event => {
        if (event.target === panel || event.target.closest('[data-admin-popup-close]')) closeAdminPopup(panel);
      });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') adminPopupPanels.forEach(panel => closeAdminPopup(panel));
    });
  }
  if (managedPanel && managedPanel.dataset.bound !== 'true') {
    managedPanel.dataset.bound = 'true';
    const shopModal = $('adminManagedShopModal');
    const closeShopModal = () => {
      if (!shopModal) return;
      shopModal.hidden = true;
      shopModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('admin-official-shop-modal-open');
    };
    const openShopModal = () => {
      if (!managedPanel.dataset.vendorId) return toast('មិនទាន់រកឃើញហាង AURORA Computer។', 'warning');
      if (!shopModal) return;
      shopModal.hidden = false;
      shopModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('admin-official-shop-modal-open');
      requestAnimationFrame(() => shopModal.querySelector('input[name="store_name"]')?.focus({ preventScroll: true }));
    };
    $('adminManagedShopReload')?.addEventListener('click', () => void renderAdminManagedShop());
    $('adminManagedShopEdit')?.addEventListener('click', openShopModal);
    $('adminManagedShopOpen')?.addEventListener('click', () => {
      const vendorId = managedPanel.dataset.vendorId;
      if (vendorId) { location.hash = 'store/' + encodeURIComponent(vendorId); }
      else toast('មិនទាន់រកឃើញហាង AURORA Computer។', 'warning');
    });
    shopModal?.querySelectorAll('[data-admin-shop-close]').forEach(button => button.addEventListener('click', closeShopModal));
    shopModal?.querySelector('.admin-official-shop-dialog')?.addEventListener('click', event => event.stopPropagation());
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && shopModal && !shopModal.hidden) closeShopModal();
    });
    $('adminManagedShopForm')?.addEventListener('submit', async event => {
      event.preventDefault();
      const vendorId = managedPanel.dataset.vendorId;
      if (!vendorId) return toast('មិនទាន់រកឃើញហាង AURORA Computer។', 'error');
      const form = event.currentTarget;
      const payload = new FormData();
      payload.append('store_name', form.elements.store_name.value || '');
      payload.append('store_location', form.elements.store_location.value || '');
      payload.append('description', form.elements.description.value || '');
      if (form.elements.logo.files[0]) payload.append('logo', form.elements.logo.files[0]);
      if (form.elements.cover.files[0]) payload.append('cover', form.elements.cover.files[0]);
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      try {
        await api('/api/admin/vendors/' + encodeURIComponent(vendorId) + '/profile', { method: 'PATCH', body: payload });
        form.elements.logo.value = '';
        form.elements.cover.value = '';
        toast('បានរក្សាទុកព័ត៌មាន AURORA Computer។');
        await renderAdminManagedShop();
        closeShopModal();
      } catch (error) {
        toast(error.message || 'មិនអាចរក្សាទុកព័ត៌មានហាងបានទេ។', 'error');
      } finally { if (button) button.disabled = false; }
    });
  }
  try {
    const res = await api('/api/admin/vendors');
    const vendors = res.data || [];
    $('adminPendingCount').textContent = vendors.filter((v) => v.status === 'pending' && v.document_url).length;
    $('adminApprovedCount').textContent = vendors.filter((v) => v.status === 'approved').length;
    $('adminRejectedCount').textContent = vendors.filter((v) => ['rejected', 'blocked'].includes(v.status)).length;
    $('adminApplications').innerHTML = vendors.map((v) => `
      <div class="rounded-2xl border border-slate-100 p-4 flex flex-wrap items-center justify-between gap-3">
        <div><b class="text-xs">${esc(v.store_name)}</b><p class="text-[10px] text-slate-500">${esc(v.contact_phone || '')} · ${esc(v.status)}</p></div>
        <div class="flex gap-2">
          ${v.status === 'pending' && v.document_url ? `<button data-admin-review="approved" data-id="${esc(v.id)}" class="rounded-full bg-emerald-600 px-4 py-1.5 text-[10px] font-bold text-white">អនុម័ត</button><button data-admin-review="rejected" data-id="${esc(v.id)}" class="rounded-full bg-rose-50 px-4 py-1.5 text-[10px] font-bold text-rose-600">បដិសេធ</button>` : ''}
        </div>
      </div>`).join('') || '<p class="py-6 text-center text-xs text-slate-400">មិនទាន់មានពាក្យស្នើសុំអ្នកលក់។</p>';
    await Promise.all([renderAdminSupplierProducts(), renderAdminManagedShop(vendors)]);
  } catch (e) {
    toast('មិនអាចផ្ទុក Admin៖ ' + e.message, 'error');
  }
}

/* --------------------------------------------------------------------------
   12. Unified Buyer / Seller Chat System
   -------------------------------------------------------------------------- */
function scrollSellerChatToBottom() {
  const target = $('sellerChatMessages');
  if (!target) return;
  const apply = () => { target.scrollTop = target.scrollHeight; };
  apply();
  requestAnimationFrame(() => { apply(); setTimeout(apply, 60); });
}

function renderSellerChatDraftProduct() {
  const banner = $('sellerChatProductBanner');
  if (!banner) return;
  const p = state.chatDraftProduct;
  if (!p) {
    banner.classList.add('hidden');
    banner.classList.remove('is-closing');
    banner.innerHTML = '';
    return;
  }
  const img = productImage(p);
  banner.classList.remove('hidden', 'is-closing');
  banner.innerHTML = `
    <div class="seller-chat-draft-thumb">${img ? `<img src="${esc(img)}" alt="">` : ic('bag', 20)}</div>
    <div class="seller-chat-draft-meta"><small>សួរអំពីផលិតផលនេះ</small><b>${esc(p.title || 'ផលិតផល')}</b><strong>${money(p.price)}</strong></div>
    <button type="button" class="seller-chat-draft-close" data-dismiss-draft-product aria-label="ដកផលិតផលចេញ">${ic('x', 14)}</button>`;
}

function dismissSellerChatDraftProduct() {
  const banner = $('sellerChatProductBanner');
  if (!banner || banner.classList.contains('hidden')) { state.chatDraftProduct = null; return; }
  banner.classList.add('is-closing');
  setTimeout(() => { state.chatDraftProduct = null; renderSellerChatDraftProduct(); }, 230);
}

function renderSellerChatMessages(messages, forceScroll = false) {
  const target = $('sellerChatMessages');
  if (!target) return;
  const wasNearBottom = forceScroll || (target.scrollHeight - target.scrollTop - target.clientHeight < 110);

  target.innerHTML = (messages || []).map((msg) => {
    const own = msg.sender_role === state.chatMode;
    const senderIsShop = msg.sender_role === 'seller';
    const participant = state.chatConversation || {};
    const senderName = senderIsShop
      ? (participant.vendor?.store_name || 'ហាងអ្នកលក់')
      : (participant.buyer?.display_name || 'អ្នកទិញ');
    const senderAvatar = senderIsShop ? participant.vendor?.store_logo_url : participant.buyer?.avatar_url;
    const avatar = senderAvatar
      ? `<img class="seller-chat-message-avatar" src="${esc(senderAvatar)}" alt="${esc(senderName)}">`
      : `<span class="seller-chat-message-avatar seller-chat-message-avatar-fallback">${ic(senderIsShop ? 'store' : 'user', 15)}</span>`;
    let content = '';
    if (msg.message_type === 'product') {
      const prod = msg.product || null;
      const img = prod?.image_url
        ? `<img src="${esc(prod.image_url)}" alt="${esc(prod.title || 'ផលិតផល')}" loading="lazy">`
        : `<span class="seller-chat-product-placeholder">${ic('bag', 24)}</span>`;
      content = `<article class="seller-chat-product-card" ${prod?.id ? `data-chat-product-id="${esc(prod.id)}"` : ''}>${img}<div class="seller-chat-product-info"><small>ផលិតផលដែលបានសួរ</small><b>${esc(prod?.title || msg.body || 'ផលិតផល')}</b>${prod ? `<strong>${money(prod.price)}</strong>` : '<span class="seller-chat-product-unavailable">ព័ត៌មានផលិតផលមិនទាន់មាន</span>'}</div></article>`;
    } else if (msg.message_type === 'image' && (msg.media_url || msg.local_image_url)) {
      const src = msg.local_image_url || msg.media_url;
      content = `<img class="seller-chat-image" src="${esc(src)}" alt="រូបភាពក្នុងសារ" loading="lazy" role="button" tabindex="0" aria-label="មើលរូបភាពធំ">`;
    } else {
      content = `<p>${esc(msg.body || '').replace(/\n/g, '<br>')}</p>`;
    }
    const time = esc(new Date(msg.created_at).toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }));
    return `<div class="seller-chat-message-row ${own ? 'own' : 'other'}">${own ? '' : avatar}<div class="seller-chat-bubble ${own ? 'own' : 'other'}">${content}<small>${time}</small></div>${own ? avatar : ''}</div>`;
  }).join('') || '<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសារទេ។ សូមចាប់ផ្ដើមសន្ទនា។</p>';

  if (wasNearBottom) scrollSellerChatToBottom();
}

function renderSellerChatInbox() {
  const target = $('sellerChatInboxList');
  if (!target) return;
  const total = state.chatInbox.reduce((sum, row) => sum + Number(row.unread_count || 0), 0);
  const badge = $('sellerChatUnreadBadge');
  badge.textContent = total > 99 ? '99+' : String(total);
  badge.classList.toggle('hidden', !total);

  target.innerHTML = state.chatInbox.map((chat) => {
    // Show the other participant: shop identity to buyers, personal identity to shop owners.
    const otherIsShop = String(chat.other_role || '').toLowerCase() === 'seller';
    const displayName = otherIsShop
      ? (chat.vendor?.store_name || 'ហាងអ្នកលក់')
      : (chat.buyer?.display_name || chat.other_name || 'អ្នកប្រើប្រាស់');
    const avatarUrl = otherIsShop ? chat.vendor?.store_logo_url : chat.buyer?.avatar_url;
    const img = avatarUrl
      ? `<img src="${esc(avatarUrl)}" alt="${esc(displayName)}" class="h-11 w-11 shrink-0 rounded-full object-cover">`
      : `<span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400">${ic(otherIsShop ? 'store' : 'user', 20)}</span>`;
    return `<button type="button" data-unified-chat="${esc(chat.id)}" class="seller-chat-inbox-item ${Number(chat.unread_count) > 0 ? 'unread' : ''}">${img}<span class="min-w-0 flex-1"><b class="block truncate">${esc(displayName)}</b><small class="block truncate text-slate-400">${esc(chat.last_message_preview || 'ចុចដើម្បីបើកសន្ទនា')}</small></span>${Number(chat.unread_count) > 0 ? `<span class="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">${Number(chat.unread_count)}</span>` : ''}</button>`;
  }).join('') || '<p class="py-8 text-center text-xs text-slate-400">មិនទាន់មានសន្ទនាទេ។</p>';
}

async function loadUnifiedSellerChatInbox() {
  if (!state.session) return;
  try {
    const res = await api('/api/seller-chat/inbox');
    state.chatInbox = res.data || [];
    renderSellerChatInbox();
  } catch (err) {
    console.warn('Chat inbox load failed:', err.message);
  }
}

async function loadSellerChatConversation(scrollToBottom = false) {
  if (!state.chatConversationId || !state.session) return;
  const res = await api('/api/seller-chat/conversations/' + encodeURIComponent(state.chatConversationId));
  const data = res.data || {};
  const conv = data.conversation || {};
  const messages = data.messages || [];

  // current_role identifies the viewer; display the opposite participant's identity.
  state.chatConversation = conv;
  const currentRole = String(conv.current_role || state.chatMode || 'buyer').toLowerCase();
  state.chatMode = currentRole === 'seller' ? 'seller' : 'buyer';
  const otherIsShop = state.chatMode === 'buyer';
  const otherName = otherIsShop
    ? (conv.vendor?.store_name || 'ហាងអ្នកលក់')
    : (conv.buyer?.display_name || 'អ្នកទិញ');
  const otherAvatar = otherIsShop ? conv.vendor?.store_logo_url : conv.buyer?.avatar_url;
  $('sellerChatTitle').textContent = otherName;
  $('sellerChatSubtitle').textContent = '';
  $('sellerChatHeaderTitle').textContent = otherName;
  $('sellerChatHeaderSubtitle').classList.add('hidden');
  $('sellerChatHeaderIdentity').classList.remove('hidden');
  $('sellerChatHeaderDefault').classList.add('hidden');
  $('sellerChatHeaderAvatar').innerHTML = otherAvatar
    ? `<img src="${esc(otherAvatar)}" alt="${esc(otherName)}" class="h-full w-full rounded-full object-cover">`
    : `<span class="grid h-full w-full place-items-center text-slate-400">${ic(otherIsShop ? 'store' : 'user', 18)}</span>`;
  $('sellerChatProductImage').innerHTML = otherAvatar
    ? `<img src="${esc(otherAvatar)}" alt="${esc(otherName)}" class="h-full w-full object-cover">`
    : `<span class="grid h-full w-full place-items-center text-slate-400">${ic(otherIsShop ? 'store' : 'user', 18)}</span>`;

  state.chatLoadedMessages = messages;
  const pending = state.chatPendingMedia.filter((m) => m.conversation_id === state.chatConversationId);
  renderSellerChatMessages([...messages, ...pending], scrollToBottom);

  $('sellerChatInboxPane').classList.add('mobile-hidden');
  $('sellerChatBack').classList.remove('hidden');
  $('sellerChatHeaderBack').classList.remove('hidden');
  $('sellerChatThread').classList.add('mobile-active');
}

async function openSellerChat(conversationId, mode, draftProduct = null) {
  state.chatConversationId = conversationId;
  state.chatDraftProduct = draftProduct || null;
  renderSellerChatDraftProduct();
  if (mode) state.chatMode = mode;

  openModal('sellerChatModal');
  $('sellerChatMessages').innerHTML = '<div class="global-loading" role="status" aria-label="កំពុងផ្ទុកសន្ទនា"><div class="loader" aria-hidden="true"></div><span>កំពុងផ្ទុកសន្ទនា...</span></div>';
  await loadSellerChatConversation(true);
  await loadUnifiedSellerChatInbox();
  scrollSellerChatToBottom();
  setTimeout(() => $('sellerChatInput')?.focus(), 80);
}

async function openSellerChatInbox() {
  if (!requireLogin()) return;
  state.chatConversationId = null;
  state.chatDraftProduct = null;
  renderSellerChatDraftProduct();
  $('sellerChatInboxPane').classList.remove('mobile-hidden');
  $('sellerChatThread').classList.remove('mobile-active');
  $('sellerChatBack').classList.add('hidden');
  $('sellerChatHeaderBack').classList.add('hidden');
  $('sellerChatHeaderIdentity').classList.add('hidden');
  $('sellerChatHeaderDefault').classList.remove('hidden');
  $('sellerChatHeaderSubtitle').classList.remove('hidden');
  $('sellerChatTitle').textContent = 'ជ្រើសរើសសន្ទនា';
  $('sellerChatSubtitle').textContent = 'ព័ត៌មានផលិតផលនឹងបង្ហាញនៅទីនេះ';
  openModal('sellerChatModal');
  await loadUnifiedSellerChatInbox();
}

async function startListingPosterChat(item) {
  if (!requireLogin()) return;
  if (!item?.id || !['job','real_estate'].includes(item.listing_type)) return;
  try {
    const result = await api('/api/seller-chat/listing-conversations', {
      method: 'POST',
      body: JSON.stringify({ listing_type: item.listing_type, listing_id: item.id })
    });
    if (!result.data?.id) throw new Error('មិនអាចបើកសន្ទនាបានទេ។');
    await openSellerChat(result.data.id, 'buyer', null);
  } catch (error) {
    toast(error.message || 'មិនអាចឆាតជាមួយអ្នកផុសបានទេ។', 'error');
  }
}

async function startStoreChat(vendorId) {
  if (!requireLogin()) return;
  const storeId = String(vendorId || '').trim();
  if (!storeId) { toast('មិនមានព័ត៌មានហាងនេះទេ។', 'warning'); return; }
  try {
    await loadUnifiedSellerChatInbox();
    const existing = state.chatInbox.find(conversation => String(conversation.vendor_id || conversation.vendor?.id || '') === storeId);
    if (existing?.id) { await openSellerChat(existing.id, 'buyer', null); return; }
    const result = await api('/api/seller-chat/store-conversations', { method: 'POST', body: JSON.stringify({ vendor_id: storeId }) });
    if (!result.data?.id) throw new Error('មិនអាចបើកសន្ទនាជាមួយហាងបានទេ។');
    await openSellerChat(result.data.id, 'buyer', null);
  } catch (error) { toast(error.message || 'មិនអាចឆាតជាមួយហាងបានទេ។', 'error'); }
}

async function startBuyerSellerChat(productId) {
  if (!requireLogin()) return;
  const targetProduct = (state.currentProduct && String(state.currentProduct.id) === String(productId))
    ? state.currentProduct
    : state.products.find((x) => String(x.id) === String(productId));

  try {
    await loadUnifiedSellerChatInbox();
    let existingId = null;
    if (targetProduct?.vendor_id) {
      const match = state.chatInbox.find((c) => String(c.vendor_id || c.vendor?.id) === String(targetProduct.vendor_id));
      if (match) existingId = match.id;
    }
    if (existingId) {
      await openSellerChat(existingId, 'buyer', targetProduct || null);
      return;
    }
    const res = await api('/api/seller-chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, attach_product: false })
    });
    if (!res.data?.id) throw new Error('មិនអាចបើកសន្ទនាបានទេ។');
    await openSellerChat(res.data.id, 'buyer', targetProduct || null);
  } catch (error) {
    toast(error.message, 'error');
  }
}

function minimizeSellerChatPanel() {
  closeModal('sellerChatModal');
}

function toggleSellerChatPanel() {
  const modal = $('sellerChatModal');
  if (modal.classList.contains('open')) { minimizeSellerChatPanel(); return; }
  if (state.chatConversationId) { openModal('sellerChatModal'); scrollSellerChatToBottom(); return; }
  void openSellerChatInbox();
}

function syncSellerChatComposer() {
  const input = $('sellerChatInput');
  const send = $('sellerChatSend');
  if (!input || !send) return;
  send.disabled = input.disabled || (!input.value.trim() && !state.chatDraftProduct);
  input.style.height = 'auto';
  input.style.height = Math.min(100, Math.max(40, input.scrollHeight)) + 'px';
}

/* --------------------------------------------------------------------------
   13. Checkout, Telegram & Presence Helpers
   -------------------------------------------------------------------------- */
function openCheckout(p) {
  if (!requireLogin()) return;
  const selectedVariant = (p?.variants || []).find(item => String(item.id) === String(state.currentVariantId)) || (p?.variants || [])[0] || null;
  const checkoutPrice = selectedVariant ? Number(selectedVariant.price) : Number(p?.price || 0);
  const checkoutStock = selectedVariant ? Number(selectedVariant.stock) : Number(p?.stock || 0);
  if (!p || checkoutStock <= 0) { toast('ទំនិញនេះអស់ស្តុកហើយ។', 'warning'); return; }
  if (!$('checkoutModal')) {
    const wrap = document.createElement('div');
    wrap.id = 'checkoutModal';
    wrap.className = 'modal';
    wrap.innerHTML = `<section class="modal-box app-checkout-box max-w-[520px] p-6">
      <div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-bold">ព័ត៌មានដឹកជញ្ជូន និងទូទាត់</h2><button type="button" class="close-btn" data-close="checkoutModal">${ic('x', 16)}</button></div>
      <form id="checkoutForm" class="space-y-3">
        <input id="checkoutName" required class="field" placeholder="ឈ្មោះអ្នកទទួល">
        <input id="checkoutPhone" required class="field" placeholder="លេខទូរស័ព្ទ">
        <textarea id="checkoutAddress" required class="field min-h-20" placeholder="អាសយដ្ឋានដឹកជញ្ជូន"></textarea>
        <fieldset class="checkout-payment-options">
          <legend>ជ្រើសរើសវិធីទូទាត់</legend>
          <label><input type="radio" name="payment_method" value="cash_on_delivery" checked><span><b>${ic('truck',15)} ទូទាត់ពេលទទួលទំនិញ</b><small>Cash on Delivery</small></span></label>
          <label><input type="radio" name="payment_method" value="bank_transfer"><span><b>${ic('wallet',15)} KHQR / ផ្ទេរប្រាក់តាមធនាគារ</b><small>Bank Transfer · រង់ចាំការផ្ទៀងផ្ទាត់</small></span></label>
        </fieldset>
        <p id="checkoutPaymentNote" class="checkout-payment-note" hidden>ការបញ្ជាទិញនឹងរង់ចាំការផ្ទៀងផ្ទាត់។ ប្រព័ន្ធមិនទាន់មាន QR Code របស់អ្នកលក់ក្នុងព័ត៌មានហាងទេ។ សូមទាក់ទងអ្នកលក់ដើម្បីទទួល KHQR ឬព័ត៌មានគណនីផ្ទេរប្រាក់។</p>
        <div class="flex justify-between pt-2 font-bold"><span>សរុប</span><span id="checkoutTotal"></span></div>
        <button id="checkoutSubmit" class="brand-gradient w-full rounded-full py-3 text-xs font-bold text-white">បញ្ជាក់ការបញ្ជាទិញ</button>
      </form>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-close]').onclick = () => closeModal('checkoutModal');
    $('checkoutForm').querySelectorAll('[name="payment_method"]').forEach(input => input.addEventListener('change', () => {
      $('checkoutPaymentNote').hidden = input.value !== 'bank_transfer' || !input.checked;
    }));
    $('checkoutForm').onsubmit = async e => {
      e.preventDefault();
      const submit = $('checkoutSubmit');
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = 'កំពុងបញ្ជាទិញ...';
      try {
        const paymentMethod = new FormData($('checkoutForm')).get('payment_method') || 'cash_on_delivery';
        const checkoutProduct = state.currentProduct;
        const checkoutVariant = (checkoutProduct?.variants || []).find(item => String(item.id) === String(state.currentVariantId)) || (checkoutProduct?.variants || [])[0] || null;
        await api('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            customer_name: $('checkoutName').value.trim(),
            customer_phone: $('checkoutPhone').value.trim(),
            delivery_address: $('checkoutAddress').value.trim(),
            payment_method: paymentMethod,
            items: [{ product_id: checkoutProduct.id, variant_id: checkoutVariant?.id || null, quantity: 1 }]
          })
        });
        closeModal('checkoutModal');
        toast(paymentMethod === 'bank_transfer' ? 'បានទទួលការបញ្ជាទិញ។ ស្ថានភាពទូទាត់កំពុងរង់ចាំការផ្ទៀងផ្ទាត់។' : 'បានបញ្ជាទិញជោគជ័យ!');
        await Promise.all([loadOrders(), loadProducts()]);
      } catch (err) {
        toast(err.message, 'error');
      } finally {
        submit.disabled = false;
        submit.innerHTML = original;
      }
    };
  }
  $('checkoutTotal').textContent = money(checkoutPrice);
  $('checkoutName').value = profileName();
  $('checkoutPhone').value = state.me?.profile?.phone || '';
  $('checkoutForm').querySelector('[name="payment_method"][value="cash_on_delivery"]').checked = true;
  $('checkoutPaymentNote').hidden = true;
  openModal('checkoutModal');
}

function openAuth(mode = 'login') {
  setAuthMode(mode);
  openModal('authModal');
  mountTelegramLoginWidget();
}

function mountTelegramLoginWidget() {
  return mountTelegramWidget('telegramLoginWidget', 'on7inOneTelegramLogin', 'telegramLoginWidgetMounted');
}

function mountTelegramWidget(containerId, callbackName, mountedKey) {
  const container = $(containerId);
  const username = String(state.telegramBotUsername || '').replace(/^@/, '').trim();
  if (!container || !/^[A-Za-z0-9_]{5,32}$/.test(username)) return false;
  if (state[mountedKey]) return true;

  container.replaceChildren();
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.dataset.telegramLogin = username;
  script.dataset.size = 'large';
  script.dataset.userpic = 'false';
  script.dataset.onauth = callbackName + '(user)';
  container.appendChild(script);
  state[mountedKey] = true;
  return true;
}

async function completeTelegramLogin(identity) {
  if (state.telegramAuthPending) return;
  state.telegramAuthPending = true;
  try {
    if (!state.supabase) throw new Error('ប្រព័ន្ធ Supabase មិនទាន់ភ្ជាប់ទេ។');
    const response = await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(identity),
      cache: 'no-store'
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'មិនអាចចូលតាម Telegram បានទេ។');

    const session = payload.data?.session;
    if (!session?.access_token || !session?.refresh_token) {
      throw new Error('Telegram មិនបានផ្ដល់ Session ត្រឹមត្រូវទេ។');
    }

    const { data, error } = await state.supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token
    });
    if (error) throw error;
    state.session = data.session || session;
    await refreshSession();
    if (!state.session) throw new Error('មិនអាចរក្សាទុក Session របស់ Telegram បានទេ។');

    syncHeader();
    closeModal('authModal');
    toast(payload.data?.isNewUser
      ? 'បានបង្កើតគណនី និងចូលតាម Telegram ជោគជ័យ!'
      : 'បានចូលគណនីតាម Telegram ជោគជ័យ!');
    void Promise.all([loadSaved(), loadOrders(), loadUnifiedSellerChatInbox()])
      .catch(error => console.warn('Could not load Telegram account data:', error.message));
  } catch (error) {
    toast(error.message || 'មិនអាចចូលតាម Telegram បានទេ។', 'error');
  } finally {
    state.telegramAuthPending = false;
  }
}

async function completeTelegramLink(identity) {
  if (state.telegramAuthPending) return;
  if (!state.session) {
    toast('សូមចូលគណនី 7inOne ជាមុនសិន។', 'warning');
    return;
  }
  state.telegramAuthPending = true;
  try {
    await api('/api/me/telegram', {
      method: 'POST',
      body: JSON.stringify(identity)
    });
    state.telegramProfileWidgetMounted = false;
    $('telegramProfileWidget')?.replaceChildren();
    await renderTelegramSecurity();
    toast('បានភ្ជាប់ Telegram Login ជាមួយគណនីនេះរួចរាល់។');
  } catch (error) {
    toast(error.message || 'មិនអាចភ្ជាប់ Telegram បានទេ។', 'error');
  } finally {
    state.telegramAuthPending = false;
  }
}

window.on7inOneTelegramLogin = identity => { void completeTelegramLogin(identity); };
window.on7inOneTelegramLink = identity => { void completeTelegramLink(identity); }

function setAuthMode(mode) {
  state.authMode = mode;
  const reg = mode === 'register';
  $('authNameWrap').classList.toggle('hidden', !reg);
  $('authName').required = reg;
  $('authTitle').textContent = reg ? 'បង្កើតគណនី 7inOne' : 'សូមស្វាគមន៍មកកាន់ 7inOne';
  $('authSubmit').textContent = reg ? 'បង្កើតគណនី' : 'ចូលគណនី';
  document.querySelectorAll('[data-auth-mode]').forEach((b) => {
    const active = b.dataset.authMode === mode;
    b.classList.toggle('bg-white', active);
    b.classList.toggle('shadow-sm', active);
  });
}

async function renderTelegramSecurity() {
  if (!state.session) return;
  mountTelegramWidget('telegramProfileWidget', 'on7inOneTelegramLink', 'telegramProfileWidgetMounted');
  try {
    const res = await api('/api/me/telegram');
    const connected = Boolean(res.data?.connected);
    $('telegramAccountStatus').textContent = connected ? 'Telegram Bot Chat បានភ្ជាប់រួចរាល់ ✓' : 'Telegram Bot Chat មិនទាន់ភ្ជាប់';
    $('sendTelegramOtpBtn').disabled = !connected;
    $('changeTelegramPasswordBtn').disabled = !connected;
  } catch {}
}

function createProductGalleryVideoFrame(videoId, title = 'Product video', autoplay = true) {
  const frame = document.createElement('iframe');
  frame.className = 'product-gallery-video-frame';
  frame.dataset.productGalleryVideo = 'true';
  frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(videoId) + '?autoplay=' + (autoplay ? '1' : '0') + '&controls=1&rel=0&playsinline=1';
  frame.title = title || 'Product video';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  return frame;
}
function productGalleryVideoFrameMarkup(videoId, title = 'Product video', autoplay = false) {
  return '<iframe class="product-gallery-video-frame" data-product-gallery-video="true" src="https://www.youtube-nocookie.com/embed/' +
    encodeURIComponent(videoId) + '?autoplay=' + (autoplay ? '1' : '0') +
    '&controls=1&rel=0&playsinline=1" title="' + esc(title || 'Product video') +
    '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
}

function youtubeVideoId(value) {
  try {
    const url = new URL(String(value || '').trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0]?.match(/^[A-Za-z0-9_-]{11}$/)?.[0] || '';
    if (!['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)) return '';
    const id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|live|shorts)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || '';
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
  } catch { return ''; }
}
let listingVideoPlayer = null;
let listingVideoProgressTimer = null;
let listingVideoSession = 0;
let listingProductAutoSlideTimer = null;

function startListingProductAutoSlide(metaHost) {
  if (listingProductAutoSlideTimer) clearInterval(listingProductAutoSlideTimer);
  listingProductAutoSlideTimer = null;
  const rail = metaHost?.querySelector('.is-similar-products .home-shorts-related-list');
  if (!rail) return;
  const originals = Array.from(rail.children);
  if (originals.length < 2) return;
  const originalWidth = rail.scrollWidth;
  originals.forEach(item => rail.appendChild(item.cloneNode(true)));
  let paused = false;
  rail.addEventListener('mouseenter', () => { paused = true; });
  rail.addEventListener('mouseleave', () => { paused = false; });
  rail.addEventListener('pointerdown', () => { paused = true; });
  rail.addEventListener('pointerup', () => { paused = false; });
  rail.addEventListener('pointercancel', () => { paused = false; });
  listingProductAutoSlideTimer = setInterval(() => {
    if (paused || !rail.isConnected || document.hidden) return;
    rail.scrollLeft += 0.7;
    if (rail.scrollLeft >= originalWidth) rail.scrollLeft -= originalWidth;
  }, 25);
}
let listingVideoApiPromise = null;

function loadYouTubeIframeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (listingVideoApiPromise) return listingVideoApiPromise;
  listingVideoApiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try { if (typeof previousReady === 'function') previousReady(); } catch {}
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error('YouTube Player API មិនអាចដំណើរការបានទេ។'));
    };
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('មិនអាចផ្ទុក YouTube Player API បានទេ។'));
      document.head.appendChild(script);
    }
  }).catch(error => {
    if (!window.YT?.Player) {
      document.querySelector('script[src="https://www.youtube.com/iframe_api"]')?.remove();
    }
    listingVideoApiPromise = null;
    throw error;
  });
  return listingVideoApiPromise;
}

function stopListingVideoProgress() {
  if (listingVideoProgressTimer) {
    window.clearInterval(listingVideoProgressTimer);
    listingVideoProgressTimer = null;
  }
}

function closeListingVideoPopup() {
  listingVideoSession += 1;
  if (listingProductAutoSlideTimer) clearInterval(listingProductAutoSlideTimer);
  listingProductAutoSlideTimer = null;
  stopListingVideoProgress();
  if (listingVideoPlayer) {
    try { listingVideoPlayer.stopVideo(); } catch {}
    try { listingVideoPlayer.destroy(); } catch {}
    listingVideoPlayer = null;
  }
  const popup = $('homeShortsPopup');
  const stage = $('homeShortsPopupStage');
  if (stage) stage.replaceChildren();
  if (popup?.open) popup.close();
}

function openListingVideoPopup(url, title = 'វីដេអូ', meta = {}) {
  const videoId = youtubeVideoId(url);
  const popup = $('homeShortsPopup');
  const stage = $('homeShortsPopupStage');
  if (!videoId || !popup || !stage) {
    toast('YouTube Video Link មិនត្រឹមត្រូវទេ។', 'error');
    return;
  }

  closeListingVideoPopup();
  const session = listingVideoSession;
  const isProductGalleryPopup = meta.source === 'product-gallery';
  popup.classList.toggle('is-product-gallery-popup', isProductGalleryPopup);
  $('homeShortsPopupTitle').textContent = title || 'វីដេអូប្រកាស';
  const metaHost = $('homeShortsPopupMeta');
  if (metaHost) {
    const shopName = meta.storeName || 'ហាងអ្នកលក់';
    const shopAvatar = meta.storeAvatar || '';
    const currentId = String(meta.listingId || '');
    const vendorId = String(meta.vendorId || '');
    const category = String(meta.category || '');
    const renderShopMeta = () =>
      '<div class="home-shorts-shop-meta">' +
        (shopAvatar ? '<img src="' + esc(shopAvatar) + '" alt="' + esc(shopName) + '">' : '<span class="home-shorts-shop-fallback">' + esc(Array.from(shopName)[0] || 'S') + '</span>') +
        '<span class="home-shorts-shop-name">' + esc(shopName) + '</span>' +
        (meta.storeVerified ? verifiedStoreBadge(vendorId) : '') +
      '</div>';
    const renderCurrentProduct = () => {
      const image = meta.productImage || '';
      const price = meta.productPrice != null && meta.productPrice !== '' ? money(meta.productPrice) : '';
      return '<button type="button" class="home-shorts-current-product" data-related-product-id="' + esc(currentId) + '">' +
        (image ? '<img src="' + esc(image) + '" alt="" loading="lazy">' : '<span class="home-shorts-related-placeholder">' + ic('image',16) + '</span>') +
        '<span class="home-shorts-current-product-info"><strong>' + esc(meta.productTitle || title || 'ផលិតផល') + '</strong>' +
        (price ? '<span>' + esc(price) + '</span>' : '') + '</span></button>';
    };
    const renderProductSection = (sectionTitle, products, isSimilar = false) => {
      if (!products.length && !isSimilar) return '';
      const rows = products.map(product => {
        const productImage = (Array.isArray(product.product_images) ? product.product_images.slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).find(image => image?.image_url)?.image_url : '') ||
          (Array.isArray(product.images) ? product.images.map(image => typeof image === 'string' ? image : (image?.image_url || image?.url || '')).find(Boolean) : '') ||
          (Array.isArray(product.image_urls) ? product.image_urls.find(Boolean) : '') ||
          product.primary_image_url || product.image_url || product.cover_url || product.thumbnail_url || product.photo_url || '';
        const productPrice = product.price_label != null ? money(product.price_label) :
          product.price != null ? money(product.price) : '';
        return '<div class="home-shorts-related-row">' +
          '<button type="button" class="home-shorts-related-open" data-related-product-id="' + esc(product.id) + '">' +
            (productImage ? '<img src="' + esc(productImage) + '" alt="" loading="lazy">' : '<span class="home-shorts-related-placeholder">' + ic('image',16) + '</span>') +
            '<span class="home-shorts-related-title">' + esc(product.title || 'ផលិតផល') + '</span>' +
            (productPrice ? '<strong>' + esc(productPrice) + '</strong>' : '') +
          '</button>' +
        '</div>';
      }).join('');
      const content = rows || '<div class="home-shorts-related-empty">មិនទាន់មានផលិតផលស្រដៀងទេ</div>';
      return '<section class="home-shorts-product-section' + (isSimilar ? ' is-similar-products' : '') + '">' +
        (isSimilar
          ? '<div class="home-shorts-related-heading"><h4>' + esc(sectionTitle) + '</h4><div class="home-shorts-related-controls">' +
              '<button type="button" class="home-shorts-gallery-close" aria-label="បិទវីដេអូ">×</button>' +
            '</div></div>'
          : '<h4>' + esc(sectionTitle) + '</h4>') +
        '<div class="home-shorts-related-list">' + content + '</div></section>';
    };
    const renderContext = (shopProducts = [], similarProducts = []) => isProductGalleryPopup
      ? '<div class="home-shorts-popup-context">' + renderShopMeta() + renderCurrentProduct() +
        renderProductSection('ផលិតផលស្រដៀង', similarProducts, true) + '</div>'
      : renderShopMeta() + renderProductSection('ផលិតផលរបស់ហាង', shopProducts) + renderProductSection('ផលិតផលស្រដៀង', similarProducts);
    metaHost.innerHTML = renderContext();
    metaHost.hidden = false;
    {
      const loadRelatedProducts = async () => {
        const requests = [];
        if (vendorId) {
          const params = new URLSearchParams({ vendor_id: vendorId, limit: '50' });
          requests.push(api('/api/products?' + params.toString()).then(result => ({
            type: 'shop', products: Array.isArray(result.data) ? result.data : []
          })));
        }
        {
          const params = new URLSearchParams({ limit: '100' });
          if (category) params.set('category', category);
          requests.push(api('/api/products?' + params.toString()).then(result => ({
            type: 'similar', products: Array.isArray(result.data) ? result.data : []
          })));
        }
        const results = await Promise.allSettled(requests);
        if (session !== listingVideoSession || !metaHost.isConnected) return;
        let shopProducts = [], similarProducts = [];
        results.forEach(result => {
          if (result.status !== 'fulfilled') {
            console.warn('Could not load popup related products:', result.reason);
            return;
          }
          if (result.value.type === 'shop') {
            shopProducts = result.value.products.filter(product => product && String(product.id) !== currentId &&
              String(product.vendor_id || '') === vendorId).slice(0, 4);
          } else {
            similarProducts = result.value.products.filter(product => product && String(product.id) !== currentId &&
              (!category || String(product.category || '') === category)).slice(0, 12);
          }
        });
        metaHost.innerHTML = renderContext(shopProducts, similarProducts);
        if (isProductGalleryPopup) startListingProductAutoSlide(metaHost);
      };
      void loadRelatedProducts().catch(error => console.warn('Could not load popup related products:', error));
    }
    metaHost.onclick = event => {
      if (event.target.closest('.home-shorts-gallery-close')) {
        event.preventDefault();
        closeListingVideoPopup();
        return;
      }
      const scrollButton = event.target.closest('[data-related-scroll]');
      if (scrollButton) {
        event.preventDefault();
        const rail = metaHost.querySelector('.is-similar-products .home-shorts-related-list');
        if (rail) rail.scrollBy({ left: (scrollButton.dataset.relatedScroll === 'right' ? 1 : -1) * Math.max(160, rail.clientWidth * 0.75), behavior: 'smooth' });
        return;
      }
      const productButton = event.target.closest('[data-related-product-id]');
      if (productButton) {
        event.preventDefault();
        const productId = productButton.dataset.relatedProductId;
        closeListingVideoPopup();
        void openProduct(productId);
      }
    };
  }

  const playerShell = document.createElement('div');
  playerShell.className = 'custom-youtube-player';
  playerShell.innerHTML =
    '<div class="custom-youtube-screen">' +
      '<div class="custom-youtube-frame" id="customYoutubeFrame"></div>' +
      '<button type="button" class="custom-youtube-center-play" data-video-action="toggle" aria-label="ចាក់វីដេអូ"><span data-video-play-icon></span></button>' +
      '<div class="custom-youtube-loading">កំពុងផ្ទុកវីដេអូ...</div>' +
      '<div class="custom-youtube-controls">' +
      '<div class="custom-youtube-progress-row"><span class="custom-youtube-current">0:00</span><input class="custom-youtube-seek" data-video-seek type="range" min="0" max="1000" value="0" step="1" aria-label="ទីតាំងវីដេអូ"><span class="custom-youtube-duration">0:00</span></div>' +
      '<div class="custom-youtube-control-row">' +
        '<button type="button" data-video-action="toggle" aria-label="ចាក់ / ផ្អាក"><span data-video-play-icon>▶</span></button>' +
        '<button type="button" data-video-action="back" aria-label="ថយក្រោយ 10 វិនាទី">−10</button>' +
        '<button type="button" data-video-action="forward" aria-label="ទៅមុខ 10 វិនាទី">+10</button>' +
        '<button type="button" data-video-action="captions" aria-label="បើក/បិទ Caption" aria-pressed="false" title="បើក/បិទ Caption">CC</button>' +
        '<button type="button" data-video-action="mute" aria-label="បិទសំឡេង"><span data-video-volume-icon>🔊</span></button>' +
        '<input class="custom-youtube-volume" data-video-volume type="range" min="0" max="100" value="85" aria-label="កម្រិតសំឡេង">' +
        '<span class="custom-youtube-spacer"></span>' +
        '<button type="button" data-video-action="settings" aria-label="ការកំណត់">⚙</button>' +
        '<button type="button" data-video-action="fullscreen" aria-label="ពេញអេក្រង់">⛶</button>' +
      '</div>' +
      '<div class="custom-youtube-settings" hidden><label>ល្បឿនចាក់<select data-video-speed aria-label="ល្បឿនចាក់"><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1" selected>ធម្មតា 1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="1.75">1.75×</option><option value="2">2×</option></select></label></div>' +
      '</div>' +
    '</div>' +
    '';

  stage.replaceChildren(playerShell);

  // Drag the floating popup directly from the video surface with the left mouse button.
  // Keep custom controls interactive while making the YouTube iframe click-through.
  const videoScreen = playerShell.querySelector('.custom-youtube-screen');
  if (videoScreen && !videoScreen.dataset.popupDragBound) {
    videoScreen.dataset.popupDragBound = '1';
    let videoDrag = null;
    videoScreen.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.custom-youtube-controls, button, input, select, a')) return;
      const rect = popup.getBoundingClientRect();
      videoDrag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top };
      try { videoScreen.setPointerCapture(event.pointerId); } catch {}
      popup.style.position = 'fixed';
      popup.style.margin = '0';
      popup.style.transform = 'none';
      popup.style.left = rect.left + 'px';
      popup.style.top = rect.top + 'px';
      event.preventDefault();
    });
    videoScreen.addEventListener('pointermove', event => {
      if (!videoDrag || event.pointerId !== videoDrag.pointerId) return;
      const left = Math.max(8, Math.min(window.innerWidth - popup.offsetWidth - 8, videoDrag.left + event.clientX - videoDrag.startX));
      const top = Math.max(8, Math.min(window.innerHeight - popup.offsetHeight - 8, videoDrag.top + event.clientY - videoDrag.startY));
      popup.style.left = left + 'px';
      popup.style.top = top + 'px';
    });
    const stopVideoDrag = event => {
      if (videoDrag && event.pointerId === videoDrag.pointerId) videoDrag = null;
    };
    videoScreen.addEventListener('pointerup', stopVideoDrag);
    videoScreen.addEventListener('pointercancel', stopVideoDrag);
  }
  // Non-modal floating player: keep the marketplace interactive behind it.
  if (!popup.open) popup.show();

  const frameHost = playerShell.querySelector('#customYoutubeFrame');
  const seek = playerShell.querySelector('[data-video-seek]');
  const volume = playerShell.querySelector('[data-video-volume]');
  const settings = playerShell.querySelector('.custom-youtube-settings');
  const loading = playerShell.querySelector('.custom-youtube-loading');

  const formatTime = seconds => {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    return Math.floor(value / 60) + ':' + String(value % 60).padStart(2, '0');
  };
  const setPlayingUi = playing => {
    const playSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10-6.5-10-6.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    const pauseSvg = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.5 5.5v13M15.5 5.5v13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    playerShell.querySelectorAll('[data-video-play-icon]').forEach(node => {
      node.innerHTML = playing ? pauseSvg : playSvg;
    });
    const centerPlay = playerShell.querySelector('.custom-youtube-center-play');
    if (centerPlay) {
      centerPlay.classList.toggle('is-playing', playing);
      centerPlay.setAttribute('aria-label', playing ? 'ផ្អាកវីដេអូ' : 'ចាក់វីដេអូ');
    }
  };
  const updateProgress = () => {
    if (!listingVideoPlayer || session !== listingVideoSession) return;
    try {
      const duration = listingVideoPlayer.getDuration() || 0;
      const current = listingVideoPlayer.getCurrentTime() || 0;
      seek.value = duration ? String(Math.round(current / duration * 1000)) : '0';
      playerShell.querySelector('.custom-youtube-current').textContent = formatTime(current);
      playerShell.querySelector('.custom-youtube-duration').textContent = formatTime(duration);
    } catch {}
  };

  let captionsEnabled = false;
  const captionsButton = playerShell.querySelector('[data-video-action="captions"]');
  playerShell.addEventListener('click', event => {
    const button = event.target.closest('[data-video-action]');
    if (!button || !listingVideoPlayer) return;
    const action = button.dataset.videoAction;
    try {
      if (action === 'toggle') {
        if (listingVideoPlayer.getPlayerState() === 1) listingVideoPlayer.pauseVideo();
        else listingVideoPlayer.playVideo();
      } else if (action === 'back') {
        listingVideoPlayer.seekTo(Math.max(0, listingVideoPlayer.getCurrentTime() - 10), true);
      } else if (action === 'forward') {
        listingVideoPlayer.seekTo(Math.min(listingVideoPlayer.getDuration() || Infinity, listingVideoPlayer.getCurrentTime() + 10), true);
      } else if (action === 'captions') {
        captionsEnabled = !captionsEnabled;
        if (captionsEnabled) listingVideoPlayer.loadModule('captions');
        else listingVideoPlayer.unloadModule('captions');
        captionsButton?.setAttribute('aria-pressed', String(captionsEnabled));
        captionsButton?.classList.toggle('is-active', captionsEnabled);
      } else if (action === 'mute') {
        if (listingVideoPlayer.isMuted()) listingVideoPlayer.unMute();
        else listingVideoPlayer.mute();
        playerShell.querySelector('[data-video-volume-icon]').textContent = listingVideoPlayer.isMuted() ? '🔇' : '🔊';
      } else if (action === 'settings') {
        settings.hidden = !settings.hidden;
      } else if (action === 'fullscreen') {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else playerShell.requestFullscreen?.();
      }
    } catch {}
  });

  let seekCommitFrame = 0;
  const commitSeek = () => {
    if (!listingVideoPlayer || session !== listingVideoSession) return;
    const duration = listingVideoPlayer.getDuration() || 0;
    if (!duration) return;
    const targetTime = Math.max(0, Math.min(duration, Number(seek.value) / 1000 * duration));
    playerShell.querySelector('.custom-youtube-current').textContent = formatTime(targetTime);
    try { listingVideoPlayer.seekTo(targetTime, true); } catch {}
  };
  seek.addEventListener('input', () => {
    if (!listingVideoPlayer) return;
    const duration = listingVideoPlayer.getDuration() || 0;
    if (!duration) return;
    const targetTime = Math.max(0, Math.min(duration, Number(seek.value) / 1000 * duration));
    playerShell.querySelector('.custom-youtube-current').textContent = formatTime(targetTime);
    if (seekCommitFrame) cancelAnimationFrame(seekCommitFrame);
    seekCommitFrame = requestAnimationFrame(commitSeek);
  });
  seek.addEventListener('change', commitSeek);
  seek.addEventListener('pointerup', commitSeek);
  seek.addEventListener('keyup', event => { if (event.key.startsWith('Arrow') || event.key === 'Home' || event.key === 'End') commitSeek(); });
  volume.addEventListener('input', () => {
    if (!listingVideoPlayer) return;
    const level = Number(volume.value);
    listingVideoPlayer.setVolume(level);
    if (level > 0 && listingVideoPlayer.isMuted()) listingVideoPlayer.unMute();
    playerShell.querySelector('[data-video-volume-icon]').textContent = level === 0 ? '🔇' : '🔊';
  });
  playerShell.querySelector('[data-video-speed]').addEventListener('change', event => {
    try { listingVideoPlayer?.setPlaybackRate(Number(event.target.value)); } catch {}
  });

  loadYouTubeIframeApi().then(YT => {
    if (session !== listingVideoSession || !frameHost.isConnected) return;
    listingVideoPlayer = new YT.Player(frameHost, {
      width: '100%',
      height: '100%',
      videoId,
      playerVars: { autoplay: 1, cc_load_policy: 0, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, playsinline: 1, rel: 0, enablejsapi: 1, origin: window.location.origin },
      events: {
        onReady: event => {
          if (session !== listingVideoSession) {
            try { event.target.destroy(); } catch {}
            return;
          }
          loading.hidden = true;
          // Start with captions disabled; viewers can enable them with the CC control.
          captionsEnabled = false;
          captionsButton?.setAttribute('aria-pressed', 'false');
          captionsButton?.classList.remove('is-active');
          try { event.target.unloadModule('captions'); } catch {}
          try { event.target.setOption('captions', 'track', {}); } catch {}
          event.target.setVolume(Number(volume.value));
          event.target.playVideo();
          stopListingVideoProgress();
          listingVideoProgressTimer = window.setInterval(updateProgress, 250);
        },
        onStateChange: event => {
          if (session !== listingVideoSession) return;
          setPlayingUi(event.data === YT.PlayerState.PLAYING);
          if (!captionsEnabled) {
            try { listingVideoPlayer?.unloadModule('captions'); } catch {}
            try { listingVideoPlayer?.setOption('captions', 'track', {}); } catch {}
          }
          if (event.data === YT.PlayerState.ENDED) {
            updateProgress();
            stopListingVideoProgress();
          } else if (event.data === YT.PlayerState.PLAYING && !listingVideoProgressTimer) {
            listingVideoProgressTimer = window.setInterval(updateProgress, 250);
          }
        },
        onError: () => {
          if (session !== listingVideoSession) return;
          loading.textContent = 'មិនអាចចាក់វីដេអូនេះបានទេ។ សូមពិនិត្យ Link YouTube។';
          loading.hidden = false;
        }
      }
    });
  }).catch(error => {
    if (session !== listingVideoSession) return;
    loading.textContent = error.message || 'មិនអាចផ្ទុក YouTube Player បានទេ។';
    loading.hidden = false;
  });
}
function listingVideoButton(item) {
  if (!item?.youtube_video_url || !youtubeVideoId(item.youtube_video_url)) return '';
  const store = item.vendors || item.vendor || {};
  const poster = item.poster || {};
  const image = (Array.isArray(item.image_urls) ? item.image_urls[0] : '') || item.image_url || item.cover_url || '';
  const price = item.price_label == null ? '' : money(item.price_label);
  const meta = {
    storeName: store.store_name || item.store_name || 'ហាងអ្នកលក់',
    storeAvatar: store.store_logo_url || store.logo_url || '',
    listingId: item.id || '',
    vendorId: item.vendor_id || store.id || '',
    category: item.category || ''
  };
  return '<button type="button" class="listing-video-open" data-listing-video="' + esc(item.youtube_video_url) + '" data-listing-video-title="' + esc(item.title || 'វីដេអូប្រកាស') + '" data-video-store-name="' + esc(meta.storeName) + '" data-video-store-avatar="' + esc(meta.storeAvatar) + '" data-video-listing-id="' + esc(meta.listingId) + '" data-video-vendor-id="' + esc(meta.vendorId) + '" data-video-category="' + esc(meta.category) + '">' + ic('play',17) + '<span>មើលវីដេអូ YouTube</span></button>';
}

async function syncVendorPresence() {
  const nextId = state.session && !document.hidden && state.me?.vendor?.status === 'approved' ? String(state.me.vendor.id || '') : '';
  if (nextId) {
    try { await fetch('/api/vendor/presence?tab_id=' + encodeURIComponent(state.vendorPresenceTabId), { method: 'POST', headers: { Authorization: 'Bearer ' + state.session.access_token } }); } catch {}
  }
}

/* --------------------------------------------------------------------------
   14. Event Bindings & Bootstrapping
   -------------------------------------------------------------------------- */
function initNavIcons(root = document) {
  root.querySelectorAll('[data-nav-icon]').forEach(node => {
    const name = String(node.dataset.navIcon || '');
    if (!Object.prototype.hasOwnProperty.call(ICON_PATHS, name)) {
      console.warn('Unknown marketplace navigation icon:', name);
      node.replaceChildren();
      return;
    }
    node.innerHTML = ic(name, name === 'chat' ? 22 : 19);
  });
}

function initIcons() {
  $('logoIcon').innerHTML = ic('bag', 20);
  $('searchIcon').innerHTML = ic('search', 17);
  $('searchBtn').innerHTML = ic('search', 16);
  $('postIcon').innerHTML = ic('plus', 16);
  $('mobilePostBtn').innerHTML = ic('plus', 18);
  $('bellIcon').innerHTML = ic('bell', 18);
  $('chevronIcon').innerHTML = ic('chev', 13);
  $('menuUserIcon').innerHTML = ic('user', 15);
  $('menuStoreIcon').innerHTML = ic('store', 15);
  $('menuAdminIcon').innerHTML = ic('shield', 15);
  $('menuSaveIcon').innerHTML = ic('bookmark', 15);
  $('menuLoginIcon').innerHTML = ic('logout', 15);
  if ($('heroShield')) $('heroShield').innerHTML = ic('shield', 15);
  if ($('heroUsers')) $('heroUsers').innerHTML = ic('users', 15);
  $('catAll').innerHTML = ic('grid', 22);
  $('catPhone').innerHTML = ic('phone', 22);
  $('catCar').innerHTML = ic('car', 22);
  $('catHome').innerHTML = ic('home', 22);
  $('catFashion').innerHTML = ic('shirt', 22);
  $('catFurniture').innerHTML = ic('sofa', 22);
  $('emptyIcon').innerHTML = ic('search', 24);
  $('coverCam').innerHTML = ic('camera', 14);
  $('avatarCam').insertAdjacentHTML('afterbegin', ic('camera', 13));
  $('sellerGateIcon').innerHTML = ic('shield', 22);
  $('kpiListingsIcon').innerHTML = ic('grid', 17);
  $('kpiViewsIcon').innerHTML = ic('eye', 17);
  $('kpiRatingIcon').innerHTML = ic('star', 17);
  $('kpiSalesIcon').innerHTML = ic('wallet', 17);
  $('addProductIcon').innerHTML = ic('plus', 15);
  $('sellerDocThumb').innerHTML = ic('file', 22);
  $('year').textContent = new Date().getFullYear();

  document.querySelectorAll('[data-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.icon, Number(node.dataset.iconSize) || 18); });
  document.querySelectorAll('[data-seller-icon]').forEach((node) => { node.innerHTML = ic(node.dataset.sellerIcon, 16); });
  initNavIcons();
  document.querySelectorAll('.close-btn').forEach((b) => { b.innerHTML = ic('x', 16); });
}

function jobsSalaryValue(job) {
  const min = Number(job.salary_min);
  const max = Number(job.salary_max);
  if (Number.isFinite(min) && job.salary_min !== null && job.salary_min !== '') return min;
  if (Number.isFinite(max) && job.salary_max !== null && job.salary_max !== '') return max;
  return null;
}

function renderJobs() {
  const root = $('jobsList');
  if (!root) return;
  const query = $('jobsSearchInput')?.value?.trim() || '';
  const category = state.activeJobCategory || 'all';
  const subcategory = state.activeJobSubcategory || 'all';
  const sort = state.jobsSort || 'newest';
  let jobs = (state.jobs || []).filter(job => subcategory === 'all' || String(job.subcategory || '') === subcategory);
  if (sort === 'salary_asc' || sort === 'salary_desc') {
    jobs.sort((a,b) => {
      const av = jobsSalaryValue(a), bv = jobsSalaryValue(b);
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return sort === 'salary_asc' ? av - bv : bv - av;
    });
  } else {
    jobs.sort((a,b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }
  const heading = document.querySelector('.jobs-results-heading b');
  if (heading) {
    const active = $('jobsCategoryList')?.querySelector('[data-job-category].is-active');
    heading.textContent = category === 'all' ? 'ការងារទាំងអស់' : (active?.textContent?.trim() || 'ការងារ');
  }
  const count = $('jobsResultCount');
  if (count) count.textContent = jobs.length + ' ការងារ';
  if (!jobs.length) {
    root.innerHTML = `<div class="jobs-empty-state"><span aria-hidden="true">▤</span><b>មិនមានការងារត្រូវនឹងលក្ខខណ្ឌទេ</b><p>${query ? 'សូមសាកល្បងពាក្យស្វែងរកផ្សេង។' : 'ការងារថ្មីៗនឹងបង្ហាញនៅទីនេះ នៅពេលមានការប្រកាស។'}</p></div>`;
    return;
  }
  root.innerHTML = jobs.map(job => {
    const image = job.image_url || job.image_urls?.[0] || '';
    const salary = job.price_label === 'ចរចា' ? 'ចរចាប្រាក់ខែ' : (job.price_label ? '$' + String(job.price_label).replace(' - ', ' - $') : 'ទាក់ទងសួរប្រាក់ខែ');
    return `<button type="button" class="jobs-result-card" data-job-open="${esc(job.id)}">
      <span class="jobs-result-image">${image ? `<img src="${esc(image)}" alt="" loading="lazy">` : ic('briefcase',22)}</span>
      <span class="jobs-result-content">
        <span class="jobs-result-poster"><span class="listing-poster-avatar">${job.poster?.avatar_url ? `<img src="${esc(job.poster.avatar_url)}" alt="">` : esc(Array.from(job.poster?.display_name || '7')[0])}</span><b>${esc(job.poster?.display_name || job.company_name || 'អ្នកប្រើប្រាស់')}</b><time>${timeAgoKm(job.created_at)}</time></span>
        <b>${esc(job.title || 'ការងារ')}</b>
        <small>${esc(job.company_name || 'និយោជក')} · ${esc(job.location || 'កម្ពុជា')}</small>
        <strong>${esc(salary)}${({hourly:' / ម៉ោង',daily:' / ថ្ងៃ',monthly:' / ខែ'}[job.salary_period] || '')}</strong>
      </span>
      <span class="jobs-result-arrow" aria-hidden="true">›</span>
    </button>`;
  }).join('');
}

function scheduleSkeleton(render, delay = 160) {
  let timer = setTimeout(render, delay);
  return () => { if (timer) { clearTimeout(timer); timer = null; } };
}

function renderJobsSkeleton() {
  const root = $('jobsList');
  if (!root) return;
  const bar = (className = '') => `<span class="skeleton jobs-skeleton-block ${className}" aria-hidden="true"></span>`;
  root.innerHTML = Array.from({ length: 5 }, (_, index) => `
    <div class="jobs-result-card jobs-skeleton-card" aria-hidden="true">
      <span class="jobs-result-image jobs-skeleton-image">${bar('jobs-sk-image')}</span>
      <span class="jobs-result-content jobs-skeleton-content">
        <span class="jobs-result-poster jobs-skeleton-poster">
          ${bar('jobs-sk-avatar')}${bar('jobs-sk-poster-name')}${bar('jobs-sk-time')}
        </span>
        ${bar('jobs-sk-title ' + (index % 2 ? 'is-short' : ''))}
        ${bar('jobs-sk-company')}
        ${bar('jobs-sk-salary')}
      </span>
      <span class="jobs-result-arrow" aria-hidden="true">${bar('jobs-sk-arrow')}</span>
    </div>`).join('');
}

async function loadJobs() {
  const requestId = ++state.jobsRequestId;
  const params = new URLSearchParams({ limit: '50', type: 'job' });
  const query = $('jobsSearchInput')?.value?.trim() || '';
  if (query) params.set('q', query);
  if (state.activeJobCategory && state.activeJobCategory !== 'all') params.set('category', state.activeJobCategory);
  const root = $('jobsList');
  if (root) root.setAttribute('aria-busy','true');
  const cancelSkeleton = root ? scheduleSkeleton(renderJobsSkeleton) : () => {};
  try {
    const result = await api('/api/marketplace/listings?' + params.toString());
    if (requestId !== state.jobsRequestId) return;
    cancelSkeleton();
    state.jobs = Array.isArray(result.data) ? result.data : [];
    renderJobs();
  } catch (error) {
    if (requestId !== state.jobsRequestId) return;
    cancelSkeleton();
    state.jobs = [];
    renderJobs();
    toast('មិនអាចទាញយកការងារបានទេ៖ ' + error.message, 'error');
  } finally {
    cancelSkeleton();
    if (requestId === state.jobsRequestId && root) root.setAttribute('aria-busy','false');
  }
}

function renderJobSubcategories() {
  const root = $('jobsSubcategoryList');
  if (!root) return;
  const category = state.activeJobCategory;
  const subs = category === 'all' ? [] : (LISTING_TAXONOMY.jobs[category]?.subs || []);
  if (!subs.length) {
    root.hidden = true;
    root.innerHTML = '';
    state.activeJobSubcategory = 'all';
    return;
  }
  root.hidden = false;
  root.innerHTML = ['all', ...subs].map((value,index) => {
    const label = index === 0 ? 'ទាំងអស់' : value;
    const selected = state.activeJobSubcategory === value;
    return `<button type="button" data-job-subcategory="${esc(value)}" class="${selected ? 'is-active' : ''}">${esc(label)}</button>`;
  }).join('');
}

function bindEvents() {
  // Jobs category, subcategory, keyword and salary sorting filters.
  const jobsSearch = $('jobsSearchInput');
  const jobsCategories = $('jobsCategoryList');
  jobsCategories?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-job-category]');
    if (!button) return;
    state.activeJobCategory = button.dataset.jobCategory || 'all';
    state.activeJobSubcategory = 'all';
    jobsCategories.querySelectorAll('[data-job-category]').forEach(item => item.classList.toggle('is-active', item === button));
    renderJobSubcategories();
    void loadJobs();
  });
  $('jobsSubcategoryList')?.addEventListener('click', event => {
    const button = event.target.closest('[data-job-subcategory]');
    if (!button) return;
    state.activeJobSubcategory = button.dataset.jobSubcategory || 'all';
    $('jobsSubcategoryList').querySelectorAll('[data-job-subcategory]').forEach(item => item.classList.toggle('is-active', item === button));
    renderJobs();
  });
  $('jobsSortSelect')?.addEventListener('change', event => {
    state.jobsSort = event.target.value || 'newest';
    renderJobs();
  });
  jobsSearch?.addEventListener('input', () => {
    clearTimeout(window.jobsSearchWait);
    window.jobsSearchWait = setTimeout(() => void loadJobs(), 300);
  });
  $('jobsList')?.addEventListener('click', event => {
    const card = event.target.closest('[data-job-open]');
    if (!card) return;
    void openMarketplaceListing('job', card.dataset.jobOpen);
  });

  // Search & Category Filters
  document.querySelectorAll('[data-property-type]').forEach((button) => {
    button.addEventListener('click', () => setPropertyType(button.dataset.propertyType));
  });
  document.querySelectorAll('[data-listing-type]').forEach((button) => {
    button.addEventListener('click', () => setListingType(button.dataset.listingType));
  });
  $('homeShortsPopupClose')?.addEventListener('click', closeListingVideoPopup);
  $('closeDetailsPopover')?.addEventListener('click', closeDetailsPopover);
  $('detailsPopoverModal')?.addEventListener('click', event => {
    if (event.target === $('detailsPopoverModal')) closeDetailsPopover();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDetailsPopover(); });

  (() => {
    const dialog = $('homeShortsPopup');
    if (!dialog || dialog.dataset.popupControlsBound) return;
    dialog.dataset.popupControlsBound = '1';

    // Keep dragging optional: the old metadata/header strip is intentionally removed.
    const handle = dialog.querySelector('#homeShortsPopupMeta') || dialog.querySelector('.home-shorts-popup-head');
    if (handle) {
      let dragState = null;
      handle.dataset.dragBound = '1';
      handle.style.cursor = 'move';
      handle.style.touchAction = 'none';
      handle.addEventListener('pointerdown', event => {
        if (event.target.closest('button, a, input, select, textarea, [data-related-product-id]')) return;
        const rect = dialog.getBoundingClientRect();
        dragState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
        try { handle.setPointerCapture(event.pointerId); } catch {}
        dialog.style.position = 'fixed';
        dialog.style.margin = '0';
        dialog.style.transform = 'none';
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.top + 'px';
        event.preventDefault();
      });
      dialog.addEventListener('pointermove', event => {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        const left = Math.max(8, Math.min(window.innerWidth - dialog.offsetWidth - 8, dragState.left + event.clientX - dragState.x));
        const top = Math.max(8, Math.min(window.innerHeight - dialog.offsetHeight - 8, dragState.top + event.clientY - dragState.y));
        dialog.style.left = left + 'px';
        dialog.style.top = top + 'px';
      });
      const stopDrag = event => { if (dragState && event.pointerId === dragState.pointerId) dragState = null; };
      dialog.addEventListener('pointerup', stopDrag);
      dialog.addEventListener('pointercancel', stopDrag);
    }

    // Resize handles must be installed even when the popup header is absent.
    ['n','s','e','w','ne','nw','se','sw'].forEach(edge => {
      const grip = document.createElement('span');
      grip.className = 'home-shorts-resize-handle';
      grip.dataset.edge = edge;
      grip.setAttribute('aria-hidden', 'true');
      dialog.appendChild(grip);
      let resize = null;
      grip.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        const rect = dialog.getBoundingClientRect();
        resize = { id: event.pointerId, edge, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, width: rect.width };
        grip.setPointerCapture(event.pointerId);
        dialog.style.position = 'fixed';
        dialog.style.margin = '0';
        dialog.style.transform = 'none';
        dialog.style.left = rect.left + 'px';
        dialog.style.top = rect.top + 'px';
        event.preventDefault();
        event.stopPropagation();
      });
      grip.addEventListener('pointermove', event => {
        if (!resize || event.pointerId !== resize.id) return;
        const dx = event.clientX - resize.x;
        const dy = event.clientY - resize.y;
        const e = resize.edge;
        const horizontal = e.includes('e') ? dx : e.includes('w') ? -dx : 0;
        const vertical = e.includes('s') ? dy : e.includes('n') ? -dy : 0;
        const delta = horizontal || (vertical ? vertical * 16 / 9 : 0);
        const maxWidth = Math.max(650, window.innerWidth - 16);
        const width = Math.max(650, Math.min(maxWidth, resize.width + delta));
        dialog.style.width = width + 'px';
        if (e.includes('w')) dialog.style.left = (resize.left + resize.width - width) + 'px';
        if (e.includes('n')) dialog.style.top = Math.max(8, resize.top + (resize.width - width) * 9 / 16) + 'px';
      });
      const stop = event => { if (resize && event.pointerId === resize.id) resize = null; };
      grip.addEventListener('pointerup', stop);
      grip.addEventListener('pointercancel', stop);
    });

    dialog.addEventListener('close', () => {
      dialog.style.left = '';
      dialog.style.top = '';
      dialog.style.position = '';
      dialog.style.margin = '';
      dialog.style.transform = '';
      dialog.style.width = '';
      dialog.style.height = '';
    });
  })();
  $('homeShortsPopup')?.addEventListener('close', closeListingVideoPopup);
  document.addEventListener('click', event => {
    const videoButton = event.target.closest('[data-listing-video]');
    if (videoButton) openListingVideoPopup(videoButton.dataset.listingVideo, videoButton.dataset.listingVideoTitle || 'វីដេអូប្រកាស', {
      storeName: videoButton.dataset.videoStoreName,
      storeAvatar: videoButton.dataset.videoStoreAvatar,
      listingId: videoButton.dataset.videoListingId,
      vendorId: videoButton.dataset.videoVendorId,
      category: videoButton.dataset.videoCategory
    });
  });
  $('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.searchTerm = $('searchInput').value.trim();
    state.activeCategory = $('searchCategory').value;
    if (state.activeCategory !== 'all') state.activeListingType = 'product';
    updateMarketplaceCategoryHeading();
    document.querySelectorAll('[data-listing-type]').forEach((b) => b.classList.toggle('active', b.dataset.listingType === state.activeListingType));
    void loadProducts();
  });
  $('searchInput').addEventListener('input', (e) => {
    state.searchTerm = e.target.value.trim();
    clearTimeout(window.searchWait);
    window.searchWait = setTimeout(() => void loadProducts(), 350);
  });
  $('searchCategory').addEventListener('change', (e) => setCategory(e.target.value));
  document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-category]');
  if (b) setCategory(b.dataset.category);
});
  document.querySelectorAll('[data-tag]').forEach((b) => b.addEventListener('click', () => {
    state.searchTerm = b.dataset.tag;
    $('searchInput').value = state.searchTerm;
    void loadProducts();
  }));
  $('clearFilters').addEventListener('click', () => {
    state.searchTerm = '';
    state.activeCondition = 'all';
    state.activeSpecFilters = {};
    state.activeSubcategory = 'all';
    state.activeDetailType = 'all';
    state.specPriceMin = '';
    state.specPriceMax = '';
    document.querySelectorAll('[data-spec-filter]').forEach(input => { input.checked = false; });
    document.querySelectorAll('[data-price-filter]').forEach(input => { input.value = ''; });
    document.querySelector('[data-condition-filter][value="all"]')?.click();
    $('searchInput').value = '';
    setCategory('all');
  });

  // Marketplace sort controls
  const sortButtons = document.querySelectorAll('[data-sort-value]');
  const syncMarketplaceSortState = () => {
    sortButtons.forEach((button) => {
      const active = button.dataset.sortValue === state.marketplaceSort;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  syncMarketplaceSortState();
  $('specificationFilters')?.addEventListener('change', event => {
    const subcategoryInput = event.target.closest('[data-subcategory-filter]');
    if (subcategoryInput) {
      state.activeSubcategory = subcategoryInput.value || 'all';
      state.activeDetailType = 'all';
      state.activeSpecFilters = {};
      renderProducts();
      return;
    }
    const detailTypeInput = event.target.closest('[data-detail-type-filter]');
    if (detailTypeInput) {
      state.activeDetailType = detailTypeInput.value || 'all';
      state.activeSpecFilters = {};
      renderProducts();
      return;
    }
    const input = event.target.closest('[data-spec-filter]');
    if (input) {
      const key = input.dataset.specFilter;
      const selected = new Set(state.activeSpecFilters[key] || []);
      if (input.checked) selected.add(input.value); else selected.delete(input.value);
      state.activeSpecFilters[key] = [...selected];
      renderProducts();
      return;
    }
    const priceInput = event.target.closest('[data-price-filter]');
    if (priceInput) {
      state.specPriceMin = $('specificationFilters').querySelector('[data-price-filter="min"]')?.value || '';
      state.specPriceMax = $('specificationFilters').querySelector('[data-price-filter="max"]')?.value || '';
      renderProducts();
    }
  });

  document.querySelector('.amazon-filter-sidebar')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sort-value]');
    if (!button) return;
    const sortValue = button.dataset.sortValue;
    if (!['low', 'high', 'newest'].includes(sortValue)) return;
    state.marketplaceSort = sortValue;
    syncMarketplaceSortState();
    renderProducts();
  });

  // Product Grid Delegation
  document.querySelectorAll('[data-condition-filter]').forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      state.activeCondition = input.value || 'all';
      renderProducts();
    });
  });
  $('productGrid').addEventListener('click', (e) => {
    const copyId=e.target.closest('[data-copy-product-code]');
    if(copyId){e.preventDefault();e.stopPropagation();void copyProductCode(copyId);return;}
    const otherListing = e.target.closest('[data-action="view-listing"]');
    if (otherListing) { openMarketplaceListing(otherListing.dataset.type, otherListing.dataset.id); return; }
    const heart = e.target.closest('[data-action="save"]');
    if (heart) { e.preventDefault(); e.stopPropagation(); Promise.resolve(saveAction(heart.dataset.id, heart)); return; }
    const store = e.target.closest('[data-action="store"]');
    if (store) { e.preventDefault(); e.stopPropagation(); void openStorefront(store.dataset.vendorId); return; }
    const view = e.target.closest('[data-action="view"]');
    if (view) void openProduct(view.dataset.id);
  });

  // Keep the visible view in sync with browser Back / Forward navigation.
  window.addEventListener('hashchange', () => {
    const routeParts = String(window.location.hash || '#home')
      .replace(/^#/, '')
      .split('/')
      .filter(Boolean);
    const routeName = routeParts[0] || 'home';
    let routeId = '';
    try { routeId = routeParts[1] ? decodeURIComponent(routeParts[1]) : ''; } catch {}

    const activeView = document.querySelector('.view.active')?.id?.replace(/^view-/, '') || '';
    if (routeName === 'product' && ['job', 'real_estate'].includes(routeParts[1]) && routeParts[2]) {
      let listingId = '';
      try { listingId = decodeURIComponent(routeParts[2]); } catch {}
      if (activeView === 'product' && String(state.currentProduct?.id || '') === listingId && state.currentProduct?.listing_type === routeParts[1]) return;
      const navigationId = ++state.routeSyncNavigationId;
      void openMarketplaceListing(routeParts[1], listingId, { preserveScroll: true, routeSyncNavigationId: navigationId });
      return;
    }
    if (routeName === 'product' && routeId) {
      if (activeView === 'product' && String(state.currentProduct?.id || '') === routeId && !state.currentProduct?.listing_type) return;
      const navigationId = ++state.routeSyncNavigationId;
      void openProduct(routeId, { preserveScroll: true, routeSyncNavigationId: navigationId });
      return;
    }
    if (routeName === 'store' && routeId) {
      if (activeView === 'store' && String(state.currentStoreId || '') === routeId) return;
      const navigationId = ++state.routeSyncNavigationId;
      void openStorefront(routeId, { preserveScroll: true, routeSyncNavigationId: navigationId });
      return;
    }

    const allowedRoutes = ['home', 'profile', 'seller', 'admin'];
    const nextView = allowedRoutes.includes(routeName) ? routeName : 'home';
    if (activeView === nextView) return;
    ++state.routeSyncNavigationId;
    void showView(nextView, { fromHistory: true, preserveScroll: true });
  });

  // Header & Navigation

  $('postAdBtn').addEventListener('click', () => { if (requireLogin()) openListingTypeChooser(); });
  $('mobilePostBtn').addEventListener('click', () => $('postAdBtn').click());
  $('mobileMarketPost')?.addEventListener('click', () => $('postAdBtn').click());
  $('heroPostBtn')?.addEventListener('click', () => $('postAdBtn')?.click());
  document.querySelectorAll('[data-create-kind]').forEach((button) => button.addEventListener('click', () => {
    const kind = button.dataset.createKind;
    closeModal('listingTypeModal');
    if (kind === 'product') {
      if (isSellerAccount()) renderProductForm();
      else openSellerModal();
    } else if (kind === 'job') openJobListingForm();
    else if (kind === 'real_estate') openPropertyListingForm();
  }));
  $('productCategory').addEventListener('change', () => renderProductTaxonomy($('productCategory').value));
  $('productDetailType').addEventListener('change', () => renderProductSpecFields($('productCategory').value));
  $('jobCategory').addEventListener('change', () => { fillTaxonomySelect($('jobCategory'), $('jobSubcategory'), $('jobDetailType'), LISTING_TAXONOMY.jobs); renderListingSpecFields('job', $('jobCategory').value); });
  $('propertyCategory').addEventListener('change', () => { fillTaxonomySelect($('propertyCategory'), $('propertySubcategory'), $('propertyDetailType'), LISTING_TAXONOMY.properties); renderListingSpecFields('property', $('propertyCategory').value); });
  bindListingImageAlbums();
  $('jobListingForm').addEventListener('submit', (event) => { event.preventDefault(); void submitNewListing(event.currentTarget, '/api/jobs', 'job'); });
  $('propertyListingForm').addEventListener('submit', (event) => { event.preventDefault(); void submitNewListing(event.currentTarget, '/api/real-estate', 'property'); });
  $('notificationBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleDrop('notificationMenu'); });
  $('profileMenuBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleDrop('profileMenu'); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#profileMenu,#profileMenuBtn,#notificationMenu,#notificationBtn')) closeDropdowns();
  });

  document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));
  document.querySelectorAll('[data-action]').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.action;
    if (a === 'profile') showView('profile');
    if (a === 'seller-dashboard') showView('seller');
    if (a === 'admin') showView('admin');
    if (a === 'saved') { showView('profile'); state.profileTab = 'saved'; void renderProfileTab(); }
    if (a === 'open-chat') void openSellerChatInbox();
    if (a === 'login') openAuth();
    if (a === 'logout') void (async () => {
      await state.supabase.auth.signOut();
      state.session = null;
      state.me = null;
      state.savedIds.clear();
      
      syncHeader();
      showView('home');
      toast('បានចាកចេញពីគណនីរួចរាល់។');
    })();
  }));

  // Auth Form
  document.querySelectorAll('[data-auth-mode]').forEach((b) => b.addEventListener('click', () => setAuthMode(b.dataset.authMode)));
  $('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const identity = $('authIdentity').value.trim();
    const password = $('authPassword').value;
    const isEmail = identity.includes('@');
    $('authSubmit').disabled = true;
    try {
      if (!state.supabase) {
        throw new Error('ប្រព័ន្ធ Login មិនទាន់ភ្ជាប់ Supabase ទេ។ សូមទាក់ទង Admin។');
      }

      const isRegister = state.authMode === 'register';
      const res = isRegister
        ? await state.supabase.auth.signUp(isEmail
            ? { email: identity, password, options: { data: { display_name: $('authName').value.trim() } } }
            : { phone: identity, password })
        : await state.supabase.auth.signInWithPassword(isEmail
            ? { email: identity, password }
            : { phone: identity, password });

      if (res.error) throw res.error;

      state.session = res.data.session || null;
      const authRevision = ++state.authRevision;
      if (!state.session) {
        if (isRegister) {
          toast('បានបង្កើតគណនី។ សូមពិនិត្យ Email ឬ SMS ដើម្បីផ្ទៀងផ្ទាត់ មុនចូលប្រើ។');
          return;
        }
        throw new Error('ការផ្ទៀងផ្ទាត់មិនបានបង្កើត Session ទេ។ សូមពិនិត្យគណនី ឬការកំណត់ Supabase។');
      }

      let profileLoaded = true;
      try {
        await loadIdentity(state.session, authRevision);
      } catch (profileError) {
        // Authentication already succeeded; keep the valid session and let profile data retry later.
        profileLoaded = false;
        console.warn('Login succeeded but profile loading failed:', profileError.message);
        state.me = {
          user: {
            id: state.session.user?.id,
            email: state.session.user?.email || null,
            phone: state.session.user?.phone || null
          },
          profile: {
            display_name: state.session.user?.user_metadata?.display_name
              || state.session.user?.email?.split('@')[0]
              || 'គណនីអ្នកប្រើប្រាស់'
          },
          vendor: null,
          isAdmin: false
        };
      }

      syncHeader();
      closeModal('authModal');
      if (profileLoaded) toast('បានចូលគណនីជោគជ័យ!');
      else toast('បានចូលគណនី ប៉ុន្តែព័ត៌មាន Profile មិនទាន់អាចទាញបានទេ។', 'warning');
      void syncVendorPresence();
    } catch (err) {
      toast(err.message || 'មិនអាចចូលគណនីបានទេ។', 'error');
    } finally {
      $('authSubmit').disabled = false;
    }
  });

  // Seller Dashboard & Forms
  $('addProductBtn').addEventListener('click', () => renderProductForm());
  $('sellerGateApply').addEventListener('click', openSellerModal);
  $('sellerVerifyNow').addEventListener('click', openSellerModal);
  $('productShortDesc')?.addEventListener('input', updateShortDescriptionCounter);
  $('productYoutubeVideoUrl')?.addEventListener('input', updateProductYoutubePreview);
  $('productImage')?.addEventListener('change', (event) => {
    const selected = Array.from(event.currentTarget.files || []);
    const current = state.selectedProductImages || [];
    const accepted = [];
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    for (const file of selected) {
      if (!allowed.has(file.type)) { toast('សូមប្រើ JPG, PNG ឬ WEBP ប៉ុណ្ណោះ។', 'error'); continue; }
      if (file.size > 20 * 1024 * 1024) { toast('រូបភាពនីមួយៗមិនអាចធំជាង ២០MB បានទេ។', 'error'); continue; }
      if (current.length + accepted.length >= 10) { toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូបប៉ុណ្ណោះ។', 'error'); break; }
      accepted.push({ kind: 'new', file: file, previewUrl: URL.createObjectURL(file) });
    }
    state.selectedProductImages = current.concat(accepted);
    renderProductImageAlbum();
    event.currentTarget.value = '';
  });
  $('productImageAlbum')?.addEventListener('click', (event) => {
    const mainButton = event.target.closest('[data-product-image-main]');
    const removeButton = event.target.closest('[data-product-image-remove]');
    const images = state.selectedProductImages || [];
    if (mainButton) {
      const index = Number(mainButton.dataset.productImageMain);
      if (index > 0 && images[index]) { images.unshift(images.splice(index, 1)[0]); renderProductImageAlbum(); }
      return;
    }
    if (removeButton) {
      const index = Number(removeButton.dataset.productImageRemove);
      const removed = images[index];
      if (!removed) return;
      if (removed.kind === 'new' && removed.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      images.splice(index, 1);
      renderProductImageAlbum();
    }
  });

  $('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveButton = $('productSaveButton');
    if (saveButton?.disabled) return;
    const id = $('editProductId').value;
    const selectedImages = (state.selectedProductImages || []).slice();
    const newImages = selectedImages.filter((item) => item.kind === 'new');
    const existingImages = selectedImages.filter((item) => item.kind === 'existing');
    if (selectedImages.length > 10) { toast('អាចដាក់រូបភាពបានអតិបរមា ១០ រូប។', 'error'); return; }
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (newImages.some((item) => !allowed.has(item.file.type) || item.file.size > 20 * 1024 * 1024)) {
      toast('សូមប្រើ JPG / PNG / WEBP ហើយរូបនីមួយៗមិនលើស ២០MB។', 'error'); return;
    }
    const shortDesc = $('productShortDesc').value.trim();
    const fullDesc = $('productDescription').value.trim();
    if (!$('productLocation').value.trim()) { toast('សូមជ្រើសរើសទីតាំងដល់កម្រិតភូមិ។', 'error'); return; }
    const payload = {
      title: $('productTitle').value.trim(), price: Number($('productPrice').value),
      category: $('productCategory').value, location: $('productLocation').value,
      condition: $('productCondition').value, short_description: shortDesc,
      description: shortDesc + PRODUCT_DESC_SEPARATOR + fullDesc, stock: 1,
      youtube_video_url: $('productYoutubeVideoUrl').value.trim()
    };
    const originalSaveButtonHTML = saveButton?.innerHTML || '';
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.setAttribute('aria-busy', 'true');
      saveButton.innerHTML = '<span class="product-save-spinner" aria-hidden="true"></span><span>កំពុងរក្សាទុក...</span>';
    }
    try {
      const r = id
        ? await api('/api/products/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify(payload) })
        : await api('/api/products', { method: 'POST', body: JSON.stringify(payload) });
      const productId = r.data.id;
      const existingProduct = id ? state.sellerProductCache.find((item) => String(item.id) === String(id)) : null;
      const keepIds = new Set(existingImages.map((item) => String(item.id)));
      for (const oldImage of (existingProduct?.product_images || [])) {
        if (oldImage.id && !keepIds.has(String(oldImage.id))) {
          await api('/api/products/' + encodeURIComponent(productId) + '/images/' + encodeURIComponent(oldImage.id), { method: 'DELETE' });
        }
      }
      let uploadedImages = [];
      const uploadStatus = $('productUploadStatus');
      const uploadLabel = $('productUploadLabel');
      const uploadProgress = $('productUploadProgressBar');
      if (uploadStatus) uploadStatus.hidden = newImages.length === 0;
      if (uploadProgress) uploadProgress.style.width = '0%';
      if (newImages.length) {
        const form = new FormData();
        newImages.forEach(item => form.append('images', item.file));
        if (uploadLabel) uploadLabel.textContent = 'កំពុង Upload រូបភាព ' + newImages.length + ' រូប · 0%';
        const uploaded = await apiUploadWithProgress(
          '/api/products/' + encodeURIComponent(productId) + '/images',
          form,
          percent => {
            if (uploadLabel) uploadLabel.textContent = 'កំពុង Upload រូបភាព ' + newImages.length + ' រូប · ' + percent + '%';
            if (uploadProgress) uploadProgress.style.width = percent + '%';
          }
        );
        uploadedImages = uploaded.data || [];
      }
      if (uploadStatus) uploadStatus.hidden = true;
      const uploadedByFile = new Map(newImages.map((item, index) => [item, uploadedImages[index]]));
      const orderedIds = selectedImages.map((item) => item.kind === 'existing' ? item.id : uploadedByFile.get(item)?.id).filter(Boolean);
      if (orderedIds.length) {
        await api('/api/products/' + encodeURIComponent(productId) + '/images/order', {
          method: 'PATCH', body: JSON.stringify({ image_ids: orderedIds })
        });
      }
      try {
        await api('/api/products/' + encodeURIComponent(productId) + '/listing-details', {
          method: 'PUT',
          body: JSON.stringify({
            category: payload.category,
            subcategory: $('productSubcategory').value,
            detail_type: $('productDetailType').value,
            specifications: {...collectListingSpecs($('productForm')), ...($('productForm').elements.google_map_url?.value.trim() ? {google_map_url:$('productForm').elements.google_map_url.value.trim()} : {})},
            province_code: $('productProvinceCode').value,
            district_code: $('productDistrictCode').value,
            commune_code: $('productCommuneCode').value,
            village_code: $('productVillageCode').value
          })
        });
      } catch (detailsError) {
        console.warn('Product taxonomy details were not saved:', detailsError.message);
      }
      revokeProductImagePreviews();
      closeModal('productFormModal');
      toast('បានរក្សាទុកទំនិញជោគជ័យ!');
      await Promise.all([renderSeller(), loadProducts()]);
    } catch (err) {
      toast(err.message || 'មិនអាចរក្សាទុកទំនិញបានទេ។', 'error');
    } finally {
      if ($('productUploadStatus')) $('productUploadStatus').hidden = true;
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.removeAttribute('aria-busy');
        saveButton.innerHTML = originalSaveButtonHTML;
      }
    }
  });

  $('sellerDashboardContent').addEventListener('click', async (e) => {
    const tab = e.target.closest('[data-seller-tab]');
    if (tab) {
      state.sellerActiveTab = tab.dataset.sellerTab;
      document.querySelectorAll('[data-seller-tab]').forEach((b) => b.classList.toggle('is-active', b === tab));
      document.querySelectorAll('[data-seller-panel]').forEach((p) => { p.hidden = p.dataset.sellerPanel !== state.sellerActiveTab; });
      return;
    }
    const actionBtn = e.target.closest('[data-seller-action]');
    if (actionBtn) {
      const id = actionBtn.dataset.id;
      if (actionBtn.dataset.sellerAction === 'edit') {
        const prod = state.sellerProductCache.find((x) => String(x.id) === String(id));
        if (prod) renderProductForm(prod);
      } else if (actionBtn.dataset.sellerAction === 'delete') {
        if (!(await appDialog({ title:'លុបទំនិញ', message:'តើអ្នកពិតជាចង់លុបទំនិញនេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់ក្រោយបានទេ។', confirmLabel:'លុបទំនិញ', danger:true }))) return;
        await api('/api/products/' + id, { method: 'DELETE' });
        toast('បានលុបទំនិញរួចរាល់។');
        await Promise.all([renderSeller(), loadProducts()]);
      }
    }
  });

  // Unified Chat Events
  $('supportChatLauncher').addEventListener('click', toggleSellerChatPanel);
  $('sellerChatClose').addEventListener('click', minimizeSellerChatPanel);
  $('sellerChatHeaderBack').addEventListener('click', () => void openSellerChatInbox());
  $('sellerChatInboxRefresh').addEventListener('click', () => void loadUnifiedSellerChatInbox());
  $('sellerChatInboxList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-unified-chat]');
    if (btn) void openSellerChat(btn.dataset.unifiedChat);
  });
  $('sellerChatBack').addEventListener('click', () => {
    $('sellerChatInboxPane').classList.remove('mobile-hidden');
    $('sellerChatThread').classList.remove('mobile-active');
    state.chatConversationId = null;
    state.chatDraftProduct = null;
    renderSellerChatDraftProduct();
  });
  $('sellerChatProductBanner')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-dismiss-draft-product]')) {
      dismissSellerChatDraftProduct();
      syncSellerChatComposer();
    }
  });
  $('sellerChatInput').addEventListener('input', syncSellerChatComposer);
  $('sellerChatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('sellerChatForm').requestSubmit(); }
  });
  $('sellerChatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('sellerChatInput');
    const body = input.value.trim();
    if ((!body && !state.chatDraftProduct) || !state.chatConversationId) return;

    const draft = state.chatDraftProduct;
    try {
      if (draft) {
        await api(`/api/seller-chat/conversations/${encodeURIComponent(state.chatConversationId)}/messages`, {
          method: 'POST',
          body: JSON.stringify({ product_id: draft.id, message_type: 'product', body: draft.title || '' })
        });
        state.chatDraftProduct = null;
        renderSellerChatDraftProduct();
      }
      if (body) {
        await api(`/api/seller-chat/conversations/${encodeURIComponent(state.chatConversationId)}/messages`, {
          method: 'POST',
          body: JSON.stringify({ body })
        });
      }
      input.value = '';
      syncSellerChatComposer();
      await loadSellerChatConversation(true);
      await loadUnifiedSellerChatInbox();
    } catch (err) { toast(err.message, 'error'); }
  });

  // Modals & Lightbox Close
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => closeModal(b.dataset.close)));
  document.querySelectorAll('.modal').forEach((m) => m.addEventListener('mousedown', (e) => { if (e.target === m) closeModal(m.id); }));
  $('productLightboxClose')?.addEventListener('click', closeProductLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach((m) => closeModal(m.id));
      closeDropdowns();
      if (state.productLightboxOpen) closeProductLightbox();
      document.querySelector('.seller-chat-image-preview')?.remove();
      syncBodyScrollLock();
    }
  });

  // Home sidebar navigation
  document.querySelectorAll('[data-home-side]').forEach((button) => button.addEventListener('click', () => {
    const action = button.dataset.homeSide;
    if (action === 'home') { state.searchTerm = ''; if ($('searchInput')) $('searchInput').value = ''; setCategory('all'); void showView('home'); }
    else if (action === 'live') void showView('home').then(() => $('homeVendorMediaSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    else if (action === 'saved' || action === 'orders') { if (!requireLogin()) return; state.profileTab = action === 'saved' ? 'saved' : 'history'; void showView('profile').then(() => renderProfileTab()); }
  }));
  const moveProductGallery = (direction) => { const images = (state.currentProduct?.product_images || []).filter((item) => item?.image_url); if (!images.length) return; state.productGalleryIndex = (state.productGalleryIndex + direction + images.length) % images.length; updateProductLightbox(); };
  $('productLightboxPrev')?.addEventListener('click', () => moveProductGallery(-1));
  $('productLightboxNext')?.addEventListener('click', () => moveProductGallery(1));

  $('offerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!requireLogin()) return;
    const product = state.currentOfferProduct || state.currentProduct;
    if (!product?.id) { toast('មិនអាចកំណត់ទំនិញសម្រាប់សំណើតម្លៃបានទេ។', 'error'); return; }
    try { await api('/api/offers', { method: 'POST', body: JSON.stringify({ product_id: product.id, offer_price: Number($('offerAmount')?.value || 0), message: $('offerMessage')?.value?.trim() || '' }) }); closeModal('offerModal'); $('offerForm').reset(); toast('បានផ្ញើសំណើតម្លៃជោគជ័យ!'); }
    catch (err) { toast(err.message || 'មិនអាចផ្ញើសំណើតម្លៃបានទេ។', 'error'); }
  });

  // Shared image preview for image upload controls across the marketplace.
  // Product album and existing profile/document previews keep their dedicated flows.
  const uploadPreviewUrls = new WeakMap();
  const uploadPreviewNodes = new WeakMap();
  const posterPreviewTargets = {
    posterUploadTop: 'posterPreviewTop',
    posterUploadMiddle: 'posterPreviewMiddle',
    posterUploadTall: 'posterPreviewTall'
  };
  document.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'file') return;
    if (!String(input.accept || '').toLowerCase().includes('image')) return;
    if (['productImage', 'avatarUpload', 'coverUpload', 'sellerDocument'].includes(input.id)) return;

    const files = Array.from(input.files || []).filter(file => file.type.startsWith('image/'));
    const previousUrls = uploadPreviewUrls.get(input) || [];
    previousUrls.forEach(url => URL.revokeObjectURL(url));
    uploadPreviewUrls.set(input, []);

    const targetId = posterPreviewTargets[input.id];
    const existingTarget = targetId ? $(targetId) : null;
    let preview = existingTarget || uploadPreviewNodes.get(input);
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'global-image-upload-preview';
      const anchor = input.closest('label') || input;
      anchor.insertAdjacentElement('afterend', preview);
      uploadPreviewNodes.set(input, preview);
    }
    preview.replaceChildren();
    if (!files.length) {
      if (targetId) preview.textContent = 'Preview';
      else { preview.remove(); uploadPreviewNodes.delete(input); }
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    uploadPreviewUrls.set(input, urls);
    const grid = document.createElement('div');
    grid.className = 'global-image-upload-grid';
    files.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'global-image-upload-item';
      const image = document.createElement('img');
      image.src = urls[index];
      image.alt = file.name || 'Image preview';
      image.loading = 'lazy';
      item.appendChild(image);
      if (files.length > 1) {
        const name = document.createElement('span');
        name.textContent = file.name;
        item.appendChild(name);
      }
      grid.appendChild(item);
    });
    preview.appendChild(grid);
  });

  $('sellerDocument')?.addEventListener('change', () => {
    const file = $('sellerDocument').files?.[0], preview = $('sellerDocPreview');
    if (!preview) return; preview.innerHTML = '';
    if (!file) { preview.classList.add('hidden'); return; }
    if (!file.type.startsWith('image/')) { toast('សូមជ្រើសរើសឯកសាររូបភាព។', 'error'); return; }
    const img = document.createElement('img'); img.src = URL.createObjectURL(file); img.alt = 'Document preview'; img.className = 'max-h-48 w-full object-contain'; preview.appendChild(img); preview.classList.remove('hidden');
  });
  $('sellerApplyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!requireLogin()) return;
    const form = new FormData(); form.append('store_name', $('shopName')?.value.trim() || ''); form.append('contact_phone', $('shopContact')?.value.trim() || ''); form.append('address', $('shopAddress')?.value.trim() || '');
    const file = $('sellerDocument')?.files?.[0]; if (file) form.append('document', file);
    try { await api('/api/vendors/register', { method: 'POST', body: form }); closeModal('sellerModal'); $('sellerApplyForm').reset(); await refreshSession(); toast('បានដាក់ពាក្យស្នើសុំអ្នកលក់ជោគជ័យ!'); await showView('seller'); }
    catch (err) { toast(err.message || 'មិនអាចដាក់ពាក្យបានទេ។', 'error'); }
  });

  const selectProfileTab = (tab) => { if (!['saved', 'history', 'my-posts', 'seller'].includes(tab) || !requireLogin()) return; state.profileTab = tab; document.querySelectorAll('[data-profile-tab]').forEach((b) => { const active = b.dataset.profileTab === tab; b.classList.toggle('is-active', active); b.classList.toggle('active', active); }); void renderProfileTab(); };
  document.querySelectorAll('[data-profile-tab]').forEach((b) => b.addEventListener('click', () => selectProfileTab(b.dataset.profileTab)));
  document.querySelectorAll('[data-profile-jump]').forEach((b) => b.addEventListener('click', () => selectProfileTab(b.dataset.profileJump)));
  $('profileApplyTop')?.addEventListener('click', () => state.me?.vendor ? showView('seller') : openSellerModal());
  $('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); if (!requireLogin()) return;
    try { await api('/api/me', { method: 'PATCH', body: JSON.stringify({ display_name: $('profileName')?.value.trim() || '', phone: $('profilePhone')?.value.trim() || '', province: $('profileLocation')?.value || '', bio: $('profileBio')?.value.trim() || '' }) }); await refreshSession(); toast('បានរក្សាទុកព័ត៌មាន Profile ជោគជ័យ!'); await renderProfileTab(); }
    catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Profile បានទេ។', 'error'); }
  });
  // Profile settings dialogs (forms and Telegram widget IDs remain unchanged).
  document.querySelectorAll('[data-open-profile-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = $(button.dataset.openProfileModal);
      if (dialog && !dialog.open) {
        dialog.showModal();
        syncBodyScrollLock();
      }
    });
  });
  document.querySelectorAll('[data-close-profile-modal]').forEach((button) => {
    button.addEventListener('click', () => $(button.dataset.closeProfileModal)?.close());
  });
  ['profileInfoModal', 'telegramSecurityModal'].forEach((id) => {
    const dialog = $(id);
    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog?.addEventListener('close', syncBodyScrollLock);
  });

  const uploadProfileImage = async (inputId, type) => {
    const file = $(inputId)?.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'avatar') {
      setAvatar($('profileAvatar'), previewUrl, profileName());
    } else {
      setProfileCover($('view-profile')?.querySelector('.cover'), previewUrl);
    }

    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    try {
      const uploadResult = await api('/api/me/media', { method: 'POST', body: form });
      await refreshSession();

      const savedUrl = uploadResult?.data?.[type === 'avatar' ? 'avatar_url' : 'cover_url']
        || state.me?.profile?.[type === 'avatar' ? 'avatar_url' : 'cover_url'];
      if (savedUrl) {
        if (type === 'avatar') setAvatar($('profileAvatar'), savedUrl, profileName());
        else setProfileCover($('view-profile')?.querySelector('.cover'), savedUrl);
      }

      await renderProfileTab();
      toast('បានប្ដូររូបភាព Profile ជោគជ័យ!');
    } catch (err) {
      toast(err.message || 'មិនអាច Upload រូបភាពបានទេ។', 'error');
      setProfileCover($('view-profile')?.querySelector('.cover'), state.me?.profile?.cover_url || '');
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };
  $('avatarUpload')?.addEventListener('change', () => void uploadProfileImage('avatarUpload', 'avatar'));
  $('coverUpload')?.addEventListener('change', () => void uploadProfileImage('coverUpload', 'cover'));
  $('profileTabContent')?.addEventListener('click', async (e) => {
    const action = e.target.closest('[data-my-post-action]');
    if (action) {
      const { type, id } = action.dataset;
      if (action.dataset.myPostAction === 'edit') {
        state.myPostEditing = type + ':' + id;
        renderMyPostsList();
        return;
      }
      if (action.dataset.myPostAction === 'cancel') {
        state.myPostEditing = null;
        renderMyPostsList();
        return;
      }
      const labels = { renew:'Renew ប្រកាសនេះ?', expire:'បញ្ចប់សុពលភាពប្រកាសនេះ?', delete:'លុបប្រកាសនេះមែនទេ?' };
      const verb = action.dataset.myPostAction;
      if (!(await appDialog({ title:verb === 'delete' ? 'លុបប្រកាស' : verb === 'renew' ? 'បន្តសុពលភាពប្រកាស' : 'បញ្ចប់សុពលភាពប្រកាស', message:labels[verb] || 'តើអ្នកចង់បន្តសកម្មភាពនេះមែនទេ?', confirmLabel:verb === 'delete' ? 'លុបប្រកាស' : 'បញ្ជាក់', danger:verb === 'delete' }))) return;
      try {
        let response;
        if (verb === 'delete') response = await api('/api/my-posts/' + encodeURIComponent(type) + '/' + encodeURIComponent(id), { method:'DELETE' });
        else response = await api('/api/my-posts/' + encodeURIComponent(type) + '/' + encodeURIComponent(id), { method:'PATCH', body:JSON.stringify({ action:verb }) });
        toast(verb === 'delete' && response?.archived ? 'ប្រកាសនេះមានប្រវត្តិលក់ ដូច្នេះបានដាក់ Archive។' : verb === 'delete' ? 'បានលុបប្រកាសរួចរាល់។' : verb === 'renew' ? 'បាន Renew ប្រកាសជោគជ័យ។' : 'បានបញ្ចប់សុពលភាពប្រកាស។');
        await renderMyPosts();
      } catch (err) { toast(err.message || 'មិនអាចធ្វើសកម្មភាពបានទេ។', 'error'); }
      return;
    }
    const open = e.target.closest('[data-open-product]');
    if (open) { void openProduct(open.dataset.openProduct); return; }
    const remove = e.target.closest('[data-remove-saved]');
    if (remove) Promise.resolve(saveAction(remove.dataset.removeSaved, remove));
  });
  $('profileTabContent')?.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-my-post-edit-form]');
    if (!form) return;
    e.preventDefault();
    const type = form.dataset.type, id = form.dataset.id, values = new FormData(form);
    const payload = { action:'edit' };
    let requestBody = null;
    if (['job','property','rental','land','house_sale'].includes(type)) {
      const get = name => String(values.get(name) ?? '');
      payload.title = get('title');
      payload.description = get('description');
      payload.short_description = get('short_description');
      payload.category = get('category');
      payload.subcategory = get('subcategory');
      payload.detail_type = get('detail_type');
      payload.location = get('location');
      payload.youtube_video_url = get('youtube_video_url');
      payload.province_code = get('province_code');
      payload.district_code = get('district_code');
      payload.commune_code = get('commune_code');
      payload.village_code = get('village_code');
      const specsField = get('specifications');
      let specifications = {};
      try { specifications = JSON.parse(specsField || '{}'); } catch { toast('ព័ត៌មានបន្ថែមមិនត្រឹមត្រូវទេ។', 'error'); return; }
      const googleMapUrl = get('google_map_url');
      if (googleMapUrl) specifications.google_map_url = googleMapUrl;
      else delete specifications.google_map_url;
      payload.specifications = specifications;
      if (type === 'job') {
        payload.company_name = get('company_name');
        payload.vacancies = get('vacancies');
        payload.salary_min = get('salary_min');
        payload.salary_max = get('salary_max');
        payload.salary_period = get('salary_period');
        payload.employment_type = get('employment_type');
        payload.work_schedule = get('work_schedule');
        payload.days_off = get('days_off');
        payload.experience = get('experience');
        payload.education = get('education');
        payload.skills = get('skills_text').split(',').map(value => value.trim()).filter(Boolean);
        payload.languages = get('languages_text').split(',').map(value => value.trim()).filter(Boolean);
        payload.benefits = get('benefits_text').split(',').map(value => value.trim()).filter(Boolean);
      } else if (type === 'property') {
        payload.address = get('address');
        payload.price = get('price');
        payload.price_period = get('price_period');
        payload.area_sqm = get('area_sqm');
        payload.bedrooms = get('bedrooms');
        payload.bathrooms = get('bathrooms');
      } else {
        payload.address = get('address');
        payload.price = get('price');
        payload.area_sqm = get('area_sqm');
        if (type === 'rental') {
          payload.rent_period = get('rent_period');
          payload.property_type = get('property_type');
          payload.bedrooms = get('bedrooms');
          payload.bathrooms = get('bathrooms');
          payload.furnished = get('furnished');
        } else if (type === 'land') {
          payload.land_type = get('land_type');
          payload.title_deed = get('title_deed');
          payload.road_access = get('road_access');
        } else {
          payload.property_type = get('property_type');
          payload.bedrooms = get('bedrooms');
          payload.bathrooms = get('bathrooms');
          payload.furnished = get('furnished');
          payload.title_deed = get('title_deed');
        }
      }
      const keepImageIds = Array.from(form.querySelectorAll('[data-keep-listing-image]:checked')).map(input => input.value);
      values.set('keep_image_message_ids', JSON.stringify(keepImageIds));
      values.set('payload', JSON.stringify(payload));
      requestBody = values;
    } else {
      if (type === 'social_post') payload.caption = values.get('caption') || '';
      else {
        payload.title = values.get('title') || '';
        payload.description = values.get('description') || '';
        payload.location = values.get('location') || '';
        if (type === 'job') {
          payload.salary_min = values.get('salary_min');
          payload.salary_max = values.get('salary_max');
        } else if (type === 'product') {
          payload.price = values.get('price');
          payload.stock = values.get('stock');
        } else payload.price = values.get('price');
      }
      requestBody = JSON.stringify(payload);
    }
    try {
      await api('/api/my-posts/' + encodeURIComponent(type) + '/' + encodeURIComponent(id), { method:'PATCH', body:requestBody });
      state.myPostEditing = null;
      toast('បានកែប្រែប្រកាសជោគជ័យ។');
      await renderMyPosts();
    } catch (err) { toast(err.message || 'មិនអាចកែប្រែប្រកាសបានទេ។', 'error'); }
  });

  $('connectTelegramBtn')?.addEventListener('click', async () => { try { const res = await api('/api/me/telegram/connect', { method: 'POST', body: JSON.stringify({}) }); const url = res.data?.url || res.data?.link || res.data?.telegram_url; if (url && $('telegramConnectLink')) { $('telegramConnectLink').href = url; $('telegramConnectLink').classList.remove('hidden'); } $('refreshTelegramStatusBtn')?.classList.remove('hidden'); toast('បានបង្កើតតំណភ្ជាប់ Telegram។'); } catch (err) { toast(err.message || 'មិនអាចភ្ជាប់ Telegram បានទេ។', 'error'); } });
  $('refreshTelegramStatusBtn')?.addEventListener('click', () => void renderTelegramSecurity());
  $('sendTelegramOtpBtn')?.addEventListener('click', async () => { try { await api('/api/me/telegram/otp', { method: 'POST', body: JSON.stringify({}) }); toast('បានផ្ញើ OTP តាម Telegram។'); } catch (err) { toast(err.message || 'មិនអាចផ្ញើ OTP បានទេ។', 'error'); } });
  $('telegramPasswordForm')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api('/api/me/telegram/password', { method: 'POST', body: JSON.stringify({ otp: $('telegramPasswordOtp')?.value.trim() || '', new_password: $('telegramNewPassword')?.value || '' }) }); $('telegramPasswordForm').reset(); toast('បានប្ដូរ Password ជោគជ័យ!'); } catch (err) { toast(err.message || 'មិនអាចប្ដូរ Password បានទេ។', 'error'); } });
  $('forgotPasswordBtn')?.addEventListener('click', () => { $('authForm')?.classList.add('hidden'); $('telegramRecoveryForm')?.classList.remove('hidden'); $('forgotPasswordBtn')?.classList.add('hidden'); });
  $('backToLoginBtn')?.addEventListener('click', () => { $('telegramRecoveryForm')?.classList.add('hidden'); $('authForm')?.classList.remove('hidden'); $('forgotPasswordBtn')?.classList.remove('hidden'); });
  $('requestRecoveryOtpBtn')?.addEventListener('click', async () => { try { await api('/api/auth/telegram-recovery/otp', { method: 'POST', body: JSON.stringify({ email: $('recoveryEmail')?.value.trim() || '' }) }); toast('បានស្នើសុំ OTP សង្គ្រោះតាម Telegram។'); } catch (err) { toast(err.message || 'មិនអាចស្នើសុំ OTP បានទេ។', 'error'); } });
  $('telegramRecoveryForm')?.addEventListener('submit', async (e) => { e.preventDefault(); try { await api('/api/auth/telegram-recovery/reset', { method: 'POST', body: JSON.stringify({ email: $('recoveryEmail')?.value.trim() || '', otp: $('recoveryOtp')?.value.trim() || '', new_password: $('recoveryNewPassword')?.value || '' }) }); $('telegramRecoveryForm').reset(); $('backToLoginBtn')?.click(); toast('បានសង្គ្រោះ Password ជោគជ័យ។ សូមចូលគណនីម្ដងទៀត។'); } catch (err) { toast(err.message || 'មិនអាចសង្គ្រោះ Password បានទេ។', 'error'); } });

  $('sellerProductSearch')?.addEventListener('input', () => renderSellerProductList());
  document.querySelectorAll('[data-seller-filter]').forEach((b) => b.addEventListener('click', () => { state.sellerActiveFilter = b.dataset.sellerFilter; document.querySelectorAll('[data-seller-filter]').forEach((x) => x.classList.toggle('is-active', x === b)); renderSellerProductList(); }));
  $('sellerOffers')?.addEventListener('click', async (e) => { const b = e.target.closest('[data-offer-action]'); if (!b) return; try { await api('/api/offers/' + encodeURIComponent(b.dataset.id), { method: 'PATCH', body: JSON.stringify({ status: b.dataset.offerAction }) }); await renderSeller(); toast('បានធ្វើបច្ចុប្បន្នភាពសំណើតម្លៃ។'); } catch (err) { toast(err.message || 'មិនអាចកែស្ថានភាពសំណើបានទេ។', 'error'); } });
  $('sellerOrders')?.addEventListener('click', async (e) => { const b = e.target.closest('[data-order-status]'); if (!b) return; try { await api('/api/vendor/orders/' + encodeURIComponent(b.dataset.orderId), { method: 'PATCH', body: JSON.stringify({ status: b.dataset.orderStatus }) }); await renderSeller(); toast('បានធ្វើបច្ចុប្បន្នភាពការបញ្ជាទិញ។'); } catch (err) { toast(err.message || 'មិនអាចកែស្ថានភាពការបញ្ជាទិញបានទេ។', 'error'); } });
  $('sellerShopProfileForm')?.addEventListener('submit', async (e) => { e.preventDefault(); const form = new FormData(); form.append('store_name', $('sellerShopName')?.value.trim() || ''); form.append('store_location', $('sellerShopLocation')?.value.trim() || ''); form.append('description', $('sellerShopDescription')?.value.trim() || ''); const logo = $('sellerShopLogo')?.files?.[0], cover = $('sellerShopCover')?.files?.[0]; if (logo) form.append('logo', logo); if (cover) form.append('cover', cover); try { await api('/api/vendor/profile', { method: 'PATCH', body: form }); await refreshSession(); await renderSeller(); toast('បានរក្សាទុកព័ត៌មានហាង។'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុកព័ត៌មានហាងបានទេ។', 'error'); } });
  $('maintenanceAdminLogin')?.addEventListener('click', () => openAuth());
  $('saveMaintenanceSettings')?.addEventListener('click', async () => { try { const payload = { maintenanceMode: Boolean($('maintenanceToggle')?.checked), maintenanceMessage: $('maintenanceMessageInput')?.value || '' }; const res = await api('/api/admin/maintenance', { method: 'POST', body: JSON.stringify(payload) }); state.maintenanceMode = payload.maintenanceMode; state.maintenanceMessage = payload.maintenanceMessage; applyMaintenanceUI(); if ($('maintenanceStatusHint')) $('maintenanceStatusHint').textContent = state.maintenanceMode ? 'ស្ថានភាពបច្ចុប្បន្ន៖ Maintenance' : 'ស្ថានភាពបច្ចុប្បន្ន៖ កំពុងដំណើរការ'; toast(res.message || 'បានរក្សាទុក Maintenance Settings។'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Maintenance Settings បានទេ។', 'error'); } });
  $('saveBrandingBtn')?.addEventListener('click', async () => { const form = new FormData(); form.append('siteTitle', $('brandTitleInput')?.value || ''); form.append('siteSubtitle', $('brandSubtitleInput')?.value || ''); form.append('heroBadge', $('heroBadgeInput')?.value || ''); form.append('heroTitle', $('heroTitleInput')?.value || ''); form.append('heroSubtitle', $('heroSubtitleInput')?.value || ''); form.append('clearHeroImages', String(Boolean($('clearHeroImages')?.checked))); const logo = $('brandingLogoUpload')?.files?.[0], favicon = $('brandingFaviconUpload')?.files?.[0]; if (logo) form.append('logo', logo); if (favicon) form.append('favicon', favicon); Array.from($('brandingHeroUpload')?.files || []).slice(0, 3).forEach((f) => form.append('heroImages', f)); try { const res = await api('/api/admin/branding', { method: 'PATCH', body: form }); applySiteBranding(res.data || {}); if ($('brandingStatus')) $('brandingStatus').textContent = 'បានរក្សាទុក Brand និង Banner ជោគជ័យ'; toast('បានរក្សាទុក Brand ជោគជ័យ!'); } catch (err) { toast(err.message || 'មិនអាចរក្សាទុក Brand បានទេ។', 'error'); } });
  $('telegramDiagnosticsBtn')?.addEventListener('click', async () => {
    const target = $('telegramDiagnosticsResult');
    const button = $('telegramDiagnosticsBtn');
    if (button) { button.disabled = true; button.textContent = 'កំពុងពិនិត្យ…'; }
    if (target) target.innerHTML = '<div class="admin-telegram-diagnostics-loading">កំពុងពិនិត្យការភ្ជាប់ Telegram…</div>';
    try {
      const res = await api('/api/admin/telegram/diagnostics');
      if (target) target.innerHTML = renderTelegramDiagnostics(res.data ?? res);
    } catch (err) {
      if (target) target.innerHTML = '<div class="admin-telegram-diagnostics-row is-error"><span class="admin-telegram-diagnostics-label">ស្ថានភាពពិនិត្យ</span><strong>' + esc(err.message || 'មិនអាចពិនិត្យស្ថានភាព Telegram បានទេ។') + '</strong></div>';
    } finally {
      if (button) { button.disabled = false; button.textContent = 'ពិនិត្យស្ថានភាព'; }
    }
  });
  
  $('adminSupplierImportForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const url = String(new FormData(event.currentTarget).get('url') || '').trim();
    if (url) void scanAuroraSupplierCatalog(url);
  });
  $('adminSupplierImportResults')?.addEventListener('click', async event => {
    const target = $('adminSupplierImportResults');
    const nextButton = event.target.closest('[data-supplier-import-next]');
    if (nextButton) {
      const catalogUrl = target?.dataset.catalogUrl || '';
      if (catalogUrl) await scanAuroraSupplierCatalog(catalogUrl, Number(nextButton.dataset.supplierImportNext || 0));
      return;
    }
    const button = event.target.closest('[data-supplier-import-code]');
    if (!button) return;
    const catalogUrl = target?.dataset.catalogUrl || '';
    const code = button.dataset.supplierImportCode;
    const supplierPrice = Number(button.dataset.supplierImportPrice);
    if (!catalogUrl || !code || !Number.isFinite(supplierPrice)) return;
    button.disabled = true; button.textContent = 'កំពុងនាំចូល...';
    try {
      const result = await api('/api/admin/supplier-import/import', { method: 'POST', body: JSON.stringify({ catalog_url: catalogUrl, supplier_product_code: code, expected_supplier_price: supplierPrice }) });
      toast(result.data?.availability_updated
        ? 'បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពស្តុកតាម CC COMPUTER សម្រាប់ '+(result.data?.title||code)+' ជោគជ័យ។'
        : result.data?.existing_product
          ? 'បានបន្ថែម '+Number(result.data?.created_variants||0)+' Variants ទៅផលិតផល '+(result.data?.title||code)+' ជោគជ័យ។'
          : 'បាននាំចូល '+(result.data?.title||code)+' ជាផលិតផលមេ និង '+Number(result.data?.created_variants||0)+' Variants ជោគជ័យ។');
      await scanAuroraSupplierCatalog(catalogUrl);
      await renderAdminSupplierProducts();
    } catch (error) {
      button.disabled = false; button.textContent = 'នាំចូលផលិតផលនេះ';
      toast(error.message||'មិនអាចនាំចូលផលិតផលបានទេ។','error');
    }
  });
  $('adminGalleryProductSearchRun')?.addEventListener('click', () => void searchAdminGalleryProducts());
  $('adminGalleryProductSearch')?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); void searchAdminGalleryProducts(); } });
  $('adminGalleryCandidatesRefresh')?.addEventListener('click', () => void renderAdminGalleryCandidates());
  $('adminGalleryProductResults')?.addEventListener('click', async event => {
    const button = event.target.closest('[data-gallery-search-product]');
    if (!button) return;
    button.disabled = true;
    const original = button.textContent;
    button.textContent = 'កំពុងស្វែងរក...';
    try {
      const result = await api('/api/admin/products/' + encodeURIComponent(button.dataset.gallerySearchProduct) + '/gallery-search', { method: 'POST', body: JSON.stringify({}) });
      toast(result.message || ('រកឃើញរូប ' + Number(result.found || 0) + '។'));
      await renderAdminGalleryCandidates();
    } catch (error) {
      toast(error.message || 'មិនអាចស្វែងរករូបបានទេ។', 'error');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
  $('adminGalleryCandidates')?.addEventListener('click', async event => {
    const approve = event.target.closest('[data-gallery-approve]');
    const reject = event.target.closest('[data-gallery-reject]');
    const button = approve || reject;
    if (!button) return;
    button.disabled = true;
    try {
      if (approve) {
        await api('/api/admin/product-gallery-candidates/' + encodeURIComponent(approve.dataset.galleryApprove) + '/approve', { method: 'POST', body: JSON.stringify({}) });
        toast('បានអនុម័ត និង Upload រូបទៅ Telegram រួចរាល់។');
      } else {
        await api('/api/admin/product-gallery-candidates/' + encodeURIComponent(reject.dataset.galleryReject), { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) });
        toast('បានបដិសេធរូបភាព។');
      }
      await renderAdminGalleryCandidates();
      await renderAdminSupplierProducts();
    } catch (error) {
      button.disabled = false;
      toast(error.message || 'មិនអាចរក្សាទុកការសម្រេចបានទេ។', 'error');
    }
  });
  $('adminSupplierAutoSyncRun')?.addEventListener('click', async event => {
    const button = event.currentTarget, status = $('adminSupplierAutoSyncStatus');
    button.disabled = true; button.textContent = 'កំពុងស្កេន...';
    if (status) status.textContent = 'កំពុងស្កេន CC COMPUTER និងផ្ទៀងផ្ទាត់តម្លៃ/ស្តុក...';
    try {
      const result = await api('/api/admin/supplier-auto-sync/run', { method: 'POST', body: JSON.stringify({}) });
      const data = result.data || {};
      if (status) status.textContent = 'ស្កេន '+Number(data.scanned||0)+' មុខ · Update '+Number(data.updated||0)+' · ត្រូវពិនិត្យ '+Number(data.review||0)+' · បាត់ '+Number(data.missing||0)+' · លាក់ '+Number(data.archived||0);
      toast('បានបញ្ចប់ Auto Sync។');
      await renderAdminSupplierProducts();
      await renderSupplierUpdateReviews();
    } catch (error) {
      if (status) status.textContent = error.message || 'Auto Sync បរាជ័យ។';
      toast(error.message || 'Auto Sync បរាជ័យ។', 'error');
    } finally {
      button.disabled = false; button.textContent = 'ស្កេនឥឡូវនេះ';
    }
  });
  $('adminSupplierReviewList')?.addEventListener('click', async event => {
    const button = event.target.closest('[data-supplier-review-decision]');
    if (!button) return;
    button.disabled = true;
    try {
      await api('/api/admin/supplier-update-reviews/' + encodeURIComponent(button.dataset.reviewId), {
        method: 'PATCH', body: JSON.stringify({ status: button.dataset.supplierReviewDecision })
      });
      toast(button.dataset.supplierReviewDecision === 'approved' ? 'បានអនុម័តការផ្លាស់ប្តូរ។' : 'បានបដិសេធការផ្លាស់ប្តូរ។');
      await renderAdminSupplierProducts();
      await renderSupplierUpdateReviews();
    } catch (error) {
      button.disabled = false;
      toast(error.message || 'មិនអាចរក្សាទុកការសម្រេចបានទេ។', 'error');
    }
  });

  $('adminSupplierRefresh')?.addEventListener('click',()=>{void renderAdminSupplierProducts();void renderAdminSupplierRegistry();});
  $('adminSupplierRegistryForm')?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const message = $('adminSupplierRegistryMessage');
    if (message) message.textContent = 'កំពុងរក្សាទុក Supplier...';
    try {
      await api('/api/admin/suppliers', { method: 'POST', body: JSON.stringify(data) });
      form.reset();
      if (message) message.textContent = 'បានបន្ថែម Supplier។ Domain ត្រូវផ្ទៀងផ្ទាត់ ហើយ Adapter ត្រូវរួចរាល់ មុនបើក Scanner។';
      await renderAdminSupplierRegistry();
    } catch (error) {
      if (message) message.textContent = error.message || 'មិនអាចបន្ថែម Supplier បានទេ។';
    }
  });
  $('adminSupplierRegistryList')?.addEventListener('click', event => {
    const verify = event.target.closest('[data-supplier-registry-verify]');
    if (verify) return void updateAdminSupplierRegistry(verify.dataset.supplierRegistryVerify, { is_verified: verify.dataset.next === 'true' });
    const active = event.target.closest('[data-supplier-registry-active]');
    if (active && !active.disabled) void updateAdminSupplierRegistry(active.dataset.supplierRegistryActive, { is_active: active.dataset.next === 'true' });
  });
  void renderAdminSupplierRegistry();
  $('adminSupplierSearch')?.addEventListener('input',()=>{adminAuroraPages[adminAuroraTab]=1;void renderAdminSupplierProducts();});
  $('adminSupplierProductsPanel')?.addEventListener('click', async event => {
    const tab=event.target.closest('[data-aurora-tab]');
    if(tab){adminAuroraTab=tab.dataset.auroraTab;void renderAdminSupplierProducts();return;}
    const page=event.target.closest('[data-aurora-page]');
    if(page&&!page.disabled){adminAuroraPages[adminAuroraTab]=Number(page.dataset.auroraPage)||1;void renderAdminSupplierProducts();return;}
    const publish=event.target.closest('[data-aurora-publish-selected]');
    if(publish){
      const ids=Array.from(document.querySelectorAll('[data-aurora-product-select]:checked')).map(input=>input.dataset.auroraProductSelect);
      if(!ids.length)return toast('សូមជ្រើសរើសផលិតផលយ៉ាងតិច ១ មុខ។','error');
      const confirmed=await appDialog({mode:'confirm',title:'ផុសផលិតផលជាក្រុម',message:'តើអ្នកចង់ផុសផលិតផល '+ids.length+' មុខដែលបានជ្រើសរើសមែនទេ?',confirmLabel:'ផុសផលិតផល'});
      if(!confirmed)return;
      publish.disabled=true;
      let succeeded=0;const failed=[];
      for(const id of ids){
        try{await api('/api/products/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({status:'active'})});succeeded++;}
        catch(error){failed.push(error.message||id);}
      }
      toast('ផុសបាន '+succeeded+'/'+ids.length+' ផលិតផល'+(failed.length?' · មាន '+failed.length+' មុខមិនទាន់ផុស':''));
      await renderAdminSupplierProducts();return;
    }
  });
  $('adminSupplierProductsList')?.addEventListener('change',event=>{
    if(event.target.matches('[data-aurora-select-page]')){
      document.querySelectorAll('[data-aurora-product-select]').forEach(input=>input.checked=event.target.checked);
    }
  });
  $('adminSupplierCreateForm')?.addEventListener('submit',async event=>{
    event.preventDefault();const form=event.currentTarget,data=Object.fromEntries(new FormData(form).entries());
    try{const created=await api('/api/products',{method:'POST',body:JSON.stringify({title:data.title,category:data.category,description:data.description||'',price:Math.round((Number(data.supplier_price||0)+5)*100)/100,stock:Number(data.stock||0),location:'Cambodia',condition:'ថ្មី'})});const id=created.data?.id;if(!id)throw new Error('មិនទទួលបាន Product ID');
      await api('/api/admin/supplier-products/'+encodeURIComponent(id)+'/source',{method:'PUT',body:JSON.stringify({supplier_name:data.supplier_name||'',supplier_url:data.supplier_url||'',supplier_price:Number(data.supplier_price||0),supplier_product_code:data.supplier_product_code||''})});
      form.reset();toast('បានបង្កើតផលិតផល Supplier ជោគជ័យ។');await renderAdminSupplierProducts();
    }catch(error){toast(error.message||'មិនអាចបង្កើតផលិតផលបានទេ។','error');}
  });
  $('adminSupplierProductsList')?.addEventListener('click',async event=>{
    if(event.target.closest('[data-aurora-product-select],[data-aurora-select-page],[data-aurora-publish-selected],[data-aurora-page]')){event.stopPropagation();return;}
    const deleteButton=event.target.closest('[data-admin-aurora-delete]');
    if(deleteButton){
      event.preventDefault();event.stopPropagation();
      const productId=deleteButton.dataset.adminAuroraDelete;
      const product=(state.adminSupplierProducts||[]).find(item=>String(item.id)===String(productId));
      if(!product)return;
      const confirmed = await appDialog({ mode:'confirm', title:'លុបផលិតផល AURORA', message:'តើអ្នកប្រាកដថាចង់លុបផលិតផល "'+(product.title||'')+'"?', confirmLabel:'លុបផលិតផល', danger:true });
      if(!confirmed)return;
      deleteButton.disabled=true;
      try{
        const result=await api('/api/products/'+encodeURIComponent(productId),{method:'DELETE'});
        closeAdminAuroraProductEditor();
        toast(result.archived?'ផលិតផលមានប្រវត្តិបញ្ជាទិញ ដូច្នេះបានលាក់ជំនួសការលុប។':'បានលុបផលិតផលរួចរាល់។');
        await renderAdminSupplierProducts();
      }catch(error){deleteButton.disabled=false;toast(error.message||'មិនអាចលុបផលិតផលបានទេ។','error');}
      return;
    }
    const row=event.target.closest('[data-admin-aurora-edit]');
    if(row)openAdminAuroraProductEditor(row.dataset.adminAuroraEdit);
  });
  $('adminSupplierProductsList')?.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const row=event.target.closest('.admin-aurora-row');if(!row)return;
    event.preventDefault();openAdminAuroraProductEditor(row.dataset.adminAuroraEdit);
  });
  $('adminApplications')?.addEventListener('click', async (e) => { const b = e.target.closest('[data-admin-review]'); if (!b) return; try { await api('/api/admin/vendors/' + encodeURIComponent(b.dataset.id), { method: 'PATCH', body: JSON.stringify({ status: b.dataset.adminReview }) }); await renderAdmin(); toast('បានធ្វើបច្ចុប្បន្នភាពពាក្យស្នើសុំ។'); } catch (err) { toast(err.message || 'មិនអាចពិនិត្យពាក្យស្នើសុំបានទេ។', 'error'); } });

  // Open chat images in an in-page lightbox; never navigate to a new tab.
  $('sellerChatMessages')?.addEventListener('click', (e) => {
    const productCard = e.target.closest('.seller-chat-product-card[data-chat-product-id]');
    if (productCard) { e.preventDefault(); void openProduct(productCard.dataset.chatProductId); return; }
    const image = e.target.closest('.seller-chat-image');
    if (!image) return;
    e.preventDefault();
    document.querySelector('.seller-chat-image-preview')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'seller-chat-image-preview';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'មើលរូបភាព');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'seller-chat-image-preview-close';
    close.setAttribute('aria-label', 'បិទ');
    close.textContent = '×';
    const fullImage = document.createElement('img');
    fullImage.src = image.currentSrc || image.src;
    fullImage.alt = image.alt || 'រូបភាពក្នុងសារ';
    overlay.append(close, fullImage);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target === close) {
        overlay.remove();
        syncBodyScrollLock();
      }
    });
    document.body.appendChild(overlay);
    syncBodyScrollLock();
  });
  $('sellerChatMessages')?.addEventListener('keydown', (e) => {
    const productCard = e.target.closest('.seller-chat-product-card[data-chat-product-id]');
    if (productCard && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); void openProduct(productCard.dataset.chatProductId); return; }
    const image = e.target.closest('.seller-chat-image');
    if (image && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      image.click();
    }
  });
  $('sellerChatChooseImage')?.addEventListener('click', () => $('sellerChatImageInput')?.click());
  $('sellerChatImageInput')?.addEventListener('change', async () => { const file = $('sellerChatImageInput').files?.[0]; if (!file || !state.chatConversationId) return; const form = new FormData(); form.append('image', file); try { await api('/api/seller-chat/conversations/' + encodeURIComponent(state.chatConversationId) + '/image', { method: 'POST', body: form }); $('sellerChatImageInput').value = ''; await loadSellerChatConversation(true); await loadUnifiedSellerChatInbox(); } catch (err) { toast(err.message || 'មិនអាចផ្ញើរូបភាពបានទេ។', 'error'); } });
  $('sellerChatMute')?.addEventListener('click', () => {
    state.chatMuted = !state.chatMuted;
    const b = $('sellerChatMute');
    const label = state.chatMuted ? 'បើកសំឡេង' : 'បិទសំឡេង';
    b.setAttribute('aria-pressed', String(state.chatMuted)); b.setAttribute('aria-label', label); b.title = label;
    b.innerHTML = state.chatMuted
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6m0-6-5 6"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>';
  });

}

function updateSiteOnlineCount(count) {
  const target = $('siteOnlineCount');
  if (!target) return;
  const value = Number(count);
  target.textContent = Number.isFinite(value) && value >= 0
    ? new Intl.NumberFormat('en').format(Math.floor(value))
    : '—';
}

async function sendSitePresence(leave = false) {
  if (!state.sitePresenceVisitorId) return;
  try {
    const response = await fetch('/api/site/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitor_id: state.sitePresenceVisitorId, leave }),
      cache: 'no-store',
      keepalive: leave
    });
    if (!response.ok) throw new Error(`Presence request failed (${response.status})`);
    const result = await response.json();
    if (!leave) updateSiteOnlineCount(result?.data?.count);
  } catch (error) {
    if (leave) return;
    try {
      const response = await fetch('/api/site/online', { cache: 'no-store' });
      if (!response.ok) return;
      const result = await response.json();
      updateSiteOnlineCount(result?.data?.count);
    } catch (readError) {
      console.warn('Could not refresh website online count:', readError.message);
    }
  }
}

function startSitePresence() {
  if (state.sitePresenceStarted) return;
  state.sitePresenceStarted = true;
  try {
    state.sitePresenceVisitorId = crypto.randomUUID();
  } catch {
    state.sitePresenceVisitorId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }
  void sendSitePresence();
  state.sitePresenceTimer = window.setInterval(() => void sendSitePresence(), 25_000);
  window.addEventListener('pagehide', () => {
    if (state.sitePresenceTimer) window.clearInterval(state.sitePresenceTimer);
    void sendSitePresence(true);
  }, { once: true });
}

async function boot() {
  initIcons();
  bindEvents();
  startSitePresence();

  const initialView = document.documentElement.dataset.initialView || 'home';
  const initialProductId = document.documentElement.dataset.initialProductId || '';
  const initialListingType = document.documentElement.dataset.initialListingType || '';
  const initialListingId = document.documentElement.dataset.initialListingId || '';
  const initialStoreId = document.documentElement.dataset.initialStoreId || '';

  void showView(initialView, { optimistic: true, deferLoad: true, preserveScroll: true });

  try {
    let cfg = {};
    try {
      const configResponse = await fetch('/api/config', { cache: 'no-store' });
      if (!configResponse.ok) throw new Error(`Config request failed (${configResponse.status})`);
      cfg = await configResponse.json();
      state.maintenanceMode = cfg.maintenanceMode === true;
      state.maintenanceMessage = String(cfg.maintenanceMessage || DEFAULT_MAINTENANCE_MSG);
      state.telegramBotUsername = String(cfg.telegramBotUsername || '').replace(/^@/, '').trim();
      applySiteBranding(cfg);
      mountTelegramLoginWidget();
    } catch (configError) {
      console.error('Could not load marketplace config:', configError);
      toast('មិនអាចទាញការកំណត់ប្រព័ន្ធបានទេ៖ ' + configError.message, 'warning');
    }

    if (cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase?.createClient) {
      state.supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
      state.supabase.auth.onAuthStateChange((event, session) => {
        const revision = ++state.authRevision;
        const sessionSnapshot = session || null;
        state.session = sessionSnapshot;

        if (!sessionSnapshot) {
          state.me = null;
          syncHeader();
          return;
        }

        // Supabase invokes this for initial restore, account switches and token refresh.
        // Defer API work until the callback returns; discard stale account responses.
        Promise.resolve().then(async () => {
          if (revision !== state.authRevision) return;
          try {
            await loadIdentity(sessionSnapshot, revision);
          } catch (error) {
            if (revision === state.authRevision) {
              console.warn('Auth state changed but profile could not be loaded:', error.message);
            }
          }
          if (revision !== state.authRevision) return;
          syncHeader();
          void syncVendorPresence();
        });
      });
    } else {
      console.warn('Supabase public configuration is missing; account login is unavailable.');
    }

    await refreshSession();
    state.routeAccessReady = true;

    // Always load the public storefront even if session restoration or profile lookup fails.
    const tasks = [loadProducts(), loadJobs()];
    if (initialView === 'product' && initialListingType && initialListingId) {
      tasks.push(openMarketplaceListing(initialListingType, initialListingId, { preserveScroll: true }));
    } else if (initialView === 'product' && initialProductId) {
      tasks.push(openProduct(initialProductId, { preserveScroll: true }));
    } else if (initialView === 'store' && initialStoreId) {
      tasks.push(openStorefront(initialStoreId, { preserveScroll: true }));
    } else {
      tasks.push(showView(initialView, { preserveScroll: true }));
    }

    if (state.session) {
      tasks.push(Promise.all([loadSaved(), loadOrders(), loadUnifiedSellerChatInbox()]).catch((error) => {
        console.warn('Could not restore some account data:', error.message);
      }));
    }

    await Promise.allSettled(tasks);
    
    document.documentElement.classList.remove('route-restoring');
  } catch (err) {
    console.error('Boot error:', err);
    document.documentElement.classList.remove('route-restoring');
    applyMaintenanceUI();
    toast('មិនអាចភ្ជាប់ប្រព័ន្ធបានទេ៖ ' + err.message, 'error');
    // Last-resort public product load: do not leave the homepage empty after a session error.
    void loadProducts();
  }
}

void boot();
