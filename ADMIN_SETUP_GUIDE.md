# Admin Video Portfolio Setup Guide

## 🎬 Overview
Your admin panel is now configured to manage a production company's video portfolio using Supabase.

## 📊 Database Schema

### Table: `videos`
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  category_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow public to read videos so visitors can view the portfolio)
CREATE POLICY "Allow public to read videos"
  ON videos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);

-- If your videos table already exists, run this to add missing fields safely.
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category_id INTEGER;
```

### Table: `video_categories`
```sql
-- Stores the Works carousel cards shown on /works.
-- name = visible card title, carousel_video_url = uploaded card video.
ALTER TABLE video_categories
ADD COLUMN IF NOT EXISTS carousel_video_url TEXT;

-- Allow public to read categories on /works and category pages
CREATE POLICY "Allow public to read video categories"
  ON video_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert video categories"
  ON video_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update video categories"
  ON video_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete video categories"
  ON video_categories FOR DELETE
  TO authenticated
  USING (true);
```

## 🗄️ Storage Bucket Setup

### Bucket: `thumbnails`
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true);

-- Create storage policies
CREATE POLICY "Allow authenticated users to upload thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Allow public to read thumbnails"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Allow authenticated users to delete thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'thumbnails');
```

### Bucket: `carousel-videos`
```sql
-- Stores the original video files for the main Works carousel cards.
INSERT INTO storage.buckets (id, name, public)
VALUES ('carousel-videos', 'carousel-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Required for large category card videos. The admin uses resumable uploads.
UPDATE storage.buckets
SET file_size_limit = 524288000
WHERE id = 'carousel-videos';

CREATE POLICY "Allow authenticated users to upload carousel videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'carousel-videos');

CREATE POLICY "Allow authenticated users to update carousel videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'carousel-videos')
  WITH CHECK (bucket_id = 'carousel-videos');

CREATE POLICY "Allow public to read carousel videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'carousel-videos');

CREATE POLICY "Allow authenticated users to delete carousel videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'carousel-videos');
```

### Bucket: `work-videos`
```sql
-- Stores original files for the individual videos inside /works/[category].
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-videos', 'work-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Required for large portfolio videos. The admin uses resumable uploads.
UPDATE storage.buckets
SET file_size_limit = 524288000
WHERE id = 'work-videos';

CREATE POLICY "Allow authenticated users to upload work videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'work-videos');

CREATE POLICY "Allow authenticated users to update work videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'work-videos')
  WITH CHECK (bucket_id = 'work-videos');

CREATE POLICY "Allow public to read work videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'work-videos');

CREATE POLICY "Allow authenticated users to delete work videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'work-videos');
```

## 🚀 How to Set Up in Supabase Dashboard

### Step 1: Create the Database Table
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the `videos` table SQL from above
3. Click **Run** to create the table

### Step 2: Create Storage Buckets
1. Go to **Storage** → **Create a new bucket**
2. Create `thumbnails` and make it **Public**
3. Create `carousel-videos` and make it **Public**
4. Create `work-videos` and make it **Public**
5. Set the file size limit for `carousel-videos` and `work-videos` to **500MB**
6. Save

### Step 3: Set Storage Policies
1. In **Storage** → Click on each bucket
2. Go to **Policies** tab
3. Add the policies from above (or use the UI to create similar policies)

## 💻 Features Implemented

### ✅ Admin Dashboard
- **Single-page admin panel** focused on video management
- **Beautiful gradient UI** with purple-to-blue theme
- **Real-time video count** display
- **Responsive design** (mobile to desktop)

### ✅ Add/Edit Video Form
- **Title input** - Name of the production
- **Google Drive URL input** - Link to the video
- **Category selector** - Decides which Works category page shows the video
- **Thumbnail upload** - File picker with preview
- **Supabase Storage integration** - Automatic upload to `thumbnails`
- **Loading states** - "Uploading..." and "Saving..." indicators
- **Error handling** - User-friendly error messages
- **Form validation** - Required field checks

