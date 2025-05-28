// --- CarouselModule ---
const CarouselModule = (function() {
    let config = {};
    let switchToNextViewCallback = null;
    let switchToPrevViewCallback = null; // Added

    function setup() {
        console.log("CarouselModule: setup started. Config:", JSON.parse(JSON.stringify(config))); // Log a copy
        if (!config.contentElement || !config.shellElement) {
            console.error("CarouselModule: Content or Shell element not found!", config.contentElement, config.shellElement);
            if (config.contentElement) config.contentElement.innerHTML = '<p style="color:white; text-align:center;">旋转木马容器配置错误</p>';
            return;
        }
        if (!config.itemImageUrls || config.itemImageUrls.length === 0) {
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
        console.log("CarouselModule: setup finished. Items created:", config.items.length);
        updateTransform();
    }

    function updateTransform() {
        if (!config.contentElement) {
            console.warn("CarouselModule: updateTransform called but contentElement is null.");
            return;
        }
        const rotationY = -config.currentIndex * config.angleIncrement;
        config.contentElement.style.transform = `translateZ(-${config.translateZValue}) rotateY(${rotationY}deg)`;
        // console.log("CarouselModule: Transform updated to:", config.contentElement.style.transform);
    }

    function handleWheel(event) {
        if (!config.itemImageUrls || config.itemImageUrls.length === 0) return true; // No items, consume event

        let nextIndex = config.currentIndex;
        if (event.deltaY > 0) { // Scrolling down
            if (config.currentIndex < config.itemImageUrls.length - 1) {
                nextIndex++;
            } else {
                if (typeof switchToNextViewCallback === 'function') switchToNextViewCallback();
                return true;
            }
        } else if (event.deltaY < 0) { // Scrolling up
            if (config.currentIndex > 0) {
                nextIndex--;
            } else {
                if (typeof switchToPrevViewCallback === 'function') switchToPrevViewCallback();
                return true;
            }
        }

        if (nextIndex !== config.currentIndex) {
            config.currentIndex = nextIndex;
            updateTransform();
        }
        return true;
    }

    return {
        init: function(initialConfig, callbackToNext, callbackToPrev) {
            console.log("CarouselModule: init called.");
            config = { itemImageUrls: [], translateZValue: '35vw', contentElement: null, shellElement: null, items: [], currentIndex: 0, angleIncrement: 0, ...initialConfig };
            switchToNextViewCallback = callbackToNext;
            switchToPrevViewCallback = callbackToPrev;
             // Defer setup slightly to ensure DOM elements are definitely there if selectors are passed as strings
            // However, if elements are passed directly, this isn't strictly needed.
            // For safety, if elements might not be ready:
            // setTimeout(() => {
            //    if (config.contentElement && config.shellElement) {
            //        setup();
            //    } else {
            //        console.error("CarouselModule init deferred: contentElement or shellElement is missing.");
            //    }
            // }, 0);
            // Direct setup if elements are guaranteed:
            if (config.contentElement && config.shellElement) {
                 setup();
            } else {
                console.error("CarouselModule init: contentElement or shellElement is missing in initialConfig.");
                 if(initialConfig.contentElement) initialConfig.contentElement.innerHTML = '<p style="color:white; text-align:center;">旋转木马组件初始化失败</p>';
            }
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; }
    };
})();

// --- AccordionModule (No changes from previous version needed for these bugs) ---
const AccordionModule = (function() {
    let config = {};
    let switchToNextViewCallback = null;
    let switchToPrevViewCallback = null;
    function setActivePanel(index) {
        if (index < 0 || index >= config.panels.length || !config.panels[index]) return;
        config.panels.forEach(p => p.classList.remove('active'));
        config.panels[index].classList.add('active');
        config.currentActiveIndex = index;
    }
    function setup() {
        if (!config.containerElement) { return; }
        config.panels = [];
        config.containerElement.innerHTML = '';
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
        if (config.panels.length > 0) setActivePanel(config.currentActiveIndex || 0);
    }
    function handleWheel(event) {
        if (!config.data || config.data.length === 0) return true;
        let nextIndex = config.currentActiveIndex;
        if (event.deltaY > 0) {
            if (config.currentActiveIndex < config.data.length - 1) {
                nextIndex++;
            } else {
                if (typeof switchToNextViewCallback === 'function') switchToNextViewCallback();
                return true;
            }
        } else if (event.deltaY < 0) {
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

// --- DrawerCarouselModule (No changes from previous version needed for these bugs) ---
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
             // config.contentAreaElement.style.backgroundColor = '#333'; // Example default
        }
        config.currentIndex = index;
    }

    function setup() {
        if (!config.navContainerElement || !config.contentAreaElement || !config.data) {
            console.error("DrawerCarouselModule: Missing required config elements (navContainer, contentArea, or data).");
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
            // REMOVED IMG TAG FROM HERE
            contentItem.innerHTML = `<h2>${dataItem.title}</h2>
                                     ${dataItem.quote ? `<p class="quote">${dataItem.quote}</p>` : ''}
                                     ${dataItem.description ? `<p>${dataItem.description}</p>` : ''}`;
            config.contentAreaElement.appendChild(contentItem); // Append text container to contentArea
            contentItems.push(contentItem);
        });

        if (config.data.length > 0) {
            setActiveDrawerItem(config.currentIndex || 0);
        } else {
             // Handle empty data case - clear background
             config.contentAreaElement.style.backgroundImage = 'none';
             // config.contentAreaElement.style.backgroundColor = '#2c3e50'; // or a default color
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
            config.switchToNextViewCallback = callbackToNext;
            setup();
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; }
    };
})();

