// ==================== 菜谱数据 ====================

const RECIPES = [
  {
    id: 1,
    title: '番茄炒蛋',
    category: '家常菜',
    desc: '国民家常菜，酸甜滑嫩，新手零失败的入门菜',
    time: 15,
    difficulty: '简单',
    servings: '2 人份',
    color: '#FFE0B2',
    accent: '#E8590C',
    ingredients: [
      { name: '鸡蛋', amount: '4 个' },
      { name: '番茄', amount: '2 个（中等）' },
      { name: '葱花', amount: '适量' },
      { name: '盐', amount: '1 茶匙' },
      { name: '白糖', amount: '1 汤匙' },
      { name: '食用油', amount: '3 汤匙' },
    ],
    steps: [
      {
        title: '处理食材',
        desc: '番茄洗净后在顶部划十字刀，用开水烫30秒后去皮，切成小块。鸡蛋打入碗中，加少许盐，充分搅打至蛋液均匀起泡。',
        tip: '蛋液里加一小勺水，炒出来的鸡蛋会更嫩滑。',
      },
      {
        title: '炒鸡蛋',
        desc: '锅中倒入2汤匙油，大火烧至七成热（油面微微冒烟）。倒入蛋液，待底部凝固后用铲子快速划散成大块，盛出备用。',
        tip: '鸡蛋七分熟就盛出，余温会继续加热，避免过老。',
        timer: 60,
      },
      {
        title: '炒番茄',
        desc: '锅中再加1汤匙油，放入番茄块中火翻炒。用铲子按压番茄帮助出汁，炒至番茄软烂成酱状，约2-3分钟。',
        tip: '加一小撮盐可以加速番茄出汁。',
        timer: 150,
      },
      {
        title: '合炒调味',
        desc: '将炒好的鸡蛋倒回锅中，加入白糖和盐，翻炒均匀让鸡蛋裹上番茄汁。大火收汁30秒，撒葱花即可出锅。',
        timer: 30,
      },
    ],
  },
  {
    id: 2,
    title: '红烧排骨',
    category: '家常菜',
    desc: '色泽红亮，肉质软烂，一口脱骨的经典硬菜',
    time: 60,
    difficulty: '中等',
    servings: '3 人份',
    color: '#FFCCBC',
    accent: '#C92A2A',
    ingredients: [
      { name: '猪小排', amount: '500 克' },
      { name: '生姜', amount: '4 片' },
      { name: '大葱', amount: '1 根' },
      { name: '八角', amount: '2 个' },
      { name: '冰糖', amount: '30 克' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '老抽', amount: '1 汤匙' },
      { name: '料酒', amount: '2 汤匙' },
    ],
    steps: [
      {
        title: '排骨焯水',
        desc: '排骨冷水下锅，加姜片和料酒，大火煮开后撇去浮沫，继续煮2分钟。捞出用温水冲洗干净，沥干备用。',
        tip: '冷水下锅才能逼出血水，温水冲洗避免肉质收缩。',
        timer: 180,
      },
      {
        title: '炒糖色',
        desc: '锅中放少许油，加入冰糖，小火慢慢熬化。当糖液变成琥珀色并冒小泡时，迅速倒入排骨翻炒，让每块排骨都裹上糖色。',
        tip: '糖色变深就立刻下排骨，炒过头会发苦。',
        timer: 90,
      },
      {
        title: '加料炖煮',
        desc: '排骨上色后加入生抽、老抽、料酒翻炒均匀。加入没过排骨的热水，放入葱段、姜片和八角。大火烧开后转最小火，加盖炖40分钟。',
        tip: '一定要加热水，冷水会让肉质瞬间收紧变硬。',
        timer: 2400,
      },
      {
        title: '大火收汁',
        desc: '40分钟后开盖，转大火收汁。不断翻动排骨防止粘锅，直到汤汁浓稠发亮包裹住排骨即可出锅装盘。',
        tip: '收汁时不要离开，汤汁变浓后很容易糊底。',
        timer: 180,
      },
    ],
  },
  {
    id: 3,
    title: '蒜蓉西兰花',
    category: '快手菜',
    desc: '5分钟搞定的健康素菜，清脆爽口蒜香浓郁',
    time: 8,
    difficulty: '简单',
    servings: '2 人份',
    color: '#C8E6C9',
    accent: '#2F9E44',
    ingredients: [
      { name: '西兰花', amount: '1 颗' },
      { name: '大蒜', amount: '5 瓣' },
      { name: '盐', amount: '1 茶匙' },
      { name: '蚝油', amount: '1 汤匙' },
      { name: '食用油', amount: '2 汤匙' },
    ],
    steps: [
      {
        title: '处理西兰花',
        desc: '西兰花掰成小朵，用淡盐水浸泡10分钟去除杂质和虫卵。大蒜切成蒜蓉备用。',
        tip: '盐水浸泡比清水冲洗更干净。',
        timer: 600,
      },
      {
        title: '焯水',
        desc: '烧一锅开水，加少许盐和几滴油。放入西兰花焯水1分钟，捞出立刻过凉水沥干，保持翠绿脆嫩。',
        tip: '焯水后过凉水是保持翠绿颜色的关键。',
        timer: 60,
      },
      {
        title: '蒜蓉爆香',
        desc: '锅中倒油烧至五成热，下蒜蓉中小火煸炒至微微金黄、蒜香四溢。',
        tip: '蒜蓉不要炒焦，微黄即可，否则会发苦。',
        timer: 30,
      },
      {
        title: '翻炒出锅',
        desc: '倒入焯好的西兰花，转大火快速翻炒。加入蚝油和盐，翻炒均匀让每朵西兰花都裹上蒜蓉蚝油汁，即可出锅。',
        timer: 45,
      },
    ],
  },
  {
    id: 4,
    title: '紫菜蛋花汤',
    category: '汤羹',
    desc: '3分钟速成鲜汤，清淡暖胃又百搭',
    time: 8,
    difficulty: '简单',
    servings: '2 人份',
    color: '#B2DFDB',
    accent: '#00897B',
    ingredients: [
      { name: '紫菜', amount: '一小把' },
      { name: '鸡蛋', amount: '2 个' },
      { name: '葱花', amount: '适量' },
      { name: '盐', amount: '1 茶匙' },
      { name: '香油', amount: '几滴' },
      { name: '白胡椒粉', amount: '少许' },
    ],
    steps: [
      {
        title: '准备食材',
        desc: '紫菜撕成小片用清水泡软。鸡蛋打散备用。葱花切好待用。',
      },
      {
        title: '煮汤底',
        desc: '锅中加3碗清水，大火烧开。放入紫菜煮1分钟，让紫菜充分展开释放鲜味。',
        timer: 60,
      },
      {
        title: '淋蛋花',
        desc: '将火调到最大，蛋液沿筷子或勺子缓缓淋入沸水中。蛋液入锅后不要立刻搅动，等10秒蛋花浮起后再轻轻推开。',
        tip: '蛋液要细流般淋入，这样蛋花又薄又漂亮。',
        timer: 15,
      },
      {
        title: '调味出锅',
        desc: '加入盐和白胡椒粉调味，滴入几滴香油，撒葱花即可出锅。',
      },
    ],
  },
  {
    id: 5,
    title: '葱花鸡蛋饼',
    category: '早餐',
    desc: '外酥内软葱香四溢，10分钟搞定元气早餐',
    time: 12,
    difficulty: '简单',
    servings: '2 人份',
    color: '#FFF9C4',
    accent: '#F59F00',
    ingredients: [
      { name: '面粉', amount: '150 克' },
      { name: '鸡蛋', amount: '3 个' },
      { name: '葱花', amount: '一大把' },
      { name: '盐', amount: '1 茶匙' },
      { name: '清水', amount: '250 毫升' },
      { name: '食用油', amount: '适量' },
    ],
    steps: [
      {
        title: '调面糊',
        desc: '面粉中打入鸡蛋，先搅拌均匀成稠面糊，再分次加入清水搅成稀面糊。面糊流动性要好，像酸奶的质地。加入葱花和盐拌匀。',
        tip: '先浓后稀的方式调面糊，不容易有面疙瘩。',
      },
      {
        title: '热锅下糊',
        desc: '平底锅刷一层薄油，中火烧至微热。舀一勺面糊倒入锅中央，转动锅子让面糊自然摊成圆形薄饼。',
        tip: '面糊倒下去能自己流动摊开，说明稠度刚好。',
        timer: 5,
      },
      {
        title: '煎至两面金黄',
        desc: '中小火煎至底面凝固微黄，翻面继续煎。两面都煎至金黄有焦斑即可出锅。重复以上步骤用完所有面糊。',
        timer: 180,
      },
    ],
  },
  {
    id: 6,
    title: '凉拌黄瓜',
    category: '快手菜',
    desc: '拍一拍拌一拌，酸辣开胃的夏日凉菜',
    time: 10,
    difficulty: '简单',
    servings: '2 人份',
    color: '#C5E1A5',
    accent: '#7CB342',
    ingredients: [
      { name: '黄瓜', amount: '2 根' },
      { name: '大蒜', amount: '3 瓣' },
      { name: '小米椒', amount: '2 个' },
      { name: '生抽', amount: '2 汤匙' },
      { name: '香醋', amount: '1 汤匙' },
      { name: '白糖', amount: '1 茶匙' },
      { name: '香油', amount: '1 茶匙' },
    ],
    steps: [
      {
        title: '拍黄瓜',
        desc: '黄瓜洗净切去两头，用刀面拍裂再切成段。拍裂的黄瓜更容易入味。',
        tip: '拍的时候力度要够，裂而不碎最好。',
      },
      {
        title: '腌黄瓜',
        desc: '黄瓜段撒少许盐拌匀，腌5分钟逼出多余水分，然后倒掉渗出的水。这样拌好的凉菜不会越放越稀。',
        timer: 300,
      },
      {
        title: '调酱汁',
        desc: '蒜蓉、小米椒圈放入碗中，加生抽、香醋、白糖、香油搅拌均匀，至糖完全融化。',
      },
      {
        title: '拌合入味',
        desc: '将酱汁倒入黄瓜中充分拌匀，静置2分钟让黄瓜入味即可食用。',
        timer: 120,
      },
    ],
  },
  {
    id: 7,
    title: '银耳红枣羹',
    category: '甜品',
    desc: '胶质浓稠滋润养颜，慢炖出好气色',
    time: 90,
    difficulty: '简单',
    servings: '3 人份',
    color: '#F8BBD0',
    accent: '#C2185B',
    ingredients: [
      { name: '银耳', amount: '半朵' },
      { name: '红枣', amount: '8 颗' },
      { name: '枸杞', amount: '一小把' },
      { name: '冰糖', amount: '40 克' },
      { name: '清水', amount: '1500 毫升' },
    ],
    steps: [
      {
        title: '泡发银耳',
        desc: '银耳提前2小时用冷水泡发，泡至完全舒展变软。剪去黄色硬蒂，撕成小朵，越小越容易出胶。',
        tip: '撕得越碎出胶越快越浓稠。',
        timer: 7200,
      },
      {
        title: '大火煮开',
        desc: '银耳放入砂锅，加足量清水。大火烧开后转最小火，保持微微冒泡的状态慢炖。',
        tip: '水要一次加足，中途加水会影响出胶。',
        timer: 600,
      },
      {
        title: '慢炖出胶',
        desc: '小火慢炖40分钟，期间偶尔搅动防止粘底。当汤汁变得浓稠黏滑，银耳完全煮化出胶即可。',
        timer: 2400,
      },
      {
        title: '加料收尾',
        desc: '加入红枣和冰糖，继续煮15分钟。最后5分钟加入枸杞，搅拌至冰糖融化即可关火。',
        tip: '枸杞最后放，煮太久会发酸变色。',
        timer: 900,
      },
    ],
  },
  {
    id: 8,
    title: '蛋炒饭',
    category: '快手菜',
    desc: '粒粒分明金黄喷香，剩饭的最佳归宿',
    time: 12,
    difficulty: '简单',
    servings: '1 人份',
    color: '#FFE082',
    accent: '#F9A825',
    ingredients: [
      { name: '隔夜米饭', amount: '1 大碗' },
      { name: '鸡蛋', amount: '2 个' },
      { name: '葱花', amount: '适量' },
      { name: '火腿丁', amount: '50 克' },
      { name: '盐', amount: '1 茶匙' },
      { name: '生抽', amount: '1 茶匙' },
      { name: '食用油', amount: '2 汤匙' },
    ],
    steps: [
      {
        title: '准备米饭',
        desc: '隔夜米饭提前用手抓散，确保没有大块结团。如果是现煮的饭，摊开晾凉后再用。',
        tip: '隔夜饭水分少炒出来才会粒粒分明。',
      },
      {
        title: '炒鸡蛋',
        desc: '锅中倒油大火烧热，倒入打散的蛋液。蛋液入锅后迅速用铲子划散成碎块，八分熟盛出。',
        timer: 30,
      },
      {
        title: '炒饭',
        desc: '锅中再加少许油，放入火腿丁煸炒出香味。倒入米饭，用铲子不停按压翻炒，把饭团压散，让每粒米都裹上油。',
        tip: '大火快炒，不停翻动，让米饭在锅里跳跃。',
        timer: 120,
      },
      {
        title: '合炒调味',
        desc: '将炒好的鸡蛋碎倒回锅中，加盐和生抽翻炒均匀。最后撒入葱花，大火翻炒几下即可出锅。',
        timer: 30,
      },
    ],
  },
];

