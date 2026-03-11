# Age-Based Theming System

## Overview
The Smart Study Dashboard now features an intelligent age-based theming system that automatically adapts the appearance of the application based on the user's age.

## How It Works

### Theme Selection
- **Age ≤ 15**: Childish/Playful Theme (Default)
  - Uses Comic Sans MS font
  - Bright, playful colors (yellow, green, cream)
  - Mascot character with personality
  - Playful elements and rounded shadows
  - Emojis throughout

- **Age > 15**: Professional Theme
  - Uses Segoe UI font (modern, clean)
  - Professional colors (blue, gray, muted tones)
  - Minimalist design approach
  - Subtle shadows and clean borders
  - Reduced emoji usage

## Setting User Age

### Step 1: Open Profile Page
1. Click on "Profile" in the navigation menu
2. You'll see a form with your profile settings

### Step 2: Enter Age
1. Fill in the **Age** field with your age
2. You can also update your Name and Daily Goal while here

### Step 3: Save Profile
1. Click the **Save** button
2. The theme will immediately apply to the current page
3. Refresh the page or navigate to other pages to see the theme applied everywhere

## What Changes in Professional Theme

### Visual Changes
| Element | Childish | Professional |
|---------|----------|--------------|
| Font | Comic Sans MS | Segoe UI |
| Background | Cream (#fef6e4) | Light Gray (#f5f5f5) |
| Headers | Yellow (#ffd166) | Dark Blue (#2c3e50) |
| Navbar | Bright Green | Dark Gray |
| Buttons | Yellow with thick shadows | Blue with subtle shadows |
| Cards | White with playful shadows | White with minimal borders |
| Borders | 3-4px thick | 1-2px thin |

### Functional Changes
- Mascot image becomes slightly less prominent (opacity reduced)
- Removed playful text styling (text-stroke)
- Simplified button interactions (no transform effects)
- Professional color scheme throughout

## Technical Implementation

### Files Modified
1. **profile.html** - Added age input field
2. **profile.js** - Added age loading/saving
3. **main.js** - Added `initializeTheme()` function
4. **style.css** - Added `.professional` theme class
5. **All HTML pages** - Added theme initialization on load

### How the Theme is Applied
The `initializeTheme()` function:
1. Reads the user's age from localStorage (`userAge`)
2. If age > 15, adds the `.professional` class to the `<body>` element
3. If age ≤ 15, removes the `.professional` class
4. Runs automatically on page load

### Dark Mode Compatibility
- Both themes are fully compatible with dark mode
- Professional + Dark Mode creates a sleek dark interface
- Theme changes persist across page navigation

## Storage
- Age is stored in the browser's localStorage under the key `userAge`
- Changes persist even after closing and reopening the browser
- Logging out does not clear the age preference

## Switching Themes
To change themes:
1. Go to Profile page
2. Update your age
3. Click Save
4. The theme will apply immediately

## Example Scenario
- **User 1 (Age 12)**: Opens dashboard → Sees colorful, fun interface with mascot
- **User 2 (Age 18)**: Opens dashboard → Sees clean, professional interface
- **User 1 Sets Age to 20**: Age is updated → Scene switches to professional theme
- **User 1 Sets Age to 14**: Age is updated → Scene switches back to playful theme

## Notes
- The age-based theming enhances UX by matching the interface maturity to user age
- Both themes are fully functional - no features are hidden or disabled
- The transition is immediate upon profile save
- All pages respect the theme preference
