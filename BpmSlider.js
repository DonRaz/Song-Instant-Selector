import SongManager from './SongManager.js'

export default class BpmSlider {
    constructor(songManager, advancedFilters) {
      // Create arrow in constructor
      // this.createToggleArrowElemet();
      // Call these after creating the arrow element
      this.createExpandedState();
      this.advancedFilters = advancedFilters
      this.songManager = songManager
      this.min = 60;
      this.max = 140;
      this.rangeValues = [2, 6, 12, 100]; // Range values // 100 would be any BPM (Eliminating this filtering)
      this.currentValue = 100; // Default value
      this.currentRangeValue = this.rangeValues[3]; // Default range
      this.rangeValueIndex = 3; // Start with the first value
      this.currentState = 1; // 1 = expanded, 0 = collapsed


      const pickedValueElement = document.getElementById("picked-value");
      pickedValueElement.style.margin='-0.25rem'
      this.updateUI();
  
    }


    createExpandedState(){
          // Create required elements
    this.bpmRange = document.getElementById('bpm-range');

    this.sliderContainer = document.createElement('div');
    this.sliderContainer.id = 'slider-container';

    this.sliderRange = document.createElement('div');
    this.sliderRange.id = 'slider-range';
    this.sliderRange.classList.add('slider-range');

    this.sliderActiveRange = document.createElement('div');
    this.sliderActiveRange.id = 'slider-active-range';
    this.sliderActiveRange.classList.add('slider-active-range');
    this.sliderActiveRange.style.left = '0%';
    this.sliderActiveRange.style.width = '100%';

    this.sliderThumb = document.createElement('div');
    this.sliderThumb.id = 'slider-thumb';
    this.sliderThumb.classList.add('slider-thumb');
    this.sliderThumb.style.left = '50%';

    this.dataBubble = document.createElement('div');
    this.dataBubble.id = 'data-bubble';
    this.dataBubble.classList.add('data-thumb');
    this.dataBubble.style.left = '50%';

    this.sliderValue = document.createElement('div');
    this.sliderValue.id = 'slider-value';
    this.sliderValue.classList.add('slider-value');
    this.sliderValue.style.left = '50%';

    this.pickedValue = document.createElement('span');
    this.pickedValue.id = 'picked-value';
    this.pickedValue.textContent = ' -BPM- ';
    this.sliderValue.appendChild(this.pickedValue);

    this.rangeValueContainer = document.createElement('div');
    this.rangeValueContainer.id = 'range-value-container';
    this.rangeValueContainer.classList.add('range-value-container');

    this.rangeValueElement = document.createElement('span');
    this.rangeValueElement.id = 'range-value';
    this.rangeValueElement.classList.add('range-value');
    this.rangeValueContainer.appendChild(this.rangeValueElement);

    // Nesting elements
    this.dataBubble.appendChild(this.sliderValue);
    this.dataBubble.appendChild(this.rangeValueContainer);
    this.sliderThumb.appendChild(this.dataBubble);
    this.sliderRange.appendChild(this.sliderActiveRange);
    this.sliderRange.appendChild(this.sliderThumb);
    this.sliderContainer.appendChild(this.sliderRange);
    this.bpmRange.appendChild(this.sliderContainer);

      
    // bind elements and event listeners
    this.sliderRange = document.getElementById("slider-range");
    this.sliderThumb = document.getElementById("slider-thumb");
    this.rangeValueElement = document.getElementById("range-value");
    this.dataBubble = document.getElementById("data-bubble");
    this.sliderThumb.addEventListener("mousedown", this.moveSliderThumb.bind(this));
    this.dataBubble.addEventListener("click", this.updateRange.bind(this));

    this.dataBubble.addEventListener("mousedown", function(event){
      event.stopPropagation(); 
  }, false); 



    // Update the class for dataBubble and bpmRange
    this.dataBubble.classList.remove('collapsed');
    // this.bpmRange.style.height = '15rem';
    
    this.sliderThumb.addEventListener("touchstart", this.moveSliderThumb.bind(this));
    this.dataBubble.addEventListener("touchstart", this.updateRange.bind(this));


  }
    
  


