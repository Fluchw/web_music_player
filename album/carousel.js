// carousel.js
const CarouselModule = (function() {
    let config = {};
    let switchToNextViewCallback = null; // 修改回调名称

    function setup() {
        if (!config.contentElement || !config.shellElement) {
            console.error('旋转木马容器或外壳元素未找到 (carousel.js)!');
            return;
        }
        if (config.itemImageUrls.length === 0) {
            config.contentElement.innerHTML = '<p style="color:white; text-align:center;">没有配置旋转木马图片</p>';
            return;
        }

        config.angleIncrement = 360 / config.itemImageUrls.length;
        config.items = []; 
        config.contentElement.innerHTML = ''; 

        config.itemImageUrls.forEach((url, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item'); 
            itemElement.style.backgroundImage = `url(${url})`;
            const rotateYValue = index * config.angleIncrement;
            itemElement.style.transform = `rotateY(${rotateYValue}deg) translateZ(${config.translateZValue})`;
            config.contentElement.appendChild(itemElement);
            config.items.push(itemElement);
        });
        updateTransform(); 
    }

    function updateTransform() {
        if (!config.contentElement) return;
        const rotationY = -config.currentIndex * config.angleIncrement;
        config.contentElement.style.transform = `translateZ(-${config.translateZValue}) rotateY(${rotationY}deg)`;
    }

    function handleWheel(event) {
        let nextIndex = config.currentIndex;
        if (event.deltaY > 0) { 
            if (config.currentIndex < config.itemImageUrls.length - 1) {
                nextIndex++;
            } else {
                // 到达最后一个项目，并且向下滚动，触发切换到下一个视图的回调
                if (typeof switchToNextViewCallback === 'function') {
                    switchToNextViewCallback(); 
                }
                return; // 切换后不再处理当前模块的逻辑
            }
        } else if (event.deltaY < 0) { 
            nextIndex = Math.max(0, config.currentIndex - 1);
        }

        if (nextIndex !== config.currentIndex) {
            config.currentIndex = nextIndex;
            updateTransform();
        }
    }

    return {
        init: function(initialConfig, callbackToNext) { // 修改参数名
            config = { 
                itemImageUrls: [],
                translateZValue: '35vw',
                contentElement: null,
                shellElement: null,
                items: [],
                currentIndex: 0,
                angleIncrement: 0,
                mainBackgroundImageUrl: '',
                ...initialConfig 
            };
            switchToNextViewCallback = callbackToNext; // 存储回调
            setup();
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; } 
    };
})();
