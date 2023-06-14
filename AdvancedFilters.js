import BpmSlider from './BpmSlider.js';
import KeySlider from './KeySlider.js';

export default class AdvancedFilters {
    constructor(songManager) {

        // Initialize containers
        this.advancedFiltersSection = document.getElementById('advanced-section');
        this.bpmRangeContainer = document.getElementById('bpm-range');
        this.keyRangeContainer = document.getElementById('key-range');
    


        this.data_bpmRange;
        this.data_keyRange;

        this.isBpmMode = true; // default mode is bpm
        this.expandedState = 'expanded';
        this.createToggleArrowElemet();
        // Initialize the selector element
        // this.createModeSelector();
        this.createBpmKeySwitch();
    
        // Update initial UI
        this.updateUI();

        this.songManager = songManager;
        this.bpmSlider = new BpmSlider(this.songManager, this);
        this.keySlider = new KeySlider(this.songManager, this);
    }






    createBpmKeySwitch() {   
        this.bpmKeySwitchContainer = document.getElementById("bpm-key-switch-container");
        this.bpmKeySwitchContainer.style.textAlign = 'center'; // or any other styles you want
        // Create song count display
  
        
        this.bpmDisplaySummary = document.createElement('p');
        this.bpmDisplaySummary.id = 'bpm-display-summary';
        this.bpmDisplaySummary.style.color = 'white'; // Default color
        this.bpmDisplaySummary.innerText = 'BPM';
    

        this.keyDisplaySummary = document.createElement('p');
        this.keyDisplaySummary.id = 'key-display-summary';
        this.keyDisplaySummary.innerText = 'Key';
    
    
        this.highlightAdvanced = document.createElement('div');
        this.highlightAdvanced.classList.add('highlight-advanced');
        this.highlightAdvanced.id = 'highlight-advanced-filters';
        // this.highlightAdvanced.style.transform = 'translateX(102%)';
        
        //////////UNCOMMENT LATER/////////// Append highlight to the bpmKeySwitchContainer
        this.bpmKeySwitchContainer.appendChild(this.highlightAdvanced);  
        // Append elements
        this.bpmKeySwitchContainer.appendChild(this.bpmDisplaySummary);
        this.bpmKeySwitchContainer.appendChild(this.keyDisplaySummary);
    
        // Default state
        this.state = 'bpm'; // Either 'bpm' or 'key'
    
        this.bpmKeySwitchContainer.addEventListener('click', () => {
            this.state = this.state === 'bpm' ? 'key' : 'bpm';
            this.updateParagraphStylesAdvanced();
        });
    
        // add click listener to rotate and increase size temporarily
        this.bpmDisplaySummary.addEventListener('click', () => {
            this.bpmDisplaySummary.classList.add('clicked');
            setTimeout(() => {
                this.bpmDisplaySummary.classList.remove('clicked');
            }, 200); // Remove the 'clicked' class after 1 second
        });      

        
        // Update the event listener for addTagButton
        this.bpmKeySwitchContainer.addEventListener('click', () => {
            // If its closed now
            if (this.keyRangeContainer.style.display === 'none') {
                this.bpmRangeContainer.style.display = 'none';
                this.keyRangeContainer.style.display = 'block';
            } else {
                this.bpmRangeContainer.style.display = 'block';
                this.keyRangeContainer.style.display = 'none';
            }
        });
    
    }
    
    updateParagraphStylesAdvanced() {
        requestAnimationFrame(() => {
            if (this.state === 'key') {
                this.keyDisplaySummary.style.color = 'white';
                this.keyDisplaySummary.style.fontWeight = '600';
                this.bpmDisplaySummary.style.color = 'gray';
                this.bpmDisplaySummary.style.fontWeight = '200';
                // highlight
                this.highlightAdvanced.style.transform = 'translateX(102%)';
    
            } else {
                this.bpmDisplaySummary.style.color = 'white';
                this.bpmDisplaySummary.style.fontWeight = '600';
                this.keyDisplaySummary.style.color = 'gray';
                this.keyDisplaySummary.style.fontWeight = '300';
                //highlight
                this.highlightAdvanced.style.transform = 'translateX(0%)';
            }
        });
    }
    





    createModeSelector() {
        // Create a container for the selector
        this.modeSelector = document.createElement('div');
        this.modeSelector.id = 'advanced-mode-selector';
        this.modeSelector.classList.add('advanced-mode-selector');  // new class added
    
        // Create elements for both modes
        this.bpmModeElement = document.createElement('div');
        this.bpmModeElement.innerText = 'BPM';
        this.bpmModeElement.classList.add('mode', 'advanced-mode');  // new class added
        this.keyModeElement = document.createElement('div');
        this.keyModeElement.innerText = 'Key';
        this.keyModeElement.classList.add('mode', 'advanced-mode');  // new class added
    
        // Add click events to the mode elements
        this.bpmModeElement.addEventListener('click', () => this.toggleFilters());
        this.keyModeElement.addEventListener('click', () => this.toggleFilters());
    
        // Add the mode elements to the mode selector
        this.modeSelector.appendChild(this.bpmModeElement);
        this.modeSelector.appendChild(this.keyModeElement);
    
        // Add the mode selector to the advancedFiltersSection
        this.advancedFiltersSection.appendChild(this.modeSelector);
    }

