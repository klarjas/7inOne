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
function syncProductImageFileInput() {
  const input = $('productImage');
  if (!input) return;
  const transfer = new DataTransfer();
  (state.selectedProductImages || []).filter((item) => item.kind === 'new').forEach((item) => transfer.items.add(item.file));
  input.files = transfer.files;
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
  'Laptop': ['CPU Model','RAM Type & Capacity','GPU Model & VRAM','Storage Type & Capacity','Screen Size','Battery Health'],
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
  $('productSpecificationFields').innerHTML = fields.length
    ? '<h3 class="sm:col-span-2 text-xs font-bold text-slate-300">លក្ខណៈសម្បត្តិផលិតផល</h3>' + fields.map((label,index) =>
      '<label><span class="label">' + esc(label) + '</span><input class="field" data-listing-spec="' + esc('spec_' + index) + '" placeholder="' + esc(label) + '"></label>'
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
  } catch (e) {
    toast('មិនអាចផ្ទុក Admin៖ ' + e.message, 'error');
  }
}

/* --------------------------------------------------------------------------
   12. Unified Buyer / Seller Chat System
   -------------------------------------------------------------------------- */
