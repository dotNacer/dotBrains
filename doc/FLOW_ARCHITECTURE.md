# Flow Architecture Documentation

## Project Overview

dotBrains is a web application designed to manage and visualize story scenes in an interactive flow-based interface. The core concept revolves around representing scenes as nodes in a directed graph, where connections between nodes represent the story's progression and possible branching paths.

## Core Concepts

### Nodes

- **Definition**: Visual representations of content in the flow diagram
- **Types**:
    - Scene Nodes (primary type)
    - Future extensibility for other node types
- **Properties**:
    - Must have a unique position in the flow
    - One scene can only be represented by one node
    - Position data must be persisted
    - Future-proofed for additional visual properties

### Edges (Connections)

- **Definition**: Connections between nodes representing story flow
- **Properties**:
    - Can be animated
    - Can contain conditional logic
    - Support for multiple input/output connections
    - Store metadata about the transition between scenes

### Flow Structure

- **Key Requirements**:
    - Must have one or multiple starting points
    - Must have one or multiple ending points
    - Supports branching narratives
    - Allows for complex scene interconnections

## Technical Implementation Goals

### Phase 1: Basic Structure

1. Implement base node system

    - Position tracking
    - Scene association
    - Basic node types

2. Implement edge system
    - Basic connections
    - Direction handling
    - Position persistence

### Phase 2: Enhanced Features

1. Add edge properties

    - Animation support
    - Conditional logic
    - Transition metadata

2. Implement node types
    - Start nodes
    - End nodes
    - Scene nodes
    - (Extensible for future types)

### Phase 3: Flow Logic

1. Implement flow validation
    - Start/end point verification
    - Connection integrity checks
    - Scene uniqueness validation

## Data Model Requirements

### Node Storage

- Must track:
    - Unique identifier
    - Position (x, y coordinates)
    - Node type
    - Associated content (e.g., scene reference)
    - Visual properties (future expansion)

### Edge Storage

- Must track:
    - Source and target nodes
    - Edge type
    - Animation properties
    - Conditional logic
    - Transition metadata

### Content Association

- Scenes must be uniquely associated with nodes
- Support for different content types in future
- Maintain referential integrity

## Future Considerations

### Potential Extensions

- Multiple flow diagrams
- Additional node types
- Enhanced visual properties
- Flow versioning
- Flow templates

### Technical Debt Prevention

- Modular node type system
- Extensible edge property system
- Clear separation between flow data and content data

## Implementation Notes

The system should be implemented in a way that:

- Maintains clear separation of concerns
- Allows for easy addition of new node types
- Supports future enhancements to edge properties
- Ensures data integrity between nodes and their content
- Provides a flexible but consistent structure for flow creation
