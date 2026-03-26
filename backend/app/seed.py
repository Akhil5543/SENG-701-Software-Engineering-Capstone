"""
Seed the database with initial data for design methods, architectures, and tools.
Run with: python -m app.seed
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine
from app.models.models import Base, DesignMethod, Architecture, Tool

Base.metadata.create_all(bind=engine)

DESIGN_METHODS = [
    {
        "name": "UML Class Diagram",
        "slug": "uml-class-diagram",
        "category": "UML",
        "description": "A static structure diagram that describes the structure of a system by showing its classes, attributes, operations, and relationships between objects.",
        "use_cases": "Object-oriented design, system documentation, code generation, reverse engineering",
        "diagram_type": "class",
        "diagram_example": """classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +fetch()
    }
    class Cat {
        +bool indoor
        +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat""",
        "case_study": "Used extensively in enterprise applications to model domain entities and their relationships before implementation.",
        "tags": ["OOP", "static", "structure", "modeling"],
        "academic_standard": True,
        "industry_standard": True,
    },
    {
        "name": "UML Sequence Diagram",
        "slug": "uml-sequence-diagram",
        "category": "UML",
        "description": "An interaction diagram that shows how processes operate with one another and in what order, displaying object interactions arranged in time sequence.",
        "use_cases": "API design, use case implementation, protocol specification, debugging flows",
        "diagram_type": "sequence",
        "diagram_example": """sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    User->>Frontend: Login Request
    Frontend->>API: POST /auth/login
    API->>DB: Query user credentials
    DB-->>API: User record
    API-->>Frontend: JWT Token
    Frontend-->>User: Redirect to dashboard""",
        "case_study": "Widely used for documenting REST API interactions and microservice communication flows.",
        "tags": ["interaction", "dynamic", "time-ordered", "collaboration"],
        "academic_standard": True,
        "industry_standard": True,
    },
    {
        "name": "Entity Relationship Diagram (ERD)",
        "slug": "erd",
        "category": "ERD",
        "description": "A data modeling technique that graphically illustrates an information system's entities and the relationships between those entities.",
        "use_cases": "Database design, data architecture, schema planning, legacy system documentation",
        "diagram_type": "erDiagram",
        "diagram_example": """erDiagram
    USER {
        int id PK
        string name
        string email
        datetime created_at
    }
    ORDER {
        int id PK
        int user_id FK
        float total
        string status
    }
    PRODUCT {
        int id PK
        string name
        float price
    }
    ORDER_ITEM {
        int order_id FK
        int product_id FK
        int quantity
    }
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "included in" """,
        "case_study": "Standard tool for relational database schema design in enterprise and web applications.",
        "tags": ["database", "data-modeling", "relational", "schema"],
        "academic_standard": True,
        "industry_standard": True,
    },
    {
        "name": "Data Flow Diagram (DFD)",
        "slug": "dfd",
        "category": "DFD",
        "description": "A graphical representation of the flow of data through an information system, modeling its process aspects. Shows how data moves between processes, data stores, and external entities.",
        "use_cases": "Process analysis, legacy system documentation, requirements analysis, business process modeling",
        "diagram_type": "flowchart",
        "diagram_example": """flowchart TD
    E1([Customer]) -->|Order Request| P1[Process Order]
    P1 -->|Validate| P2[Check Inventory]
    P2 -->|Query| D1[(Inventory DB)]
    D1 -->|Stock Level| P2
    P2 -->|Available| P3[Generate Invoice]
    P3 -->|Store| D2[(Orders DB)]
    P3 -->|Invoice| E1
    P2 -->|Out of Stock| P4[Notify Customer]
    P4 -->|Alert| E1""",
        "case_study": "Used in structured analysis methodology to model business processes before software design.",
        "tags": ["process", "data-flow", "structured-analysis", "legacy"],
        "academic_standard": True,
        "industry_standard": False,
    },
    {
        "name": "Observer Design Pattern",
        "slug": "observer-pattern",
        "category": "Design Pattern",
        "description": "A behavioral design pattern where an object (subject) maintains a list of dependents (observers) and notifies them automatically of state changes. Implements a one-to-many dependency relationship.",
        "use_cases": "Event handling systems, MVC frameworks, real-time data feeds, pub/sub systems",
        "diagram_type": "class",
        "diagram_example": """classDiagram
    class Subject {
        -observers: List
        +attach(observer)
        +detach(observer)
        +notify()
    }
    class Observer {
        <<interface>>
        +update()
    }
    class ConcreteSubject {
        -state
        +getState()
        +setState()
    }
    class ConcreteObserver {
        -subject
        +update()
    }
    Subject <|-- ConcreteSubject
    Observer <|.. ConcreteObserver
    Subject --> Observer : notifies""",
        "case_study": "Core pattern in React's state management, Angular's RxJS observables, and Java's EventListener framework.",
        "tags": ["behavioral", "GoF", "event-driven", "decoupling"],
        "academic_standard": True,
        "industry_standard": True,
    },
    {
        "name": "Factory Design Pattern",
        "slug": "factory-pattern",
        "category": "Design Pattern",
        "description": "A creational design pattern that provides an interface for creating objects without specifying the exact class to create. Defines a method for creating objects, which subclasses can override.",
        "use_cases": "Plugin architectures, UI component libraries, database driver selection, cross-platform development",
        "diagram_type": "class",
        "diagram_example": """classDiagram
    class Creator {
        <<abstract>>
        +createProduct() Product
        +operation()
    }
    class ConcreteCreatorA {
        +createProduct() ProductA
    }
    class ConcreteCreatorB {
        +createProduct() ProductB
    }
    class Product {
        <<interface>>
        +doStuff()
    }
    class ProductA {
        +doStuff()
    }
    class ProductB {
        +doStuff()
    }
    Creator <|-- ConcreteCreatorA
    Creator <|-- ConcreteCreatorB
    Product <|.. ProductA
    Product <|.. ProductB""",
        "case_study": "Used extensively in Spring Framework's BeanFactory and in UI frameworks for component creation.",
        "tags": ["creational", "GoF", "abstraction", "instantiation"],
        "academic_standard": True,
        "industry_standard": True,
    },
]

ARCHITECTURES = [
    {
        "name": "Layered (N-Tier) Architecture",
        "slug": "layered-architecture",
        "style": "layered",
        "description": "Organizes code into horizontal layers where each layer has a specific role. Common layers: Presentation, Business Logic, Data Access, Database.",
        "strengths": ["Simple to understand", "Clear separation of concerns", "Easy to test layers independently", "Widely understood by developers"],
        "weaknesses": ["Can become monolithic", "Performance overhead between layers", "Tight coupling between adjacent layers", "Difficult to scale individual components"],
        "use_cases": ["Enterprise web applications", "Traditional MVC applications", "Small to medium-sized systems"],
        "diagram_example": """graph TD
    A[Presentation Layer<br/>React / Angular / Vue] --> B[Business Logic Layer<br/>Services / Use Cases]
    B --> C[Data Access Layer<br/>Repositories / DAOs]
    C --> D[Database Layer<br/>PostgreSQL / MySQL]
    style A fill:#4472C4,color:#fff
    style B fill:#ED7D31,color:#fff
    style C fill:#A9D18E,color:#000
    style D fill:#FFD966,color:#000""",
        "scalability_score": 5.5,
        "maintainability_score": 7.0,
        "complexity_score": 3.0,
        "tags": ["monolith", "MVC", "enterprise", "traditional"],
    },
    {
        "name": "Microservices Architecture",
        "slug": "microservices",
        "style": "microservices",
        "description": "Structures an application as a collection of small, independently deployable services, each running in its own process and communicating via lightweight APIs.",
        "strengths": ["Independent deployment", "Technology flexibility per service", "High scalability", "Fault isolation", "Team autonomy"],
        "weaknesses": ["Distributed system complexity", "Network latency", "Data consistency challenges", "Operational overhead", "Harder to debug"],
        "use_cases": ["Large-scale web platforms", "High-traffic e-commerce", "Netflix/Amazon-scale systems", "Cloud-native applications"],
        "diagram_example": """graph TD
    GW[API Gateway] --> US[User Service]
    GW --> OS[Order Service]
    GW --> PS[Product Service]
    GW --> NS[Notification Service]
    US --> UDB[(User DB)]
    OS --> ODB[(Order DB)]
    PS --> PDB[(Product DB)]
    OS --> MQ[Message Queue]
    MQ --> NS
    style GW fill:#2E4D8F,color:#fff""",
        "scalability_score": 9.5,
        "maintainability_score": 6.5,
        "complexity_score": 8.5,
        "tags": ["distributed", "cloud-native", "independent-deployment", "devops"],
    },
    {
        "name": "Event-Driven Architecture",
        "slug": "event-driven",
        "style": "event-driven",
        "description": "A design pattern where components communicate through asynchronous events. Producers emit events, consumers react to them, with an event broker in between.",
        "strengths": ["High decoupling", "Real-time processing", "Scalable event consumers", "Audit trail via event log"],
        "weaknesses": ["Eventual consistency", "Complex debugging", "Message ordering challenges", "Event schema management"],
        "use_cases": ["Real-time analytics", "IoT data processing", "Financial transaction systems", "Microservice communication"],
        "diagram_example": """sequenceDiagram
    participant P as Producer
    participant B as Event Broker (Kafka)
    participant C1 as Consumer 1
    participant C2 as Consumer 2
    P->>B: Emit OrderPlaced event
    B->>C1: Deliver event
    B->>C2: Deliver event
    C1->>C1: Update inventory
    C2->>C2: Send email notification""",
        "scalability_score": 9.0,
        "maintainability_score": 5.5,
        "complexity_score": 8.0,
        "tags": ["async", "decoupled", "real-time", "kafka", "reactive"],
    },
    {
        "name": "Client-Server Architecture",
        "slug": "client-server",
        "style": "client-server",
        "description": "A distributed computing model where the server hosts resources/services and clients request them. The two-tier model is the foundation of web development.",
        "strengths": ["Clear separation of client/server concerns", "Centralized data management", "Easy to update server independently", "Well-understood pattern"],
        "weaknesses": ["Server can become a bottleneck", "Network dependency", "Limited offline capability", "Scalability constraints at server"],
        "use_cases": ["Web applications", "Mobile apps", "Email systems", "File servers"],
        "diagram_example": """sequenceDiagram
    participant C as Client (Browser)
    participant S as Web Server
    participant DB as Database
    C->>S: HTTP GET /products
    S->>DB: SELECT * FROM products
    DB-->>S: Result set
    S-->>C: JSON Response
    C->>C: Render UI""",
        "scalability_score": 6.0,
        "maintainability_score": 7.5,
        "complexity_score": 3.5,
        "tags": ["web", "REST", "HTTP", "distributed"],
    },
    {
        "name": "Serverless Architecture",
        "slug": "serverless",
        "style": "serverless",
        "description": "Cloud execution model where the provider dynamically manages server allocation. Functions are deployed as stateless units, triggered by events, and billed per execution.",
        "strengths": ["No server management", "Automatic scaling", "Pay-per-use cost model", "Rapid deployment"],
        "weaknesses": ["Cold start latency", "Vendor lock-in", "Stateless constraints", "Debugging difficulty", "Limited execution time"],
        "use_cases": ["Event-driven processing", "APIs with variable traffic", "Scheduled tasks", "Data transformation pipelines"],
        "diagram_example": """graph LR
    A[HTTP Request] --> B[API Gateway]
    B --> C[Lambda Function]
    C --> D[(DynamoDB)]
    E[S3 Upload Event] --> F[Lambda Function]
    F --> G[Image Processor]
    G --> H[S3 Output Bucket]
    style B fill:#FF9900,color:#000
    style C fill:#FF9900,color:#000""",
        "scalability_score": 9.0,
        "maintainability_score": 6.0,
        "complexity_score": 6.5,
        "tags": ["cloud", "FaaS", "AWS Lambda", "auto-scaling"],
    },
]

