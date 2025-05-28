// config.js

// 默认颜色配置
const DEFAULT_COLORS_1 = {
    inner: "#00BFFF",  // 亮蓝色
    outer: "#FFA500"   // 橙色
};

const DEFAULT_COLORS_2 = {
    inner: "#9400D3",  // 深紫色
    outer: "#4169E1"   // 皇家蓝
};

// 当前默认颜色
const INNER_COLOR = "#FFAA33";  // 金色
const OUTER_COLOR = "#89CFF0";  // 天蓝色

// 添加颜色控制器
const ColorController = {
    init() {
        this.blackHoleEffect = {
            innerColor: INNER_COLOR,
            outerColor: OUTER_COLOR
        };
        
        // 从localStorage加载保存的颜色
        const savedColors = JSON.parse(localStorage.getItem('blackHoleColors') || '{}');
        if (savedColors.inner) this.blackHoleEffect.innerColor = savedColors.inner;
        if (savedColors.outer) this.blackHoleEffect.outerColor = savedColors.outer;
        
        // 初始化时更新一次颜色
        this.updateBlackHoleColors();
    },

    updateBlackHoleColors() {
        const iframe = document.getElementById('blackHoleIframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'updateColors',
                inner: this.blackHoleEffect.innerColor,
                outer: this.blackHoleEffect.outerColor
            }, '*');
            this.saveColors();
        }
    },

    applyPreset(preset) {
        if (!preset || !preset.inner || !preset.outer) return;
        this.blackHoleEffect.innerColor = preset.inner;
        this.blackHoleEffect.outerColor = preset.outer;
        this.updateBlackHoleColors();
        this.updateInputs();
    },

    reset() {
        this.blackHoleEffect.innerColor = INNER_COLOR;
        this.blackHoleEffect.outerColor = OUTER_COLOR;
        this.updateBlackHoleColors();
        this.updateInputs();
    },

    setInnerColor(color) {
        this.blackHoleEffect.innerColor = color;
        this.updateBlackHoleColors();
    },

    setOuterColor(color) {
        this.blackHoleEffect.outerColor = color;
        this.updateBlackHoleColors();
    },

    saveColors() {
        localStorage.setItem('blackHoleColors', JSON.stringify({
            inner: this.blackHoleEffect.innerColor,
            outer: this.blackHoleEffect.outerColor
        }));
    },

    updateInputs() {
        const innerInput = document.getElementById('innerColorInput');
        const outerInput = document.getElementById('outerColorInput');
        if (innerInput) innerInput.value = this.blackHoleEffect.innerColor;
        if (outerInput) outerInput.value = this.blackHoleEffect.outerColor;
    },

    setupEventListeners() {
        // 设置颜色输入监听
        const innerInput = document.getElementById('innerColorInput');
        const outerInput = document.getElementById('outerColorInput');
        const defaultColors1Btn = document.getElementById('defaultColors1');
        const defaultColors2Btn = document.getElementById('defaultColors2');
        const resetColorsBtn = document.getElementById('resetColors');

        if (innerInput) {
            innerInput.addEventListener('input', () => {
                this.setInnerColor(innerInput.value);
            });
        }

        if (outerInput) {
            outerInput.addEventListener('input', () => {
                this.setOuterColor(outerInput.value);
            });
        }

        if (defaultColors1Btn) {
            defaultColors1Btn.addEventListener('click', () => {
                this.applyPreset(DEFAULT_COLORS_1);
            });
        }

        if (defaultColors2Btn) {
            defaultColors2Btn.addEventListener('click', () => {
                this.applyPreset(DEFAULT_COLORS_2);
            });
        }

        if (resetColorsBtn) {
            resetColorsBtn.addEventListener('click', () => {
                this.reset();
            });
        }
    }
};

// 当文档加载完成时初始化颜色控制器
document.addEventListener('DOMContentLoaded', () => {
    ColorController.init();
    ColorController.setupEventListeners();
});

