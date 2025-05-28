// --- CarouselModule ---
const CarouselModule = (function() {
    let config = {};
    let switchToNextViewCallback = null;
    let switchToPrevViewCallback = null; 

    function setup() {
        // Ensure content and shell elements are present
        if (!config.contentElement || !config.shellElement) {
            if (config.contentElement) config.contentElement.innerHTML = '<p style="color:white; text-align:center;">旋转木马容器配置错误</p>';
            return;
        }
        // Ensure there are images to display
        if (!config.itemImageUrls || config.itemImageUrls.length === 0) {
            config.contentElement.innerHTML = '<p style="color:white; text-align:center;">没有配置旋转木马图片</p>';
            return;
        }
        // Calculate angle increment for item rotation
        config.angleIncrement = 360 / config.itemImageUrls.length;
        config.items = [];
        config.contentElement.innerHTML = ''; // Clear previous items
        // Create and append items to the carousel
        config.itemImageUrls.forEach((url, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.style.backgroundImage = `url(${url})`;
            const rotateYValue = index * config.angleIncrement;
            itemElement.style.transform = `rotateY(${rotateYValue}deg) translateZ(${config.translateZValue})`;
            config.contentElement.appendChild(itemElement);
            config.items.push(itemElement);
        });
        updateTransform(); // Apply initial transform
    }

    function updateTransform() {
        if (!config.contentElement) return;
        // Rotate the content container based on the current index
        const rotationY = -config.currentIndex * config.angleIncrement;
        config.contentElement.style.transform = `translateZ(-${config.translateZValue}) rotateY(${rotationY}deg)`;
    }

    function handleWheel(event) {
        if (!config.itemImageUrls || config.itemImageUrls.length === 0) return true; // No items, consume event

        let nextIndex = config.currentIndex;
        if (event.deltaY > 0) { // Scrolling down
            if (config.currentIndex < config.itemImageUrls.length - 1) {
                nextIndex++;
            } else {
                // Reached the end, call callback to switch to the next view
                if (typeof switchToNextViewCallback === 'function') switchToNextViewCallback();
                return true; // Indicate that the event was handled for view switching
            }
        } else if (event.deltaY < 0) { // Scrolling up
            if (config.currentIndex > 0) {
                nextIndex--;
            } else {
                // Reached the beginning, call callback to switch to the previous view
                if (typeof switchToPrevViewCallback === 'function') switchToPrevViewCallback();
                return true; // Indicate that the event was handled for view switching
            }
        }

        if (nextIndex !== config.currentIndex) {
            config.currentIndex = nextIndex;
            updateTransform();
        }
        return true; // Indicate that the event was handled (either for item switch or view switch intent)
    }

    return {
        init: function(initialConfig, callbackToNext, callbackToPrev) {
            config = { itemImageUrls: [], translateZValue: '35vw', contentElement: null, shellElement: null, items: [], currentIndex: 0, angleIncrement: 0, ...initialConfig };
            switchToNextViewCallback = callbackToNext;
            switchToPrevViewCallback = callbackToPrev;
            if (config.contentElement && config.shellElement) {
                 setup();
            } else {
                 if(initialConfig.contentElement) initialConfig.contentElement.innerHTML = '<p style="color:white; text-align:center;">旋转木马组件初始化失败</p>';
            }
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; }
    };
})();