TOOLS = [
    {
        "name": "Visual Paradigm",
        "slug": "visual-paradigm",
        "vendor": "Visual Paradigm International",
        "category": "Modeling",
        "description": "A comprehensive UML modeling tool supporting a wide range of diagrams including class, sequence, use case, ERD, and architecture diagrams with team collaboration features.",
        "website_url": "https://www.visual-paradigm.com",
        "license_type": "commercial",
        "cost_info": "Free community edition; Pro starts at $6/month",
        "platforms": ["Windows", "Mac", "Linux", "Web"],
        "supported_methods": ["UML", "ERD", "DFD", "BPMN", "ArchiMate"],
        "supported_notations": ["UML 2.5", "ERD", "BPMN 2.0", "ArchiMate 3.0"],
        "tags": ["enterprise", "UML", "collaboration", "code-generation"],
    },
    {
        "name": "Enterprise Architect",
        "slug": "enterprise-architect",
        "vendor": "Sparx Systems",
        "category": "Modeling",
        "description": "A professional modeling platform for enterprise architecture, software design, and business analysis. Supports UML, SysML, BPMN, and more with powerful code engineering.",
        "website_url": "https://sparxsystems.com",
        "license_type": "commercial",
        "cost_info": "Starts at ~$229 (perpetual license)",
        "platforms": ["Windows"],
        "supported_methods": ["UML", "SysML", "BPMN", "ArchiMate", "ERD"],
        "supported_notations": ["UML 2.5", "SysML 1.6", "BPMN 2.0"],
        "tags": ["enterprise", "UML", "SysML", "code-generation", "reverse-engineering"],
    },
    {
        "name": "Lucidchart",
        "slug": "lucidchart",
        "vendor": "Lucid Software",
        "category": "Diagramming",
        "description": "A web-based diagramming tool for creating flowcharts, UML diagrams, ERDs, network diagrams, and more with real-time collaboration.",
        "website_url": "https://lucidchart.com",
        "license_type": "freemium",
        "cost_info": "Free tier (3 documents); Individual $7.95/month",
        "platforms": ["Web", "Windows", "Mac"],
        "supported_methods": ["UML", "ERD", "DFD", "Flowchart"],
        "supported_notations": ["UML", "ERD", "BPMN"],
        "tags": ["web-based", "collaboration", "cloud", "easy-to-use"],
    },
    {
        "name": "draw.io (diagrams.net)",
        "slug": "drawio",
        "vendor": "JGraph Ltd",
        "category": "Diagramming",
        "description": "A free, open-source diagramming tool available as a web app, desktop app, and VS Code extension. No account required.",
        "website_url": "https://diagrams.net",
        "license_type": "open-source",
        "cost_info": "Free and open source",
        "platforms": ["Web", "Windows", "Mac", "Linux"],
        "supported_methods": ["UML", "ERD", "DFD", "Flowchart", "Network Diagram"],
        "supported_notations": ["UML", "ERD", "BPMN"],
        "tags": ["free", "open-source", "offline", "VS Code", "no-signup"],
    },
    {
        "name": "PlantUML",
        "slug": "plantuml",
        "vendor": "PlantUML Open Source",
        "category": "Text-to-Diagram",
        "description": "An open-source tool that generates diagrams from plain text. Ideal for version-controlled diagrams embedded in code repositories and documentation.",
        "website_url": "https://plantuml.com",
        "license_type": "open-source",
        "cost_info": "Free and open source",
        "platforms": ["Web", "Windows", "Mac", "Linux"],
        "supported_methods": ["UML", "ERD", "Flowchart", "Gantt"],
        "supported_notations": ["UML 2.0", "ERD"],
        "tags": ["text-based", "version-control", "CI/CD", "open-source", "automation"],
    },
    {
        "name": "Mermaid.js",
        "slug": "mermaidjs",
        "vendor": "Mermaid Open Source",
        "category": "Text-to-Diagram",
        "description": "A JavaScript-based diagramming tool that renders text definitions into diagrams. Natively supported in GitHub Markdown, Notion, and many documentation tools.",
        "website_url": "https://mermaid.js.org",
        "license_type": "open-source",
        "cost_info": "Free and open source",
        "platforms": ["Web", "GitHub", "Notion", "GitLab"],
        "supported_methods": ["UML", "ERD", "Flowchart", "Sequence", "Gantt"],
        "supported_notations": ["UML subset", "ERD"],
        "tags": ["markdown", "GitHub", "text-based", "open-source", "lightweight"],
    },
    {
        "name": "ArchiMate",
        "slug": "archimate",
        "vendor": "The Open Group",
        "category": "Architecture Notation",
        "description": "An open and independent enterprise architecture modeling language and standard. Provides a uniform representation for diagrams describing enterprise architectures.",
        "website_url": "https://www.opengroup.org/archimate-forum",
        "license_type": "open-standard",
        "cost_info": "Standard is free; tools implementing it vary",
        "platforms": ["Web", "Windows", "Mac"],
        "supported_methods": ["Enterprise Architecture", "TOGAF"],
        "supported_notations": ["ArchiMate 3.1"],
        "tags": ["enterprise-architecture", "TOGAF", "open-standard", "modeling-language"],
    },
]


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(DesignMethod).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding design methods...")
        for data in DESIGN_METHODS:
            db.add(DesignMethod(**data))

        print("Seeding architectures...")
        for data in ARCHITECTURES:
            db.add(Architecture(**data))

        print("Seeding tools...")
        for data in TOOLS:
            db.add(Tool(**data))

        db.commit()
        print(f"✅ Seeded {len(DESIGN_METHODS)} methods, {len(ARCHITECTURES)} architectures, {len(TOOLS)} tools")
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