// --- ParallaxModule (No changes from previous version needed for these bugs) ---
const ParallaxModule = (function() {
    let config = {};
    let switchToPrevViewCallback = null;
    let switchToNextViewCallback = null;
    let parallaxBlocks = [];
    let parallaxContainer = null;
    let parallaxScrollListener = null;

    function setup() {
        parallaxContainer = config.containerElement;
        if (!parallaxContainer || !config.itemContainerElement) {
            console.error('视差容器或项目容器元素未找到!');
            return;
        }
        config.itemContainerElement.innerHTML = '';
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
            parallaxBlocks.push(block);
        });

        if (parallaxScrollListener && parallaxContainer) {
            parallaxContainer.removeEventListener('scroll', parallaxScrollListener);
        }
        parallaxScrollListener = handleParallaxEffectScroll;
        if (parallaxContainer) {
            parallaxContainer.addEventListener('scroll', parallaxScrollListener);
            handleParallaxEffectScroll();
        }
    }
    function handleParallaxEffectScroll() {
        if (!parallaxContainer || parallaxBlocks.length === 0) return;
        const scrollTop = parallaxContainer.scrollTop;
        const containerHeight = parallaxContainer.clientHeight;

        parallaxBlocks.forEach(el => {
            const parentSectionItem = el.parentElement;
            const itemRect = parentSectionItem.getBoundingClientRect();
            const containerRect = parallaxContainer.getBoundingClientRect();
            const itemTopRelativeToContainer = itemRect.top - containerRect.top;

            if (itemRect.bottom > containerRect.top && itemRect.top < containerRect.bottom) {
                const elementMidPointInContainer = itemTopRelativeToContainer + parentSectionItem.offsetHeight / 2;
                const containerMidPoint = containerHeight / 2;
                const difference = elementMidPointInContainer - containerMidPoint;
                const parallaxFactor = 0.2;
                const yOffset = -difference * parallaxFactor;
                el.style.backgroundPosition = `center ${yOffset}px`;
            }
        });
    }
    function handleWheel(event) {
        if (!parallaxContainer) return false;

        const isAtTop = parallaxContainer.scrollTop <= 0;
        const scrollableHeight = parallaxContainer.scrollHeight - parallaxContainer.clientHeight;
        const isAtBottom = scrollableHeight <= 5 || parallaxContainer.scrollTop >= scrollableHeight - 5;

        if (event.deltaY < 0 && isAtTop) {
            if (typeof switchToPrevViewCallback === 'function') {
                switchToPrevViewCallback();
                return true;
            }
        } else if (event.deltaY > 0 && isAtBottom) {
            if (typeof switchToNextViewCallback === 'function') {
                switchToNextViewCallback();
                return true;
            }
        }
        return false;
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
        resetScroll: function() {
            if (parallaxContainer) {
                parallaxContainer.scrollTop = 0;
                handleParallaxEffectScroll();
            }
        }
    };
})();

