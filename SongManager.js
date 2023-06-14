
import Song from './Song.js'
import SongListItemUI from './SongList_UI.js';

export default class SongManager {
    constructor(songs) {
        this.allSongs = songs;
        this.bpmRange = [60, 140]; // Default BPM range
        this.keyRange = ["3A", "4A", "5A", "4B"]
        this.activeTags = []; // Active tags
        this.filteredByTagsSongs = songs;
        this.listOfSongs_UI = document.getElementById('songs');//'#song-list'
        this.listOfSongs_UI.addEventListener('click', (event) => this.handleListClick(event));

        this.createFilterSortingSwitch();
    //    this.createBpmKeySwitch();
    }

    // changeSonglistContainerSizeInRem(newSize){
    //     this.listOfSongs_UI.style.height='${newSize}rem'



    
    // }
    createFilterSortingSwitch(){
        // Create song count display
        this.filterSortingSwitchContainer = document.getElementById("filter-sorting-switch-container");

        this.filterSortingSwitchContainer.style.textAlign = 'center'; // or any other styles you want

        // Song count display
        this.songCountDisplay = document.createElement('p');
        this.songCountDisplay.id = 'song-count-display';
        this.songCountDisplay.style.color = 'white'; // Default color


        // sorting criterias
        this.sortingCriteriaDisplay = document.createElement('p');
        this.sortingCriteriaDisplay.id = 'sorting-criteria-display';
    

        // highlight
        this.highlight = document.createElement('div');
        this.highlight.classList.add('highlight');
        this.highlight.style.transform = 'translateX(102%)';
        
        // Append highlight to the filterSortingSwitchContainer
        this.filterSortingSwitchContainer.appendChild(this.highlight);  
        // Append elements
        this.filterSortingSwitchContainer.appendChild(this.songCountDisplay);
        this.filterSortingSwitchContainer.appendChild(this.sortingCriteriaDisplay);
    
        // Default state
        this.state = 'song-count'; // Either 'song-count' or 'sorting-criteria'

        this.filterSortingSwitchContainer.addEventListener('click', () => {
            this.state = this.state === 'song-count' ? 'sorting-criteria' : 'song-count';
            this.updateParagraphStyles();
            
        });
    
        // add click listener to rotate and increase size temporarily
        this.songCountDisplay.addEventListener('click', () => {
            this.songCountDisplay.classList.add('clicked');
            setTimeout(() => {
                this.songCountDisplay.classList.remove('clicked');
            }, 200); // Remove the 'clicked' class after 1 second
        });        /// add click listener between sort and tags
       
       
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
        // Placing in the UI to container
        // const container = document.querySelector('.container');
        // container.insertBefore(this.filterSortingSwitchContainer, container.childNodes[2]); // inserting after song-list
    }

    updateParagraphStyles() {
        requestAnimationFrame(() => {
            if (this.state === 'song-count') {
                this.sortingCriteriaDisplay.style.color = 'white';
                this.sortingCriteriaDisplay.style.fontWeight = '600';
                this.songCountDisplay.style.color = 'gray';
                this.songCountDisplay.style.fontWeight = '200';
                // highlight
                this.highlight.style.transform = 'translateX(102%)';

            } else {
                this.songCountDisplay.style.color = 'white';
                this.songCountDisplay.style.fontWeight = '600';
                this.sortingCriteriaDisplay.style.color = 'gray';
                this.sortingCriteriaDisplay.style.fontWeight = '300';

                //highlight
                this.highlight.style.transform = 'translateX(0%)';

            }
        });
    }
    

    // __________________________________ BPM __________________________________
    // Set the BPM range and update the song list
    
    applyTagsFilterToSongs(filterUsSongs){
        this.filteredByTagsSongs = filterUsSongs.filter(song => this.activeTags.every(tag => song.hasTag(tag)));
    }

    setBpmRange(bpmRange) {
        this.bpmRange = bpmRange;
        this.updateSongList();
    }


    setKeyRange(keyRange) {
        this.keyRange = keyRange;
        this.updateSongList();
    }

    // Get songs within the BPM range
    getSongsWithinBpmRange() {
        return this.filteredByTagsSongs.filter(song => song.isInBpmRange(this.bpmRange));
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

        this.activeTags = tags;
        this.updateSongList();
        
        // and if we added, we can just filter more deeply into the current collection
    }


    // __________________________________ Tags __________________________________ END
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

    // Update the song list based on the current BPM range
    updateSongList(energy = 4, popularity = 8) {
        /* NOTE THAT THE DEFAULT canvas drawing of Energy=4 and Popularity=8 Are in GraphManager2D.initializeDefaultSelection*/
        // Clear the existing song list
        while (this.listOfSongs_UI.firstChild) {
            this.listOfSongs_UI.removeChild(this.listOfSongs_UI.firstChild);
        }

        this.applyTagsFilterToSongs(this.filteredByTagsSongs);
        let songsFilteredByBPM = this.getSongsWithinBpmRange(); //BPM Filter
        let songsFilteredByKey = this.getSongsWithinKeyRange(songsFilteredByBPM); // Key Filter

    
        this.songCountDisplay.innerText = `${songsFilteredByKey.length} results`;
        this.sortingCriteriaDisplay.innerText= `↑↓ ⚡️ ${Math.round(energy)}, 💡 ${Math.round(popularity)}`;
        // Sort songs based on their distance to the selected point
        const sortedSongs = this.sortByProximity(energy, popularity, songsFilteredByKey);

        // Display sorted songs (only first 5)
        sortedSongs.slice(0,30).forEach((song, index) => {
            const songUI = new SongListItemUI(song);
            const listItem = songUI.createCollapsedState();
            listItem.dataset.index = index;
            this.listOfSongs_UI.appendChild(listItem);
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