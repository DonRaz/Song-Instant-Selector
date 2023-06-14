import SongManager from './SongManager.js'

export default class KeySlider {
    constructor(advancedFilters) {
      this.keyRange = document.getElementById('key-range');

      // Create arrow in constructor

      // Call these after creating the arrow element
      this.createExpandedState();
      this.advancedFilters = advancedFilters
      this.min = 1;
      this.max = 12;
      this.currentValue = 1; // Default value
      this.currentRangeValue = 1; // Default range value
      this.currentKey = 'A'; // Default key
      this.currentState = 1; // 1 = expanded, 0 = collapsed


      // const pickedValueElement = document.getElementById("picked-value");
      // pickedValueElement.style.margin='-0.25rem'
      this.setDisable = this.setDisable.bind(this);

      this.updateUI();
  
    }


    setDisable(disable) {
      this.isDisabled = disable;
  
      // Graying out the slider when disabled
      if(this.isDisabled) {
        this.sliderContainer.style.opacity = '0.5';
        this.sliderThumb.style.cursor = 'not-allowed';
      } else {
        this.sliderContainer.style.opacity = '1';
        this.sliderThumb.style.cursor = 'pointer';
      }
      
    }

    createExpandedState(){
          // Create required elements
    this.sliderContainer = document.createElement('div');
    this.sliderContainer.id = 'key-slider-container';

    this.sliderRange = document.createElement('div');
    this.sliderRange.id = 'key-slider-range';
    this.sliderRange.classList.add('key-slider-range');

    this.sliderActiveRange = document.createElement('div');
    this.sliderActiveRange.id = 'key-slider-active-range';
    this.sliderActiveRange.classList.add('key-slider-active-range');
    this.sliderActiveRange.style.left = '0%';
    this.sliderActiveRange.style.width = '100%';

    this.sliderThumb = document.createElement('div');
    this.sliderThumb.id = 'key-slider-thumb';
    this.sliderThumb.classList.add('key-slider-thumb');
    this.sliderThumb.style.left = '50%';

    this.dataBubble = document.createElement('div');
    this.dataBubble.id = 'key-data-bubble';
    this.dataBubble.classList.add('key-data-thumb');
    this.dataBubble.style.left = '50%';

    this.sliderValue = document.createElement('div');
    this.sliderValue.id = 'key-slider-value';
    this.sliderValue.classList.add('key-slider-value');
    this.sliderValue.style.left = '50%';

    this.pickedValue = document.createElement('span');
    this.pickedValue.id = 'key-picked-value';
    this.pickedValue.textContent = ' - Key - ';
    this.sliderValue.appendChild(this.pickedValue);



    // Nesting elements
    this.dataBubble.appendChild(this.sliderValue);
    this.sliderThumb.appendChild(this.dataBubble);
    this.sliderRange.appendChild(this.sliderActiveRange);
    this.sliderRange.appendChild(this.sliderThumb);
    this.sliderContainer.appendChild(this.sliderRange);
    this.keyRange.appendChild(this.sliderContainer);

      
    // bind elements and event listeners

    this.sliderRange = document.getElementById("key-slider-range");
    this.sliderThumb = document.getElementById("key-slider-thumb");
    this.rangeValueElement = document.getElementById("key-range-value");
    this.dataBubble = document.getElementById("key-data-bubble");


    this.sliderThumb.addEventListener("mousedown", this.moveSliderThumb.bind(this));
  
    this.sliderRange.addEventListener("mousedown", this.moveSliderThumb.bind(this));
    this.dataBubble.addEventListener("click", this.updateKey.bind(this));

    this.dataBubble.addEventListener("mousedown", function(event){
      event.stopPropagation(); 
  }, false); 

    // Update the class for dataBubble and keyRange
    // this.keyRange.style.height = '15rem';
    
    this.sliderThumb.addEventListener("touchstart", this.moveSliderThumb.bind(this));
    this.dataBubble.addEventListener("touchstart", this.updateRange.bind(this));


  }
    

      updateThumbPosition(value) {
        const percentage = ((value - this.min) / (this.max - this.min)) * 100;
        this.sliderThumb.style.left = percentage + "%";
      }
    
      updateValuePosition() {
        const sliderValue = document.getElementById("key-slider-value");
        sliderValue.style.left = this.sliderThumb.style.left;
      }
    
