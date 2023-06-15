
import Song from './Song.js'
import SongListItemUI from './SongList_UI.js';

export default class SongManager {
    constructor(songs) {
        this.allSongs = songs; 
        this.filteredByTagsSongs = songs; // Using it to prevent additional computations. (don't need to go over the entire DB when adding constraint)

        this.isBpmFilterActive = true;
        this.bpmRange = [60, 140]; // Default BPM range

        this.isBpmFilterActive=true;
        this.keyRange = ["3A", "4A", "5A", "4B"]


        this.activeTags = []; // Active tags
        this.listOfSongs_UI = document.getElementById('songs');//'#song-list'
        this.listOfSongs_UI.addEventListener('click', (event) => this.handleListClick(event));

        this.createFilterSortingSwitch();
    //    this.createBpmKeySwitch();
    }

    // changeSonglistContainerSizeInRem(newSize){
    //     this.listOfSongs_UI.style.height='${newSize}rem'


    createSummaryObject(containerId, idOfTextField, svgImagePath, imageDivPath, activeIndicatorId) {
        // create the div container
        let container = document.createElement('div');
        container.id = containerId;
        container.style.display = 'flex';
        container.style.position = 'relative'; // Container needs to be relative for absolute child positioning.
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between'; // Spread out the elements in the container
        container.style.flex = '1'; // This will spread out the child elements equally
    
        // create the image
        let image = document.createElement('img');
        image.src = svgImagePath;
        image.style.width = '2rem';
        image.style.height = '2rem';
        image.style.position = 'absolute'; // Image is positioned absolutely to the container
        image.style.left = '1.2rem'; // You may need to adjust this value
        image.style.bottom = '20%'; // You may need to adjust this value
        image.style.zIndex = '10';
    
        // create the text field
        let textField = document.createElement('p');
        textField.id = idOfTextField;
        textField.style.textAlign = 'center'; // center the text in the text field
    
        // create the div for the image
        let imageDiv = document.createElement('div');
        imageDiv.id = imageDivPath;
        imageDiv.appendChild(image);  // Append image to imageDiv
    
        // Create the active indicator
        let activeIndicator = document.createElement('div');
        activeIndicator.id = activeIndicatorId;
        activeIndicator.classList.add('active-indicator');
        imageDiv.appendChild(activeIndicator);
                   
        // append the elements to the container
        container.appendChild(imageDiv);
        container.appendChild(textField);
    
        return container;
    }
    
    // }
    createFilterSortingSwitch(){
        // Get the switch container
        this.filterSortingSwitchContainer = document.getElementById("filter-sorting-switch-container");
        this.filterSortingSwitchContainer.style.textAlign = 'center'; // or any other styles you want

        // Create summary objects similar to AdvancedFilters
        this.songCountSummaryObject = this.createSummaryObject('song-count-container',
                                                                'song-count-display',
                                                                'images/colored/tags.svg', 
                                                                'song-count-image-div',
                                                                'song-count-active-indicator');
        
        this.sortingCriteriaSummaryObject = this.createSummaryObject('sorting-criteria-container',
                                                                    'sorting-criteria-display',
                                                                    'images/sort.svg',
                                                                    'sorting-criteria-image-div',
                                                                    'sorting-criteria-active-indicator');
        // Append the new objects
        this.filterSortingSwitchContainer.appendChild(this.songCountSummaryObject);
        this.filterSortingSwitchContainer.appendChild(this.sortingCriteriaSummaryObject);

        // Highlight
        this.highlight = document.createElement('div');
        this.highlight.classList.add('highlight');
        this.highlight.style.transform = 'translateX(102%)';

        // Append highlight to the filterSortingSwitchContainer
        this.filterSortingSwitchContainer.appendChild(this.highlight);  
        
        // Default state
        this.state = 'song-count'; // Either 'song-count' or 'sorting-criteria'

        this.filterSortingSwitchContainer.addEventListener('click', () => {
            this.state = this.state === 'song-count' ? 'sorting-criteria' : 'song-count';
            this.updateParagraphStyles();
        });
    
        // add click listener to rotate and increase size temporarily
        this.songCountSummaryObject.querySelector('p').addEventListener('click', () => {
            this.songCountSummaryObject.querySelector('p').classList.add('clicked');
            setTimeout(() => {
                this.songCountSummaryObject.querySelector('p').classList.remove('clicked');
            }, 200); // Remove the 'clicked' class after 1 second
        });  
       
        this.twoDSelector = document.getElementById('2dSelector'); // style.display - 'block' or 'none'
        this.tagCatalogElement = document.getElementById('tag-catalog'); // style.display - 'block' or 'none'
        // Update the event listener for addTagButton
        this.filterSortingSwitchContainer.addEventListener('click', () => {
            // If its closed now
            if (this.twoDSelector.style.display === 'none') {
                this.tagCatalogElement.style.display = 'none';
                this.twoDSelector.style.display = 'block';
            } else {
                this.tagCatalogElement.style.display = 'block';
                this.twoDSelector.style.display = 'none';
            }
        });
        
        this.songTextInSummaryObject = document.getElementById("song-count-display");
        this.sortTextInSummaryObject = document.getElementById("sorting-criteria-display");
        let tagImageDiv = document.getElementById('song-count-image-div');
        this.tagImage = tagImageDiv.querySelector('img');
        // Placing in the UI to container
        // const container = document.querySelector('.container');
        // container.insertBefore(this.filterSortingSwitchContainer, container.childNodes[2]); // inserting after song-list
    }

