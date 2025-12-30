# Data Model: Task

## Entity: Task

Represents a single to-do item in the application.

### Fields

| Field | Type | Description | Constraints |
|---|---|---|---|
| `id` | integer | A unique identifier for the task. | Required, Unique, Auto-incrementing |
| `title` | string | The title or name of the task. | Required, Non-empty |
| `description` | string | An optional, more detailed description of the task. | Optional |
| `completed` | boolean | The completion status of the task. | Required, Defaults to `false` |
| `timestamp` | string | The ISO 8601 timestamp of when the task was created or last updated. | Required |

### State Transitions

- A `Task` is created with `completed: false`.
- It can transition to `completed: true`. This is a one-way transition.
