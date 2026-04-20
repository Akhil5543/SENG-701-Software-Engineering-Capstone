"""
Seed data for Software Design Tool Platform — Beta version
Expanded to 35 catalog entries: 12 methods, 10 architectures, 13 tools
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import DesignMethod, Architecture, Tool


def seed():
    db: Session = SessionLocal()
    try:
        # Only seed if empty
        if db.query(DesignMethod).count() > 0:
            return

        # ─────────────────────────────────────────
        # DESIGN METHODS (12 entries)
        # ─────────────────────────────────────────
        methods = [
            DesignMethod(
                name="UML Class Diagram",
                slug="uml-class-diagram",
                category="UML",
                description="A structural diagram showing classes, attributes, operations, and relationships in a system. It is the most widely used UML diagram and serves as the backbone of object-oriented design.",
                diagram_example="""classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() void
    }
    class Dog {
        +String breed
        +fetch() void
    }
    class Cat {
        +bool indoor
        +purr() void
    }
    Animal <|-- Dog
    Animal <|-- Cat""",
                tags=["OOP", "Structure", "UML 2.5", "Industry Standard"],
                academic_standard=True,
                use_cases="Class hierarchy design, database schema planning, API contract definition, reverse engineering legacy code",
                case_study="Used by the UMBC Software Engineering department in SENG 600 to model the course registration system domain."
            ),
            DesignMethod(
                name="UML Sequence Diagram",
                slug="uml-sequence-diagram",
                category="UML",
                description="An interaction diagram showing how objects communicate over time, depicting the sequence of messages exchanged between participants to accomplish a use case.",
                diagram_example="""sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    U->>F: Login(email, password)
    F->>A: POST /auth/login
    A->>D: SELECT user WHERE email=?
    D-->>A: User record
    A-->>F: JWT token
    F-->>U: Dashboard loaded""",
                tags=["Interaction", "UML 2.5", "Time-ordered", "Use Case"],
                academic_standard=True,
                use_cases="API flow documentation, authentication flows, microservice interaction modeling, test case derivation",
                case_study="Applied in documenting the checkout flow for an e-commerce platform with 12 microservices."
            ),
            DesignMethod(
                name="Entity Relationship Diagram",
                slug="entity-relationship-diagram",
                category="ERD",
                description="A data modeling technique that graphically illustrates an information system's entities and the relationships between those entities. Essential for relational database design.",
                diagram_example="""erDiagram
    STUDENT ||--o{ ENROLLMENT : enrolls
    COURSE ||--o{ ENROLLMENT : contains
    INSTRUCTOR ||--o{ COURSE : teaches
    STUDENT {
        int student_id PK
        string name
        string email
        date dob
    }
    COURSE {
        int course_id PK
        string title
        int credits
    }
    ENROLLMENT {
        int id PK
        int student_id FK
        int course_id FK
        date enrolled_date
        string grade
    }""",
                tags=["Database", "Relational", "Schema Design", "Crow's Foot"],
                academic_standard=True,
                use_cases="Database schema design, data migration planning, ORM model definition, system integration mapping",
                case_study="Used to design the student information system schema at UMBC with 40+ tables and complex relationships."
            ),
            DesignMethod(
                name="Data Flow Diagram",
                slug="data-flow-diagram",
                category="DFD",
                description="A graphical representation showing how data flows through an information system. DFDs represent processes, data stores, external entities, and data flows.",
                diagram_example="""flowchart LR
    U([User]) -->|Login Request| P1[Authenticate User]
    P1 -->|Query| DS1[(User Database)]
    DS1 -->|User Record| P1
    P1 -->|Auth Token| U
    U -->|Place Order| P2[Process Order]
    P2 -->|Save| DS2[(Orders DB)]
    P2 -->|Notify| EX([Email Service])""",
                tags=["Process", "Data Flow", "Systems Analysis", "Structured"],
                academic_standard=True,
                use_cases="Business process analysis, system requirements modeling, legacy system documentation, security threat modeling",
                case_study="Applied in modeling a hospital patient intake process to identify bottlenecks and improve data routing."
            ),
            DesignMethod(
                name="Observer Pattern",
                slug="observer-pattern",
                category="Design Pattern",
                description="A behavioral design pattern where an object (subject) maintains a list of dependents (observers) and notifies them automatically of state changes. Core pattern in event-driven systems.",
                diagram_example="""classDiagram
    class Subject {
        -observers: List
        +attach(Observer) void
        +detach(Observer) void
        +notify() void
    }
    class Observer {
        <<interface>>
        +update(data) void
    }
    class ConcreteSubject {
        -state: any
        +getState() any
        +setState(any) void
    }
    class ConcreteObserver {
        -subject: ConcreteSubject
        +update(data) void
    }
    Subject <|-- ConcreteSubject
    Observer <|.. ConcreteObserver
    Subject --> Observer""",
                tags=["Behavioral", "GoF", "Event-Driven", "Reactive"],
                academic_standard=True,
                use_cases="UI event handling, stock price notifications, MVC pattern implementation, real-time dashboard updates",
                case_study="Used in a React state management system where multiple components subscribe to a shared data store."
            ),
            DesignMethod(
                name="Factory Pattern",
                slug="factory-pattern",
                category="Design Pattern",
                description="A creational design pattern providing an interface for creating objects in a superclass while allowing subclasses to alter the type of objects created. Promotes loose coupling.",
                diagram_example="""classDiagram
    class ShapeFactory {
        +createShape(type: string) Shape
    }
    class Shape {
        <<interface>>
        +draw() void
        +area() float
    }
    class Circle {
        -radius: float
        +draw() void
        +area() float
    }
    class Rectangle {
        -width: float
        -height: float
        +draw() void
        +area() float
    }
    ShapeFactory --> Shape
    Shape <|.. Circle
    Shape <|.. Rectangle""",
                tags=["Creational", "GoF", "Loose Coupling", "OOP"],
                academic_standard=True,
                use_cases="Plugin systems, database driver abstraction, UI component creation, cross-platform API clients",
                case_study="Implemented in a payment processing system to create different payment gateway adapters based on region."
            ),
            DesignMethod(
                name="Strategy Pattern",
                slug="strategy-pattern",
                category="Design Pattern",
                description="A behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable. Lets the algorithm vary independently from clients that use it.",
                diagram_example="""classDiagram
    class SortContext {
        -strategy: SortStrategy
        +setStrategy(SortStrategy) void
        +sort(data: List) List
    }
    class SortStrategy {
        <<interface>>
        +sort(data: List) List
    }
    class QuickSort {
        +sort(data: List) List
    }
    class MergeSort {
        +sort(data: List) List
    }
    class BubbleSort {
        +sort(data: List) List
    }
    SortContext --> SortStrategy
    SortStrategy <|.. QuickSort
    SortStrategy <|.. MergeSort
    SortStrategy <|.. BubbleSort""",
                tags=["Behavioral", "GoF", "Algorithm", "Interchangeable"],
                academic_standard=True,
                use_cases="Sorting algorithms, compression strategies, payment processing, route calculation, validation rules",
                case_study="Used in a logistics app to swap routing algorithms (fastest vs cheapest) at runtime without changing core code."
            ),
            DesignMethod(
                name="Decorator Pattern",
                slug="decorator-pattern",
                category="Design Pattern",
                description="A structural design pattern that attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.",
                diagram_example="""classDiagram
    class Coffee {
        <<interface>>
        +cost() float
        +description() string
    }
    class SimpleCoffee {
        +cost() float
        +description() string
    }
    class CoffeeDecorator {
        -coffee: Coffee
        +cost() float
        +description() string
    }
    class MilkDecorator {
        +cost() float
        +description() string
    }
    class SugarDecorator {
        +cost() float
        +description() string
    }
    Coffee <|.. SimpleCoffee
    Coffee <|.. CoffeeDecorator
    CoffeeDecorator <|-- MilkDecorator
    CoffeeDecorator <|-- SugarDecorator""",
                tags=["Structural", "GoF", "Extensibility", "Wrapper"],
                academic_standard=True,
                use_cases="UI component enhancement, middleware pipelines, logging wrappers, data encryption layers, caching",
                case_study="Applied in an Express.js middleware chain to add authentication, logging, and rate limiting to API routes."
            ),
            DesignMethod(
                name="UML Activity Diagram",
                slug="uml-activity-diagram",
                category="UML",
                description="A behavioral diagram showing the workflow of activities and actions, supporting both sequential and parallel behavior. Equivalent to a flowchart but with UML notation and swim lanes.",
                diagram_example="""flowchart TD
    Start([Start]) --> A[Receive Order]
    A --> B{In Stock?}
    B -->|Yes| C[Reserve Item]
    B -->|No| D[Notify Backorder]
    C --> E[Process Payment]
    E --> F{Payment OK?}
    F -->|Yes| G[Ship Order]
    F -->|No| H[Cancel Order]
    G --> End([End])
    D --> End
    H --> End""",
                tags=["Behavioral", "UML 2.5", "Workflow", "Parallel"],
                academic_standard=True,
                use_cases="Business process modeling, workflow automation design, use case realization, parallel process documentation",
                case_study="Used to model an e-commerce order fulfillment workflow identifying 3 parallel processing paths."
            ),
            DesignMethod(
                name="Component Diagram",
                slug="component-diagram",
                category="UML",
                description="A structural UML diagram that shows the organization of components and dependencies between them. Useful for depicting high-level system decomposition into deployable units.",
                diagram_example="""graph LR
    subgraph Frontend
        UI[React SPA]
    end
    subgraph Backend
        API[FastAPI]
        Auth[Auth Service]
        DB[(PostgreSQL)]
    end
    subgraph External
        Email[Email Service]
        Storage[S3 Storage]
    end
    UI -->|HTTP REST| API
    API --> Auth
    API --> DB
    API --> Email
    API --> Storage""",
                tags=["Structural", "UML 2.5", "Deployment", "Architecture"],
                academic_standard=True,
                use_cases="System decomposition, microservice boundary definition, deployment planning, interface contract definition",
                case_study="Used to document the component boundaries of a SaaS platform before migrating from monolith to microservices."
            ),
            DesignMethod(
                name="State Machine Diagram",
                slug="state-machine-diagram",
                category="UML",
                description="A behavioral diagram modeling the states an object can be in and the transitions between states triggered by events. Essential for protocol design and reactive systems.",
                diagram_example="""stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted : submit()
    Submitted --> UnderReview : assign_reviewer()
    UnderReview --> Approved : approve()
    UnderReview --> Rejected : reject()
    UnderReview --> Draft : request_changes()
    Approved --> Published : publish()
    Rejected --> [*]
    Published --> [*]""",
                tags=["Behavioral", "UML 2.5", "States", "Protocol"],
                academic_standard=True,
                use_cases="Order lifecycle management, UI wizard flows, network protocol design, embedded system control logic",
                case_study="Applied to model a document approval workflow with 6 states reducing implementation defects by 40%."
            ),
            DesignMethod(
                name="Singleton Pattern",
                slug="singleton-pattern",
                category="Design Pattern",
                description="A creational design pattern ensuring a class has only one instance and providing a global access point to it. Commonly used for configuration managers, connection pools, and loggers.",
                diagram_example="""classDiagram
    class Singleton {
        -instance: Singleton
        -data: any
        -Singleton()
        +getInstance() Singleton
        +getData() any
        +setData(any) void
    }
    class Client1 {
        +useService() void
    }
    class Client2 {
        +useService() void
    }
    Client1 --> Singleton : getInstance()
    Client2 --> Singleton : getInstance()
    note for Singleton "Only one instance exists\\nacross the application"
""",
                tags=["Creational", "GoF", "Global State", "Thread Safety"],
                academic_standard=True,
                use_cases="Database connection pools, configuration objects, logging systems, cache managers, thread pools",
                case_study="Used to implement a thread-safe database connection pool in a high-traffic REST API handling 10K req/sec."
            ),
        ]

        # ─────────────────────────────────────────
        # ARCHITECTURE STYLES (10 entries)
        # ─────────────────────────────────────────
        architectures = [
            Architecture(
                name="Layered Architecture",
                slug="layered-architecture",
                style="Layered",
                description="Organizes code into horizontal layers where each layer has a specific role and only communicates with adjacent layers. The most common pattern for enterprise applications.",
                diagram_example="""graph TB
    subgraph L1[Presentation Layer]
        UI[Web UI / Mobile App]
    end
    subgraph L2[Business Logic Layer]
        SVC[Services / Use Cases]
        DOM[Domain Models]
    end
    subgraph L3[Data Access Layer]
        REPO[Repositories]
        ORM[ORM / Query Builder]
    end
    subgraph L4[Database Layer]
        DB[(PostgreSQL / MySQL)]
    end
    L1 --> L2
    L2 --> L3
    L3 --> L4""",
                strengths=["Simple to understand", "Easy to test layers independently", "Clear separation of concerns", "Well-documented patterns"],
                weaknesses=["Can become monolithic", "Performance overhead from layer traversal", "Tight coupling between layers", "Difficult to scale individual layers"],
                scalability_score=5.5,
                maintainability_score=7.0,
                complexity_score=3.0,
                use_cases=["Enterprise CRUD", "Internal tools", "CMS platforms", "ERP systems"]
            ),
            Architecture(
                name="Microservices Architecture",
                slug="microservices-architecture",
                style="Microservices",
                description="Structures an application as a collection of small, independently deployable services each running in its own process and communicating via lightweight APIs.",
                diagram_example="""graph TB
    GW[API Gateway] --> US[User Service]
    GW --> OS[Order Service]
    GW --> PS[Product Service]
    GW --> NS[Notification Service]
    US --> UDB[(Users DB)]
    OS --> ODB[(Orders DB)]
    PS --> PDB[(Products DB)]
    OS --> MQ[Message Queue]
    MQ --> NS""",
                strengths=["Independent deployment", "Technology flexibility per service", "Fault isolation", "Horizontal scaling per service"],
                weaknesses=["Distributed system complexity", "Network latency overhead", "Data consistency challenges", "Operational overhead"],
                scalability_score=9.5,
                maintainability_score=6.5,
                complexity_score=8.5,
                use_cases=["Large-scale web platforms", "E-commerce systems", "Streaming services", "Fintech"]
            ),
            Architecture(
                name="Event-Driven Architecture",
                slug="event-driven-architecture",
                style="Event-Driven",
                description="Components communicate through events — producers emit events and consumers react to them asynchronously. Enables loose coupling and high scalability for reactive systems.",
                diagram_example="""graph LR
    subgraph Producers
        OS[Order Service]
        PS[Payment Service]
        IS[Inventory Service]
    end
    subgraph Event Bus
        EB[Kafka / RabbitMQ]
    end
    subgraph Consumers
        NS[Notification Service]
        AS[Analytics Service]
        RS[Report Service]
    end
    OS -->|OrderPlaced| EB
    PS -->|PaymentConfirmed| EB
    IS -->|StockUpdated| EB
    EB --> NS
    EB --> AS
    EB --> RS""",
                strengths=["Loose coupling between producers/consumers", "High scalability", "Easy to add new consumers", "Audit trail via event log"],
                weaknesses=["Event ordering complexity", "Debugging difficulty", "Eventual consistency only", "Message broker single point of failure"],
                scalability_score=9.0,
                maintainability_score=6.0,
                complexity_score=8.0,
                use_cases=["Real-time analytics", "IoT pipelines", "Financial transactions", "E-commerce flows"]
            ),
            Architecture(
                name="Client-Server Architecture",
                slug="client-server-architecture",
                style="Client-Server",
                description="Divides the system into clients that request services and servers that provide them. The foundational pattern for networked applications including the web.",
                diagram_example="""graph LR
    subgraph Clients
        WEB[Web Browser]
        MOB[Mobile App]
        DES[Desktop App]
    end
    subgraph Server
        LB[Load Balancer]
        APP[Application Server]
        DB[(Database)]
        CACHE[Cache Layer]
    end
    WEB -->|HTTP/HTTPS| LB
    MOB -->|HTTP/HTTPS| LB
    DES -->|HTTP/HTTPS| LB
    LB --> APP
    APP --> DB
    APP --> CACHE""",
                strengths=["Simple and well understood", "Clear responsibility separation", "Easy to maintain server-side logic", "Supports many client types"],
                weaknesses=["Server is a bottleneck", "Network dependency", "Server scalability limits throughput", "Stateful sessions complicate scaling"],
                scalability_score=6.5,
                maintainability_score=7.5,
                complexity_score=4.0,
                use_cases=["Web applications", "Email systems", "File sharing", "SaaS products"]
            ),
            Architecture(
                name="Serverless Architecture",
                slug="serverless-architecture",
                style="Serverless",
                description="Functions are deployed as stateless units executed on-demand by a cloud provider. No server management required; billing is per execution. Also called FaaS (Function as a Service).",
                diagram_example="""graph LR
    subgraph Triggers
        HTTP[HTTP Request]
        SCHED[Scheduler]
        EVT[Queue Event]
    end
    subgraph Functions
        F1[Auth Function]
        F2[Process Function]
        F3[Notify Function]
    end
    subgraph Managed Services
        DB[(DynamoDB)]
        S3[S3 Storage]
        SES[Email SES]
    end
    HTTP --> F1
    SCHED --> F2
    EVT --> F3
    F1 --> DB
    F2 --> S3
    F3 --> SES""",
                strengths=["Zero server management", "Auto-scaling to zero", "Pay-per-execution billing", "Fast deployment"],
                weaknesses=["Cold start latency", "Vendor lock-in", "15-min execution limit (AWS)", "Difficult local debugging"],
                scalability_score=9.0,
                maintainability_score=5.5,
                complexity_score=6.5,
                use_cases=["Event-driven processing", "Scheduled jobs", "Lightweight APIs", "File processing"]
            ),
            Architecture(
                name="Hexagonal Architecture",
                slug="hexagonal-architecture",
                style="Ports and Adapters",
                description="Also known as Ports and Adapters. Places the application core at the center, with ports defining interfaces and adapters implementing them. Isolates the domain from infrastructure concerns.",
                diagram_example="""graph TB
    subgraph External
        HTTP[HTTP Adapter]
        CLI[CLI Adapter]
        DB[DB Adapter]
        EMAIL[Email Adapter]
    end
    subgraph Core
        PORT1[Input Port]
        APP[Application Logic]
        PORT2[Output Port]
    end
    HTTP --> PORT1
    CLI --> PORT1
    PORT1 --> APP
    APP --> PORT2
    PORT2 --> DB
    PORT2 --> EMAIL""",
                strengths=["Highly testable — swap adapters in tests", "Domain isolation", "Technology agnostic", "Clean separation of concerns"],
                weaknesses=["More boilerplate code", "Steeper learning curve", "Over-engineering for simple apps", "More interfaces to maintain"],
                scalability_score=7.0,
                maintainability_score=9.0,
                complexity_score=6.0,
                use_cases=["Domain-driven design", "Long-lived enterprise apps", "Test-heavy systems", "DDD bounded contexts"]
            ),
            Architecture(
                name="CQRS Architecture",
                slug="cqrs-architecture",
                style="CQRS",
                description="Command Query Responsibility Segregation — separates read (query) operations from write (command) operations using different models. Often combined with Event Sourcing.",
                diagram_example="""graph LR
    CLIENT[Client]
    subgraph Write Side
        CMD[Command Handler]
        AGG[Aggregate]
        EV[Event Store]
    end
    subgraph Read Side
        QRY[Query Handler]
        VIEW[Read Model / View]
    end
    CLIENT -->|Command| CMD
    CMD --> AGG
    AGG --> EV
    EV -->|Project| VIEW
    CLIENT -->|Query| QRY
    QRY --> VIEW""",
                strengths=["Optimized read and write models independently", "Scalable reads via denormalized views", "Clear audit trail with event store", "Supports high-throughput writes"],
                weaknesses=["Eventual consistency between models", "Increased complexity", "More code to maintain", "Requires Event Sourcing knowledge"],
                scalability_score=8.5,
                maintainability_score=6.0,
                complexity_score=9.0,
                use_cases=["Financial systems", "High-throughput platforms", "Audit systems", "Collaborative tools"]
            ),
            Architecture(
                name="Pipe and Filter Architecture",
                slug="pipe-and-filter-architecture",
                style="Pipe and Filter",
                description="Processes data through a sequence of independent processing steps (filters) connected by channels (pipes). Each filter transforms its input and passes the result downstream.",
                diagram_example="""graph LR
    SRC[Data Source] -->|Raw Data| F1[Validate Filter]
    F1 -->|Valid Data| F2[Transform Filter]
    F2 -->|Transformed| F3[Enrich Filter]
    F3 -->|Enriched| F4[Aggregate Filter]
    F4 -->|Result| SINK[Data Sink]
    F1 -->|Invalid| ERR[Error Handler]""",
                strengths=["Highly composable and reusable filters", "Easy to test each filter independently", "Simple to add or remove processing steps", "Natural for streaming data"],
                weaknesses=["Not suitable for interactive systems", "Data transformation overhead", "Difficult error handling across pipes", "Sequential processing limits parallelism"],
                scalability_score=7.0,
                maintainability_score=8.0,
                complexity_score=4.0,
                use_cases=["ETL pipelines", "Compiler design", "Image processing", "Log processing"]
            ),
            Architecture(
                name="Space-Based Architecture",
                slug="space-based-architecture",
                style="Space-Based",
                description="Removes the database as a synchronous constraint by using an in-memory distributed data grid (tuple space). Processing units share data through the space rather than a central database.",
                diagram_example="""graph TB
    subgraph Processing Units
        PU1[Processing Unit 1]
        PU2[Processing Unit 2]
        PU3[Processing Unit 3]
    end
    subgraph Virtualized Middleware
        MSG[Messaging Grid]
        DATA[Data Grid / Cache]
        PROC[Processing Grid]
    end
    DB[(Persistent Store)]
    PU1 <--> DATA
    PU2 <--> DATA
    PU3 <--> DATA
    DATA -->|Async Persist| DB""",
                strengths=["Near-infinite horizontal scalability", "No database bottleneck", "Extremely high throughput", "Elastic scaling"],
                weaknesses=["Very high complexity", "Eventual consistency challenges", "Expensive infrastructure", "Difficult to implement correctly"],
                scalability_score=10.0,
                maintainability_score=4.0,
                complexity_score=10.0,
                use_cases=["High-volume trading", "Online gaming backends", "Real-time bidding", "Massive concurrency"]
            ),
            Architecture(
                name="Service-Oriented Architecture",
                slug="service-oriented-architecture",
                style="SOA",
                description="An enterprise architectural style structuring software as a collection of interoperable services communicating over a network using standard protocols (SOAP, REST). Predecessor to Microservices.",
                diagram_example="""graph TB
    subgraph Enterprise Service Bus
        ESB[ESB / Message Broker]
    end
    subgraph Services
        CRM[CRM Service]
        ERP[ERP Service]
        HR[HR Service]
        PAY[Payment Service]
    end
    subgraph Consumers
        WEB[Web Portal]
        MOB[Mobile App]
        PART[Partner API]
    end
    WEB --> ESB
    MOB --> ESB
    PART --> ESB
    ESB --> CRM
    ESB --> ERP
    ESB --> HR
    ESB --> PAY""",
                strengths=["Reusable enterprise services", "Technology heterogeneity", "Centralized governance", "Standards-based interoperability"],
                weaknesses=["ESB can become bottleneck", "Heavyweight protocols (SOAP)", "High governance overhead", "Slower than modern microservices"],
                scalability_score=6.5,
                maintainability_score=6.0,
                complexity_score=7.5,
                use_cases=["Enterprise integration", "Legacy modernization", "B2B integration", "Government systems"]
            ),
        ]

        # ─────────────────────────────────────────
        # TOOLS (13 entries)
        # ─────────────────────────────────────────
        tools = [
            Tool(
                name="Visual Paradigm",
                slug="visual-paradigm", website_url="https://www.visual-paradigm.com",
                vendor="Visual Paradigm International",
                description="A comprehensive UML modeling and software design tool supporting all 14 UML diagram types, BPMN, ERD, and ArchiMate with code generation capabilities.",
                license_type="Commercial",
                cost_info="Community (Free) | Modeler $6/mo | Standard $19/mo | Professional $35/mo",
                platforms=["Windows", "macOS", "Linux", "Web"],
                supported_methods=["UML Class", "UML Sequence", "ERD", "BPMN", "ArchiMate", "DFD"],
                supported_notations=["UML 2.5", "BPMN 2.0", "ArchiMate 3.1", "ERD", "SysML"]
            ),
            Tool(
                name="Enterprise Architect",
                slug="enterprise-architect", website_url="https://sparxsystems.com",
                vendor="Sparx Systems",
                description="A powerful enterprise-grade UML and modeling platform supporting the full software development lifecycle from requirements to deployment with team collaboration features.",
                license_type="Commercial",
                cost_info="Professional $229 | Corporate $329 | Unified $469 (perpetual license)",
                platforms=["Windows"],
                supported_methods=["UML Class", "UML Sequence", "ERD", "BPMN", "ArchiMate", "SysML"],
                supported_notations=["UML 2.5", "BPMN 2.0", "SysML", "ArchiMate 3.1", "DMN"]
            ),
            Tool(
                name="Lucidchart",
                slug="lucidchart", website_url="https://www.lucidchart.com",
                vendor="Lucid Software",
                description="A web-based diagramming and visual collaboration platform with real-time collaboration, extensive shape libraries, and integrations with Google Workspace and Atlassian.",
                license_type="Freemium",
                cost_info="Free (3 diagrams) | Individual $9/mo | Team $9/user/mo | Enterprise custom",
                platforms=["Web", "iOS", "Android"],
                supported_methods=["UML Class", "UML Sequence", "ERD", "Flowchart", "Network Diagram"],
                supported_notations=["UML 2.5", "ERD (Crow's Foot)", "BPMN", "Custom"]
            ),
            Tool(
                name="draw.io",
                slug="drawio", website_url="https://www.drawio.com",
                vendor="JGraph (diagrams.net)",
                description="A free and open-source diagramming tool available as a web app, desktop app, and VS Code extension. Supports offline use, local file storage, and integrates with Confluence and Notion.",
                license_type="Open-Source",
                cost_info="Completely free (Apache 2.0 license)",
                platforms=["Web", "Windows", "macOS", "Linux", "VS Code"],
                supported_methods=["UML Class", "ERD", "Flowchart", "Network Diagram", "DFD"],
                supported_notations=["UML 2.5", "ERD", "Custom", "BPMN basic"]
            ),
            Tool(
                name="PlantUML",
                slug="plantuml", website_url="https://plantuml.com",
                vendor="PlantUML Team (Open Source)",
                description="A text-based diagramming tool that generates diagrams from a plain text DSL. Integrates with CI/CD pipelines, documentation systems, and IDEs via plugins.",
                license_type="Open-Source",
                cost_info="Free (GPL license) | PlantUML Server self-hosted: free",
                platforms=["Windows", "macOS", "Linux", "JVM-based (JAR)"],
                supported_methods=["UML Class", "UML Sequence", "Activity", "Component", "State"],
                supported_notations=["UML 2.5", "PlantUML DSL", "C4 model via extension"]
            ),
            Tool(
                name="Mermaid.js",
                slug="mermaidjs", website_url="https://mermaid.js.org",
                vendor="Mermaid (Open Source)",
                description="A JavaScript-based diagramming library that renders diagrams from a Markdown-inspired text syntax directly in the browser. Widely supported in GitHub, GitLab, Notion, and Obsidian.",
                license_type="Open-Source",
                cost_info="Free (MIT license) | Mermaid Chart cloud: Free/Pro $8/mo",
                platforms=["Web", "Node.js", "GitHub", "GitLab", "Confluence"],
                supported_methods=["Flowchart", "Sequence", "Class", "ERD", "State", "Gantt"],
                supported_notations=["Mermaid DSL", "UML-inspired", "ERD basic"]
            ),
            Tool(
                name="ArchiMate",
                slug="archimate", website_url="https://www.opengroup.org/archimate-forum",
                vendor="The Open Group",
                description="An enterprise architecture modeling language and notation standard for describing, analyzing, and visualizing architecture. Supported by tools like Archi and BiZZdesign.",
                license_type="Open-Standard",
                cost_info="Standard free (Archi tool: free) | BiZZdesign enterprise: custom pricing",
                platforms=["Windows", "macOS", "Linux"],
                supported_methods=["Enterprise Architecture", "Business Layer", "Application Layer", "Technology Layer"],
                supported_notations=["ArchiMate 3.1", "TOGAF", "ITIL mapping"]
            ),
            Tool(
                name="Balsamiq",
                slug="balsamiq", website_url="https://balsamiq.com",
                vendor="Balsamiq Studios",
                description="A rapid wireframing tool that simulates a hand-drawn, low-fidelity UI sketch style. Designed to focus on structure and interaction rather than visual polish during early design phases.",
                license_type="Commercial",
                cost_info="Cloud $9/mo (2 projects) | $49/mo (unlimited) | Desktop $99 one-time",
                platforms=["Web", "Windows", "macOS"],
                supported_methods=["Wireframing", "Lo-Fi Prototyping", "UI Sketching"],
                supported_notations=["Sketch-style wireframe", "UI mockup"]
            ),
            Tool(
                name="Figma",
                slug="figma", website_url="https://www.figma.com",
                vendor="Figma Inc. (Adobe)",
                description="A collaborative web-based UI/UX design tool supporting vector design, prototyping, and design systems. The industry standard for hi-fi UI prototyping and design handoff.",
                license_type="Freemium",
                cost_info="Free (3 projects) | Professional $12/editor/mo | Organization $45/editor/mo",
                platforms=["Web", "Windows", "macOS"],
                supported_methods=["Hi-Fi Prototyping", "UI Design", "Design Systems", "Wireframing"],
                supported_notations=["Design components", "Auto-layout", "Prototype flows"]
            ),
            Tool(
                name="Structurizr",
                slug="structurizr", website_url="https://structurizr.com",
                vendor="Structurizr Ltd",
                description="A toolchain for creating software architecture diagrams and documentation using the C4 model. Supports diagrams-as-code via the Structurizr DSL with workspace versioning.",
                license_type="Freemium",
                cost_info="Cloud Free (1 workspace) | Cloud Plus $9/mo | On-premises: $25/mo",
                platforms=["Web", "Docker (self-hosted)"],
                supported_methods=["C4 Context", "C4 Container", "C4 Component", "C4 Code"],
                supported_notations=["C4 model", "Structurizr DSL", "PlantUML export"]
            ),
            Tool(
                name="IBM Rational Rose",
                slug="ibm-rational-rose", website_url="https://www.ibm.com/products/rational-rose",
                vendor="IBM",
                description="A legacy enterprise UML modeling tool that was widely used in the early 2000s for object-oriented analysis and design. Largely superseded by more modern tools but still in use in enterprises.",
                license_type="Commercial",
                cost_info="IBM licensing model — contact IBM for pricing",
                platforms=["Windows"],
                supported_methods=["UML Class", "UML Sequence", "Use Case", "Component"],
                supported_notations=["UML 1.x", "Booch notation", "Rose petal format"]
            ),
            Tool(
                name="Astah",
                slug="astah", website_url="https://astah.net",
                vendor="Change Vision",
                description="A UML modeling tool popular in academia and Japan, offering a clean interface for creating standard UML diagrams with a free community edition for students.",
                license_type="Freemium",
                cost_info="Community Free (limited) | Professional $29.99/mo | Academic discount available",
                platforms=["Windows", "macOS", "Linux"],
                supported_methods=["UML Class", "UML Sequence", "Use Case", "ERD", "Activity"],
                supported_notations=["UML 2.x", "ER notation", "DFD basic"]
            ),
            Tool(
                name="StarUML",
                slug="staruml", website_url="https://staruml.io",
                vendor="MKLab",
                description="A modern, fast UML/MDD platform supporting multiple diagram types with an extension system. Popular among students and developers for its clean interface and low cost.",
                license_type="Commercial",
                cost_info="One-time license $89 | 30-day free trial",
                platforms=["Windows", "macOS", "Linux"],
                supported_methods=["UML Class", "UML Sequence", "ERD", "Component", "State"],
                supported_notations=["UML 2.x", "ERD", "SysML partial"]
            ),
        ]

        # Insert all records
        for m in methods:
            db.add(m)
        for a in architectures:
            db.add(a)
        for t in tools:
            db.add(t)

        db.commit()
        print(f"✅ Beta seed complete: {len(methods)} methods, {len(architectures)} architectures, {len(tools)} tools = {len(methods)+len(architectures)+len(tools)} total entries")

    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()