// --- AccordionModule ---
const AccordionModule = (function() {
    let config = {};
    let switchToNextViewCallback = null;
    let switchToPrevViewCallback = null;

    function setActivePanel(index) {
        if (index < 0 || index >= config.panels.length || !config.panels[index]) return;
        // Deactivate all panels and activate the selected one
        config.panels.forEach(p => p.classList.remove('active'));
        config.panels[index].classList.add('active');
        config.currentActiveIndex = index;
    }

    function setup() {
        if (!config.containerElement) { return; }
        config.panels = [];
        config.containerElement.innerHTML = ''; // Clear previous panels
        // Create and append panels
        config.data.forEach((dataItem, index) => {
            const panel = document.createElement('div');
            panel.classList.add('accordion-panel-new');
            panel.style.backgroundImage = `url('${dataItem.imageUrl}')`;
            const titleElement = document.createElement('div');
            titleElement.classList.add('panel-title-new');
            titleElement.textContent = dataItem.title;
            panel.appendChild(titleElement);
            config.containerElement.appendChild(panel);
            config.panels.push(panel);
            panel.addEventListener('click', () => {
                setActivePanel(index);
            });
        });
        if (config.panels.length > 0) setActivePanel(config.currentActiveIndex || 0); // Activate initial panel
    }

    function handleWheel(event) {
        if (!config.data || config.data.length === 0) return true;
        let nextIndex = config.currentActiveIndex;
        if (event.deltaY > 0) { // Scrolling down
            if (config.currentActiveIndex < config.data.length - 1) {
                nextIndex++;
            } else {
                if (typeof switchToNextViewCallback === 'function') switchToNextViewCallback();
                return true;
            }
        } else if (event.deltaY < 0) { // Scrolling up
            if (config.currentActiveIndex > 0) {
                nextIndex--;
            } else {
                if (typeof switchToPrevViewCallback === 'function') switchToPrevViewCallback();
                return true;
            }
        }
        if (nextIndex !== config.currentActiveIndex) {
            setActivePanel(nextIndex);
        }
        return true;
    }

    return {
        init: function(initialConfig, callbackToNext, callbackToPrev) {
            config = { data: [], containerElement: null, panels: [], currentActiveIndex: 0, ...initialConfig };
            switchToNextViewCallback = callbackToNext;
            switchToPrevViewCallback = callbackToPrev;
            setup();
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; }
    };
})();

