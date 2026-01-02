# Data Model: Todo Full-Stack Application

**Date**: 2026-01-02
**Feature**: `002-todo-full-stack-app`
**Input**: `spec.md`

## Entities

### User

Represents a registered user of the application.

| Field         | Type      | Constraints      | Description                   |
|---------------|-----------|------------------|-------------------------------|
| id            | Integer   | Primary Key      | Unique identifier for the user. |
| email         | String    | Not Null, Unique | User's email address.         |
| password_hash | String    | Not Null         | Hashed password for the user. |

### Task

Represents a single to-do item.

| Field            | Type    | Constraints      | Description                        |
|------------------|---------|------------------|------------------------------------|
| id               | Integer | Primary Key      | Unique identifier for the task.    |
| description      | String  | Not Null         | The content of the task.           |
| completed_status | Boolean | Not Null, Default: false | Whether the task is complete. |
| owner_id         | Integer | Foreign Key (User.id) | The ID of the user who owns the task. |

## Relationships

- A `User` can have many `Tasks`.
- A `Task` belongs to exactly one `User`.

This is a one-to-many relationship.
