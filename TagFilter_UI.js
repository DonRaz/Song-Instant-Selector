import SongManager from './SongManager.js'

export default class TagFilter {
    constructor(songManager) {
        this.tagWCategories = {
            'Hot':  [
                "Happy", "Fool Around", "Sing", "Pool", "Sexy", "Club", "EDM", "Hip Hop", "Latin",
                "Dance Remixes" , "Pop", "Jump", "PEGI 4 [Age]", "Wedding", "Flying High"
            ], 
            'Vibes':  [
                "Wedding", "Pool", "Bars", "Club", "Strip Club", "Build up", "Jump", "Sing", "Fool Around", "Flying High", "Happy", "Cheer Competitors",
                "Sexy", "Fight & Fog", "Mad", "Calm", "Romantic & Slow Dance", "Build Down",
                "Drink Up", "MC Hype", "Inspiring" 
            ],
            'Genres':  [
                "Pop", "Dance Remixes", "EDM", "Hip Hop", ,"Rock",  "Latin", "Tribal",  "Club-Hotel",
                "Psy-Trance", "Israeli - Kibutz", "Mizrahit", "Nostalgic"
            ],
            'Eras': [
                "60s", "70s", "80s", "90s", "2000s", "2010s", "2020s",
                
            ],
            'Collections': [
                "DTracks", "Sp- Sing-Along", "Sp- Kids Party", "Sp- Bach Party", "Sp- Workout", "Sp- Bach Israel",
            ],

            'Extra': [
                "Girl Power", "Darbuka", "Israel [Loc]", "California [Loc]", 
                "Morning", "Sunset", "PEGI 16 [Age]", "PEGI 4 [Age]",
            ],

        };
        this.twoDSelector = document.getElementById('2dSelector'); // style.display - 'block' or 'none'
        this.songManager = songManager;
        this.activeTags = ["Happy"]; // Default active tags


        this.filterElement = document.getElementById('tags-filtering-div');

        this.createFilterElements();
        this.buildTagCatalog(); // Build the tag catalog once

        this.updateUI();
    }

    createFilterElements() {
        // Create div for active tags and add tag button
        this.activeTagsElement = document.createElement('div');
        this.activeTagsElement.id = 'active-tags';



        console.log("HEYYY ---- TagFilter UI Createfilterelement");
        // Create div for tag catalog
        this.tagCatalogElement = document.getElementById('tag-catalog');


        // Add elements to filter element
        this.filterElement.appendChild(this.activeTagsElement);

        

        // Add event listeners
        this.activeTagsElement.addEventListener('click', (event) => {
            if (event.target.tagName.toLowerCase() === 'span') {
                this.removeTag(event.target.textContent);
            }
        });

    }

    

    collapseTagCatalog() {
        this.tagCatalogElement.style.display = 'none';
        this.twoDSelector.style.display = 'block';
    }

    showTagCatalog() {  
        // this.twoDSelector = document.getElementById('2dSelector'); // style.display - 'block' or 'none'
        // this.tagCatalog = document.getElementById(''tag-catalog'); // style.display - 'block' or 'none'
        
        // hide selector2d
        this.twoDSelector.style.display = 'none';
        // Convert the + button to close button
          // Rotate the + button by 45 degrees
        // Show the tag catalog
        this.tagCatalogElement.style.display = 'block';
    }

    showCategoryTags(category) {
        const tagsContainer = this.tagsContainer

        // Clear previous tags
        tagsContainer.innerHTML = '';

        // Add the tags for the selected category
        this.tagWCategories[category].forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.textContent = tag;
            tagElement.classList.add('filter-tag');

        // If the tag is active, add a different CSS class
        if (this.activeTags.includes(tag)) {
            tagElement.classList.add('active-in-catalog');
        }

            tagElement.addEventListener('click', () => {
                this.addTag(tag);
            });

            tagsContainer.appendChild(tagElement);
        });
    }

    addTag(tag) {
        // Add the tag to the active tags if it's not already there
        if (!this.activeTags.includes(tag)) {
            this.activeTags.push(tag);
            this.updateUI();
            this.updateTagStatusInCatalog();
        }
        else{
            this.removeTag(tag);
        }
    }

    removeTag(tag) {
        // Remove the tag from the active tags if it's there
        const index = this.activeTags.indexOf(tag);
        if (index !== -1) {
            this.activeTags.splice(index, 1);
            this.updateUI();
            this.updateTagStatusInCatalog();
        }
    }

    buildTagCatalog() {
        // Create a container for the tabs
        const categoriesContainer = document.createElement('div');
        categoriesContainer.classList.add('categories-container');

        // Create a container for the tags
        this.tagsContainer = document.createElement('div');
        this.tagsContainer.classList.add('tags-container');

        // Iterate over tag categories and create a tab for each one
        Object.keys(this.tagWCategories).forEach((category, index) => {
            const categoryTab = document.createElement('div');
            categoryTab.textContent = category;
            categoryTab.classList.add('category-tab');

            // Set the first tab as active initially
            if (index === 0) {
                categoryTab.classList.add('active');
            }

            categoryTab.addEventListener('click', () => {
                // Remove 'active' class from all tabs
                document.querySelectorAll('.category-tab').forEach(tab => {
                    tab.classList.remove('active');
                });

                // Add 'active' class to the clicked tab
                categoryTab.classList.add('active');

                // Show the tags for the clicked tab
                this.showCategoryTags(category);
            });

            categoriesContainer.appendChild(categoryTab);
        });

        // Add the categories and tags containers to the tag catalog element
        this.tagCatalogElement.appendChild(categoriesContainer);
        this.tagCatalogElement.appendChild(this.tagsContainer);

        // Show the tags for the first category initially
        this.showCategoryTags(Object.keys(this.tagWCategories)[0]);
    }
    
    updateTagStatusInCatalog() {
        // Update the classes of the tag elements in the catalog
        document.querySelectorAll('.filter-tag').forEach(tagElement => {
            if (this.activeTags.includes(tagElement.textContent)) {
                tagElement.classList.add('active-in-catalog');
            } else {
                tagElement.classList.remove('active-in-catalog');
            }
        });
    }

    updateUI() {
        // Update the active tags element
        this.activeTagsElement.innerHTML = '';
        this.activeTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            tagElement.classList.add('active-filter-tag');
            this.activeTagsElement.appendChild(tagElement);
            
        });
        



        // Update the song manager with the new active tags
        this.songManager.updateActiveTags(this.activeTags);
    }
}
