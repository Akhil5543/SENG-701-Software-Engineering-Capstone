import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTools } from "../utils/api";
import mermaid from "mermaid";

// ── Mermaid diagram renderer (reuse your existing pattern) ──────────────────
function MermaidDiagram({ chart, id }) {
  const ref = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chart) return;
    setSvg("");
    setError(null);
    const timer = setTimeout(() => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#1e3a5f",
          primaryTextColor: "#e2e8f0",
          primaryBorderColor: "#3b82f6",
          lineColor: "#64748b",
          secondaryColor: "#0f172a",
          tertiaryColor: "#1e293b",
          background: "#0f172a",
          mainBkg: "#1e293b",
          nodeBorder: "#3b82f6",
          clusterBkg: "#1e293b",
          titleColor: "#e2e8f0",
          edgeLabelBackground: "#1e293b",
          attributeBackgroundColorEven: "#1e293b",
          attributeBackgroundColorOdd: "#0f172a",
        },
      });
      mermaid
        .render(`mermaid-tool-compare-${id}-${Date.now()}`, chart)
        .then(({ svg }) => {
          setSvg(svg);
          setError(null);
        })
        .catch(() => {
          setError("Diagram could not be rendered.");
        });
    }, 100);
    return () => clearTimeout(timer);
  }, [chart, id]);

  if (error)
    return (
      <div className="flex items-center justify-center h-full text-red-400 text-sm">
        {error}
      </div>
    );
  if (!svg)
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm animate-pulse">
        Rendering diagram…
      </div>
    );
  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
      className="w-full overflow-x-auto flex justify-center"
    />
  );
}

