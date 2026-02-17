const form = document.getElementById('numerology-form');
const report = document.getElementById('report');
const sendDataBtn = document.getElementById('send-data');

let latestPayload = null;

const numberTraits = {
  1: {
    personality: '你的核心是開創與主導，行動快、直覺強，重視掌控感與效率。課題是放慢節奏，讓他人有參與空間。',
    career: '財運多來自主動出擊與獨立決策，適合自營、領導、業務開拓。避免只靠衝勁而忽略長期佈局。',
    relationship: '在人際中你容易扮演帶頭角色，伴侶互動需練習傾聽與共同決策，關係會更穩。',
    advice: '適合：新專案、品牌建立、創業試點。不適合硬衝：高風險投資與情緒化辭職。'
  },
  2: {
    personality: '你重視感受與協調，善於察言觀色，內在敏感細膩。課題是建立界線，別過度迎合。',
    career: '財運在合作、顧問、服務、溝通型工作中逐步累積。穩健比暴衝更有利。',
    relationship: '你重視陪伴與安全感，適合溫和互動。請把需求說出口，不要讓委屈累積。',
    advice: '適合：合作專案、關係經營、長期儲蓄。不適合硬衝：短線投機、情緒性承諾。'
  },
  3: {
    personality: '你有表達與創意天賦，外放熱情、腦袋靈活。課題是把靈感落地成可執行計畫。',
    career: '財運來自內容、行銷、教學、表達舞台；節奏是先擴散再收斂，需避免分心。',
    relationship: '你擅長帶來氣氛與新鮮感，但要注意承諾一致性，避免讓人感受不穩。',
    advice: '適合：內容輸出、社群經營、創意副業。不適合硬衝：同時開太多戰線。'
  },
  4: {
    personality: '你務實、耐力高，擅長建立制度與流程。課題是避免過度保守，給自己彈性。',
    career: '財運偏向慢而穩，利於專業累積與資產配置，適合工程、行政、管理型路線。',
    relationship: '你重視責任與承諾，能帶來穩定。建議多表達情感而不只用行動證明。',
    advice: '適合：長線規劃、證照能力、固定投資。不適合硬衝：沒評估就大改跑道。'
  },
  5: {
    personality: '你追求自由、變化與體驗，適應力很高。課題是建立核心目標，避免三分鐘熱度。',
    career: '財運與機會在人脈流動、跨域整合中出現，適合業務、顧問、旅遊、媒體。',
    relationship: '你需要空間與新鮮感，關係中誠實溝通界線很重要，避免忽冷忽熱。',
    advice: '適合：跨領域學習、彈性工作、海外機會。不適合硬衝：無規劃換工作。'
  },
  6: {
    personality: '你有照顧者特質，重視責任、品質與美感。課題是先照顧自己，再照顧他人。',
    career: '財運常來自專業服務與信任關係，教育、設計、療癒、顧客服務皆有利。',
    relationship: '你願意付出，容易成為關係支柱；建議避免過度承擔，建立雙向支持。',
    advice: '適合：品牌口碑、顧客服務、家庭型理財。不適合硬衝：替他人背債或擔責。'
  },
  7: {
    personality: '你偏向思考與洞察，重視內在真實與深度。課題是行動節奏要跟上想法。',
    career: '財運在研究、策略、技術、知識型領域較佳，靠專精與判斷力放大價值。',
    relationship: '你需要精神交流與信任空間，建議主動表達感受，別讓沉默造成距離。',
    advice: '適合：進修、資料分析、中長線布局。不適合硬衝：跟風投資與人云亦云。'
  },
  8: {
    personality: '你有企圖心與資源整合力，善於目標管理。課題是平衡成就與情感需求。',
    career: '財運與事業連動強，適合管理、金融、商務拓展。重點在紀律和風險控管。',
    relationship: '你做事果斷，互動上需留意語氣與溫度，讓對方感受到被重視。',
    advice: '適合：升遷競爭、資源整合、績效導向計畫。不適合硬衝：高槓桿冒進。'
  },
  9: {
    personality: '你有理想與同理，願意看見整體與大局。課題是聚焦優先順序，避免耗能過度。',
    career: '財運常在影響力、公益價值、教育文化、內容傳播中放大，適合有使命感的路線。',
    relationship: '你包容度高，能給人支持。請記得誠實表達底線，避免隱性委屈。',
    advice: '適合：品牌理念、社會影響、整合資源。不適合硬衝：為了面子硬撐不止損。'
  }
};

function reduceToDigit(num) {
  let value = num;
  while (value > 9) {
    value = String(value)
      .split('')
      .map(Number)
      .reduce((sum, n) => sum + n, 0);
  }
  return value;
}

function calculateBaseNumber(birthday) {
  const digits = birthday.replace(/-/g, '').split('').map(Number);
  const total = digits.reduce((sum, n) => sum + n, 0);
  return reduceToDigit(total);
}

function calculatePersonalYear(birthday) {
  const [year, month, day] = birthday.split('-').map(Number);
  const currentYear = new Date().getFullYear();
  const total = month + day + currentYear;
  const py = reduceToDigit(total);
  const trend = py <= 4 ? '順勢累積期' : py <= 7 ? '調整轉化期' : '收成與整合期';
  return { personalYear: py, trend, birthYear: year };
}

function buildQuestionResponse(name, question, baseNumber) {
  const tones = [
    '你其實比自己想像得更有韌性，近期看似卡住的點，正在逼你釐清真正想走的方向。',
    '你對結果有高標準，這是優勢；只要把焦慮拆成可執行步驟，進展會比預期更快。',
    '你身邊其實有可用資源，只是你習慣先靠自己。適度求助，反而能讓局勢更穩。'
  ];
  const pick = tones[baseNumber % tones.length];
  return `${name}，關於「${question}」：${pick} 你現在最需要的不是一次到位，而是先做出一個小而確定的行動，讓能量開始流動。`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name').toString().trim();
  const phone = formData.get('phone').toString().trim();
  const birthday = formData.get('birthday').toString();
  const question = formData.get('question').toString().trim();

  const baseNumber = calculateBaseNumber(birthday);
  const trait = numberTraits[baseNumber];
  const { personalYear, trend } = calculatePersonalYear(birthday);

  document.getElementById('base-number').textContent = `本命數：${baseNumber}（依生日數字總和化簡）`;
  document.getElementById('personality').textContent = trait.personality;
  document.getElementById('career').textContent = trait.career;
  document.getElementById('relationship').textContent = trait.relationship;
  document.getElementById('year-flow').textContent = `你的個人流年數為 ${personalYear}，目前屬於「${trend}」。建議順勢安排：上半年打底、下半年驗收。`;
  document.getElementById('advice').textContent = trait.advice;
  document.getElementById('question-response').textContent = buildQuestionResponse(name, question, baseNumber);

  latestPayload = { name, phone, birthday, baseNumber };

  report.classList.remove('hidden');
  report.scrollIntoView({ behavior: 'smooth' });
});

sendDataBtn.addEventListener('click', () => {
  if (!latestPayload) {
    alert('請先完成靈數計算，再傳送預約資料。');
    return;
  }

  const { name, phone, birthday, baseNumber } = latestPayload;
  const subject = encodeURIComponent('能量調頻預約');
  const body = encodeURIComponent(
    `姓名：${name}\n電話：${phone}\n生日：${birthday}\n本命數：${baseNumber}`
  );
  window.location.href = `mailto:martins52kimo@gmail.com?subject=${subject}&body=${body}`;
});