// --- DrawerCarouselModule ---
const DrawerCarouselModule = (function() {
    let config = {};
    let switchToPrevViewCallback = null;
    // switchToNextViewCallback is in config.switchToNextViewCallback
    let navItems = [];
    let contentItems = []; // These are the .drawer-content-item elements

    function setActiveDrawerItem(index) {
        if (index < 0 || index >= config.data.length || !config.contentAreaElement) return;

        // Update navigation items
        navItems.forEach(item => item.classList.remove('active-drawer-nav'));
        if (navItems[index]) navItems[index].classList.add('active-drawer-nav');

        // Update content items (text visibility)
        contentItems.forEach(item => item.classList.remove('active-drawer-content'));
        if (contentItems[index]) contentItems[index].classList.add('active-drawer-content');

        // Set background image on the content area
        const currentData = config.data[index];
        if (currentData && currentData.imageUrl) {
            config.contentAreaElement.style.backgroundImage = `url('${currentData.imageUrl}')`;
        } else {
            config.contentAreaElement.style.backgroundImage = 'none'; // Or a default background
        }
        config.currentIndex = index;
    }

    function setup() {
        if (!config.navContainerElement || !config.contentAreaElement || !config.data) {
            return;
        }
        navItems = [];
        contentItems = []; // Reset contentItems array
        config.navContainerElement.innerHTML = '';
        config.contentAreaElement.innerHTML = ''; // Clear previous content items if any

        config.data.forEach((dataItem, index) => {
            // Create Nav Item
            const navItem = document.createElement('div');
            navItem.classList.add('drawer-nav-item');
            navItem.innerHTML = `<span class="drawer-nav-number">${index + 1}</span><span class="drawer-nav-title">${dataItem.navTitle || dataItem.title}</span>`;
            navItem.addEventListener('click', () => setActiveDrawerItem(index));
            config.navContainerElement.appendChild(navItem);
            navItems.push(navItem);

            // Create Content Item (for text only)
            const contentItem = document.createElement('div');
            contentItem.classList.add('drawer-content-item');
            contentItem.innerHTML = `<h2>${dataItem.title}</h2>
                                     ${dataItem.quote ? `<p class="quote">${dataItem.quote}</p>` : ''}
                                     ${dataItem.description ? `<p>${dataItem.description}</p>` : ''}`;
            config.contentAreaElement.appendChild(contentItem); 
            contentItems.push(contentItem);
        });

        if (config.data.length > 0) {
            setActiveDrawerItem(config.currentIndex || 0);
        } else {
             config.contentAreaElement.style.backgroundImage = 'none';
        }
    }

    function handleWheel(event) {
        if (!config.data || config.data.length === 0) return true;
        let nextIndex = config.currentIndex;
        if (event.deltaY > 0) {
            if (config.currentIndex < config.data.length - 1) nextIndex++;
            else {
                if (typeof config.switchToNextViewCallback === 'function') config.switchToNextViewCallback();
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
            config = { data: [], navContainerElement: null, contentAreaElement: null, currentIndex: 0, ...initialConfig };
            switchToPrevViewCallback = callbackToPrev;
            config.switchToNextViewCallback = callbackToNext; // Store the next callback in config
            setup();
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; }
    };
})();

// --- ParallaxModule ---
const ParallaxModule = (function() {
    let config = {};
    let switchToPrevViewCallback = null;
    let switchToNextViewCallback = null;
    let parallaxBlocks = [];
    let parallaxContainer = null; // This is the .view-section element for parallax
    let parallaxScrollListener = null;

    function setup() {
        parallaxContainer = config.containerElement; // e.g., document.getElementById('parallaxSection')
        if (!parallaxContainer || !config.itemContainerElement) {
            return;
        }
        config.itemContainerElement.innerHTML = ''; // Clear previous items
        parallaxBlocks = [];

        config.itemsData.forEach(data => {
            const sectionItem = document.createElement('section');
            sectionItem.classList.add('section-item');
            const block = document.createElement('div');
            block.classList.add('section-item__block');
            block.style.backgroundImage = `url(${data.imageUrl})`;
            const textDiv = document.createElement('div');
            textDiv.classList.add('section-item__text');
            textDiv.innerHTML = `<div class="text-title">${data.title}</div><div class="text-desc">${data.desc}</div>`;
            sectionItem.appendChild(block);
            sectionItem.appendChild(textDiv);
            config.itemContainerElement.appendChild(sectionItem);
            parallaxBlocks.push(block); // Store the elements that will have their background position animated
        });

        // Remove old listener if re-initializing
        if (parallaxScrollListener && parallaxContainer) {
            parallaxContainer.removeEventListener('scroll', parallaxScrollListener);
        }
        parallaxScrollListener = handleParallaxEffectScroll; // Assign the function reference
        if (parallaxContainer) {
            parallaxContainer.addEventListener('scroll', parallaxScrollListener);
            handleParallaxEffectScroll(); // Initial call to set positions
        }
    }

    function handleParallaxEffectScroll() {
        if (!parallaxContainer || parallaxBlocks.length === 0) return;

        const scrollTop = parallaxContainer.scrollTop; // Scroll position of the parallax section itself
        const containerHeight = parallaxContainer.clientHeight;

        parallaxBlocks.forEach(el => {
            const parentSectionItem = el.parentElement; // The .section-item
            const itemRect = parentSectionItem.getBoundingClientRect(); // Position relative to viewport
            const containerRect = parallaxContainer.getBoundingClientRect(); // Parallax section's position relative to viewport

            // Calculate item's top position relative to the parallaxContainer's top
            const itemTopRelativeToContainer = itemRect.top - containerRect.top;

            // Check if the item is visible within the parallaxContainer's viewport area
            if (itemRect.bottom > containerRect.top && itemRect.top < containerRect.bottom) {
                const elementMidPointInContainer = itemTopRelativeToContainer + parentSectionItem.offsetHeight / 2;
                const containerMidPoint = containerHeight / 2;
                const difference = elementMidPointInContainer - containerMidPoint;
                const parallaxFactor = 0.2; // How much the background moves relative to scroll
                const yOffset = -difference * parallaxFactor;
                el.style.backgroundPosition = `center ${yOffset}px`;
            }
        });
    }

    function handleWheel(event) {
        if (!parallaxContainer) return false; // Not handled

        const isAtTop = parallaxContainer.scrollTop <= 0;
        const scrollableHeight = parallaxContainer.scrollHeight - parallaxContainer.clientHeight;
        // Consider "at bottom" if very close to the bottom, to account for subpixel rendering issues
        const isAtBottom = scrollableHeight <= 5 || parallaxContainer.scrollTop >= scrollableHeight - 5;

        if (event.deltaY < 0 && isAtTop) { // Scrolling up at the top
            if (typeof switchToPrevViewCallback === 'function') {
                switchToPrevViewCallback();
                return true; // Event handled for view switch
            }
        } else if (event.deltaY > 0 && isAtBottom) { // Scrolling down at the bottom
            if (typeof switchToNextViewCallback === 'function') {
                switchToNextViewCallback();
                return true; // Event handled for view switch
            }
        }
        return false; // Event not handled for view switch (allow internal scroll)
    }

    return {
        init: function(initialConfig, callbackToPrev, callbackToNext) {
            config = { itemsData: [], containerElement: null, itemContainerElement: null, ...initialConfig };
            switchToPrevViewCallback = callbackToPrev;
            switchToNextViewCallback = callbackToNext;
            setup();
        },
        handleWheel: handleWheel,
        getContainerElement: function() { return parallaxContainer; },
        resetScroll: function() { // Method to reset scroll, e.g., when reactivating this view
            if (parallaxContainer) {
                parallaxContainer.scrollTop = 0;
                handleParallaxEffectScroll(); // Update positions after scroll reset
            }
        }
    };
})();

// --- MusicPlayerModule ---
const MusicPlayerModule = (function() {
    let audio, playPauseBtn, titleEl, progressBarContainerEl, progressBarEl, nextBtn, prevBtn, currentTimeEl, totalDurationEl, playerContainerEl, playModeBtn;
    let songs = [];
    let currentSongIdx = 0;
    let isPlaying = false;
    let isDragging = false, dragOffsetX, dragOffsetY;
    let isRandomPlay = false; // 添加随机播放状态

    // 添加获取下一首歌索引的函数
    function getNextSongIndex() {
        if (isRandomPlay) {
            return Math.floor(Math.random() * songs.length);
        }
        return (currentSongIdx + 1) % songs.length;
    }

    // 添加获取上一首歌索引的函数
    function getPrevSongIndex() {
        if (isRandomPlay) {
            return Math.floor(Math.random() * songs.length);
        }
        return (currentSongIdx - 1 + songs.length) % songs.length;
    }

    // 修改处理下一首歌的函数
    function handleNextSong() {
        currentSongIdx = getNextSongIndex();
        loadSong(currentSongIdx, true);
    }

    // 修改处理上一首歌的函数
    function handlePrevSong() {
        currentSongIdx = getPrevSongIndex();
        loadSong(currentSongIdx, true);
    }

    // 添加切换播放模式的函数
    function togglePlayMode() {
        isRandomPlay = !isRandomPlay;
        playModeBtn.innerHTML = isRandomPlay ? 
            '<i class="fas fa-random"></i>' : 
            '<i class="fas fa-list-ul"></i>';
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function loadSong(songIndex, autoPlayAfterLoad = false) {
        if (songIndex >= 0 && songIndex < songs.length) {
            const song = songs[songIndex];
            audio.src = song.src;
            titleEl.textContent = song.title;
            titleEl.title = song.title; // For tooltip on hover
            audio.load(); // Important to load the new source
            currentSongIdx = songIndex;
            isPlaying = false; // Reset playback state until play is confirmed
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';


            if (autoPlayAfterLoad) {
                // Autoplay is tricky. Listen for 'canplaythrough' or 'canplay'
                const canPlayListener = () => {
                    playCurrentSong(); // Try to play once ready
                };
                audio.removeEventListener('canplaythrough', canPlayListener); // Remove old listener if any
                audio.removeEventListener('canplay', canPlayListener); // Remove old listener if any
                audio.addEventListener('canplaythrough', canPlayListener, { once: true });
            }
        }
    }

    function playCurrentSong() {
        if (!audio.src && songs.length > 0) { // If no src, but songs available, load first then try play
             loadSong(currentSongIdx, true); // Load and set flag to play after load
             return;
        }
        if (audio.src) { // Only play if there's a source
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    isPlaying = false;
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                });
            }
        }
    }


    function handlePlayPause() {
        if (isPlaying) {
            audio.pause();
        } else {
            if (!audio.src && songs.length > 0) {
                 loadSong(currentSongIdx, true); // Load and attempt to play
            } else if (audio.src) {
                 playCurrentSong();
            }
        }
    }

    function handleNextSong() {
        currentSongIdx = (currentSongIdx + 1) % songs.length;
        loadSong(currentSongIdx, true); // Load new song and auto-play
    }

    function handlePrevSong() {
        currentSongIdx = (currentSongIdx - 1 + songs.length) % songs.length;
        loadSong(currentSongIdx, true); // Load new song and auto-play
    }

    function updateProgressBar() {
        if (audio.duration && !isNaN(audio.duration)) {
            progressBarEl.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        } else {
            progressBarEl.style.width = `0%`;
            currentTimeEl.textContent = "0:00"; // Or "--:--"
        }
    }

    function handleProgressBarClick(e) {
        if (audio.duration && !isNaN(audio.duration)) {
            const rect = progressBarContainerEl.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;
            audio.currentTime = audio.duration * (clickPosition / rect.width);
        }
    }

    function makeDraggable() {
        playerContainerEl.addEventListener('mousedown', (e) => {
            // Prevent dragging if clicking on buttons or progress bar
            if (e.target.closest('button') || e.target.closest('.progress-bar-container')) return;
            isDragging = true;
            const rect = playerContainerEl.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            playerContainerEl.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none'; // Prevent text selection during drag
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent default browser drag behavior
            let newLeft = e.clientX - dragOffsetX;
            let newTop = e.clientY - dragOffsetY;

            // Constrain to viewport
            const bodyWidth = document.documentElement.clientWidth;
            const bodyHeight = document.documentElement.clientHeight;
            const playerWidth = playerContainerEl.offsetWidth;
            const playerHeight = playerContainerEl.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, bodyWidth - playerWidth));
            newTop = Math.max(0, Math.min(newTop, bodyHeight - playerHeight));

            playerContainerEl.style.left = newLeft + 'px';
            playerContainerEl.style.top = newTop + 'px';
            // Important: remove transform if you are using left/top for dragging
            // Or, adjust transform instead of left/top
            playerContainerEl.style.right = 'auto'; // Clear conflicting styles
            playerContainerEl.style.bottom = 'auto'; // Clear conflicting styles
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                playerContainerEl.style.cursor = 'grab';
                document.body.style.userSelect = ''; // Re-enable text selection
            }
        });
    }

    return {
        init: function(config) {
            audio = document.getElementById(config.audioId);
            playPauseBtn = document.getElementById(config.playPauseButtonId);
            titleEl = document.getElementById(config.songTitleId);
            progressBarContainerEl = document.getElementById(config.progressBarContainerId);
            progressBarEl = document.getElementById(config.progressBarId);
            nextBtn = document.getElementById(config.nextSongButtonId);
            prevBtn = document.getElementById(config.prevSongButtonId);
            currentTimeEl = document.getElementById(config.currentTimeDisplayId);
            totalDurationEl = document.getElementById(config.totalDurationDisplayId);
            playerContainerEl = document.getElementById(config.playerContainerId);
            songs = config.songList || [];

            if (!audio || !playPauseBtn || !titleEl || !progressBarContainerEl || !progressBarEl || !nextBtn || !prevBtn || !currentTimeEl || !totalDurationEl || !playerContainerEl) {
                return;
            }

            if (songs.length > 0) {
                loadSong(currentSongIdx, false); // Load first song, but don't autoplay yet
            } else {
                titleEl.textContent = "播放列表为空";
            }


            playPauseBtn.addEventListener('click', handlePlayPause);
            nextBtn.addEventListener('click', handleNextSong);
            prevBtn.addEventListener('click', handlePrevSong);

            audio.addEventListener('play', () => { isPlaying = true; playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; });
            audio.addEventListener('pause', () => { isPlaying = false; playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; });
            audio.addEventListener('ended', handleNextSong); // Autoplay next song
            audio.addEventListener('loadedmetadata', () => { totalDurationEl.textContent = (audio.duration && !isNaN(audio.duration)) ? formatTime(audio.duration) : "0:00"; });
            audio.addEventListener('timeupdate', updateProgressBar);
            progressBarContainerEl.addEventListener('click', handleProgressBarClick);
            makeDraggable();

            // 添加播放模式按钮
            const controlsDiv = playerContainerEl.querySelector('.player-controls');
            
            playModeBtn = document.createElement('button');
            playModeBtn.innerHTML = '<i class="fas fa-list-ul"></i>';
            playModeBtn.addEventListener('click', togglePlayMode);
            controlsDiv.appendChild(playModeBtn);
        },
        play: playCurrentSong, 
        pause: () => audio.pause(),
        show: () => playerContainerEl && playerContainerEl.classList.add('visible'),
        hide: () => playerContainerEl && playerContainerEl.classList.remove('visible'),
    };
})();