const APP_CONFIGS = {
    // 图片资源字典
    imageUrls: {
        // 本地图片
        local1: 'img/208846BF2F5FB16B04C62284809C3D44.jpg',
        local2: 'img/33CC25F529D01F2E1158FBD800A90562.jpg',
        local3: 'img/34AF2F473C46DC743555C35D0C694B8D.jpg',
        local4: 'img/4BB799BF8262359A72BF528A72EF3404.jpg',
        local5: 'img/4EEFCF937D29387A879D80DEADCCB24D.jpg',
        local6: 'img/50BD22A984E8ED7F81297A8236170034.jpg',
        local7: 'img/6DD27722966418C16F6F8FB9B52847E4.jpg',
        local8: 'img/8A49C3AC6E4FD0CEEC7A53A718659F76.jpg',
        local9: 'img/EF971A3625DEF1729E77623EBE6FCA0C.jpg',
        local10: 'img/F6C3192713D2FB918391C35AB68734F0.jpg',
        local11: 'img/F861ECAB71EE24088FF0EDC51391E4B8.jpg',
        // 在线图片
        online1: 'https://patchwiki.biligame.com/images/lysk/thumb/6/65/pvea1olklkmpw82qc94caqr2ye7igmi.png/450px-%E6%80%9D%E5%BF%B5%E9%95%BF%E5%9B%BE-%E6%B5%AE%E8%8A%B1%E4%BB%A5%E8%BD%BD.png',
        online2: 'https://patchwiki.biligame.com/images/lysk/thumb/d/d8/jyx3jj49tta8eycjmxcw7j7tgmhwu6t.png/450px-%E6%80%9D%E5%BF%B5%E9%95%BF%E5%9B%BE-%E8%BF%9C%E7%A9%BA%E6%A3%A0%E9%9B%A8.png',
        online3: 'https://patchwiki.biligame.com/images/lysk/thumb/c/cf/tvdjpkyazljcvgork035kahuj0nhi9w.png/450px-%E6%80%9D%E5%BF%B5%E9%95%BF%E5%9B%BE-%E8%BF%9C%E7%A9%BA%E8%BF%B7%E8%88%AA.png',
        online4: 'https://patchwiki.biligame.com/images/lysk/thumb/d/d5/s8agau4egg33w62rcvwhnyyna9n94ki.png/450px-%E6%80%9D%E5%BF%B5%E9%95%BF%E5%9B%BE-%E9%99%90%E5%AE%9A%E4%BD%99%E5%91%B3.png',
        online5: 'https://patchwiki.biligame.com/images/lysk/thumb/4/4c/gqgm6aimkwziqn3bdtvxpbzldwujfz7.png/450px-%E6%80%9D%E5%BF%B5%E9%95%BF%E5%9B%BE-%E5%AF%82%E8%B7%AF%E4%B8%8D%E5%BD%92.png'
    },

    // 全局配置
    globalBackgroundImageUrl: 'https://source.unsplash.com/random/1920x1080/?galaxy,abstract,dark-theme', // 替换为你想要的全局背景图URL

    // 入口页面文字
    entryPage: {
        title: "探索未知之境",
        subtitle: "向下滑动，开启奇妙旅程"
    },

    // 音乐播放器列表
musicFiles: [
    { title: "万象遇你", src: "music/沈洛君 - 恋与深空·万象遇你「钢琴」.mp3" },
    { title: "仲夏雨", src: "music/沈洛君 - 恋与深空·夏以昼·仲夏雨「钢琴」.mp3" },
    { title: "巨大轰鸣", src: "music/沈洛君 - 恋与深空·夏以昼·回归预告pv巨大轰鸣「钢琴」.mp3" },
    { title: "家人", src: "music/沈洛君 - 恋与深空·夏以昼·家人「钢琴」.mp3" },
    { title: "抵达梦境边缘", src: "music/沈洛君 - 恋与深空·夏以昼·抵达梦境边缘「钢琴」.mp3" },
    { title: "无尽夏·飞鸟回还时", src: "music/沈洛君 - 恋与深空·夏以昼·无尽夏·飞鸟回还时「钢琴」.mp3" },
    { title: "无引力乐园", src: "music/沈洛君 - 恋与深空·夏以昼·无引力乐园「钢琴」.mp3" },
    { title: "荒芜航线", src: "music/沈洛君 - 恋与深空·夏以昼·荒芜航线「钢琴」.mp3" },
    { title: "触痛讯号", src: "music/沈洛君 - 恋与深空·夏以昼·触痛讯号「钢琴」.mp3" },
    { title: "远空迷航", src: "music/沈洛君 - 恋与深空·夏以昼·远空迷航「钢琴」.mp3" },
    { title: "飞鸟回还日", src: "music/沈洛君 - 恋与深空·夏以昼·飞鸟回还日「钢琴」.mp3" },
    { title: "深空序曲", src: "music/沈洛君 - 恋与深空·深空序曲「钢琴」.mp3" },
    { title: "深空变奏", src: "music/沈洛君 - 恋与深空变奏.mp3" },
    { title: "万象遇你pv", src: "music/沈洛君 - 恋与深空·万象遇你pv「钢琴」.mp3" },

],

    // 3D 旋转木马配置
    carousel: {
        itemImageUrls: [
            'local1',
            'local2',
            'online1',
            'local3',
            'online2'
        ],
        translateZValue: '28vw',
    },

    // 手风琴效果配置
    accordion: {
        data: [
            { title: "寂路不归", imageUrl: "local6" },
            { title: "浮花以载", imageUrl: "online1" },
            { title: "远空迷航", imageUrl: "local8" },
            { title: "深空漫游", imageUrl: "online3" },
            { title: "星际探索", imageUrl: "local10" }
        ]
    },

    // 抽屉式轮播配置
    drawerCarousel: {
        data: [
                // { title: "online1", imageUrl: "online1" },
                // { title: "online2", imageUrl: "online2" },
                // { title: "online3", imageUrl: "online3" },
                // { title: "online4", imageUrl: "online4" },
                // { title: "online5", imageUrl: "online5" },
                // { title: "local3", imageUrl: "local3" },
                // { title: "local8", imageUrl: "local8" },
                // { title: "local9", imageUrl: "local9" },
                // { title: "local10", imageUrl: "local10" },
            { 
                navTitle: "寂路不归", 
                title: "寂路不归", 
                quote: "在璀璨星海中独行，每一步都印刻着永恒。", 
                imageUrl: "local3", 
                description: "纵使前路漫漫，始终相信光明就在前方。" 
            },
            { 
                navTitle: "星际探索", 
                title: "星际探索", 
                quote: "跨越星河，探寻未知的边界。", 
                imageUrl: "local4", 
                description: "每一次的冒险，都是对宇宙奥秘的新发现。" 
            },
            { 
                navTitle: "深空序曲", 
                title: "深空序曲", 
                quote: "在无垠宇宙中聆听星辰的低语。", 
                imageUrl: "local10", 
                description: "这是一曲穿越时空的永恒乐章。" 
            },
            { 
                navTitle: "远空迷航", 
                title: "远空迷航", 
                quote: "迷失在浩瀚星海，寻找归途的指引。", 
                imageUrl: "local7", 
                description: "在漫漫旅程中，找寻属于自己的星光。" 
            }
        ]
    },

    // 视差滚动区块配置
    parallax: {
        itemsData: [
            { 
                title: "「寂露追光」", 
                desc: "在星际边缘，寻找光明的轨迹", 
                imageUrl: "local1" 
            },
            { 
                title: "「无尽夏时」", 
                desc: "每一个永恒的瞬间，都是时光的礼物", 
                imageUrl: "local2" 
            },
            { 
                title: "「深空序曲」", 
                desc: "聆听星辰奏响的永恒乐章", 
                imageUrl: "local4" 
            },
            { 
                title: "「星际远航」", 
                desc: "跨越光年的距离，寻找未知的可能", 
                imageUrl: "local5" 
            },
            { 
                title: "「梦境边缘」", 
                desc: "在现实与梦想的交界处徘徊", 
                imageUrl: "local6" 
            },
            { 
                title: "「归途之光」", 
                desc: "指引我们回家的星光", 
                imageUrl: "local7" 
            },
            { 
                title: "「永恒回响」", 
                desc: "时空之间永恒的共鸣", 
                imageUrl: "local11" 
            }
        ]
    }
};

// 辅助函数：解析图片URL
function getImageUrl(key) {
    return APP_CONFIGS.imageUrls[key] || key;
}

// 预处理所有配置中的图片URL
function processImageUrls(config) {
    // 处理所有需要图片URL的配置项
    ['carousel.itemImageUrls', 'accordion.data', 'drawerCarousel.data', 'parallax.itemsData'].forEach(path => {
        const keys = path.split('.');
        let current = config;
        for (const key of keys.slice(0, -1)) {
            if (current[key]) current = current[key];
            else return;
        }
        
        const lastKey = keys[keys.length - 1];
        if (Array.isArray(current[lastKey])) {
            current[lastKey] = current[lastKey].map(item => {
                if (typeof item === 'string') {
                    return getImageUrl(item);
                }
                if (item.imageUrl) {
                    return { ...item, imageUrl: getImageUrl(item.imageUrl) };
                }
                return item;
            });
        }
    });

    return config;
}

// 导出处理后的配置
const PROCESSED_APP_CONFIGS = processImageUrls(APP_CONFIGS);