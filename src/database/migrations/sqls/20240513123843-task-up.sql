CREATE TABLE
    IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        user_id Int,
        task_description VARCHAR(255) NOT NULL,
        task_complete BOOLEAN NOT NULL DEFAULT FALSE,
        archive_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
    );