    createToggleArrowElemet(){
        // Create a new element for the expand arrow
        this.expandArrow = document.createElement('div');
        this.expandArrow.id = 'expand-arrow';
        // this.expandArrow.style.transform
        this.expandArrow.style.cursor = 'pointer';
        this.expandArrow.style.transform = 'rotate(45deg)'; // Rotate back to expanded state
  
        // Event Listener for the expand arrow
        this.expandArrow.addEventListener('click', this.toggleExpandedCollapsedStates.bind(this));
  
        // Add the expand arrow to the bpmRange
        this.advancedFiltersSection.appendChild(this.expandArrow);
    }
  
    
    updateUI() {
        if (this.isBpmMode) {
            this.bpmRangeContainer.style.display = 'block';
            this.keyRangeContainer.style.display = 'none';
            // this.bpmModeElement.style.fontWeight = 'bold';
            // this.keyModeElement.style.fontWeight = 'normal';
        } else {
            this.bpmRangeContainer.style.display = 'none';
            this.keyRangeContainer.style.display = 'block';
            // this.bpmModeElement.style.fontWeight = 'normal';
            // this.keyModeElement.style.fontWeight = 'bold';
        }
    }

    toggleFilters() {
        this.isBpmMode = !this.isBpmMode;  // Toggle between the modes
        this.updateUI();  // Update the UI to reflect the change
    }

    toggleExpandedCollapsedStates() {
        if (this.expandedState === 'expanded') {
            this.bpmRangeContainer.style.display = 'none';
            this.keyRangeContainer.style.display = 'none';
            this.expandArrow.style.transform = 'rotate(225deg)'; // Rotate to collapsed state
            this.expandedState = 'collapsed';
        } else {
            this.bpmRangeContainer.style.display = 'block';
            this.keyRangeContainer.style.display = this.isBpmMode ? 'none' : 'block';
            this.expandArrow.style.transform = 'rotate(45deg)'; // Rotate back to expanded state
            this.expandedState = 'expanded';
        }
    }

    userUpdatedBpmRange(bpmRangeData){
        this.data_bpmRange = bpmRangeData;
        this.updateSummaryView();

    }

    userUpdatedKeyRange(keyRangeData){
        this.data_keyRange = keyRangeData;
        this.updateSummaryView();
    }


    updateSummaryView() {
        // SHOW THE NEW VALUES IN THE SUMMARY VIEW.

        // update bpm range
        // this.bpmRangeDisplay.innerText = `${songsFilteredByKey.length} results`;

        // 🥁 Active BPM range ' + this.minValue + ' - ' + this.maxValue + ' 🥁
        this.bpmDisplaySummary.innerText = '🥁 All songs between [' + this.data_bpmRange[0] + '-' + this.data_bpmRange[1] + '] BPM' ;
        
        
        // update the key range.
        // this.keyaDisplay.innerText= `↑↓ ⚡️ ${Math.round(energy)}, 💡 ${Math.round(popularity)}`;
        this.keyDisplaySummary.innerText = ' 🎻 Active keys:  [' + this.data_keyRange + ']' ;

      

    }


}



/*
Instead of collapsed - expanded  
we want to only have expanded.
while the collapsed state would be built and managed by the AdvancedFilters.js
The collapsed state would present the active filters and an arrow for closing and opening the draw

when the AdvandeFilters will want to collapse one, it will just find the element (bpm-range / key-range) and hide it
on toggle it will hide / show the needed element.

the toggleArrowElement that is nwo placed in the BPMSlider, would move to the AdvancedFliter object. Once it pressed upon,
the Advanced filter will collpase both bpm-range and key-range












/*

        if (this.isBpmMode) {
            this.bpmModeElement.style.fontWeight = '600';
            this.bpmModeElement.style.color = 'white';
            // this.keyRange.style.fontWeight = '600';
            this.keyModeElement.style.fontWeight = '200';
            this.keyModeElement.style.color = 'gray';
        } else {
            this.bpmModeElement.style.fontWeight = '200';
            this.bpmModeElement.style.color = 'gray';
            // this.keyRange.style.fontWeight = '600';
            this.keyModeElement.style.fontWeight = '600';
            this.keyModeElement.style.color = 'white';
*/

/*
    
    // collapse() {
    //     if (this.expandedState === 'expanded') {
    //         this.expandedState = 'collapsed';
    //         if (this.isBpmMode) {
    //             this.bpmSlider.toggleExpandedCollapsedStates();
    //         } else {
    //             this.keySlider.toggleExpandedCollapsedStates();
    //         }
    //     }
    // }
    
    // expand() {
    //     if (this.expandedState === 'collapsed') {
    //         this.expandedState = 'expanded';
    //         if (this.isBpmMode) {
    //             this.bpmSlider.toggleExpandedCollapsedStates();
    //         } else {
    //             this.keySlider.toggleExpandedCollapsedStates();
    //         }
    //     }
    // }
    
*/