// 为每个菜谱生成 SVG 插图
function getRecipeSVG(recipe) {
  const c = recipe.accent;
  const bg = recipe.color;
  const svgs = {
    1: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <ellipse cx="200" cy="160" rx="130" ry="80" fill="${c}" opacity="0.15"/>
      <circle cx="170" cy="140" r="38" fill="#FF8A65" opacity="0.9"/>
      <circle cx="155" cy="130" r="10" fill="#FFAB91"/>
      <circle cx="185" cy="145" r="8" fill="#FFAB91"/>
      <circle cx="240" cy="155" r="30" fill="#FFD54F" opacity="0.95"/>
      <ellipse cx="240" cy="150" rx="20" ry="12" fill="#FFE082"/>
      <ellipse cx="220" cy="130" rx="14" ry="10" fill="#FFCA28" opacity="0.8"/>
      <path d="M130 195 Q200 210 270 195 Q275 205 270 215 Q200 225 130 215 Q125 205 130 195Z" fill="#FFF3E0" stroke="${c}" stroke-width="2"/>
      <circle cx="180" cy="205" r="4" fill="#66BB6A"/>
      <circle cx="230" cy="208" r="3" fill="#66BB6A"/>
    </svg>`,
    2: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <ellipse cx="200" cy="160" rx="130" ry="80" fill="${c}" opacity="0.12"/>
      <ellipse cx="200" cy="170" rx="110" ry="65" fill="#FFF3E0" stroke="${c}" stroke-width="2"/>
      <rect x="160" y="135" width="20" height="14" rx="3" fill="#8D6E63"/>
      <rect x="200" y="128" width="22" height="16" rx="3" fill="#A1887F"/>
      <rect x="235" y="140" width="18" height="13" rx="3" fill="#8D6E63"/>
      <rect x="180" y="155" width="16" height="12" rx="3" fill="#A1887F"/>
      <rect x="215" y="160" width="20" height="14" rx="3" fill="#6D4C41"/>
      <ellipse cx="200" cy="170" rx="60" ry="12" fill="${c}" opacity="0.25"/>
      <path d="M170 118 Q175 108 180 118" stroke="#4CAF50" stroke-width="2" fill="none"/>
      <path d="M225 115 Q230 105 235 115" stroke="#4CAF50" stroke-width="2" fill="none"/>
    </svg>`,
    3: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <circle cx="170" cy="140" r="50" fill="${c}" opacity="0.3"/>
      <circle cx="170" cy="140" r="38" fill="${c}" opacity="0.5"/>
      <circle cx="170" cy="140" r="26" fill="${c}" opacity="0.7"/>
      <circle cx="235" cy="165" r="42" fill="${c}" opacity="0.3"/>
      <circle cx="235" cy="165" r="32" fill="${c}" opacity="0.5"/>
      <circle cx="235" cy="165" r="20" fill="${c}" opacity="0.7"/>
      <circle cx="160" cy="120" r="6" fill="#FFF9C4"/>
      <circle cx="180" cy="145" r="5" fill="#FFF9C4"/>
      <circle cx="225" cy="150" r="5" fill="#FFF9C4"/>
      <circle cx="245" cy="170" r="6" fill="#FFF9C4"/>
      <ellipse cx="200" cy="195" rx="90" ry="8" fill="${c}" opacity="0.15"/>
    </svg>`,
    4: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <ellipse cx="200" cy="170" rx="110" ry="70" fill="${c}" opacity="0.12"/>
      <ellipse cx="200" cy="165" rx="95" ry="55" fill="#E0F2F1" stroke="${c}" stroke-width="2"/>
      <path d="M150 145 Q160 125 175 140 Q185 120 195 142 Q205 122 215 145 Q225 128 240 148 Q250 135 255 155" fill="none" stroke="${c}" stroke-width="2.5" opacity="0.6"/>
      <circle cx="175" cy="160" r="12" fill="#FFF59D" opacity="0.8"/>
      <circle cx="225" cy="155" r="10" fill="#FFF59D" opacity="0.8"/>
      <circle cx="200" cy="175" r="14" fill="#FFF59D" opacity="0.7"/>
      <path d="M180 190 Q200 198 220 190" stroke="#4CAF50" stroke-width="2" fill="none" opacity="0.5"/>
    </svg>`,
    5: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <ellipse cx="200" cy="170" rx="120" ry="75" fill="${c}" opacity="0.12"/>
      <ellipse cx="200" cy="165" rx="100" ry="60" fill="#FFECB3" stroke="${c}" stroke-width="2"/>
      <ellipse cx="200" cy="160" rx="95" ry="55" fill="#FFE082"/>
      <circle cx="170" cy="150" r="4" fill="#4CAF50" opacity="0.7"/>
      <circle cx="200" cy="145" r="3" fill="#4CAF50" opacity="0.7"/>
      <circle cx="225" cy="155" r="4" fill="#4CAF50" opacity="0.7"/>
      <circle cx="185" cy="170" r="3" fill="#4CAF50" opacity="0.6"/>
      <circle cx="215" cy="165" r="3" fill="#4CAF50" opacity="0.6"/>
      <ellipse cx="200" cy="160" rx="40" ry="20" fill="#FFCC80" opacity="0.3"/>
    </svg>`,
    6: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <ellipse cx="200" cy="170" rx="110" ry="70" fill="${c}" opacity="0.12"/>
      <ellipse cx="200" cy="165" rx="95" ry="55" fill="#F1F8E9" stroke="${c}" stroke-width="2"/>
      <rect x="165" y="140" width="8" height="30" rx="3" fill="${c}" opacity="0.6" transform="rotate(-15 169 155)"/>
      <rect x="195" y="135" width="8" height="32" rx="3" fill="${c}" opacity="0.6" transform="rotate(10 199 151)"/>
      <rect x="220" y="145" width="8" height="28" rx="3" fill="${c}" opacity="0.6" transform="rotate(-5 224 159)"/>
      <circle cx="175" cy="165" r="3" fill="#E53935"/>
      <circle cx="210" cy="160" r="3" fill="#E53935"/>
      <circle cx="230" cy="170" r="2.5" fill="#E53935"/>
      <circle cx="190" cy="175" r="2" fill="#E53935"/>
    </svg>`,
    7: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <ellipse cx="200" cy="170" rx="105" ry="68" fill="${c}" opacity="0.12"/>
      <ellipse cx="200" cy="165" rx="90" ry="52" fill="#FCE4EC" stroke="${c}" stroke-width="2"/>
      <ellipse cx="170" cy="155" rx="8" ry="12" fill="#E91E63" opacity="0.7"/>
      <ellipse cx="200" cy="148" rx="7" ry="11" fill="#E91E63" opacity="0.7"/>
      <ellipse cx="225" cy="158" rx="8" ry="12" fill="#E91E63" opacity="0.7"/>
      <ellipse cx="185" cy="175" rx="7" ry="10" fill="#E91E63" opacity="0.6"/>
      <ellipse cx="215" cy="170" rx="7" ry="11" fill="#E91E63" opacity="0.6"/>
      <circle cx="190" cy="165" r="3" fill="#F44336"/>
      <circle cx="210" cy="160" r="3" fill="#F44336"/>
      <path d="M165 140 Q170 130 175 140" stroke="#4CAF50" stroke-width="1.5" fill="none"/>
    </svg>`,
    8: `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${bg}"/>
      <ellipse cx="200" cy="170" rx="115" ry="72" fill="${c}" opacity="0.12"/>
      <ellipse cx="200" cy="165" rx="100" ry="58" fill="#FFF8E1" stroke="${c}" stroke-width="2"/>
      <circle cx="170" cy="150" r="6" fill="#FFCA28"/>
      <circle cx="195" cy="145" r="5" fill="#FFCA28"/>
      <circle cx="220" cy="155" r="6" fill="#FFCA28"/>
      <circle cx="185" cy="170" r="5" fill="#FFCA28"/>
      <circle cx="210" cy="175" r="6" fill="#FFCA28"/>
      <circle cx="175" cy="160" r="4" fill="#FFCA28"/>
      <circle cx="225" cy="165" r="4" fill="#FFCA28"/>
      <rect x="185" y="140" width="6" height="6" rx="1" fill="#EF5350" opacity="0.7"/>
      <rect x="205" y="160" width="5" height="5" rx="1" fill="#EF5350" opacity="0.7"/>
      <circle cx="195" cy="155" r="2" fill="#4CAF50" opacity="0.6"/>
    </svg>`,
  };
  return svgs[recipe.id] || svgs[1];
}
