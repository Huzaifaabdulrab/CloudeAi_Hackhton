# Data Model: Physical AI & Humanoid Robotics Textbook

## Core Entities

### Textbook Chapter
- **Name**: String (unique identifier for the chapter)
- **Title**: String (display title of the chapter)
- **Content**: Markdown text (main content of the chapter)
- **LearningObjectives**: Array of strings (what students should learn)
- **Prerequisites**: Array of Chapter references (what needs to be learned first)
- **Examples**: Array of Example objects (practical examples in the chapter)
- **Exercises**: Array of Exercise objects (hands-on activities)
- **CodeSnippets**: Array of CodeSnippet objects (code examples)
- **VisualAids**: Array of VisualAid objects (diagrams, images, videos)
- **AssessmentCriteria**: Array of strings (how to measure understanding)

### Example
- **Title**: String (brief title of the example)
- **Description**: String (explanation of what the example demonstrates)
- **Implementation**: String (step-by-step guide to implement the example)
- **RelatedConcepts**: Array of strings (concepts demonstrated in the example)
- **Difficulty**: Enum (Beginner, Intermediate, Advanced)

### Exercise
- **Title**: String (brief title of the exercise)
- **Description**: String (what the student needs to do)
- **Instructions**: String (step-by-step instructions)
- **ExpectedOutcome**: String (what the result should look like)
- **Difficulty**: Enum (Beginner, Intermediate, Advanced)
- **TimeEstimate**: Integer (estimated time in minutes to complete)

### CodeSnippet
- **Language**: String (programming language)
- **Code**: String (the actual code)
- **Description**: String (what the code does)
- **Explanation**: String (detailed explanation of the code)
- **RelatedConcepts**: Array of strings (concepts illustrated by the code)

### VisualAid
- **Type**: Enum (Diagram, Image, Video, Interactive)
- **Title**: String (brief title)
- **Description**: String (explanation of the visual aid)
- **FilePath**: String (path to the visual aid file)
- **AltText**: String (alternative text for accessibility)
- **RelatedConcepts**: Array of strings (concepts illustrated)

### CapstoneProject
- **Title**: String (title of the project)
- **Description**: String (what the project aims to achieve)
- **Requirements**: Array of strings (what needs to be implemented)
- **ImplementationGuide**: String (step-by-step guide to complete the project)
- **EvaluationCriteria**: Array of strings (how the project will be evaluated)
- **IntegrationPoints**: Array of strings (which chapters concepts connect to the project)

## Relationships

- Textbook Chapter "contains" multiple Examples
- Textbook Chapter "contains" multiple Exercises
- Textbook Chapter "contains" multiple CodeSnippets
- Textbook Chapter "contains" multiple VisualAids
- Textbook Chapter "has" zero or one CapstoneProject
- Examples "illustrate" one or more Concepts
- Exercises "reinforce" one or more Concepts
- CodeSnippets "demonstrate" one or more Concepts
- VisualAids "visualize" one or more Concepts

## Validation Rules

- Each Chapter must have a unique Name
- Each Chapter must have at least one LearningObjective
- Each Chapter must have at least one Example
- Each Chapter must have at least one Exercise
- Each CodeSnippet must have a valid programming Language
- Each Exercise must have a defined TimeEstimate
- Prerequisites must not create circular dependencies
- CapstoneProject can only exist in the final Chapter

## State Transitions (if applicable)

- Chapter content has review states: Draft → Review → Approved → Published
- Chapter content can be updated with version tracking for maintenance principle
- Exercises and Examples can be marked as Deprecated if technology changes