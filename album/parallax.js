// parallax.js
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
            console.error('视差容器或项目容器元素未找到 (parallax.js)!');
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
        const isAtTop = parallaxContainer.scrollTop === 0;
        const isAtBottom = parallaxContainer.scrollTop + parallaxContainer.clientHeight >= parallaxContainer.scrollHeight - 5; 
        
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
            config = {
                itemsData: [],
                containerElement: null, 
                itemContainerElement: null, 
                ...initialConfig
            };
            switchToPrevViewCallback = callbackToPrev;
            switchToNextViewCallback = callbackToNext; 
            setup();
        },
        handleWheel: handleWheel, 
        getContainerElement: function() { return parallaxContainer; } 
    };
})();
