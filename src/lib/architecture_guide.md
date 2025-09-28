# Flutter Clean Architecture Overview

This directory structure implements the Clean Architecture principles for our Flutter application.

## Layers

### 1. `lib/data` - The Data Layer
- **Purpose:** Handles all data operations, like fetching from a database or an API. It knows *where* the data comes from.
- **`repositories`:** Implements the abstract repositories defined in the Domain Layer. This is where Firestore calls happen. It's responsible for the offline-first data sync.
- **`models`:** Contains the data transfer objects (DTOs) that exactly match the structure of the data source (e.g., Firestore documents).

### 2. `lib/domain` - The Domain Layer
- **Purpose:** The core business logic of the app. It is completely independent of the UI and the Data layers.
- **`entities`:** Represents the core business objects. In many cases, these can be simple data classes.
- **`repositories`:** Defines the abstract contracts (interfaces) that the Data Layer must implement. The Domain Layer depends on these abstractions, not on concrete implementations.
- **`use_cases`:** Contains individual business operations, like `GetGrade4SocialStudiesUseCase`.

### 3. `lib/presentation` - The Presentation Layer
- **Purpose:** The UI of the application. It's responsible for displaying data and capturing user input.
- **`screens`:** Contains the main pages or screens of the app.
- **`widgets`:** Contains smaller, reusable UI components.
- **`state`:** (Not shown in this example for simplicity) This would contain state management logic (like BLoC, Riverpod, or Provider) to connect the UI to the Domain Layer.

### 4. `lib/services` - External Integrations
- **Purpose:** Manages communication with external services that aren't part of the core data flow, like payment gateways or third-party APIs. This is where we implement the secure Cloud Function calls.

---

## Website Credibility Guidelines (Our True North Star)

These guidelines are the principles we follow to ensure our application is professional, trustworthy, and credible.

1.  **Verify Accuracy:** Make it easy to verify the accuracy of the information on your site. You can build website credibility by providing third-party support (citations, references, source material) for information you present, especially if you link to this evidence. Even if people don't follow these links, you've shown confidence in your material.
2.  **Show Real Organization:** Show that there's a real organization behind your site. The easiest way to do this is by listing a physical address. Other features can also help, such as posting a photo of your offices or listing a membership with the chamber of commerce.
3.  **Highlight Expertise:** Highlight the expertise in your organization and in the content and services you provide. Be sure to give credentials for any experts on your team. Do not link to outside sites that are not credible; your site becomes less credible by association.
4.  **Show Trustworthy People:** Show that honest and trustworthy people stand behind your site. The first part of this guideline is to show there are real people behind the site and in the organization. Next, find a way to convey their trustworthiness through images or text.
5.  **Make Contact Easy:** A simple way to boost your site's credibility is by making your contact information clear: phone number, physical address, and email address.
6.  **Professional Design:** Design your site so it looks professional and is appropriate for your purpose. People quickly evaluate a site by visual design alone. Pay attention to layout, typography, images, and consistency. The visual design should match the site's purpose.
7.  **Be Easy to Use and Useful:** Sites win credibility points by being both easy to use and useful. Do not forget about users when catering to company ego or showing off dazzling technology.
8.  **Update Content Often:** People assign more credibility to sites that show they have been recently updated or reviewed.
9.  **Use Restraint with Promotions:** If possible, avoid having ads on your site. If you must have ads, clearly distinguish the sponsored content from your own. Avoid pop-up ads. As for writing style, try to be clear, direct, and sincere.
10. **Avoid All Errors:** Typographical errors and broken links hurt a site's credibility more than most people imagine. It's also important to keep your site up and running.