// ── Tool selector card ──────────────────────────────────────────────────────
function ToolCard({ tool, selected, onSelect, disabled }) {
  const isSelected = selected?.id === tool.id;
  return (
    <button
      onClick={() => onSelect(tool)}
      disabled={disabled && !isSelected}
      className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 ${
        isSelected
          ? "border-blue-500 bg-blue-500/10 text-white"
          : disabled
          ? "border-slate-700 bg-slate-800/30 text-slate-500 cursor-not-allowed opacity-50"
          : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50 cursor-pointer"
      }`}
    >
      <div className="font-medium text-sm">{tool.name}</div>
      <div className="text-xs text-slate-400 mt-0.5">
        {tool.vendor} · {tool.license_type}
      </div>
    </button>
  );
}

// ── Score bar (reuse your existing pattern) ─────────────────────────────────
function ScoreBar({ label, value, max = 5, color = "#3b82f6" }) {
  const pct = ((value ?? 0) / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-medium">
          {value != null ? value.toFixed(1) : "N/A"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-700">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Diagram variant definitions for each tool ───────────────────────────────
// These showcase what each tool is best known for producing.
const TOOL_DIAGRAMS = {
  // Visual Paradigm
  "visual-paradigm": {
    variants: [
      {
        label: "UML Class",
        diagram: `classDiagram
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
  Animal <|-- Cat`,
      },
      {
        label: "Sequence",
        diagram: `sequenceDiagram
  actor User
  participant UI
  participant API
  participant DB
  User->>UI: Login
  UI->>API: POST /auth
  API->>DB: Query user
  DB-->>API: User record
  API-->>UI: JWT token
  UI-->>User: Dashboard`,
      },
    ],
  },
  // Enterprise Architect
  "enterprise-architect": {
    variants: [
      {
        label: "Component",
        diagram: `graph LR
  subgraph Presentation
    A[Web UI]
    B[Mobile App]
  end
  subgraph Business
    C[Auth Service]
    D[Order Service]
    E[Product Service]
  end
  subgraph Data
    F[(SQL DB)]
    G[(Cache)]
  end
  A --> C
  A --> D
  B --> C
  D --> F
  D --> G
  E --> F`,
      },
      {
        label: "State Machine",
        diagram: `stateDiagram-v2
  [*] --> Draft
  Draft --> Submitted: submit()
  Submitted --> UnderReview: assign()
  UnderReview --> Approved: approve()
  UnderReview --> Rejected: reject()
  Approved --> Published: publish()
  Rejected --> Draft: revise()
  Published --> [*]`,
      },
    ],
  },
  // Lucidchart
  lucidchart: {
    variants: [
      {
        label: "Flowchart",
        diagram: `flowchart TD
  A([Start]) --> B{User logged in?}
  B -- Yes --> C[Load dashboard]
  B -- No --> D[Show login page]
  D --> E[Enter credentials]
  E --> F{Valid?}
  F -- Yes --> C
  F -- No --> G[Show error]
  G --> E
  C --> H([End])`,
      },
      {
        label: "ERD",
        diagram: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE-ITEM : contains
  PRODUCT ||--o{ LINE-ITEM : included-in
  CUSTOMER {
    int id PK
    string name
    string email
  }
  ORDER {
    int id PK
    date placed_at
    string status
  }
  PRODUCT {
    int id PK
    string name
    float price
  }`,
      },
    ],
  },
  // draw.io
  "drawio": {
    variants: [
      {
        label: "Network",
        diagram: `graph TB
  Internet((Internet))
  FW[Firewall]
  LB[Load Balancer]
  W1[Web Server 1]
  W2[Web Server 2]
  DB1[(Primary DB)]
  DB2[(Replica DB)]
  Internet --> FW --> LB
  LB --> W1 & W2
  W1 & W2 --> DB1
  DB1 -.replication.-> DB2`,
      },
      {
        label: "Process",
        diagram: `flowchart LR
  A[Requirement] --> B[Design]
  B --> C[Implement]
  C --> D{Tests pass?}
  D -- No --> C
  D -- Yes --> E[Code Review]
  E --> F{Approved?}
  F -- No --> C
  F -- Yes --> G[Deploy]
  G --> H[Monitor]`,
      },
    ],
  },
  // PlantUML
  plantuml: {
    variants: [
      {
        label: "Use Case",
        diagram: `graph LR
  Actor1([Student])
  Actor2([Instructor])
  subgraph LMS
    UC1(Browse Courses)
    UC2(Submit Assignment)
    UC3(Grade Assignment)
    UC4(Post Announcement)
  end
  Actor1 --> UC1
  Actor1 --> UC2
  Actor2 --> UC3
  Actor2 --> UC4`,
      },
      {
        label: "Class",
        diagram: `classDiagram
  class Repository~T~ {
    +findById(id) T
    +findAll() List~T~
    +save(entity T) T
    +delete(id) void
  }
  class UserRepository {
    +findByEmail(email) User
  }
  class User {
    +int id
    +String email
    +String role
  }
  Repository~User~ <|-- UserRepository
  UserRepository --> User`,
      },
    ],
  },
  // Mermaid.js
  "mermaidjs": {
    variants: [
      {
        label: "Git Graph",
        diagram: `gitGraph
  commit id: "init"
  branch feature/auth
  checkout feature/auth
  commit id: "add login"
  commit id: "add JWT"
  checkout main
  merge feature/auth
  branch feature/api
  commit id: "REST endpoints"
  checkout main
  merge feature/api
  commit id: "v1.0 release"`,
      },
      {
        label: "Pie Chart",
        diagram: `pie title Dev Stack Usage
  "JavaScript" : 42
  "Python" : 28
  "TypeScript" : 18
  "Other" : 12`,
      },
    ],
  },
  // ArchiMate
  archimate: {
    variants: [
      {
        label: "Layered",
        diagram: `graph TB
  subgraph Business Layer
    B1[Business Actor]
    B2[Business Process]
    B3[Business Object]
  end
  subgraph Application Layer
    A1[Application Component]
    A2[Application Service]
    A3[Application Interface]
  end
  subgraph Technology Layer
    T1[Node]
    T2[System Software]
    T3[Infrastructure Service]
  end
  B2 --> A2
  A1 --> T1
  B1 --> B2
  A2 --> A3`,
      },
      {
        label: "Motivation",
        diagram: `graph LR
  S[Stakeholder] --> G[Goal]
  G --> R[Requirement]
  R --> C[Constraint]
  G --> P[Principle]
  P --> R
  R --> D[Driver]
  D --> G`,
      },
    ],
  },
  // Balsamiq
  balsamiq: {
    variants: [
      {
        label: "Wireframe",
        diagram: `graph TD
  subgraph Mobile App Wireframe
    A[Header / Nav Bar]
    B[Search Box]
    C[Item List]
    D[Item Card 1]
    E[Item Card 2]
    F[Footer Nav]
  end
  A --> B --> C --> D & E --> F`,
      },
      {
        label: "User Flow",
        diagram: `flowchart TD
  A([App Launch]) --> B{Logged in?}
  B -- Yes --> C[Home Screen]
  B -- No --> D[Login Screen]
  D --> E[Enter Credentials]
  E --> F{Valid?}
  F -- Yes --> C
  F -- No --> G[Show Error]
  G --> E
  C --> H[Browse Items]`,
      },
    ],
  },
  // Figma
  figma: {
    variants: [
      {
        label: "Components",
        diagram: `graph LR
  subgraph Design System
    A[Button]
    B[Input Field]
    C[Card]
    D[Modal]
  end
  A --> A1[Primary]
  A --> A2[Secondary]
  A --> A3[Disabled]
  B --> B1[Default]
  B --> B2[Error]`,
      },
      {
        label: "Prototype Flow",
        diagram: `flowchart LR
  A[Landing Page] -->|Sign Up| B[Register]
  A -->|Login| C[Login Page]
  C -->|Success| D[Dashboard]
  B -->|Submit| D
  D -->|Profile| E[Profile Page]
  D -->|Settings| F[Settings]`,
      },
    ],
  },
  // Structurizr
  structurizr: {
    variants: [
      {
        label: "C4 Context",
        diagram: `graph TB
  U([User])
  subgraph System Boundary
    WA[Web Application]
    API[Backend API]
    DB[(Database)]
  end
  EXT1[Email Service]
  EXT2[Payment Gateway]
  U -->|Uses| WA
  WA -->|Calls| API
  API -->|Reads/Writes| DB
  API -->|Sends via| EXT1`,
      },
      {
        label: "C4 Container",
        diagram: `graph LR
  subgraph Backend
    A[API Gateway]
    B[Auth Service]
    C[Order Service]
  end
  subgraph Data
    E[(PostgreSQL)]
    F[(Redis Cache)]
  end
  A --> B & C
  B --> E
  C --> E & F`,
      },
    ],
  },
  // IBM Rational Rose
  "ibm-rational-rose": {
    variants: [
      {
        label: "Use Case",
        diagram: `graph LR
  A([Customer])
  B([Admin])
  subgraph Banking System
    UC1(View Balance)
    UC2(Transfer Funds)
    UC3(Pay Bill)
    UC4(Manage Users)
  end
  A --> UC1 & UC2 & UC3
  B --> UC4`,
      },
      {
        label: "Class",
        diagram: `classDiagram
  class Account {
    -int accountId
    -double balance
    +deposit(amount) void
    +withdraw(amount) bool
  }
  class SavingsAccount {
    -double interestRate
    +applyInterest() void
  }
  class CheckingAccount {
    -double overdraftLimit
    +overdraft() bool
  }
  Account <|-- SavingsAccount
  Account <|-- CheckingAccount`,
      },
    ],
  },
  // Astah
  astah: {
    variants: [
      {
        label: "Class",
        diagram: `classDiagram
  class Student {
    +int studentId
    +String name
    +enroll(course) void
  }
  class Course {
    +int courseId
    +String title
    +int credits
  }
  class Instructor {
    +String name
    +teach(course) void
  }
  Student "many" --> "many" Course
  Instructor "1" --> "many" Course`,
      },
      {
        label: "Activity",
        diagram: `flowchart TD
  A([Start]) --> B[Submit Assignment]
  B --> C{Before Deadline?}
  C -- Yes --> D[Mark On-Time]
  C -- No --> E[Mark Late]
  D & E --> F[Instructor Reviews]
  F --> G{Pass?}
  G -- Yes --> H[Record Grade]
  G -- No --> I[Request Revision]
  I --> B`,
      },
    ],
  },
  // StarUML
  staruml: {
    variants: [
      {
        label: "Sequence",
        diagram: `sequenceDiagram
  actor User
  participant App
  participant AuthService
  participant Database
  User->>App: Click Login
  App->>AuthService: validate(email, password)
  AuthService->>Database: findUser(email)
  Database-->>AuthService: UserRecord
  AuthService-->>App: JWT Token
  App-->>User: Dashboard`,
      },
      {
        label: "Component",
        diagram: `graph TB
  subgraph Frontend
    A[React SPA]
  end
  subgraph Backend
    B[REST API]
    C[Auth Module]
    D[Business Logic]
  end
  subgraph Data
    E[(PostgreSQL)]
    F[(Redis)]
  end
  A -->|HTTP| B
  B --> C & D
  D --> E & F`,
      },
    ],
  },
};

