# Setting Up Sidebar Icons

The admin sidebar now supports custom icon images! Here's how to set them up:

## Icon Files Location
Place your icon files in: `public/images/icons/`

## Required Icon Files
Upload these files with these exact names:

1. `dashboard.svg` (or `.png`) - Dashboard page icon
2. `services.svg` (or `.png`) - Services management icon
3. `portfolio.svg` (or `.png`) - Portfolio management icon
4. `packages.svg` (or `.png`) - Packages management icon
5. `bookings.svg` (or `.png`) - Bookings management icon
6. `messages.svg` (or `.png`) - Messages management icon
7. `about.svg` (or `.png`) - About Us management icon
8. `users.svg` (or `.png`) - Users management icon
9. `site.svg` (or `.png`) - View Site icon
10. `logout.svg` (or `.png`) - Logout icon

## Icon Requirements

- **Format**: SVG (preferred) or PNG with transparent background
- **Size**: Recommended 18x18px to 24x24px
- **Color**: Use black/simple designs - icons are automatically colored white
- **Style**: Simple, minimalist icons work best

## How It Works

- If an icon file exists, it will be displayed
- If an icon file is missing, a fallback dash character (—) will be shown
- Icons are automatically styled to be white and match the sidebar design
- Icons scale properly when the sidebar is collapsed

## Example

If you upload `dashboard.svg` to `public/images/icons/dashboard.svg`, it will automatically appear in the sidebar for the Dashboard link.

