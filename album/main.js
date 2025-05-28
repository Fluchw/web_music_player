// main.js
document.addEventListener('DOMContentLoaded', () => {
    const unifiedGlobalBackgroundImageUrl = 'https://placehold.co/1920x1080/5D5C61/ffffff?text=统一背景图'; 
    const bodyElement = document.body;
    let globalIsThrottled = false;
    const globalThrottleDelay = 350; 

    const entryPage = document.getElementById('entryPage');
    const mainContentContainer = document.getElementById('mainContentContainer');
    const musicPlayerContainer = document.getElementById('musicPlayerContainer');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseButton = document.getElementById('playPauseButton');
    const songTitleElement = document.getElementById('songTitle');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBar = document.getElementById('progressBar');
    const nextSongButton = document.getElementById('nextSongButton');
    const prevSongButton = document.getElementById('prevSongButton'); 
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const totalDurationDisplay = document.getElementById('totalDurationDisplay');
    
    const viewsConfig = [
        { 
            name: 'carousel', 
            module: CarouselModule, 
            sectionId: 'carouselSection',
            enabled: true,
            config: {
                itemImageUrls: ['https://placehold.co/700x450/e74c3c/ffffff?text=作品一', 'https://placehold.co/700x450/3498db/ffffff?text=作品二', 'https://placehold.co/700x450/2ecc71/ffffff?text=作品三'],
                translateZValue: '35vw', 
                contentElement: document.getElementById('carouselContent'),
                shellElement: document.querySelector('#carouselSection .shell'),
                currentIndex: 0
            }
        },
        { 
            name: 'accordion', 
            module: AccordionModule, 
            sectionId: 'accordionSection',
            enabled: true,
            config: { 
                data: [ 
                    { title: "Image", imageUrl: "https://placehold.co/1000x600/a2d2ff/333333?text=Image" }, 
                    { title: "Video", imageUrl: "https://placehold.co/1000x600/bde0fe/333333?text=Video" }, 
                    { title: "Music", imageUrl: "https://placehold.co/1000x600/ffafcc/333333?text=Music" },
                    { title: "Lyric", imageUrl: "https://placehold.co/1000x600/ffc8dd/333333?text=Lyric" } 
                ],
                containerElement: document.getElementById('accordionContainerNew'), 
                currentActiveIndex: 0,
            }
        },
        { 
            name: 'drawerCarousel', 
            module: DrawerCarouselModule, 
            sectionId: 'drawerCarouselSection',
            enabled: true,
            config: { 
                data: [ { navTitle: "风之谷", title: "风之谷的娜乌西卡", quote: "“最深的黑暗...”", imageUrl: "https://placehold.co/700x400/7abcff/333?text=风之谷图", description: "经典之作。" }, { navTitle: "天空之城", title: "天空之城拉普达", quote: "“我们的梦想...”", imageUrl: "https://placehold.co/700x400/81c784/333?text=天空图", description: "充满冒险。" }, { navTitle: "龙猫", title: "龙猫多多洛", quote: "“在我们乡下...”", imageUrl: "https://placehold.co/700x400/ffb74d/333?text=龙猫图", description: "温馨治愈。" }, { navTitle: "千与千寻", title: "千与千寻的神隐", quote: "“人生就是一列...”", imageUrl: "https://placehold.co/700x400/e57373/333?text=千寻图", description: "奇妙经历。" }],
                navContainerElement: document.getElementById('drawerNavList'), 
                contentAreaElement: document.getElementById('drawerContentArea'), 
                currentIndex: 0,
            } 
        },
        { 
            name: 'parallax', 
            module: ParallaxModule, 
            sectionId: 'parallaxSection',
            enabled: true,
            config: { 
                itemsData: [ 
                    { title: "「四月是你的谎言」", desc: "我在盛开的樱花下遇见你，从此命运不再属于自己。", imageUrl: "https://placehold.co/1920x800/a2d2ff/333333?text=视差1" },
                    { title: "「言叶之庭」", desc: "每晚临睡前 每天睁开眼的瞬间 不知不觉 我都在祈盼雨天", imageUrl: "https://placehold.co/1920x800/bde0fe/333333?text=视差2" },
                    { title: "「你的名字」", desc: "黄昏，不是白昼亦不是夜晚，是我努力却看不清你的脸。", imageUrl: "https://placehold.co/1920x800/ffafcc/333333?text=视差3" },
                    { title: "「天气之子」", desc: "天气真的是很不可思议，光只是天空的模样就让人感动不已。", imageUrl: "https://placehold.co/1920x800/ffc8dd/333333?text=视差4" }
                ],
                containerElement: document.getElementById('parallaxSection'),
                itemContainerElement: document.getElementById('parallaxItemContainer')
            }
        }
    ];

    const enabledViews = viewsConfig.filter(view => view.enabled);
    let currentViewIndex = 0; 

    if (unifiedGlobalBackgroundImageUrl) {
        bodyElement.style.backgroundImage = `url('${unifiedGlobalBackgroundImageUrl}')`;
    } else {
        console.warn("Unified background image URL is not set. Using fallback color from CSS.");
    }

    const localMusicFiles = [
        { title: "歌曲一示例", src: "music/song1.mp3" }, 
        { title: "歌曲二演示", src: "music/song2.ogg" },
        { title: "SoundHelix Song 1", src: "music/SoundHelix-Song-1.mp3" } 
    ];
    let currentSongIndex = 0;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    function loadSong(songIndex) {
        if (songIndex >= 0 && songIndex < localMusicFiles.length) {
            const song = localMusicFiles[songIndex];
            backgroundMusic.src = song.src;
            songTitleElement.textContent = song.title;
            backgroundMusic.load(); 
        }
    }
    function playCurrentSong() {
        backgroundMusic.play().catch(error => {
            console.warn("音乐播放失败:", error);
            if(playPauseButton) playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        });
    }

    let hasEntered = false;
    function handleInitialScroll(event) {
        if (hasEntered) return;
        if (event.deltaY > 0) { 
            hasEntered = true;
            if(entryPage) entryPage.classList.add('hidden');
            if(mainContentContainer) mainContentContainer.classList.add('visible');
            if(musicPlayerContainer) musicPlayerContainer.classList.add('visible');
            if (enabledViews.length > 0) activateView(enabledViews[currentViewIndex].name); 
            playCurrentSong();
            window.removeEventListener('wheel', handleInitialScroll); 
        }
    }
    window.addEventListener('wheel', handleInitialScroll, { passive: true }); 

    if (musicPlayerContainer && backgroundMusic && playPauseButton && songTitleElement && progressBarContainer && progressBar && nextSongButton && prevSongButton && currentTimeDisplay && totalDurationDisplay) {
         loadSong(currentSongIndex); 
        playPauseButton.addEventListener('click', () => {
            if (backgroundMusic.paused || backgroundMusic.ended) playCurrentSong();
            else backgroundMusic.pause();
        });
        nextSongButton.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % localMusicFiles.length;
            loadSong(currentSongIndex); playCurrentSong();
        });
        prevSongButton.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + localMusicFiles.length) % localMusicFiles.length;
            loadSong(currentSongIndex); playCurrentSong();
        });
        backgroundMusic.addEventListener('play', () => playPauseButton.innerHTML = '<i class="fas fa-pause"></i>');
        backgroundMusic.addEventListener('pause', () => playPauseButton.innerHTML = '<i class="fas fa-play"></i>');
        backgroundMusic.addEventListener('ended', () => nextSongButton.click());
        backgroundMusic.addEventListener('loadedmetadata', () => totalDurationDisplay.textContent = formatTime(backgroundMusic.duration));
        backgroundMusic.addEventListener('timeupdate', () => {
            if (backgroundMusic.duration) {
                progressBar.style.width = `${(backgroundMusic.currentTime / backgroundMusic.duration) * 100}%`;
                currentTimeDisplay.textContent = formatTime(backgroundMusic.currentTime);
            } else {
                progressBar.style.width = `0%`; currentTimeDisplay.textContent = "0:00";
            }
        });
        progressBarContainer.addEventListener('click', (e) => {
            if (backgroundMusic.duration) {
                const r = progressBarContainer.getBoundingClientRect();
                backgroundMusic.currentTime = backgroundMusic.duration * ((e.clientX - r.left) / r.width);
            }
        });
    } else { console.error("音乐播放器的某些元素未找到!"); }
    
    if (musicPlayerContainer) {
        let isDragging = false, dOX, dOY;
        musicPlayerContainer.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || e.target.closest('.progress-bar-container')) return;
            isDragging = true; dOX = e.clientX - musicPlayerContainer.getBoundingClientRect().left;
            dOY = e.clientY - musicPlayerContainer.getBoundingClientRect().top;
            musicPlayerContainer.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return; e.preventDefault(); 
            let nL = e.clientX - dOX, nT = e.clientY - dOY;
            const bW = document.documentElement.clientWidth, bH = document.documentElement.clientHeight;
            const pW = musicPlayerContainer.offsetWidth, pH = musicPlayerContainer.offsetHeight;
            nL = Math.max(0, Math.min(nL, bW - pW)); nT = Math.max(0, Math.min(nT, bH - pH));
            musicPlayerContainer.style.left = nL + 'px'; musicPlayerContainer.style.top = nT + 'px';
            musicPlayerContainer.style.right = 'auto'; musicPlayerContainer.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) { isDragging = false; musicPlayerContainer.style.cursor = 'grab';}
        });
    }

    function activateView(viewName) {
        const viewToActivate = enabledViews.find(v => v.name === viewName);
        if (!viewToActivate) {
            console.error(`View with name "${viewName}" not found or not enabled.`);
            return;
        }
        currentViewIndex = enabledViews.indexOf(viewToActivate);

        enabledViews.forEach(view => {
            const sectionElement = document.getElementById(view.sectionId);
            if (sectionElement) {
                if (view.name === viewName) {
                    sectionElement.classList.add('active-view');
                } else {
                    sectionElement.classList.remove('active-view');
                }
            }
        });
    }

    function navigateToNextView() {
        const nextIndex = (currentViewIndex + 1) % enabledViews.length;
        activateView(enabledViews[nextIndex].name);
    }

    function navigateToPrevView() {
        const prevIndex = (currentViewIndex - 1 + enabledViews.length) % enabledViews.length;
        activateView(enabledViews[prevIndex].name);
    }

    // 初始化模块
    enabledViews.forEach(viewConf => {
        if (viewConf.module && typeof viewConf.module.init === 'function') {
            // 根据模块的需要传递回调
            if (viewConf.name === 'carousel') {
                viewConf.module.init(viewConf.config, navigateToNextView);
            } else if (viewConf.name === 'accordion') {
                viewConf.module.init(viewConf.config, navigateToNextView, navigateToPrevView);
            } else if (viewConf.name === 'drawerCarousel') {
                viewConf.module.init(viewConf.config, navigateToPrevView, navigateToNextView);
            } else if (viewConf.name === 'parallax') {
                 viewConf.module.init(viewConf.config, navigateToPrevView, navigateToNextView); // Parallax现在也需要switchToNext
            }
        } else {
            console.error(`Module for view "${viewConf.name}" is not defined or has no init method.`);
        }
    });
    
    // 全局滚轮事件监听
    window.addEventListener('wheel', (event) => {
        if (!mainContentContainer.classList.contains('visible') || globalIsThrottled || hasEntered === false) return; 
        
        const currentActiveViewConfig = enabledViews[currentViewIndex];
        let viewSwitchedByModule = false;

        if (currentActiveViewConfig && currentActiveViewConfig.module && currentActiveViewConfig.module.handleWheel) {
            viewSwitchedByModule = currentActiveViewConfig.module.handleWheel(event);
        }
        
        if (viewSwitchedByModule) { 
            event.preventDefault();
            globalIsThrottled = true;
            setTimeout(() => { globalIsThrottled = false; }, globalThrottleDelay);
        } else if (currentActiveViewConfig.name === 'parallax' && !viewSwitchedByModule) {
            // 允许视差内部的默认滚动，不节流
            globalIsThrottled = false; 
        } else if (currentActiveViewConfig.name !== 'parallax' && !viewSwitchedByModule){
            // 对于非视差视图，如果模块未处理切换（例如在边界但没有回调），则阻止默认并节流
            event.preventDefault();
            globalIsThrottled = true;
            setTimeout(() => { globalIsThrottled = false; }, globalThrottleDelay);
        }
    }, { passive: false }); 

    if (enabledViews.length > 0) {
        activateView(enabledViews[0].name);
    } else {
        console.error("No views are enabled in viewsConfig.");
        if(mainContentContainer) mainContentContainer.innerHTML = "<p style='color:white; text-align:center;'>没有可显示的视图</p>";
    }
});
