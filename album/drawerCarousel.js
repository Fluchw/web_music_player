// drawerCarousel.js
const DrawerCarouselModule = (function() {
    let config = {};
    let switchToPrevViewCallback = null; 
    let switchToNextViewCallback = null; 
    let navItems = [];
    let contentItems = [];

    function setActiveDrawerItem(index) {
        if (index < 0 || index >= config.data.length) return;
        navItems.forEach(item => item.classList.remove('active-drawer-nav'));
        if (navItems[index]) navItems[index].classList.add('active-drawer-nav');
        contentItems.forEach(item => item.classList.remove('active-drawer-content'));
        if (contentItems[index]) contentItems[index].classList.add('active-drawer-content');
        config.currentIndex = index;
    }

    function setup() {
        if (!config.navContainerElement || !config.contentAreaElement) {
            console.error('抽屉轮播导航或内容区域元素未找到 (drawerCarousel.js)!');
            return;
        }
        navItems = []; contentItems = [];
        config.navContainerElement.innerHTML = ''; config.contentAreaElement.innerHTML = '';
        config.data.forEach((dataItem, index) => {
            const navItem = document.createElement('div');
            navItem.classList.add('drawer-nav-item');
            navItem.innerHTML = `<span class="drawer-nav-number">${index + 1}</span><span class="drawer-nav-title">${dataItem.navTitle || dataItem.title}</span>`;
            navItem.addEventListener('click', () => setActiveDrawerItem(index));
            config.navContainerElement.appendChild(navItem);
            navItems.push(navItem);
            const contentItem = document.createElement('div');
            contentItem.classList.add('drawer-content-item');
            contentItem.innerHTML = `<h2>${dataItem.title}</h2>${dataItem.quote ? `<p class="quote">${dataItem.quote}</p>` : ''}${dataItem.imageUrl ? `<img src="${dataItem.imageUrl}" alt="${dataItem.title}">` : ''}${dataItem.description ? `<p>${dataItem.description}</p>` : ''}`;
            config.contentAreaElement.appendChild(contentItem);
            contentItems.push(contentItem);
        });
        if (config.data.length > 0) setActiveDrawerItem(config.currentIndex || 0);
    }

    function handleWheel(event) {
        let nextIndex = config.currentIndex;
        if (event.deltaY > 0) { 
            if (config.currentIndex < config.data.length - 1) {
                nextIndex++;
            } else { 
                if (typeof switchToNextViewCallback === 'function') { 
                    switchToNextViewCallback();
                }
                return true;
            }
        } else if (event.deltaY < 0) { 
            if (config.currentIndex > 0) {
                nextIndex--;
            } else {
                if (typeof switchToPrevViewCallback === 'function') switchToPrevViewCallback();
                return true;
            }
        }
        if (nextIndex !== config.currentIndex) setActiveDrawerItem(nextIndex);
        return true;
    }

    return {
        init: function(initialConfig, callbackToPrev, callbackToNext) { 
            config = { 
                data: [], 
                navContainerElement: null, 
                contentAreaElement: null, 
                currentIndex: 0, 
                ...initialConfig 
            };
            switchToPrevViewCallback = callbackToPrev;
            switchToNextViewCallback = callbackToNext; 
            setup();
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; }
    };
})();
