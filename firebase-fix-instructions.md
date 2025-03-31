# Firebase Firestore Permissions Fix

You're experiencing 400 errors with your Firestore connections. This indicates permission issues with your Firestore security rules.

## Steps to Fix Firestore Permissions

1. Go to the [Firebase Console](https://console.firebase.google.com/project/profweb-f559c/firestore)

2. Click on "Firestore Database" in the left menu

3. Click on the "Rules" tab

4. Replace the current rules with the following (for development purposes):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow read/write access during development
      allow read, write: if true;
    }
  }
}
```

5. Click "Publish" to save the changes

6. Restart your development server:
```
npm run dev
```

## Security Warning

The rules above allow anyone to read from and write to your Firestore database. This is fine for local development, but before deploying to production, you should update the rules to be more restrictive, such as:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

This allows anyone to read data but requires authentication to write data. 

# Firebase Storage Permissions Fix

The Firebase Storage security rules need to be updated to allow uploads from your local development server.

## Steps to Fix Storage Permissions

1. Go to the Firebase Console (https://console.firebase.google.com)
2. Select your project
3. Go to Storage in the left sidebar
4. Click on the "Rules" tab
5. Update the rules to allow authenticated users to upload files. Replace the existing rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // Allow public read access
      allow write: if request.auth != null;  // Allow write access only to authenticated users
    }
  }
}
```

In the meantime, let's modify the `populateGalleryData.jsx` to use a different approach for handling the placeholder images: 