
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