    updateParagraphStyles() {
        requestAnimationFrame(() => {
            if (this.state === 'song-count') {
                this.sortTextInSummaryObject.style.color = '#E6E6EA';
                this.sortTextInSummaryObject.style.fontWeight = '600';
                this.songTextInSummaryObject.style.color = '#CDCDD6';
                this.songTextInSummaryObject.style.fontWeight = '200';
                // highlight
                this.highlight.style.transform = 'translateX(102%)';

            } else {
                this.songTextInSummaryObject.style.color = '#E6E6EA';
                this.songTextInSummaryObject.style.fontWeight = '600';
                this.sortTextInSummaryObject.style.color = '#CDCDD6';
                this.sortTextInSummaryObject.style.fontWeight = '300';

                //highlight
                this.highlight.style.transform = 'translateX(-2%)';

            }
        });
    }
    

    // __________________________________ BPM __________________________________
    // Set the BPM range and update the song list
    

    setBpmRange(bpmRange) {
        // Activate / deactivate the filter

        if (typeof bpmRange === 'boolean') {
            this.isBpmFilterActive = false
        }
        else{
            // It's a number, and we want to filter according to it. 
            this.isBpmFilterActive = true
            //and update it obviously
            this.bpmRange = bpmRange;
        }
        this.updateSongList();
    }


    setKeyRange(keyRange) {
        // Activate / deactivate the fi
        if (typeof keyRange === 'boolean') {
            this.isKeyFilterActive = false
        }
        // It's a number, and we want to filter according to it. 
        else{
            this.isKeyFilterActive = true
            //and update it obviously
            this.keyRange = keyRange;
        }
        this.updateSongList();
    }

    applyTagsFilterToSongs(filterUsSongs){
        this.filteredByTagsSongs = filterUsSongs.filter(song => this.activeTags.every(tag => song.hasTag(tag)));
        return this.filteredByTagsSongs
    }

    // Get songs within the BPM range
    getSongsWithinBpmRange(applyBpmFilterToUs) {
        return applyBpmFilterToUs.filter(song => song.isInBpmRange(this.bpmRange));
    }

    getSongsWithinKeyRange(filterUsSongs) {
        return filterUsSongs.filter(song => this.keyRange.includes(song.key));
    }

    // __________________________________ Tags __________________________________ Start
    // Set active tags
    updateActiveTags(tags) {
        //if we added constraint (tag), we can just filter more deeply into the current collection
        if (this.activeTags.length < tags.length){
            this.applyTagsFilterToSongs(this.filteredByTagsSongs)

        }
        else{
            // if removed a tag (constraint), we need to refetch, 
            this.applyTagsFilterToSongs(this.allSongs)
            
        }
        /////////// UI Update
        if (tags.length < 1){         
            this.tagImage.src = 'images/tags.svg'; // 'images/colored/tags.svg', 
        }
        else{
            this.tagImage.src = 'images/colored/tags.svg'; // 'images/colored/tags.svg', 

        }

        this.activeTags = tags;
        this.updateSongList();
        
        // and if we added, we can just filter more deeply into the current collection
    }


    // __________________________________ Tags __________________________________ END


