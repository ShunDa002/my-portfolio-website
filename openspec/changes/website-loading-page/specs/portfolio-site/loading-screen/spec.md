# Spec Delta

## Purpose

Provides a coordinated full-screen loading page overlay displaying the animated loader graphic (`public/loader.gif`) during website startup, until the page and project section embedded videos are fully loaded, as well as during subsequent page transitions.

## ADDED Requirements

### Requirement: Full-screen loading screen presentation

The site SHALL present a dedicated full-screen loading overlay whenever an active loading state occurs. The loading screen SHALL display the animation from `public/loader.gif` centered against a dark background matching the portfolio's visual theme, rendered above all other page content with an elevated layer order, preventing pointer interactions with elements underneath.

#### Scenario: Visitor enters the site
- **WHEN** a visitor navigates to the website
- **THEN** the full-screen loading overlay is immediately visible
- **AND** the centered `loader.gif` animation renders on screen
- **AND** the page content beneath the overlay is obscured and non-interactive

### Requirement: Website startup and embedded video synchronization

During website startup, the loading screen SHALL remain visible until both the document has loaded and all embedded demonstration videos in the Featured Projects section have loaded their preview players. The site SHALL enforce a defensive safety timeout of at most 5 seconds after which the loading screen dismisses even if an external video embed fails or delays loading.

#### Scenario: Document and embedded project videos finish loading
- **WHEN** the page loads and all embedded project demonstration video iframes complete loading before the safety timeout
- **THEN** the loading screen marks startup loading as complete

#### Scenario: External video embed delays or fails
- **WHEN** one or more embedded project demonstration videos fail to load or take longer than 5 seconds
- **THEN** the safety timeout triggers and the loading screen dismisses rather than leaving the visitor permanently blocked

### Requirement: Route transition loading state

The site SHALL activate and display the loading screen during client route navigation between different pages across the site. The loading screen SHALL remain displayed until the target page finishes mounting and rendering its core view. In-page anchor navigation (such as jumping between sections on the root page) SHALL NOT activate the route loading screen.

#### Scenario: Visitor navigates between distinct routes
- **WHEN** a visitor initiates navigation between different pages
- **THEN** the loading screen displays with the `loader.gif` animation
- **AND** the loading screen dismisses once the target page view is mounted

#### Scenario: Visitor navigates in-page section anchors
- **WHEN** a visitor clicks in-page section links (such as `#about`, `#skills`, `#projects`, `#wiki`, or `#contact`)
- **THEN** the page scrolls to the section without triggering the route loading overlay

### Requirement: Smooth dismissal transition

Upon satisfying loading criteria or reaching the safety timeout, the loading screen SHALL execute a smooth visual fade-out transition. After the transition completes, the loading screen SHALL become non-blocking and pass all pointer events through to the underlying page elements.

#### Scenario: Loading sequence completes
- **WHEN** the loading state resolves
- **THEN** the loading screen fades out smoothly
- **AND** navigation, buttons, cards, and scroll interactions on the page become immediately usable
