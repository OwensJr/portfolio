// Fetch and sync Facebook posts to gallery
async function fetchAndSyncFacebookPosts() {
    const { pageId, accessToken, enabled } = FACEBOOK_CONFIG;
    
    if (!enabled || !accessToken || accessToken === 'YOUR_FACEBOOK_ACCESS_TOKEN') {
        console.log('Facebook sync not configured. Add your access token to facebook-config.js');
        return;
    }

    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    try {
        // Fetch posts from Facebook Graph API
        const url = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,picture,link,created_time,type&access_token=${accessToken}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.data) {
            console.error('Failed to fetch Facebook posts');
            return;
        }

        // Determine category from post content/hashtags
        function getCategoryFromPost(message) {
            if (!message) return 'events';
            
            const msg = message.toLowerCase();
            
            // Check for project-related keywords
            if (msg.includes('#projects') || msg.includes('#product') || 
                msg.includes('#launch') || msg.includes('#ecommerce') ||
                msg.includes('#realestate') || msg.includes('#voting')) {
                return 'projects';
            }
            
            // Check for team-related keywords
            if (msg.includes('#team') || msg.includes('#teamwork') || 
                msg.includes('#collaboration')) {
                return 'team';
            }
            
            // Check for conference-related keywords
            if (msg.includes('#conference') || msg.includes('#speaking') || 
                msg.includes('#summit') || msg.includes('#panel')) {
                return 'conference';
            }
            
            // Default to events
            return 'events';
        }

        // Create gallery items from Facebook posts
        let postCount = 0;
        data.data.forEach((post, index) => {
            // Only process posts with images/videos
            if (!post.picture) return;

            const category = getCategoryFromPost(post.message);
            const title = post.message ? post.message.split('\n')[0].substring(0, 50) : 'Facebook Post';
            const description = post.message ? post.message.substring(0, 100) : 'Posted on Facebook';
            const imageUrl = post.picture;
            const postLink = `https://www.facebook.com/${post.id.split('_')[0]}/posts/${post.id.split('_')[1]}`;
            const postDate = new Date(post.created_time).toLocaleDateString();

            // Create gallery item
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item facebook-post';
            galleryItem.setAttribute('data-category', category);

            galleryItem.innerHTML = `
                <div class="gallery-image">
                    <img src="${imageUrl}" alt="${title}" loading="lazy">
                    <div class="gallery-overlay">
                        <a href="${postLink}" target="_blank" rel="noopener noreferrer" class="gallery-btn">
                            <span>View on Facebook</span>
                        </a>
                    </div>
                </div>
                <div class="gallery-info">
                    <h3>${title}</h3>
                    <p>${description}...</p>
                    <small style="color: rgba(255, 255, 255, 0.5);">${postDate}</small>
                </div>
            `;

            galleryGrid.appendChild(galleryItem);
            postCount++;
        });

        console.log(`✅ Synced ${postCount} Facebook posts to gallery`);

        // Re-attach filter listeners for new items
        if (postCount > 0) {
            attachGalleryFilters();
        }

    } catch (error) {
        console.error('❌ Error syncing Facebook posts:', error);
    }
}

// Gallery filter functionality
function attachGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Load on page ready
document.addEventListener('DOMContentLoaded', function() {
    fetchAndSyncFacebookPosts();
    attachGalleryFilters();
});