    // Update the song list based on the current BPM range
    updateSongList(energy = 4, popularity = 8) {
        /* NOTE THAT THE DEFAULT canvas drawing of Energy=4 and Popularity=8 Are in GraphManager2D.initializeDefaultSelection*/
        // Clear the existing song list
        while (this.listOfSongs_UI.firstChild) {
            this.listOfSongs_UI.removeChild(this.listOfSongs_UI.firstChild);
        }

        let newSongList = this.applyTagsFilterToSongs(this.filteredByTagsSongs);

        if (this.isBpmFilterActive)
            newSongList = this.getSongsWithinBpmRange(newSongList); //BPM Filter
        
        if (this.isKeyFilterActive)
            newSongList = this.getSongsWithinKeyRange(newSongList); // Key Filter

        // _________________________________ TEXT REPLACE __________________________________ START
        // this.songTextInSummaryObject.innerText = `${newSongList.length} results`;
        // this.sortTextInSummaryObject.innerText= `⚡️ ${Math.round(energy)}, 💡 ${Math.round(popularity)}`;
        this.songTextInSummaryObject.innerText = `${newSongList.length} results`;

        // Create images for icons
        let energyImage = document.createElement('img');
        energyImage.src = 'images/energy.svg';
        energyImage.style.width = '1.1rem';
        energyImage.style.height = '1.1rem';
        energyImage.style.transform = 'translateY(0.1rem)';
        energyImage.style.marginRight = '0.1rem';  // add right margin to create space after the image

        let popularityImage = document.createElement('img');
        popularityImage.src = 'images/popularity.svg';
        popularityImage.style.width = '1.2rem';
        popularityImage.style.height = '1.2rem';
        popularityImage.style.transform = 'translateY(0.3rem)';
        popularityImage.style.marginRight = '0.3rem';  // add right margin to create space after the image

        // Create spans for energy and popularity
        let energySpan = document.createElement('span');
        energySpan.innerText = `${Math.round(energy)}`;
        energySpan.style.fontSize = '1.1rem';  // set the font size
        energySpan.style.marginRight = '1.3rem';  // add right margin to create space after the text

        // Create spans for energy and popularity
        let seperator = document.createElement('span');
        seperator.innerText = `|`;
        seperator.style.fontSize = '1.1rem';  // set the font size
        seperator.style.fontWeight = '200'
        seperator.style.marginRight = '1.3rem';  // add right margin to create space after the text

        let popularitySpan = document.createElement('span');
        popularitySpan.innerText = `${Math.round(popularity)}`;
        popularitySpan.style.fontSize = '1.1rem';  // set the font size

        // Clear existing sortTextInSummaryObject and Append images and spans to sortTextInSummaryObject
        this.sortTextInSummaryObject.innerHTML = ""; // clear existing content
        this.sortTextInSummaryObject.appendChild(energyImage);
        this.sortTextInSummaryObject.appendChild(energySpan);
        this.sortTextInSummaryObject.appendChild(seperator);
        this.sortTextInSummaryObject.appendChild(popularityImage);
        this.sortTextInSummaryObject.appendChild(popularitySpan);


        // _________________________________ TEXT REPLACE __________________________________ END
        // Sort songs based on their distance to the selected point

        const sortedSongs = this.sortByProximity(energy, popularity, newSongList);

        // Display sorted songs (only first 5)
        sortedSongs.slice(0,30).forEach((song, index) => {
            const songUI = new SongListItemUI(song);
            const listItem = songUI.createCollapsedState();
            listItem.dataset.index = index;
            this.listOfSongs_UI.appendChild(listItem);
        });
    }

    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    sortByProximity(energy, popularity, sortUsSongs) {
        return sortUsSongs.sort((a, b) => {
            const aDistance = this.distance(a.popularity, a.energy, popularity, energy);
            const bDistance = this.distance(b.popularity, b.energy, popularity, energy);
            return aDistance - bDistance;
        });
    }
    handleListClick(event) {
        // If the copy button was clicked, don't do anything.
        if (event.target.classList.contains('copy-button')) {
            return;
        }

        // Find the closest parent li of the clicked element
        const listItem = event.target.closest('li');
        
        if (listItem) {
            const song = JSON.parse(listItem.dataset.song);

            if (listItem.querySelector('.song-details')) {
                listItem.removeChild(listItem.querySelector('.song-details'));
            } else {
                const songUI = new SongListItemUI(song);
                songUI.createExpandedState(listItem);
            }
        }
    }

    
} 