// Fallback diagram for tools without specific diagrams
function getToolDiagram(tool, variantIndex = 0) {
  const slug = tool.slug || tool.name?.toLowerCase().replace(/\s+/g, "-");
  const toolDiagrams =
    TOOL_DIAGRAMS[slug] ||
    TOOL_DIAGRAMS[
      Object.keys(TOOL_DIAGRAMS).find((k) => slug?.includes(k))
    ];

  if (toolDiagrams) {
    const variant =
      toolDiagrams.variants[variantIndex % toolDiagrams.variants.length];
    return { diagram: variant.diagram, label: variant.label };
  }

  // Generic fallback
  return {
    label: "Overview",
    diagram: `graph LR
  A[${tool.name}] --> B[Feature 1]
  A --> C[Feature 2]
  A --> D[Feature 3]`,
  };
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function ToolComparePage() {
  const [leftTool, setLeftTool] = useState(null);
  const [rightTool, setRightTool] = useState(null);
  const [leftVariant, setLeftVariant] = useState(0);
  const [rightVariant, setRightVariant] = useState(0);

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools-all"],
    staleTime: 0,
    queryFn: () => fetchTools(),
  });

  const leftDiagram = leftTool
    ? getToolDiagram(leftTool, leftVariant)
    : null;
  const rightDiagram = rightTool
    ? getToolDiagram(rightTool, rightVariant)
    : null;

  const leftVariants = leftTool
    ? TOOL_DIAGRAMS[
        leftTool.slug ||
          leftTool.name?.toLowerCase().replace(/\s+/g, "-")
      ]?.variants ||
      TOOL_DIAGRAMS[
        Object.keys(TOOL_DIAGRAMS).find((k) =>
          (
            leftTool.slug ||
            leftTool.name?.toLowerCase().replace(/\s+/g, "-")
          )?.includes(k)
        )
      ]?.variants
    : null;

  const rightVariants = rightTool
    ? TOOL_DIAGRAMS[
        rightTool.slug ||
          rightTool.name?.toLowerCase().replace(/\s+/g, "-")
      ]?.variants ||
      TOOL_DIAGRAMS[
        Object.keys(TOOL_DIAGRAMS).find((k) =>
          (
            rightTool.slug ||
            rightTool.name?.toLowerCase().replace(/\s+/g, "-")
          )?.includes(k)
        )
      ]?.variants
    : null;

  const avgRating = (tool) =>
    tool?.avg_rating != null ? tool.avg_rating : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Tool Diagram Comparison
        </h1>
        <p className="text-slate-400 text-sm">
          Select two tools to compare their diagram capabilities and features
          side by side.
        </p>
      </div>

      {/* Tool selector */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-slate-300">
            Select tools to compare (2):
          </span>
          {leftTool && rightTool && (
            <button
              onClick={() => {
                setLeftTool(null);
                setRightTool(null);
                setLeftVariant(0);
                setRightVariant(0);
              }}
              className="ml-auto text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-sm animate-pulse">
            Loading tools…
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                selected={
                  leftTool?.id === tool.id
                    ? leftTool
                    : rightTool?.id === tool.id
                    ? rightTool
                    : null
                }
                onSelect={(t) => {
                  if (leftTool?.id === t.id) {
                    setLeftTool(null);
                    setLeftVariant(0);
                  } else if (rightTool?.id === t.id) {
                    setRightTool(null);
                    setRightVariant(0);
                  } else if (!leftTool) {
                    setLeftTool(t);
                    setLeftVariant(0);
                  } else if (!rightTool) {
                    setRightTool(t);
                    setRightVariant(0);
                  }
                }}
                disabled={
                  leftTool != null &&
                  rightTool != null &&
                  leftTool.id !== tool.id &&
                  rightTool.id !== tool.id
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Comparison area */}
      {!leftTool && !rightTool && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <svg
            className="w-16 h-16 mb-4 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
            />
          </svg>
          <p className="text-lg font-medium">Select two tools above to compare</p>
          <p className="text-sm mt-1">
            Choose any two tools from the catalog to see their diagrams side by
            side
          </p>
        </div>
      )}

      {(leftTool || rightTool) && (
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              tool: leftTool,
              diagram: leftDiagram,
              variants: leftVariants,
              variantIdx: leftVariant,
              setVariant: setLeftVariant,
              color: "#3b82f6",
              side: "left",
            },
            {
              tool: rightTool,
              diagram: rightDiagram,
              variants: rightVariants,
              variantIdx: rightVariant,
              setVariant: setRightVariant,
              color: "#10b981",
              side: "right",
            },
          ].map(({ tool, diagram, variants, variantIdx, setVariant, color, side }) => (
            <div
              key={side}
              className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
            >
              {!tool ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                  <p className="text-sm">Select a tool</p>
                </div>
              ) : (
                <>
                  {/* Tool header */}
                  <div
                    className="px-5 py-4 border-b border-slate-700"
                    style={{ borderTopColor: color, borderTopWidth: 3 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-white font-semibold text-base">
                          {tool.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                            {tool.license_type}
                          </span>
                          <span className="text-xs text-slate-400">
                            {tool.vendor}
                          </span>
                          {tool.cost_info && (
                            <span className="text-xs text-slate-400">
                              · {tool.cost_info}
                            </span>
                          )}
                        </div>
                      </div>
                      {avgRating(tool) != null && (
                        <div className="text-right shrink-0">
                          <div
                            className="text-xl font-bold"
                            style={{ color }}
                          >
                            {avgRating(tool).toFixed(1)}
                          </div>
                          <div className="text-xs text-slate-400">
                            avg rating
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Diagram variant tabs */}
                  {variants && variants.length > 1 && (
                    <div className="flex gap-1 px-5 pt-4">
                      {variants.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setVariant(i)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                            variantIdx === i
                              ? "text-white font-medium"
                              : "text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-700"
                          }`}
                          style={
                            variantIdx === i
                              ? { backgroundColor: color + "33", color }
                              : {}
                          }
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Diagram */}
                  <div className="px-5 py-4 min-h-64">
                    <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                      {diagram?.label} Diagram
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-4 min-h-48">
                      {diagram && (
                        <MermaidDiagram
                          chart={diagram.diagram}
                          id={`${tool.slug}-${variantIdx}-${side}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Tool metadata */}
                  <div className="px-5 pb-5 space-y-4">
                    {/* Platforms */}
                    {tool.platforms?.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                          Platforms
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tool.platforms.map((p) => (
                            <span
                              key={p}
                              className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Supported notations */}
                    {tool.supported_methods?.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                          Supported Notations
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tool.supported_methods.map((m) => (
                            <span
                              key={m}
                              className="text-xs px-2 py-0.5 rounded bg-slate-700/70 text-slate-400"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ratings */}
                    {tool.avg_rating != null && (
                      <div>
                        <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                          Community Rating
                        </div>
                        <ScoreBar
                          label="Overall"
                          value={tool.avg_rating}
                          max={5}
                          color={color}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Head-to-head summary table */}
      {leftTool && rightTool && (
        <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700">
            <h3 className="text-white font-semibold text-sm">
              Head-to-Head Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium w-1/3">
                    Attribute
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-blue-400">
                    {leftTool.name}
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-emerald-400">
                    {rightTool.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Vendor", leftTool.vendor, rightTool.vendor],
                  [
                    "License",
                    leftTool.license_type,
                    rightTool.license_type,
                  ],
                  ["Cost", leftTool.cost_info, rightTool.cost_info],
                  [
                    "Platforms",
                    leftTool.platforms?.join(", ") || "—",
                    rightTool.platforms?.join(", ") || "—",
                  ],
                  [
                    "Avg Rating",
                    avgRating(leftTool) != null
                      ? `${avgRating(leftTool).toFixed(1)} / 5`
                      : "No reviews",
                    avgRating(rightTool) != null
                      ? `${avgRating(rightTool).toFixed(1)} / 5`
                      : "No reviews",
                  ],
                ].map(([attr, left, right]) => (
                  <tr
                    key={attr}
                    className="border-b border-slate-700/50 hover:bg-slate-700/20"
                  >
                    <td className="px-5 py-3 text-slate-400">{attr}</td>
                    <td className="px-5 py-3 text-slate-200">{left || "—"}</td>
                    <td className="px-5 py-3 text-slate-200">{right || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
