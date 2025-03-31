# Prof. Amos Olalekan Abolaji's Portfolio Website

This is the official portfolio website for Professor Amos Olalekan Abolaji, a distinguished Professor of Biochemistry at the University of Ibadan, Nigeria.

## Technologies Used

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend & Database**: Firebase (Firestore, Authentication, Storage)

## Features

- Responsive design that works on all screen sizes
- Interactive UI with smooth animations
- Content management system for easy updates
- Admin panel for managing website content
- Contact form for inquiries
- Gallery for showcasing research and activities
- Publications and research work showcase

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd prof-abolaji-website
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Set up Firebase
   - Create a Firebase project at https://console.firebase.google.com/
   - Update the Firebase configuration in `src/firebase/config.ts`

4. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Build for production
   ```
   npm run build
   # or
   yarn build
   ```

## Project Structure

- `src/` - Source code
  - `assets/` - Static assets like images
  - `components/` - Reusable React components
  - `firebase/` - Firebase configuration and services
  - `pages/` - Page components
  - `styles/` - Global styles
  - `App.tsx` - Main application component
  - `main.tsx` - Entry point

## Admin Panel

The website includes an admin panel for managing content. To access the admin panel:

1. Navigate to `/admin/login`
2. Login with the credentials set up in Firebase Authentication

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Credits

- Designed and developed by imit-celsius
- Content by Prof. Amos Olalekan Abolaji