    updateThumbPosition(value) {
      const percentage = ((value - this.min) / (this.max - this.min)) * 100;
      this.sliderThumb.style.left = percentage + "%";
    }
  
    updateValuePosition() {
      const sliderValue = document.getElementById("slider-value");
      sliderValue.style.left = this.sliderThumb.style.left;
    }
  
    updateCurrentValue(value) {
      const pickedValueElement = document.getElementById("picked-value");
      pickedValueElement.textContent = value;
    }
  
    updateRangeValue(value) {
      this.rangeValueElement.textContent = '± ' + value;
    }
  
    updateUI() {
      this.minValue = Math.max(this.min, this.currentValue - this.currentRangeValue);
      this.maxValue = Math.min(this.max, this.currentValue + this.currentRangeValue);
      // update logic
      this.songManager.setBpmRange([this.minValue, this.maxValue]);
      // update summaryView
      this.advancedFilters.userUpdatedBpmRange([this.minValue, this.maxValue]);

      if (this.currentRangeValue == 100) {
          const pickedValueElement = document.getElementById("picked-value");
          pickedValueElement.textContent = 'Any BPM';
          this.rangeValueElement.textContent = '';
      }
      else {
        this.updateCurrentValue(this.currentValue);
        this.updateRangeValue(this.currentRangeValue);

      }
        this.updateThumbPosition(this.currentValue);
        this.updateValuePosition();
        const sliderActiveRange = document.getElementById("slider-active-range");
        const rangePercentage = ((this.currentRangeValue) / (this.max - this.min)) * 100;
        const leftPercentage = Math.max(0, parseFloat(this.sliderThumb.style.left) - rangePercentage);
        const rightPercentage = Math.min(100, parseFloat(this.sliderThumb.style.left) + rangePercentage);
        sliderActiveRange.style.left = leftPercentage + "%";
        sliderActiveRange.style.width = (rightPercentage - leftPercentage) + "%";
    }
  
    moveSliderThumb(event) {
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

// Collapsed state for refernece on the summary
  /*
 createCollapsedState() {
    // Update expandArrow
    // Create a new container for collapsed state
    const collapsedContainer = document.createElement('div');
    collapsedContainer.id = 'collapsed-container';
    collapsedContainer.style.height = '3rem';
    collapsedContainer.style.width = '100%';
    collapsedContainer.style.display = 'flex';
    collapsedContainer.style.justifyContent = 'center';
    collapsedContainer.style.alignItems = 'center';
  
    // Create the content for the collapsed container
    const collapsedContent = document.createElement('div');
    collapsedContent.id = 'collapsed-content';
    this.minValue = Math.max(this.min, this.currentValue - this.currentRangeValue);
    this.maxValue = Math.min(this.max, this.currentValue + this.currentRangeValue);
    collapsedContent.textContent = '🥁 Active BPM range ' + this.minValue + ' - ' + this.maxValue + ' 🥁';
    collapsedContent.style.display = 'flex';
    collapsedContent.style.flexDirection = 'row';
    collapsedContent.style.justifyContent = 'center';
    collapsedContent.style.alignItems = 'center';
    collapsedContent.style.cursor = 'pointer';
    collapsedContent.style.background = 'linear-gradient(20deg, #AA32F8 ,#C23DF2, #B142CD)'; // same color as range-value-container
    collapsedContent.style.color = '#f5f5f7'; // white color for text
    collapsedContent.style.padding = '0.4rem 1.2rem'; // same padding as range-value-container
    collapsedContent.style.borderRadius = '4rem'; // same border radius as range-value-container
    collapsedContent.addEventListener('click', () => {
        this.toggleExpandedCollapsedStates();
    });
  
    // Add the collapsedContent to the collapsedContainer
    collapsedContainer.appendChild(collapsedContent);
  
    // Add the collapsedContainer to the bpmRange
    this.bpmRange.appendChild(collapsedContainer);
    this.bpmRange.style.height = '3rem';
  
    // Add 'collapsed' class to the dataBubble
    this.dataBubble.classList.add('collapsed');
  }

  */