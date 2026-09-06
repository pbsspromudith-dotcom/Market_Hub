# Product Requirements Document (PRD)
## Project: HitAds.ca — Admin Listing Management, Outreach & Footer Enhancements

| Metadata | Details |
| :--- | :--- |
| **Document Version** | 1.0.0 |
| **Status** | Approved / In Implementation |
| **Target Platform** | HitAds.ca (Canada Classifieds Marketplace) |
| **Tech Stack Context** | Next.js (App Router), React 19, TypeScript, Tailwind CSS, Supabase / MySQL |
| **Author** | Antigravity AI Engineering Team |
| **Date** | September 6, 2026 |

---

## 1. Executive Summary

### 1.1 Context & Problem Statement
HitAds.ca administrators require high-efficiency moderation and listing management workflows:
1. **Footer Branding Gap**: The website footer displayed multi-column links and social icons but lacked the official HitAds logo, leaving an awkward blank space and missing brand reinforcement.
2. **Pending Approvals Review Limitations**: Moderators reviewing submitted ads previously saw only a cropped thumbnail, brief title, and price. They lacked access to the full ad description, gallery of images, complete location details, ad submission date, and expiration date.
3. **Restricted Admin Listing Actions**: The main Listings management table offered only a destructive "Delete" action. Admins could not review the full listing or edit mistakes/remove unwanted images without deleting the entire ad.
4. **Promotion Status & Outreach Deficit**: The table lacked clear indicators for whether an ad was actively promoted or expired, and had no direct outreach capabilities to email sellers with upgrade opportunities or tailored notices.

### 1.2 Key Objectives
* **Branding**: Embed the official HitAds logo and Canada-wide tagline into the footer header area, creating a polished, balanced layout.
* **Streamlined Ad Approvals**: Equip the Pending Approvals tab with complete listing metadata (Ad Date, Expiration Date, Full Location) and a single-click modal to inspect all photos and full descriptions prior to approval or rejection.
* **3-Tier Listing Actions**: Provide **Review**, **Edit** (with individual image curation/deletion), and **Delete** directly in the Listings table.
* **Promotional Outreach Engine**: Clearly display active and expired promotion badges, and allow admins to send targeted re-promotion emails or customized messages to sellers via system SMTP.

---

## 2. User Personas & Use Cases

| Persona | Role | Primary Goal in this Context |
| :--- | :--- | :--- |
| **Admin / Moderator** | Platform Management | Review pending submissions thoroughly, fix customer listing mistakes without deletion, and drive ad promotion monetization. |
| **Seller / Ad Poster** | Platform User | Receive helpful promotion suggestions and retain valid listings even if an individual photo had to be corrected by admin. |
| **Visitor / Buyer** | Platform User | Experience a trustworthy, fully branded site from header to footer with high-quality, vetted ads. |

---

## 3. Feature Requirements & Specifications

### Feature 1: Footer Brand Logo & Tagline Integration (FR-1)
* **Location**: Top section of the footer in `src/components/Layout.tsx`.
* **Requirements**:
  * Render the official HitAds logo (`/logo.png?v=2`) linked to the homepage (`/`).
  * Display the tagline: *"Free Ads, Sell Fast, Buy Local, Canada Wide. Canada's trusted local classifieds marketplace."*
  * Group the social media icons (Facebook, X, Instagram) cleanly on the opposite side of the top footer bar.
  * Maintain responsive behavior across mobile, tablet, and desktop viewports.

---

### Feature 2: Pending Approvals Full Review & Metadata (FR-2)
* **Location**: Admin Dashboard -> Approvals -> Pending Approvals tab in `src/old_pages/AdminDashboard.tsx`.
* **Metadata Display Requirements**:
  * **Ad Submission Date**: Formatted date (e.g., `Sep 6, 2026, 09:15 AM`) displayed alongside a calendar icon.
  * **Expiration Date**: Calculated expiration date (e.g., 30 days from creation, or stored `expires_at`).
  * **Full Location Details**: Display complete location (City, Province, Address/Postal Code) with location pin icon.
  * **Direct Listing Link**: "Open Ad" link (`/item/{id}`) to view the live preview in a new tab.
* **Full Ad Review Modal (`AdReviewModal`)**:
  * Single-click trigger ("Review Full Ad" button).
  * High-resolution image gallery displaying all uploaded photos with thumbnail navigation.
  * Full description with line breaks preserved.
  * Complete seller information (Name, Email, Phone, Account Age).
  * Quick-action **Approve** and **Reject** buttons directly within the modal.