// --- AppController (Main Logic) ---
document.addEventListener('DOMContentLoaded', () => {
    const blackHoleIframe = document.getElementById('blackHoleIframe');
    const toggleEditModeButton = document.getElementById('toggleEditModeButton'); 
    const mainContentContainer = document.getElementById('mainContentContainer');
    const musicPlayerContainerEl = document.getElementById('musicPlayerContainer');

    let isEditingMode = true; 
    let currentContentModuleKey = null; 
    const contentModuleKeys = ['carousel', 'accordion', 'drawerCarousel', 'parallax'];
    const contentModuleElements = {
        carousel: document.getElementById('carouselSection'),
        accordion: document.getElementById('accordionSection'),
        drawerCarousel: document.getElementById('drawerCarouselSection'),
        parallax: document.getElementById('parallaxSection')
    };

    let globalIsThrottled = false;
    const globalThrottleDelay = 700; // Slightly increased for smoother transitions
    let modulesInitialized = false;

    // 颜色控制相关
    const colorPanel = document.getElementById('colorControlPanel');
    const innerColorInput = document.getElementById('innerColorInput');
    const outerColorInput = document.getElementById('outerColorInput');
    const defaultColors1Btn = document.getElementById('defaultColors1');
    const defaultColors2Btn = document.getElementById('defaultColors2');
    const resetColorsBtn = document.getElementById('resetColors');

    // 初始化时加载保存的颜色或使用默认值
    function loadSavedColors() {
        const savedColors = JSON.parse(localStorage.getItem('blackHoleColors') || '{}');
        innerColorInput.value = savedColors.inner || INNER_COLOR;
        outerColorInput.value = savedColors.outer || OUTER_COLOR;
        updateBlackHoleColors();
    }

    // 保存颜色到localStorage
    function saveColors() {
        const colors = {
            inner: innerColorInput.value,
            outer: outerColorInput.value
        };
        localStorage.setItem('blackHoleColors', JSON.stringify(colors));
    }

    // 更新黑洞颜色
    function updateBlackHoleColors() {
        const iframe = document.getElementById('blackHoleIframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'updateColors',
                inner: innerColorInput.value,
                outer: outerColorInput.value
            }, '*');
        }
    }

    // 预设方案按钮事件处理
    defaultColors1Btn.addEventListener('click', () => {
        innerColorInput.value = DEFAULT_COLORS_1.inner;
        outerColorInput.value = DEFAULT_COLORS_1.outer;
        updateBlackHoleColors();
        saveColors();
    });

    defaultColors2Btn.addEventListener('click', () => {
        innerColorInput.value = DEFAULT_COLORS_2.inner;
        outerColorInput.value = DEFAULT_COLORS_2.outer;
        updateBlackHoleColors();
        saveColors();
    });

    resetColorsBtn.addEventListener('click', () => {
        innerColorInput.value = INNER_COLOR;
        outerColorInput.value = OUTER_COLOR;
        updateBlackHoleColors();
        saveColors();
    });

    // 颜色输入事件处理
    innerColorInput.addEventListener('input', () => {
        updateBlackHoleColors();
        saveColors();
    });

    outerColorInput.addEventListener('input', () => {
        updateBlackHoleColors();
        saveColors();
    });

    // 初始化时加载保存的颜色
    loadSavedColors();

    // 在编辑模式下显示颜色面板
    function setIframeState(isEditing) {
        if (!blackHoleIframe) return;
        const scrollIndicator = document.querySelector('.scroll-down-indicator');
        
        if (isEditing) {
            blackHoleIframe.classList.add('is-interactive-fullscreen');
            blackHoleIframe.classList.remove('is-background-for-content');
            if (scrollIndicator) scrollIndicator.classList.remove('visible');
            colorPanel.classList.add('visible');
        } else {
            blackHoleIframe.classList.remove('is-interactive-fullscreen');
            blackHoleIframe.classList.add('is-background-for-content');
            if (scrollIndicator) scrollIndicator.classList.add('visible');
            colorPanel.classList.remove('visible');
        }
    }

    function updateButtonAppearance() {
        if (!toggleEditModeButton) return;
        if (isEditingMode) {
            toggleEditModeButton.innerHTML = '查看更多 <i class="fas fa-chevron-down"></i>';
        } else {
            toggleEditModeButton.innerHTML = '调整背景 <i class="fas fa-magic"></i>';
        }
    }

    function activateContentModule(moduleKey, direction = 0) {
        // Deactivate the current module
        if (currentContentModuleKey && contentModuleElements[currentContentModuleKey]) {
            contentModuleElements[currentContentModuleKey].classList.remove('active-view');
            contentModuleElements[currentContentModuleKey].style.display = 'none';
        }

        currentContentModuleKey = moduleKey;

        if (contentModuleElements[currentContentModuleKey]) {
            const activeElement = contentModuleElements[currentContentModuleKey];
            
            // Set display style based on module type
            if (activeElement.id === 'parallaxSection') {
                activeElement.style.display = 'block';
            } else {
                activeElement.style.display = 'flex'; // For carousel, accordion, drawer
            }
            
            // Add active-view class to trigger opacity/visibility
            // Use rAF to ensure display is set before class for transition
            requestAnimationFrame(() => {
                activeElement.classList.add('active-view');

                // Scroll mainContentContainer
                if (mainContentContainer && mainContentContainer.classList.contains('visible')) {
                    // Another rAF to ensure class is applied and layout is computed
                    requestAnimationFrame(() => {
                        if (contentModuleElements[currentContentModuleKey]) { 
                            mainContentContainer.scrollTop = contentModuleElements[currentContentModuleKey].offsetTop;
                        }
                    });
                }
            });

        } else if (moduleKey === null && direction === -1) { // Back to edit mode
            isEditingMode = true;
            setIframeState(true);
            if (mainContentContainer) mainContentContainer.classList.remove('visible');
            document.documentElement.style.overflowY = 'hidden';
            document.body.style.overflowY = 'hidden';
            updateButtonAppearance();
        }
    }
    
    const resolvedAppConfigs = (typeof APP_CONFIGS !== 'undefined') ? APP_CONFIGS : {};
    const carouselInitialConfig = {itemImageUrls: resolvedAppConfigs.carousel?.itemImageUrls || [], translateZValue: resolvedAppConfigs.carousel?.translateZValue || '30vw', contentElement: document.getElementById('carouselContent'), shellElement: document.querySelector('#carouselSection .shell'), currentIndex: 0 };
    const accordionInitialConfig = {data: resolvedAppConfigs.accordion?.data || [], containerElement: document.getElementById('accordionContainerNew'), currentActiveIndex: 0 };
    const drawerCarouselInitialConfig = {data: resolvedAppConfigs.drawerCarousel?.data || [], navContainerElement: document.getElementById('drawerNavList'), contentAreaElement: document.getElementById('drawerContentArea'), currentIndex: 0 };
    const parallaxInitialConfig = {itemsData: resolvedAppConfigs.parallax?.itemsData || [], containerElement: document.getElementById('parallaxSection'), itemContainerElement: document.getElementById('parallaxItemContainer') };
    const musicPlayerConfig = { 
        audioId: 'backgroundMusic', 
        playPauseButtonId: 'playPauseButton',
        songTitleId: 'songTitle',
        progressBarContainerId: 'progressBarContainer',
        progressBarId: 'progressBar',
        nextSongButtonId: 'nextSongButton',
        prevSongButtonId: 'prevSongButton',
        currentTimeDisplayId: 'currentTimeDisplay',
        totalDurationDisplayId: 'totalDurationDisplay',
        playerContainerId: 'musicPlayerContainer',
        songList: resolvedAppConfigs.musicFiles || [] 
    };

        // Fisher-Yates 洗牌算法函数
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // 使用解构赋值交换元素
        }
    }

    // 打乱 songList 的顺序
    shuffleArray(musicPlayerConfig.songList);

    function initializeContentModulesOnce() {
        if (modulesInitialized) return;
        CarouselModule.init(carouselInitialConfig, () => activateContentModule(contentModuleKeys[1], 1), () => activateContentModule(null, -1)); 
        AccordionModule.init(accordionInitialConfig, () => activateContentModule(contentModuleKeys[2], 1), () => activateContentModule(contentModuleKeys[0], -1)); 
        DrawerCarouselModule.init(drawerCarouselInitialConfig, () => activateContentModule(contentModuleKeys[1], -1), () => activateContentModule(contentModuleKeys[3], 1)); 
        ParallaxModule.init(parallaxInitialConfig, 
            () => activateContentModule(contentModuleKeys[2], -1), 
            () => { /* No scroll indicator to update */ }
        );
        MusicPlayerModule.init(musicPlayerConfig);
        if(musicPlayerContainerEl) musicPlayerContainerEl.classList.add('visible');
        modulesInitialized = true;
    }

    if (toggleEditModeButton) {
        toggleEditModeButton.addEventListener('click', () => {
            isEditingMode = !isEditingMode; 

            if (isEditingMode) {
                setIframeState(true); 
                if (mainContentContainer) mainContentContainer.classList.remove('visible');
                document.documentElement.style.overflowY = 'hidden'; 
                document.body.style.overflowY = 'hidden';
                if (currentContentModuleKey && contentModuleElements[currentContentModuleKey]) {
                    contentModuleElements[currentContentModuleKey].classList.remove('active-view');
                    contentModuleElements[currentContentModuleKey].style.display = 'none';
                }
                currentContentModuleKey = null; 
            } else {
                // 首次初始化模块时自动播放音乐
                if (!modulesInitialized) {
                    initializeContentModulesOnce(); 
                    MusicPlayerModule.play(); // 添加这行来自动播放音乐
                } else {
                    initializeContentModulesOnce();
                }
                setIframeState(false); 
                if (mainContentContainer) mainContentContainer.classList.add('visible');
                document.documentElement.style.overflowY = 'hidden'; 
                document.body.style.overflowY = 'hidden';

                if (currentContentModuleKey === null) { 
                    activateContentModule(contentModuleKeys[0], 0);
                } else { 
                    activateContentModule(currentContentModuleKey, 0);
                }
            }
            updateButtonAppearance();
        });
    }

    window.addEventListener('wheel', (event) => {
        if (isEditingMode || globalIsThrottled) { 
            return;
        }
        if (musicPlayerContainerEl && musicPlayerContainerEl.contains(event.target)) {
            return; 
        }
        
        let targetIsContentArea = mainContentContainer.contains(event.target);
        let moduleTookAction = false;

        if (currentContentModuleKey) { 
            switch(currentContentModuleKey) {
                case 'carousel': 
                    if (CarouselModule.handleWheel) moduleTookAction = CarouselModule.handleWheel(event);
                    break;
                case 'accordion':
                     if (AccordionModule.handleWheel) moduleTookAction = AccordionModule.handleWheel(event);
                    break;
                case 'drawerCarousel':
                     if (DrawerCarouselModule.handleWheel) moduleTookAction = DrawerCarouselModule.handleWheel(event);
                    break;
                case 'parallax':
                     if (ParallaxModule.handleWheel) moduleTookAction = ParallaxModule.handleWheel(event);
                     if (!moduleTookAction && targetIsContentArea && contentModuleElements.parallax.contains(event.target)) {
                         // Allow native scroll for parallax content if it didn't navigate
                         // Check if the parallax container itself can scroll
                         const el = contentModuleElements.parallax;
                         const isScrollable = el.scrollHeight > el.clientHeight;
                         const isAtTop = el.scrollTop === 0;
                         const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

                         if (isScrollable && !((event.deltaY < 0 && isAtTop) || (event.deltaY > 0 && isAtBottom))) {
                            // If it's scrollable and not at an edge where navigation might occur, let it scroll.
                            return; 
                         }
                     }
                    break;
            }
        }
            
        if(moduleTookAction) { 
            event.preventDefault(); 
            globalIsThrottled = true;
            setTimeout(() => { globalIsThrottled = false; }, globalThrottleDelay);
        }
    }, { passive: false });

    setIframeState(true); 
    updateButtonAppearance(); 
    if(mainContentContainer) mainContentContainer.classList.remove('visible'); 
    if(musicPlayerContainerEl) musicPlayerContainerEl.classList.remove('visible');
    document.documentElement.style.overflowY = 'hidden'; 
    document.body.style.overflowY = 'hidden'; 

});
