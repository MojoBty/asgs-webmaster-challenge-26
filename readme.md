# ASCE @ UCSD — Bear Garden Event Website

A promotional single-page website for ASCE @ UCSD's Bear Garden event, built as a submission for the 2026 ASGS Webmaster challenge.

## Description

A colorful, interactive single-page site designed to promote the Bear Garden event to UCSD students. The site features a full-page hero carousel, event details, past event highlights, and a variety of interactive animations — including ambient floating confetti, cursor-triggered sparkle trails, and confetti bursts on user interaction. The layout is fully responsive, with mobile-specific adaptations for images, navigation, and content sections.

## Getting Started

### Dependencies

* [Node.js](https://nodejs.org/) v18 or later
* npm (included with Node.js)
* A modern browser (Chrome, Firefox, Safari, or Edge)

### Installing

Clone the repository and install dependencies:

```
git clone <repo-url>
cd asgs-webmaster
npm install
```

### Executing program

Start the development server:

```
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

To build for production:

```
npm run build
npm start
```

## Planning

### Problem

The goal of the Bear Garden website is to promote ASCE events in a way that feels energetic, welcoming, and easy to understand quickly. The site should clearly communicate event details, encourage attendance, and reflect the social and community-focused nature of Bear Garden events.

### Target Demographic

UCSD students:

* Students looking for social events
* Students who are unfamiliar with Bear Garden and want to learn more
* Students deciding if the event is worth attending
* Students quickly browsing on their phone via social media links

Due to these common scenarios, we should prioritize clear headings, concise details, and having both responsive mobile and web layouts. Students also may have their attention captivated by interactive components or trendy styling.

### Inspiration

Other websites that have a younger/student demographic:

* [UCSD Sun God Festival](https://sgf.ucsd.edu/): Includes interactive spray paint visual feature and moving background, as well as tomagatchi that orients itself towards cursor/phone tap. Includes graffiti-like hover affect on lineup info and highlight hover on merch pieces. Also allows user to drag cards in carousel to switch between them. Mobile does not include hover affects, moving background, or interactive carousel.

* [PopUp Bagels](https://www.pcopupbagels.com/): Navbar has animated collapsing/opening, includes scroll effect to move carousel for both mobile and desktop interfaces. When hovering over flavors, the image is enlarged. Has simple but highly polished interactions.

* [Outside Lands](https://sfoutsidelands.com/): Uses a bold, highly-recognizable font and implements colorful background with moving elements to create energetic feeling. Hovering over buttons make them pop out and feel more interactice. Uses a scrolling carousel to show info about the festival.

Takeaways:
* Can use motion/animation to keep attention of the viewer and create playful atmosphere

* Should implement a clear visual hierarchy of the event visual, concise description, and then further info if the viewer is interested

* For the mobile design, I should remove unnecessary effects that may not translate well, and instead focus on simplifying those effects. I should also prioritize readibility and simplicity for the mobile design so it is easy for the viewer to navigate.

### Design Decisions

Due to our target demographic, we want to create a colorful, fun, and interactive design.

**Typography:**
Two fonts were chosen to create visual contrast and personality. A serif italic font is used for the large About tagline to give it an expressive, editorial feel that stands out from the rest of the page. A clean sans-serif font is used everywhere else to keep the interface readable and modern.

**Ambient Confetti:**
Floating confetti particles drift across the entire page in ASCE blue and gold tones to immediately create a festive, celebratory atmosphere. The particles avoid the navbar, event cards, and footer so they enhance the background without interfering with content. Fewer particles are shown on mobile to keep performance smooth on smaller devices.

**Confetti Burst Interactions:**
To reward user curiosity and make the site feel alive, three interactions trigger a confetti explosion: clicking the ASCE logo, tapping a past event card, and opening a section in the Details panel. Each burst uses a color palette that matches its context — for example, the food section bursts in warm oranges and yellows, and the prizes section bursts in gold. This makes exploration feel fun and surprising.

**Cursor Trail:**
On desktop, the cursor leaves a trail of small bear paw prints that fade out as you move. This ties into the Bear Garden theme and gives the site a playful, personalized feel that students are likely to share or remember. The cursor itself is also replaced with a bear paw icon to reinforce the theme consistently.

**Hero Carousel:**
A full-page image carousel introduces the event visually before any text. Autoplaying slides with a subtle zoom effect create energy and motion right away, which helps capture attention and set the tone. Manual controls are included for users who want to browse at their own pace.

**Responsive Images:**
Different images are shown depending on screen size — portrait posters on desktop where there is vertical space, and wider landscape banners on mobile where horizontal space is more natural. This ensures the images always look intentional and well-framed regardless of device.

**Mobile Navigation:**
On smaller screens, the full navigation links are collapsed into a hamburger menu to keep the header uncluttered. The menu opens with a smooth animated dropdown so the transition feels polished rather than abrupt.

**Mobile Accordion:**
On mobile, the Details section collapses into an accordion so users can tap to reveal only the category they care about, rather than scrolling through all four at once. This keeps the mobile layout clean and easy to navigate without removing any content.

**Scroll Reveal Animations:**
Content sections animate in as the user scrolls down the page. This paces the experience and draws attention to each section as it enters view, rather than presenting everything at once. The About tagline adds a blur effect on entry for extra visual emphasis.

**Scroll-to-Top Button:**
A button appears after scrolling down far enough to make returning to the top convenient, especially on mobile. It automatically hides near the bottom of the page so it never covers the footer links.

**About Section Scroll Animation**
About section header appears progressively as user scrolls/swipes. Helps make the page more interactive and draw user attention to the main bear garden detials.