      updateCurrentValue(value) {
          this.pickedValue.textContent = value + this.currentKey;
      }
    
      updateRangeValue(value) {
        this.rangeValueElement.textContent = '± ' + value;
      }


      updateUI() {
        const invertedKey = this.currentKey === 'A' ? 'B' : 'A';
      
        const fitting_keys_values = [
          (this.currentValue + 10) % 12 + 1 + this.currentKey, 
          this.currentValue + this.currentKey, 
          (this.currentValue % 12 + 1) + this.currentKey,
          this.currentValue + invertedKey // add inverted key
        ];
        // Update logic 
        // Update summaryView
        this.advancedFilters.userUpdatedKeyRange(fitting_keys_values);
        this.updateCurrentValue(this.currentValue);
        this.updateThumbPosition(this.currentValue);
        this.updateValuePosition();
      
        const rangePercentage = ((this.currentRangeValue) / (this.max - this.min)) * 100;
        const leftPercentage = Math.max(0, parseFloat(this.sliderThumb.style.left) - rangePercentage / 2);
        const rightPercentage = Math.min(100, parseFloat(this.sliderThumb.style.left) + rangePercentage / 2);
        
        this.sliderActiveRange.style.left = leftPercentage + "%";
        this.sliderActiveRange.style.width = (rightPercentage - leftPercentage) + "%";
    }
      
  
    moveSliderThumb(event) {
      if(this.isDisabled) {
        return;
       }
        event.preventDefault();
    
        const sliderRect = this.sliderRange.getBoundingClientRect();
        const minPos = sliderRect.left;
        const maxPos = sliderRect.right;
        const sliderWidth = maxPos - minPos;
    
        const updatePosition = (clientX) => {
            let position = clientX - minPos;
            position = Math.max(0, Math.min(position, sliderWidth));
            const percentage = (position / sliderWidth) * 100;
            this.sliderThumb.style.left = percentage + "%";
            const value = Math.round(((this.max - this.min) * percentage) / 100) + this.min;
            this.currentValue = value;
            this.updateUI();
        };
    
        const onMouseMove = (e) => {
            updatePosition(e.clientX);
        };
    
        const onTouchMove = (e) => {
            const touch = e.touches[0];
            updatePosition(touch.clientX);
        };
    
        const cleanup = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("touchend", onMouseUp);
        };
    
        const onMouseUp = cleanup;
        const onTouchEnd = cleanup;
    
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("touchend", onTouchEnd);
    }
    
    updateKey() {
      if(this.isDisabled) {
        return;
    }
      // Toggle between 'A' and 'B'
      this.currentKey = this.currentKey === 'A' ? 'B' : 'A';
      this.updateUI();
    }
  
    updateRange(event) {
      // Stop event propagation
      event.stopPropagation();
    
      this.rangeValueIndex = (this.rangeValueIndex + 1) % this.rangeValues.length; // Cycle through the range values
      this.currentRangeValue = this.rangeValues[this.rangeValueIndex];
      this.rangeValueElement.style.transform = 'translate(-50%, 0%) scale(1.1)'; // Animate the change
      setTimeout(() => {
        this.rangeValueElement.style.transform = 'translate(-50%, 0%) scale(1)';
      }, 300); // Reset the scale after the animation
      this.updateUI();
      }
    }



  // toggleExpandedCollapsedStates() {
  //   // Get all child elements in keyRange
  //   let children = Array.from(this.keyRange.children);
  
  //   // Loop through all children and remove them if their id is not 'expand-arrow'
  //   children.forEach((child) => {
  //     if (child.id !== 'expand-arrow') {
  //       this.keyRange.removeChild(child); 
  //     }
  //   });
  
  //   // Toggle states
  //   if(this.currentState == 1) {
  //     this.createCollapsedState();
  //     this.currentState = 0;
  //     this.expandArrow.style.transform = 'rotate(225deg)'; // Rotate to collapsed state
  //     this.keyRange.style.height = '5rem'; // Change the height to the height of the collapsed state
  //   } else {
  //     this.createExpandedState();
  //     this.updateUI();  // Add this line to update the UI
  //     this.currentState = 1;
  //     this.expandArrow.style.transform = 'rotate(45deg)'; // Rotate back to expanded state
  //     this.keyRange.style.height = '15rem'; // Change the height back to the height of the expanded state
  //   }
  // }