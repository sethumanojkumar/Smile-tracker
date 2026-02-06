# Smile Tracker - Pediatric Dentist Patient Management

A full-stack patient management system for pediatric dentists, built with Next.js, JavaScript, Tailwind CSS, and PostgreSQL (via Supabase). Track and manage children's dental records with ease.

## 🔒 Security & Authentication

The application includes login functionality to protect sensitive patient information:

**Default Login Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Important:** Change these default credentials in production. The current implementation uses basic client-side authentication for demonstration purposes. For production use, implement proper server-side authentication with secure password hashing.

## Features

- 🔐 **Login Protection** - Secure access to patient records
- 👶 **Patient Records** - Store comprehensive information about young patients
- 📸 **Photo Upload** - Add patient photos for easy identification
- 🦷 **Treatment Tracking** - Record treatments provided to patients
- 📝 **Notes Section** - Add detailed notes about patient visits
- 👨‍👩‍👧 **Parent Information** - Track parent/guardian details and contact information
- ✏️ **Edit Records** - Update patient information as needed
- 🗑️ **Delete Records** - Remove patient records with automatic image cleanup
- 🔍 **Search Functionality** - Find patients by name, parent name, or age
- 🎨 **Beautiful UI** - Modern, responsive design with dental-themed animations
- 🎭 **Toast Notifications** - Friendly feedback for all actions
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- ⚡ **Fast Performance** - Built on Next.js for optimal speed
- 🗄️ **Persistent Storage** - PostgreSQL database via Supabase
- ☁️ **Cloud Storage** - Patient photos stored securely in Supabase Storage

## Patient Information Tracked

- Child's full name
- Age
- Treatment information
- Clinical notes
- Parent/Guardian name
- Contact details (phone/email)
- Patient photograph

## Tech Stack

- **Framework:** Next.js 14 (Page Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage
- **API:** Next.js API Routes

## Getting Started

### Prerequisites

- Node.js installed on your machine
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.com)
   - Run the SQL script from [DATABASE_SETUP.md](DATABASE_SETUP.md) in your Supabase SQL Editor (creates `children` table)
   - Create a storage bucket named `patient-images` (instructions in DATABASE_SETUP.md)
   - Copy your project credentials

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   - Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

6. Login with default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

> 💡 **Tip:** You can change the login credentials in `pages/login.js` (line 27-28)

## Database Setup

Detailed database setup instructions can be found in [DATABASE_SETUP.md](DATABASE_SETUP.md).

The application uses a PostgreSQL database with the following schema:

```sql
CREATE TABLE children (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  parent_name TEXT NOT NULL,
  contact_details TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Image Storage

Patient photos are stored in Supabase Storage in a public bucket named `patient-images`.
├── items/
│   │   │   ├── index.js      # API routes for GET all & POST children
│   │   │   └── [id].js       # API routes for GET, PUT, DELETE by ID
│   │   └── upload.js         # Image upload API route
│   ├── _app.js               # App wrapper component
│   └── index.js              # Main page with patient management UI
├── lib/
│   ├── data.js               # Data access layer with Supabase
│   ├── storage.js            # Image upload/delete functions
│   │   └── items/
│   │       ├── index.js      # API routes for GET all & POST
│   │       └── [id].js       # API routes for GET, PUT, DELETE by ID
│   ├── _app.js               # App wrapper component
│   └── index.js              # Main page with CRUD UI
├── lib/
│   ├── data.js               # Data access layer with Supabase
│   └── supabase.js           # Supabase client configuration
├── styles/
│   └── globals.css           # Global styles with Tailwind
├── public/                   # Static files
├── next.config.js            # Next.js configuration
├── .env.local                # Environment variables (create this)
├── .env.example              # Environment variables template
├── DATABASE_SETUP.md         # Database setup instructions
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Project dependencies
```

## API Endpointschildren records
- `POST /api/items` - Create a new child record
- `GET /api/items/[id]` - Get a specific child record
- `PUT /api/items/[id]` - Update a specific child record
- `DELETE /api/items/[id]` - Delete a specific child record (also deletes associated image)
- `POST /api/upload` - Upload patient image to Supabase Storage
- `PUT /api/items/[id]` - Update a specific item
- `DELETE /api/items/[id]` - Delete a specific item

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

See `.env.example` for the template.

## Troubleshooting
- Make sure you've run the SQL script to create the `children` table
- Make sure you've created the `patient-images` storage bucket
- Check that Row Level Security policies allow the operations

### Image Upload Issues
- Ensure the `patient-images` bucket exists in Supabase Storage
- Verify the bucket is set to public
- Check that storage policies are correctly configured
- Image size limit is 5MB

### Development Server Issues
- Try deleting `node_modules` and `.next` folder, then run `npm install` again
- Make sure port 3000 is not already in use
- On Windows, if you see SSL errors, make sure `NODE_TLS_REJECT_UNAUTHORIZED=0` is in `.env.local`

## Notes

This application uses Supabase (PostgreSQL) for persistent data storage and Supabase Storage for patient images. All data is stored securely in your Supabase project.

## Security Considerations

⚠️ **Important:** This application uses basic client-side authentication for demonstration purposes only.

### Current Authentication
- Login credentials stored in `pages/login.js`
- Session stored in browser localStorage
- Client-side route protection

### For Production Use:
- **Replace client-side auth** with proper server-side authentication:
  - Use Supabase Auth, NextAuth.js, or similar
  - Implement secure password hashing (bcrypt, Argon2)
  - Use JWT tokens or secure session cookies
  - Add refresh token rotation
- **Environment & Security:**
  - Remove `NODE_TLS_REJECT_UNAUTHORIZED=0` from environment variables
  - Use HTTPS only in production
  - Implement proper Row Level Security (RLS) policies in Supabase
  - Add rate limiting on API endpoints
- **Data Protection:**
  - Add input validation and sanitization
  - Implement proper error handling (don't expose sensitive info)
  - Add HIPAA compliance measures (patient data requires special handling)
  - Encrypt sensitive data at rest
  - Implement audit logging for data access
- **Access Control:**
  - Add role-based access control (RBAC)
  - Implement multi-factor authentication (MFA)
  - Add session timeout and automatic logout
  - Track login attempts and block after failures

> 🏥 **Healthcare Compliance:** This application handles patient health information. Ensure compliance with HIPAA (US), GDPR (EU), or relevant healthcare data regulations in your jurisdiction before production deployment.
## Notes

This application uses Supabase (PostgreSQL) for persistent data storage. All data is stored in your Supabase project database
## Notes

This application uses in-memory storage, so data will be lost when the server restarts. For production use, consider integrating a database like MongoDB, PostgreSQL, or MySQL.

## License

MIT
