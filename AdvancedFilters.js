import BpmSlider from './BpmSlider.js';
import KeySlider from './KeySlider.js';

export default class AdvancedFilters {
    constructor(songManager) {

        // Initialize containers
        this.advancedFiltersSection = document.getElementById('advanced-section');
        this.bpmRangeContainer = document.getElementById('bpm-range');
        this.keyRangeContainer = document.getElementById('key-range');
    

        this.isBpmFilterActive = true;
        this.isKeyFilterActive = true;

        this.data_bpmRange;
        this.data_keyRange;

        this.expandedState = 'expanded';
        this.createToggleArrowElemet();
        // Initialize the selector element
        this.createBpmKeySwitch();
    
        // Update initial UI
        this.keyRangeContainer.style.display = 'none'

        this.createToggleActiveFilterSwitch();

        this.turnSwitchUICurrentFilter(true);

        this.songManager = songManager;
        this.bpmSlider = new BpmSlider(this);
        this.keySlider = new KeySlider(this);
    }

    turnSwitchUICurrentFilter(isTurningOn){
        if(isTurningOn){
            this.toggleSwitch.classList.remove('deactivated');
            this.toggleSwitch.classList.add('activated');
        }
        else{
            this.toggleSwitch.classList.remove('activated');
            this.toggleSwitch.classList.add('deactivated');
        }
    }

    toggleActivateCurrentFilter() {
        let bpmImageDiv = document.getElementById('bpm-image-div');
        let bpmImage = bpmImageDiv.querySelector('img');
        
        let keyImageDiv = document.getElementById('key-image-div');
        let keyImage = keyImageDiv.querySelector('img');
    
        if (this.keyRangeContainer.style.display === 'none') {
            this.isBpmFilterActive = !this.isBpmFilterActive;
            if (this.isBpmFilterActive) { 
                this.turnSwitchUICurrentFilter(true);
                this.songManager.setBpmRange(this.data_bpmRange);
                this.bpmSlider.setDisable(false);
                bpmImage.src = 'images/colored/drum-colored.svg'; // Or whatever the original SVG path was
                this.bpmTextInSummaryObject.innerText = ' Active BPM Range [' + this.data_bpmRange[0] + '-' + this.data_bpmRange[1] + ']' ;


                // replace to bpm gray image
            } else {
                this.songManager.setBpmRange(false);
                this.turnSwitchUICurrentFilter(false);
                this.bpmSlider.setDisable(true);
                bpmImage.src =  'images/drum-bpm.svg';
                this.bpmTextInSummaryObject.innerText = 'BPM filter deactivated'

            }
        } else {
            this.isKeyFilterActive = !this.isKeyFilterActive;
            if (this.isKeyFilterActive) {
                this.turnSwitchUICurrentFilter(true);
                this.songManager.setKeyRange(this.data_keyRange);
                this.keySlider.setDisable(false);
                keyImage.src = 'images/colored/sound_note-colored.svg'; // Or whatever the original SVG path was
                this.keyTextInSummaryObject.innerText = ' Active keys:  [' + this.data_keyRange + ']' ;

                // replace to key gray image
            } else {
                this.turnSwitchUICurrentFilter(false);
                this.songManager.setKeyRange(false);
                this.keySlider.setDisable(true);
                keyImage.src = 'images/sound-note-single.svg';
                this.keyTextInSummaryObject.innerText = 'Camelot Key Filter deactivated'


            }
        }
    }
        createToggleActiveFilterSwitch() {
            // Create a new div for the switch
            this.toggleSwitch = document.createElement('div');
            this.toggleSwitch.id = 'toggle-switch';
            this.toggleSwitch.style.cursor = 'pointer';
            
            // Create a new checkbox
            this.toggleCheckbox = document.createElement('input');
            this.toggleCheckbox.type = 'checkbox';
            this.toggleCheckbox.id = 'toggle-checkbox';
            this.toggleCheckbox.style.display = 'none'; // Hide the checkbox
            
            // Event Listener for the toggle checkbox
            this.toggleCheckbox.addEventListener('change', this.toggleActivateCurrentFilter.bind(this));
            
            // OnClick listener for the switch
            this.toggleSwitch.addEventListener('click', () => {
                this.toggleCheckbox.checked = !this.toggleCheckbox.checked;
                this.toggleActivateCurrentFilter(); // Call a function that you'll implement later
            });
            
            // Add the checkbox to the switch
            this.toggleSwitch.appendChild(this.toggleCheckbox);
            
            // Add the switch to the advancedFiltersSection
            this.advancedFiltersSection.appendChild(this.toggleSwitch);
    }

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
        image.style.bottom = '22%'; // You may need to adjust this value
        image.style.zIndex = '10';
    
        // create the text field
        let textField = document.createElement('p');
        textField.id = idOfTextField;
        textField.style.textAlign = 'center'; // center the text in the text field
        textField.style.transform = 'translateY(12%)';

    
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
    