---

### Feature 3: 3-Tier Listing Actions (Review, Edit, Delete) (FR-3)
* **Location**: Admin Dashboard -> Listings table ACTIONS column.
* **Action Buttons**:
  1. **Review (`visibility` icon)**:
     * Opens the `AdReviewModal` with single click.
     * Displays all images, full description, views, saves, inquiries, and seller contact details.
  2. **Edit (`edit` icon)**:
     * Opens the `AdEditModal`.
     * Allows modification of Title, Price, Price Type, Category, Location, Contact Email, Contact Phone, and Description.
     * **Image Removal & Curation**: Displays all current photos in a thumbnail grid. Each photo features a red "Remove" (X) badge. Clicking it removes that specific photo from the listing's photo array immediately.
     * Allows uploading additional photos via `/api/upload`.
     * Saves changes via `/api/listings/update`.
  3. **Delete (`delete` icon)**:
     * Displays confirmation dialog before permanent deletion.

---

### Feature 4: Ad Promotion Status & Promotional Outreach (FR-4)
* **Location**: Admin Dashboard -> Listings table PROMOTIONS column.
* **Status Badges**:
  * **Active Promotion Badge**: Highlights active types (e.g., `Top Ad`, `Home Gallery`, `Featured`) with expiration tooltip.
  * **Expired Promotion Badge**: Indicates ads whose promotion duration has elapsed.
  * **Standard Badge**: Identifies unpromoted listings.
* **Promotional Outreach Modal (`PromoteOutreachModal`)**:
  * Triggered via a "Promote / Message" button on each listing row.
  * **Tab 1 — Promote via Email**:
    * Sends a pre-formatted, conversion-optimized marketing email to the seller.
    * Highlights promotion packages: Top Ad (10x views), Homepage Gallery, Featured Ad.
    * Injects listing title and direct link to upgrade the ad on HitAds.ca.
  * **Tab 2 — Customized Message**:
    * Allows the admin to write a custom email subject and message body.
    * Includes pre-set dropdown templates:
      * *Special Promotion Discount / Promo Code*
      * *Tips to Boost Ad Views & Photos*
      * *Ad Expiration & Renewal Reminder*
      * *Custom Notification*
    * Recipient email selector (seller's user email or listing contact email).
    * Uses `@/lib/email` (`sendEmail`) to deliver via the configured SMTP server.

---

## 4. Technical Architecture & API Contracts

### 4.1 Backend Endpoints

#### 1. `POST /api/admin/listings/send-promotion`
* **Purpose**: Dispatches promotion outreach emails or custom admin notices.
* **Payload**:
  ```json
  {
    "listing_id": 23,
    "recipient_email": "seller@example.com",
    "outreach_type": "promotion_offer" | "custom_message",
    "subject": "Boost your ad on HitAds.ca",
    "message_body": "Optional custom message text"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Email sent successfully to seller@example.com"
  }
  ```

#### 2. `GET /api/admin/pending-approvals`
* **Enhancements**: Returns `allImages: string[]`, full location, `created_at`, `expires_at`, and poster details (`name`, `email`, `phone`).

#### 3. `POST /api/listings/update`
* **Enhancements**: Handles image arrays where individual photos have been curated, removed, or added by the admin.

---

## 5. Acceptance Criteria & QA Checklist

- [x] **FR-1**: Footer displays HitAds logo (`/logo.png?v=2`) linking to `/`, accompanied by the official tagline and properly aligned social icons.
- [x] **FR-2**: Pending Approvals cards display Ad Creation Date, Expiration Date, and Location.
- [x] **FR-2**: Clicking "Review Full Ad" opens `AdReviewModal` with photo gallery, description, seller info, and direct Approve/Reject actions.
- [x] **FR-2**: Clicking "Open Ad" opens `/item/{id}` in a new tab.
- [x] **FR-3**: Listings table ACTIONS column contains Review, Edit, and Delete buttons.
- [x] **FR-3**: Edit Listing modal allows removing individual images without deleting the entire ad, and successfully updates the listing.
- [x] **FR-4**: PROMOTIONS column displays current promotion status badges (Promoted, Expired, Standard).
- [x] **FR-4**: "Promote / Message" modal allows sending either a standardized promotion email or a custom message to the seller via SMTP.