// --- MusicPlayerModule ---
const MusicPlayerModule = (function() {
    let audio, playPauseBtn, titleEl, progressBarContainerEl, progressBarEl, nextBtn, prevBtn, currentTimeEl, totalDurationEl, playerContainerEl;
    let songs = [];
    let currentSongIdx = 0;
    let isPlaying = false; // Track playback state internally
    let isDragging = false, dragOffsetX, dragOffsetY;


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
            titleEl.title = song.title;
            audio.load();
            currentSongIdx = songIndex;
            isPlaying = false; // Reset playback state until play is confirmed
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';


            if (autoPlayAfterLoad) {
                // Autoplay is tricky. Listen for 'canplaythrough' or 'canplay'
                const canPlayListener = () => {
                    console.log("MusicPlayer: Audio ready for song:", songs[currentSongIdx].title);
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
             console.warn("MusicPlayer: No audio source. Loading song index", currentSongIdx, "and will attempt play.");
             loadSong(currentSongIdx, true); // Load and set flag to play after load
             return;
        }
        if (audio.src) { // Only play if there's a source
            console.log("MusicPlayer: Attempting to play", audio.src);
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    console.log("MusicPlayer: Playback started successfully for", audio.src);
                    isPlaying = true;
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(error => {
                    console.error("MusicPlayer: Playback failed for", audio.src, ":", error);
                    isPlaying = false;
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    // This is often due to browser autoplay policies.
                    // User interaction (like a click) is usually required to start audio.
                });
            }
        } else {
            console.warn("MusicPlayer: playCurrentSong called but no audio src and no songs to load.");
        }
    }


    function handlePlayPause() {
        if (isPlaying) {
            audio.pause();
            // isPlaying = false; // audio 'pause' event will handle this
            // playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            if (!audio.src && songs.length > 0) {
                 loadSong(currentSongIdx, true); // Load and attempt to play
            } else if (audio.src) {
                 playCurrentSong();
            } else {
                console.warn("MusicPlayer: Play/Pause clicked, but no song loaded and no songs in list.");
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
            currentTimeEl.textContent = "0:00";
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
            if (e.target.closest('button') || e.target.closest('.progress-bar-container')) return;
            isDragging = true;
            const rect = playerContainerEl.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            playerContainerEl.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            let newLeft = e.clientX - dragOffsetX;
            let newTop = e.clientY - dragOffsetY;
            const bodyWidth = document.documentElement.clientWidth;
            const bodyHeight = document.documentElement.clientHeight;
            const playerWidth = playerContainerEl.offsetWidth;
            const playerHeight = playerContainerEl.offsetHeight;
            newLeft = Math.max(0, Math.min(newLeft, bodyWidth - playerWidth));
            newTop = Math.max(0, Math.min(newTop, bodyHeight - playerHeight));
            playerContainerEl.style.left = newLeft + 'px';
            playerContainerEl.style.top = newTop + 'px';
            playerContainerEl.style.right = 'auto';
            playerContainerEl.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                playerContainerEl.style.cursor = 'grab';
                document.body.style.userSelect = '';
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
                console.error("One or more music player elements not found!");
                return;
            }

            if (songs.length > 0) {
                loadSong(currentSongIdx, false); // Load first song, but don't autoplay yet
            } else {
                console.warn("MusicPlayer: No songs in the playlist.");
                titleEl.textContent = "播放列表为空";
            }


            playPauseBtn.addEventListener('click', handlePlayPause);
            nextBtn.addEventListener('click', handleNextSong);
            prevBtn.addEventListener('click', handlePrevSong);

            audio.addEventListener('play', () => {
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                console.log("MusicPlayer: Event 'play' fired.");
            });
            audio.addEventListener('pause', () => {
                isPlaying = false;
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                console.log("MusicPlayer: Event 'pause' fired.");
            });
            audio.addEventListener('ended', handleNextSong);
            audio.addEventListener('loadedmetadata', () => {
                if(audio.duration && !isNaN(audio.duration)) {
                    totalDurationEl.textContent = formatTime(audio.duration);
                } else {
                    totalDurationEl.textContent = "0:00";
                }
            });
            audio.addEventListener('timeupdate', updateProgressBar);
            progressBarContainerEl.addEventListener('click', handleProgressBarClick);
            makeDraggable();
        },
        play: playCurrentSong, // Expose this method
        pause: () => audio.pause(),
        show: () => playerContainerEl && playerContainerEl.classList.add('visible'),
        hide: () => playerContainerEl && playerContainerEl.classList.remove('visible'),
    };
})();

