// config.js

const APP_CONFIGS = {
    // 全局配置
    globalBackgroundImageUrl: 'https://source.unsplash.com/random/1920x1080/?galaxy,abstract,dark-theme', // 替换为你想要的全局背景图URL

    // 入口页面文字
    entryPage: {
        title: "探索未知之境",
        subtitle: "向下滑动，开启奇妙旅程"
    },

    // 音乐播放器列表
    musicFiles: [
        { title: "星辰低语", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }, // 确保 music/ 文件夹和文件存在
        { title: "宇宙回响", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "时光旅者", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
    ],

    // 3D 旋转木马配置
    carousel: {
        itemImageUrls: [
            'https://placehold.co/700x450/8B5CF6/ffffff?text=作品·α',
            'https://placehold.co/700x450/EC4899/ffffff?text=作品·β',
            'https://placehold.co/700x450/F59E0B/ffffff?text=作品·γ',
            'https://placehold.co/700x450/10B981/ffffff?text=作品·δ'
        ],
        translateZValue: '28vw', // 旋转木马项目“推出”的距离
    },

    // 手风琴效果配置
    accordion: {
        data: [
            { title: "静谧之森", imageUrl: "https://placehold.co/1000x600/22C55E/ffffff?text=森林" },
            { title: "深邃之海", imageUrl: "https://placehold.co/1000x600/3B82F6/ffffff?text=海洋" },
            { title: "广袤之漠", imageUrl: "https://placehold.co/1000x600/FACC15/333333?text=沙漠" },
            { title: "巍峨之山", imageUrl: "https://placehold.co/1000x600/A855F7/ffffff?text=山脉" }
        ]
    },

    // 抽屉式轮播配置
    drawerCarousel: {
        data: [
            { navTitle: "初探", title: "遗失的日志", quote: "每一片尘埃，都曾是星辰的一部分。", 
                imageUrl: "https://placehold.co/800x500/0EA5E9/ffffff?text=古卷轴", 
                description: "在被遗忘的图书馆深处，发现了指向未知的线索。" },
            { navTitle: "远征", title: "水晶洞穴", quote: "最黑暗的地方，往往能看到最亮的光。", imageUrl: "https://placehold.co/800x500/4F46E5/ffffff?text=水晶洞", description: "深入地心，寻找传说中能指引方向的能量水晶。" },
            { navTitle: "谜题", title: "天文台的秘密", quote: "星图不仅指引方向，也隐藏着历史的密码。", imageUrl: "https://placehold.co/800x500/D97706/ffffff?text=天文台", description: "古老的天文仪器，似乎在等待正确的星辰排列。" },
            { navTitle: "启示", title: "天空之境", quote: "旅途的终点，是另一段旅程的开始。", imageUrl: "https://placehold.co/800x500/BE185D/ffffff?text=天空岛", description: "最终的发现，指向了更高维度的存在与挑战。" }
        ]
    },

    // 视差滚动区块配置
    parallax: {
        itemsData: [
            { title: "「时空涟漪」", desc: "宇宙弦的振动，编织出时间的织锦。", imageUrl: "https://placehold.co/1920x800/1E293B/E0E7FF?text=时空涟漪" },
            { title: "「意识星云」", desc: "思想的集合体，在宇宙深处闪耀智慧之光。", imageUrl: "https://placehold.co/1920x800/334155/C7D2FE?text=意识星云" },
            { title: "「元素洪流」", desc: "构成万物的基本粒子，在此汇聚与奔腾。", imageUrl: "https://placehold.co/1920x800/475569/A5B4FC?text=元素洪流" },
            { title: "「永恒圣殿」", desc: "传说中超越一切维度与法则的终极之地。", imageUrl: "https://placehold.co/1920x800/64748B/818CF8?text=永恒圣殿" }
        ]
    }
};