### ✅ Video Display
- **Grid layout** - Responsive 1-4 columns
- **Thumbnail cards** with hover effects
- **Play button overlay** - Appears on hover
- **Clickable thumbnails** - Opens Google Drive link
- **Video metadata** - Title and creation date
- **Edit/Delete actions** - Per video
- **Pagination** - 20 videos per page

### ✅ UX Features
- **Loading skeletons** during data fetch
- **Empty state** with encouraging message
- **Success messages** after operations
- **Confirmation dialogs** before delete
- **Image preview** before upload
- **File validation** (type and size checks)

## 🔧 Technical Implementation

### File Structure
```
app/admin/
├── page.js          # Main admin dashboard
├── WorksModal.js    # Add/Edit video form modal
└── WorksList.jsx    # Video grid display component
```

### Key Technologies
- **React Hooks** - useState, useEffect
- **Supabase Client** - Database and Storage operations
- **Ant Design** - Modal and UI components
- **Tailwind CSS** - Styling and gradients
- **Next.js Image** - Optimized image loading
- **SweetAlert2** - Confirmation dialogs

### Data Flow
1. **Fetch**: Page loads → Fetch videos from `videos` table
2. **Add**: Form submit → Upload thumbnail → Insert to database
3. **Edit**: Click edit → Populate form → Update database
4. **Delete**: Click delete → Confirm → Remove from database
5. **Refresh**: After operation → Re-fetch videos

## 🎯 How to Use

### Adding a Video
1. Click **"Add New Video"** button
2. Enter video **title**
3. Paste **Google Drive link**
4. Choose the category, such as Commercial
5. Click to **upload thumbnail** (max 5MB, images only)
6. Click **"Add Video"** to save

### Editing a Video
1. Click **"Edit"** button on any video card
2. Modify title, URL, category, or thumbnail as needed
3. Optionally upload new thumbnail
4. Click **"Update Video"** to save

### Deleting a Video
1. Click **"Delete"** button on any video card
2. Confirm deletion in popup
3. Video removed from database

### Viewing Videos
- Click on any **thumbnail** in a category page to open the saved video URL

## 🔒 Security Notes

1. **Authentication Required** - All operations require logged-in user
2. **RLS Enabled** - Row Level Security on `videos` table
3. **Public Media** - Stored thumbnails and portfolio videos are publicly accessible
4. **File Validation** - Type and size checks before upload

## 📝 Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 🐛 Troubleshooting

### Error: "Videos table does not exist"
- Run the SQL to create the `videos` table in Supabase

### Error: "Upload failed"
- Check if `thumbnails` bucket exists in Storage
- Verify storage policies are set up correctly
- Ensure file is under 5MB

### Error: "User is not authenticated"
- User must be logged in via `/admin/login`
- Check if session is valid in Supabase Auth

### Images not displaying
- Verify `thumbnail_url` is correct in database
- Check if bucket is set to **public**
- Ensure RLS policies allow SELECT on storage

## 🎨 Customization

### Change Color Theme
Edit gradient classes in components:
```jsx
// From purple-blue
from-purple-600 to-blue-600

// To green-teal (example)
from-green-600 to-teal-600
```

### Change Items Per Page
In `WorksList.jsx`:
```jsx
const itemsPerPage = 20; // Change to desired number
```

### Modify Upload Limits
In `WorksModal.js`:
```jsx
// File size limit (5MB)
if (file.size > 5 * 1024 * 1024) {
  // Change to 10MB
  if (file.size > 10 * 1024 * 1024) {
```

## ✨ Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Add Video | ✅ | Upload video metadata and thumbnail |
| Edit Video | ✅ | Update existing video details |
| Delete Video | ✅ | Remove video from database |
| View Videos | ✅ | Display all videos in grid |
| Thumbnail Upload | ✅ | Supabase Storage integration |
| Loading States | ✅ | Skeleton screens while fetching |
| Error Handling | ✅ | User-friendly error messages |
| Responsive Design | ✅ | Works on all screen sizes |
| Authentication | ✅ | Protected admin routes |
| Pagination | ✅ | Navigate through video pages |

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Supabase table and bucket setup
3. Ensure RLS policies are correct
4. Check authentication status

---

**Built with ❤️ for production companies**