// --- EntryPageModule ---
const EntryPageModule = (function() {
    let entryPageEl, mainContentEl;
    let onEnterCallback = null;
    let hasEntered = false;

    function handleInitialScroll(event) {
        if (hasEntered) return;
        if (event.deltaY > 0) {
            hasEntered = true;
            if(entryPageEl) entryPageEl.classList.add('hidden');
            if(mainContentEl) mainContentEl.classList.add('visible');
            if (typeof onEnterCallback === 'function') {
                onEnterCallback();
            }
            window.removeEventListener('wheel', handleInitialScroll);
        }
    }
    return {
        init: function(config, callback) {
            entryPageEl = document.getElementById(config.entryPageId);
            mainContentEl = document.getElementById(config.mainContentContainerId);
            onEnterCallback = callback;
            if (!entryPageEl || !mainContentEl) {
                console.error("Entry page or main content element not found!");
                return;
            }
            window.addEventListener('wheel', handleInitialScroll, { passive: true });
        },
        hasEntered: () => hasEntered
    };
})();

// --- AppController (Main Logic) ---
document.addEventListener('DOMContentLoaded', () => {
    const unifiedGlobalBackgroundImageUrl = 'https://source.unsplash.com/random/1920x1080/?dark,abstract';
    const bodyElement = document.body;

    // 应用全局背景图和入口页面文字
    if (typeof APP_CONFIGS !== 'undefined') {
        if (APP_CONFIGS.globalBackgroundImageUrl) {
            bodyElement.style.backgroundImage = `url('${APP_CONFIGS.globalBackgroundImageUrl}')`;
        }

        const entryPageTitleEl = document.querySelector('#entryPage h1');
        const entryPageSubtitleEl = document.querySelector('#entryPage p');
        if (APP_CONFIGS.entryPage) {
            if (entryPageTitleEl && APP_CONFIGS.entryPage.title) {
                entryPageTitleEl.textContent = APP_CONFIGS.entryPage.title;
            }
            if (entryPageSubtitleEl && APP_CONFIGS.entryPage.subtitle) {
                entryPageSubtitleEl.textContent = APP_CONFIGS.entryPage.subtitle;
            }
        }
    } else {
        console.error("APP_CONFIGS is not defined. Make sure config.js is loaded correctly and before script.js.");
        // Fallback texts for entry page if config is missing
        const entryPageTitleEl = document.querySelector('#entryPage h1');
        const entryPageSubtitleEl = document.querySelector('#entryPage p');
        if(entryPageTitleEl) entryPageTitleEl.textContent = "探索之旅";
        if(entryPageSubtitleEl) entryPageSubtitleEl.textContent = "向下滑动开始";
    }


    let currentViewName = 'carousel';
    const viewOrder = ['carousel', 'accordion', 'drawerCarousel', 'parallax'];
    let globalIsThrottled = false;
    const globalThrottleDelay = 450;

    const viewElements = {
        carousel: document.getElementById('carouselSection'),
        accordion: document.getElementById('accordionSection'),
        drawerCarousel: document.getElementById('drawerCarouselSection'),
        parallax: document.getElementById('parallaxSection')
    };

    // --- Configurations (now referencing APP_CONFIGS) ---
    // 确保 APP_CONFIGS 已加载，否则提供默认空值以避免后续代码出错
    const resolvedAppConfigs = (typeof APP_CONFIGS !== 'undefined') ? APP_CONFIGS : {
        musicFiles: [],
        carousel: { itemImageUrls: [], translateZValue: '25vw' },
        accordion: { data: [] },
        drawerCarousel: { data: [] },
        parallax: { itemsData: [] }
    };


    const carouselInitialConfig = {
        itemImageUrls: resolvedAppConfigs.carousel.itemImageUrls,
        translateZValue: resolvedAppConfigs.carousel.translateZValue,
        contentElement: document.getElementById('carouselContent'),
        shellElement: document.querySelector('#carouselSection .shell'),
        currentIndex: 0
    };
    const accordionInitialConfig = {
        data: resolvedAppConfigs.accordion.data,
        containerElement: document.getElementById('accordionContainerNew'),
        currentActiveIndex: 0,
    };
    const drawerCarouselInitialConfig = {
        data: resolvedAppConfigs.drawerCarousel.data,
        navContainerElement: document.getElementById('drawerNavList'),
        contentAreaElement: document.getElementById('drawerContentArea'),
        currentIndex: 0,
    };
    const parallaxInitialConfig = {
        itemsData: resolvedAppConfigs.parallax.itemsData,
        containerElement: document.getElementById('parallaxSection'),
        itemContainerElement: document.getElementById('parallaxItemContainer')
    };
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
        songList: resolvedAppConfigs.musicFiles // 使用配置中的音乐列表
    };
    const entryPageConfig = { // 这个配置主要用于 EntryPageModule 的 DOM 元素ID
        entryPageId: 'entryPage',
        mainContentContainerId: 'mainContentContainer'
    };

    // --- Helper Functions (switchToView, navigateView) and Initializations ---
    // (这些函数和模块初始化代码保持不变，它们现在会使用从 resolvedAppConfigs 中获取数据的 InitialConfig 对象)

    // ... (switchToView, navigateView 函数) ...
    function switchToView(viewName) {
        if (!viewElements[viewName] || (currentViewName === viewName && viewElements[viewName].classList.contains('active-view'))) {
            return;
        }
        // console.log(`AppController: Switching from ${currentViewName} to ${viewName}`);
        if(viewElements[currentViewName]) {
            viewElements[currentViewName].classList.remove('active-view');
        }
        currentViewName = viewName;
        viewElements[currentViewName].classList.add('active-view');
        if (viewName === 'parallax' && ParallaxModule.resetScroll) {
            ParallaxModule.resetScroll();
        }
    }

    function navigateView(direction) {
        const currentIndex = viewOrder.indexOf(currentViewName);
        const totalViews = viewOrder.length;
        // console.log(`AppController: navigateView called. Current: ${currentViewName} (index ${currentIndex}), Direction: ${direction}`);

        if (direction === 1) { // Trying to go Next
            if (currentIndex < totalViews - 1) {
                switchToView(viewOrder[currentIndex + 1]);
            } else {
                console.log("AppController: Already at the last view. Cannot go next.");
            }
        } else if (direction === -1) { // Trying to go Previous
            if (currentIndex > 0) {
                switchToView(viewOrder[currentIndex - 1]);
            } else {
                console.log("AppController: Already at the first view. Cannot go previous.");
            }
        }
    }


    MusicPlayerModule.init(musicPlayerConfig);

    EntryPageModule.init(entryPageConfig, () => {
        MusicPlayerModule.show();
        console.log("AppController: Entry page passed, attempting to play music via MusicPlayerModule.play().");
        MusicPlayerModule.play();
        switchToView(currentViewName);
    });

    // Initialize content modules
    if (CarouselModule && CarouselModule.init) {
        CarouselModule.init(carouselInitialConfig, () => navigateView(1), () => navigateView(-1));
    }
    if (AccordionModule && AccordionModule.init) {
        AccordionModule.init(accordionInitialConfig, () => navigateView(1), () => navigateView(-1));
    }
    if (DrawerCarouselModule && DrawerCarouselModule.init) {
        DrawerCarouselModule.init(drawerCarouselInitialConfig, () => navigateView(-1), () => navigateView(1));
    }
    if (ParallaxModule && ParallaxModule.init) {
        ParallaxModule.init(parallaxInitialConfig, () => navigateView(-1), () => navigateView(1));
    }

    // ... (Global Wheel Event Listener - 保持不变) ...
    window.addEventListener('wheel', (event) => {
        if (!EntryPageModule.hasEntered() || globalIsThrottled) {
            return;
        }
        if (document.getElementById('musicPlayerContainer') && document.getElementById('musicPlayerContainer').contains(event.target)) {
            return;
        }

        let eventHandledByModule = false;
        switch (currentViewName) {
            case 'carousel': if (CarouselModule.handleWheel) eventHandledByModule = CarouselModule.handleWheel(event); break;
            case 'accordion': if (AccordionModule.handleWheel) eventHandledByModule = AccordionModule.handleWheel(event); break;
            case 'drawerCarousel': if (DrawerCarouselModule.handleWheel) eventHandledByModule = DrawerCarouselModule.handleWheel(event); break;
            case 'parallax': if (ParallaxModule.handleWheel) eventHandledByModule = ParallaxModule.handleWheel(event); break;
        }
        if (eventHandledByModule) {
            event.preventDefault();
            globalIsThrottled = true;
            setTimeout(() => { globalIsThrottled = false; }, globalThrottleDelay);
        }
    }, { passive: false });
});