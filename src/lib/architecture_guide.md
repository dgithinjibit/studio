# SyncSenta AI Playbook: Building a National-Scale Synthesis Tutor

This document outlines the strategic goals and technical implementation steps for evolving SyncSenta's AI backbone from a prototype into a production-grade, scalable, and intelligent RAG (Retrieval-Augmented Generation) system on Google Cloud's Vertex AI.

## Part 1: Strategic Goals & Vision

### 1.1. Core Objective
To create a scalable and deeply intelligent AI tutor, "Mwalimu AI," that uses the official KICD curriculum *designs* as a starting point to synthesize rich, Socratic, and contextually relevant learning experiences for every student in Kenya.

### 1.2. Key Principles
- **From Retrieval to Synthesis:** The AI will not just find and repeat information from the curriculum. It will *synthesize* and *explain* the concepts laid out in the curriculum designs, acting as an expert teacher that fills in the gaps.
- **Scalability for a Nation:** The architecture must be capable of serving millions of students concurrently, with a knowledge base that can be updated instantly and securely without application downtime.
- **Factually Grounded & Safe:** All AI-generated content must be grounded in the approved KICD curriculum. The system architecture must be designed to prevent factual "hallucinations."
- **Teacher Empowerment:** The system must provide tools and insights that empower teachers, reducing their administrative load and giving them a clearer view of student progress.

### 1.3. Desired Outcome
The final model will be a robust backend service on Vertex AI. When the SyncSenta frontend sends a student's question, the service will:
1.  **Retrieve** the most relevant curriculum objectives and activities from a specialized database.
2.  **Synthesize** an explanatory, Socratic response based on those objectives.
3.  **Return** a factually-grounded, helpful, and engaging answer to the student.

---

## Part 2: The Vertex AI Implementation Playbook

This is your step-by-step guide to building the system.

### **Step 1: Create the Central Knowledge Repository**

**Goal:** To store all curriculum documents in a single, secure, and scalable location.

1.  **Set Up Your Google Cloud Project:**
    *   In the Google Cloud Console, select your project.
    *   Go to **APIs & Services > Library** and ensure the following APIs are **ENABLED**:
        *   Vertex AI API
        *   Cloud Storage API
        *   Cloud Build API

2.  **Create Your Curriculum "Data Lake" in Cloud Storage:**
    *   Go to **Cloud Storage > Buckets** and click **"Create"**.
    *   Give your bucket a unique name (e.g., `syncsenta-curriculum-data-lake`).
    *   **Action:** Inside this bucket, create folders that mirror your project's curriculum structure:
        *   `grade-1/`
        *   `grade-2/`
        *   `grade-3/`
        *   `grade-4/`
        *   ...and so on.
    *   **Action:** Upload your curriculum files (the `.ts` files from `src/curriculum/`) into the corresponding folders. Treat them as plain text files for now. This bucket is now your AI's library.

### **Step 2: Build the Automated RAG Pipeline with Vertex AI Search**

**Goal:** To create a fully managed system that automatically ingests, chunks, and indexes your curriculum for fast and accurate semantic search.

1.  **Navigate to Vertex AI Search:**
    *   In the Google Cloud Console, go to **Vertex AI > Search & Conversation**.

2.  **Create a New Datastore:**
    *   Click **"New Datastore"**.
    *   Select **"Cloud Storage"** as your data source.
    *   **Action:** Point it to the Cloud Storage bucket you created in the previous step.
    *   Give your datastore a name (e.g., `kicd-curriculum-datastore`).

3.  **Let it Index:**
    *   Vertex AI will now automatically process all the files in your bucket. It will handle text extraction, chunking (breaking documents into meaningful pieces), and creating the vector embeddings. This may take some time.
    *   **Benefit:** This is a "set it and forget it" pipeline. Whenever you add or update a curriculum file in your Cloud Storage bucket, Vertex AI Search will automatically re-index the content. Your AI's knowledge base will always be up-to-date.

### **Step 3: Develop the AI Synthesis Backend**

**Goal:** To create the "brain" that queries the datastore and uses Gemini to synthesize an answer. This will be a new backend service (a Cloud Function is ideal).

1.  **Create a New Cloud Function:**
    *   Go to **Cloud Functions** in the console.
    *   Click **"Create Function"**. Choose Python or Node.js as the runtime.
    *   This function will act as your new API endpoint. Your Next.js app will call this instead of calling the Genkit flow directly.

2.  **Implement the Backend Logic (Example in Python):**
    *   Your function will receive the `question`, `subject`, and `grade` from the frontend.

    ```python
    # This is conceptual code for your new Cloud Function
    from google.cloud import discoveryengine_v1alpha as discoveryengine
    from google.cloud import aiplatform
    import vertexai
    from vertexai.generative_models import GenerativeModel

    def query_and_synthesize(request):
        # 1. Get data from frontend request
        data = request.get_json()
        question = data['question']
        grade = data['grade']
        subject = data['subject']
        # ... and conversation_history

        # 2. Query your Vertex AI Search Datastore
        # (API details for this are in the Google Cloud docs)
        search_results = search_client.search(
            query=question,
            filters=f'grade_level: "{grade}" AND subject: "{subject}"' # Fictional filter for illustration
        )
        
        # 3. Build the context from search results
        context = ""
        for result in search_results:
            context += f"<curriculum_section>{result.document.content}</curriculum_section>\n"
            
        # 4. Construct the detailed Synthesis Prompt
        prompt = f"""
        # Persona
        You are Mwalimu AI, an expert Kenyan educator...
        
        # Core Task
        Your task is to SYNTHESIZE a clear, explanatory, and engaging Socratic response based on the curriculum outlines provided below...
        
        # CONTEXT FROM CURRICULUM
        {context}
        
        # STUDENT'S QUESTION
        {question}
        
        Synthesize your Socratic response now:
        """
        
        # 5. Call the Vertex AI Gemini Model
        vertexai.init(project="your-gcp-project-id", location="your-region")
        model = GenerativeModel("gemini-1.5-flash-001")
        response = model.generate_content(prompt)
        
        # 6. Return the AI's response to the frontend
        return {"response": response.text}

    ```

### **Step 4: Update the Frontend to Call the New Backend**

**Goal:** To have the chat interface communicate with your new, powerful Vertex AI backend.

1.  **Modify the Chat Interface (`src/app/student/chat/chat-interface.tsx`):**
    *   Instead of importing and calling `mwalimuAiTutor` from the local Genkit flow, you will use the `fetch` API to make a POST request to the URL of the Cloud Function you deployed in Step 3.
    *   You will send the `question`, `grade`, `subject`, and `messages` history in the body of the request.
    *   You will then display the response that comes back from your new backend.

This playbook provides a clear, robust path to building a professional-grade AI system. It separates concerns, ensures scalability, and gives you the fine-grained control needed for a flagship educational product.