    createBpmKeySwitch() {   

        this.bpmKeySwitchContainer = document.getElementById("bpm-key-switch-container");
        this.bpmKeySwitchContainer.style.textAlign = 'center'; // or any other styles you want
        // Create song count display
        
        

        // Call the new function to create the summary objects
        this.bpmSummaryObject = this.createSummaryObject('bpm-container',
                                                        'bpm-display-summary',
                                                        'images/colored/drum-colored.svg', //'images/drum-bpm.svg',
                                                        'bpm-image-div',
                                                        'bpm-active-indicator');
        
        this.keySummaryObject = this.createSummaryObject('key-container',
                                                        'key-display-summary',
                                                        'images/colored/sound_note-colored.svg',//'images/sound-note-double.svg',
                                                        'key-image-div',
                                                        'key-active-indicator');
        
        
        // Append the new objects
        this.bpmKeySwitchContainer.appendChild(this.bpmSummaryObject);
        this.bpmKeySwitchContainer.appendChild(this.keySummaryObject);

        // Set the initial innerText of the text fields
        // bpmSummaryObject.textField.innerText = 'BPM';
        // keySummaryObject.textField.innerText = 'Key';
    
        this.highlightAdvanced = document.createElement('div');
        this.highlightAdvanced.classList.add('highlight-advanced');
        this.highlightAdvanced.id = 'highlight-advanced-filters';
        

        
        this.bpmKeySwitchContainer.appendChild(this.highlightAdvanced);    
        this.bpmKeySwitchContainer.addEventListener('click', () => {
            this.updateParagraphStylesAdvanced();
        });
    
        
        // Update the event listener for addTagButton
        this.bpmKeySwitchContainer.addEventListener('click', () => {
            // If Bpm is open now 
            if (this.keyRangeContainer.style.display === 'none') {
                this.bpmRangeContainer.style.display = 'none';
                this.keyRangeContainer.style.display = 'block';
                if (this.isKeyFilterActive)
                    this.turnSwitchUICurrentFilter(true);
                else
                    this.turnSwitchUICurrentFilter(false);
                
                
            } else {
                this.bpmRangeContainer.style.display = 'block';
                this.keyRangeContainer.style.display = 'none';
                if (this.isBpmFilterActive)
                    this.turnSwitchUICurrentFilter(true);
                else
                    this.turnSwitchUICurrentFilter(false);
            }
        });

        this.bpmTextInSummaryObject = document.getElementById("bpm-display-summary");
        this.keyTextInSummaryObject = document.getElementById("key-display-summary");
    
    }
    
    updateParagraphStylesAdvanced() {
        requestAnimationFrame(() => {
            this.toggleSwitch.style.display='block';
            this.expandArrow.style.display = 'block';
            this.expandArrow.style.transform = 'rotate(45deg)'; // Rotate back to expanded state
            if (this.bpmRangeContainer.style.display === 'none') 
            {
                this.keyTextInSummaryObject.style.color = 'white';
                this.keyTextInSummaryObject.style.fontWeight = '600';
                this.bpmTextInSummaryObject.style.color = 'gray';
                this.bpmTextInSummaryObject.style.fontWeight = '200';
                // highlight
                this.highlightAdvanced.style.transform = 'translateX(102%)';
                // Update active indicator
                document.getElementById('bpm-active-indicator').style.display = 'none';
                document.getElementById('key-active-indicator').style.display = 'block';
            }
            else 
            {
                this.bpmTextInSummaryObject.style.color = 'white';
                this.bpmTextInSummaryObject.style.fontWeight = '600';
                this.keyTextInSummaryObject.style.color = 'gray';
                this.keyTextInSummaryObject.style.fontWeight = '200';
                //highlight
                this.highlightAdvanced.style.transform = 'translateX(0%)';
                document.getElementById('bpm-active-indicator').style.display = 'block';
                document.getElementById('key-active-indicator').style.display = 'none';
            }
        });
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
  



    toggleExpandedCollapsedStates() {
        this.bpmRangeContainer.style.display = 'none';
        this.keyRangeContainer.style.display = 'none';
        this.expandArrow.style.transform = 'rotate(225deg)'; // Rotate to collapsed state
        this.expandArrow.style.display = 'none';
        this.expandedState = 'collapsed';
        this.toggleSwitch.style.display='none';
        
    }

    userUpdatedBpmRange(bpmRangeData){
        this.songManager.setBpmRange([bpmRangeData[0], bpmRangeData[1]]);
        
        this.data_bpmRange = bpmRangeData;
        
        
        this.bpmTextInSummaryObject.innerText = ' Active BPM Range [' + this.data_bpmRange[0] + '-' + this.data_bpmRange[1] + ']' ;

    }

    userUpdatedKeyRange(keyRangeData){
        
        this.data_keyRange = keyRangeData;
        this.songManager.setKeyRange(keyRangeData);

        this.keyTextInSummaryObject.innerText = ' Active keys:  [' + this.data_keyRange + ']' ;


    }


}

